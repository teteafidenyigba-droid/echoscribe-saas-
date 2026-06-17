import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeCookies(): any {
  const cookieStore = cookies();
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {}
    },
  };
}

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: makeCookies() }
  );
}

export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: makeCookies() }
  );
}
