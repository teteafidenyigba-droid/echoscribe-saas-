import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/app") || pathname.startsWith("/billing")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Charge le profil une seule fois (session + stripe)
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, active_session_id")
      .eq("id", user.id)
      .single();

    // ── Vérification session unique ──
    const esSid = request.cookies.get("es_sid")?.value;
    if (profile?.active_session_id && profile.active_session_id !== esSid) {
      // Un autre appareil est déjà connecté → déconnexion forcée
      return NextResponse.redirect(new URL("/api/auth/force-signout", request.url));
    }

    // ── Vérification abonnement ──
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, current_period_end, trial_end")
      .eq("user_id", user.id)
      .single();

    const now = new Date();
    const hasAccess =
      sub &&
      (sub.status === "active" ||
        sub.status === "trialing" ||
        (sub.status === "canceled" &&
          sub.current_period_end &&
          new Date(sub.current_period_end) > now));

    if (!hasAccess && pathname.startsWith("/app")) {
      // Fallback: check Stripe directly if no sub in Supabase
      if (profile?.stripe_customer_id) {
        try {
          const stripeKey = process.env.STRIPE_SECRET_KEY!;
          const stripeRes = await fetch(
            `https://api.stripe.com/v1/subscriptions?customer=${profile.stripe_customer_id}&limit=1&status=all`,
            { headers: { Authorization: `Bearer ${stripeKey}` } }
          );
          const stripeData = await stripeRes.json();
          const stripeSub = stripeData?.data?.[0];
          if (
            stripeSub &&
            (stripeSub.status === "active" || stripeSub.status === "trialing")
          ) {
            return supabaseResponse;
          }
        } catch {}
      }

      return NextResponse.redirect(new URL("/billing", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|echoscribe-app.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
