import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isAdmin(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // ── Routes ADMIN — complètement séparées, jamais de vérif abonnement ──
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (!isAdmin(user.email!)) return NextResponse.redirect(new URL("/app", request.url));
    return supabaseResponse;
  }

  // ── Routes protégées utilisateurs ──
  if (pathname.startsWith("/app") || pathname.startsWith("/billing")) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));

    // Admins : accès libre à /app sans abonnement
    if (isAdmin(user.email!)) return supabaseResponse;

    // Charge le profil (session + stripe)
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, active_session_id")
      .eq("id", user.id)
      .single();

    // Vérification session unique
    const esSid = request.cookies.get("es_sid")?.value;
    if (profile?.active_session_id && profile.active_session_id !== esSid) {
      return NextResponse.redirect(new URL("/api/auth/force-signout", request.url));
    }

    // Vérification abonnement
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, current_period_end, trial_end")
      .eq("user_id", user.id)
      .maybeSingle();

    const now = new Date();
    // trial_end DOIT être défini et dans le futur — null = pas d'accès
    const trialStillActive = sub?.status === "trialing" && sub.trial_end != null && new Date(sub.trial_end) > now;
    const hasAccess = sub && (
      sub.status === "active" ||
      trialStillActive ||
      (sub.status === "canceled" && sub.current_period_end && new Date(sub.current_period_end) > now)
    );

    if (!hasAccess && pathname.startsWith("/app")) {
      if (!sub) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          await fetch(`${supabaseUrl}/rest/v1/subscriptions?on_conflict=user_id`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Prefer": "resolution=merge-duplicates" },
            body: JSON.stringify({
              user_id: user.id,
              stripe_subscription_id: `local_trial_${user.id}`,
              status: "trialing",
              trial_start: new Date().toISOString(),
              trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            }),
          });
        } catch {}
        return supabaseResponse;
      }

      if (profile?.stripe_customer_id) {
        try {
          const stripeKey = process.env.STRIPE_SECRET_KEY!;
          const stripeRes = await fetch(
            `https://api.stripe.com/v1/subscriptions?customer=${profile.stripe_customer_id}&limit=1&status=all`,
            { headers: { Authorization: `Bearer ${stripeKey}` } }
          );
          const stripeData = await stripeRes.json();
          const stripeSub = stripeData?.data?.[0];
          if (stripeSub && (stripeSub.status === "active" || stripeSub.status === "trialing")) {
            return supabaseResponse;
          }
        } catch {}
      }

      return NextResponse.redirect(new URL("/billing", request.url));
    }
  }

  // Rediriger les utilisateurs connectés hors des pages auth
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
