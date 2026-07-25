import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient as createAuthClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com", "komlanserge@hotmail.com"];

async function getAdminUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const envAdmins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const allAdmins = [...new Set([...HARDCODED_ADMINS, ...envAdmins])];
  if (!allAdmins.includes(user.email.toLowerCase())) return null;
  return user;
}

// GET /api/admin/prospects?status=cold&search=dupont&page=1
export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search") || "";
  const specialty = searchParams.get("specialty") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 50000);
  const offset = (page - 1) * limit;

  const db = createServiceClient();
  let query = db.from("prospects").select("*", { count: "exact" });

  if (status && status !== "all") query = query.eq("status", status);
  if (specialty) query = query.ilike("specialty", `%${specialty}%`);
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count ?? 0, page, limit });
}

// POST /api/admin/prospects — single create OR bulk import
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createServiceClient();

  // Enrichissement par CSV : body.enrichRows = [{ rpps_number, email }]
  if (Array.isArray(body.enrichRows)) {
    let updated = 0;
    for (const r of body.enrichRows as Record<string, string>[]) {
      const rpps = r.rpps_number?.trim();
      const email = r.email?.trim().toLowerCase();
      if (!rpps || !email || !email.includes("@")) continue;
      const { error } = await db.from("prospects")
        .update({ email, updated_at: new Date().toISOString() })
        .eq("rpps_number", rpps)
        .is("email", null);
      if (!error) updated++;
    }
    return NextResponse.json({ updated });
  }

  // Bulk import: body.rows = [...]
  if (Array.isArray(body.rows)) {
    const mapped = body.rows.map((r: Record<string, string>) => ({
      first_name: r.first_name?.trim() || "?",
      last_name: r.last_name?.trim() || "?",
      email: r.email?.trim().toLowerCase() || null,
      specialty: r.specialty?.trim() || null,
      phone: r.phone?.trim() || null,
      city: r.city?.trim() || null,
      postal_code: r.postal_code?.trim() || null,
      rpps_number: r.rpps_number?.trim() || null,
      status: "cold",
    }));
    // Deduplicate by rpps_number server-side — PostgreSQL upsert errors if two rows
    // in the same statement would update the same target row.
    const seen = new Set<string>();
    const rows = mapped.filter(r => {
      if (!r.rpps_number) return true;
      if (seen.has(r.rpps_number)) return false;
      seen.add(r.rpps_number);
      return true;
    });
    const { data, error } = await db.from("prospects")
      .upsert(rows, { onConflict: "rpps_number" })
      .select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ inserted: data?.length ?? 0 });
  }

  // Single create
  const { first_name, last_name, email, specialty, phone, city, postal_code, rpps_number, notes } = body;
  const { data, error } = await db.from("prospects").insert({
    first_name, last_name, email: email?.toLowerCase() || null,
    specialty, phone, city, postal_code, rpps_number, notes, status: "cold"
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PATCH /api/admin/prospects — update status or notes for one or many
export async function PATCH(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createServiceClient();

  // Bulk: { ids: [...], status: "contacted" }
  if (Array.isArray(body.ids)) {
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.status) update.status = body.status;
    if (body.status === "contacted") update.last_contacted_at = new Date().toISOString();

    const { error } = await db.from("prospects").update(update).in("id", body.ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Single: { id, status, notes }
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status) update.status = body.status;
  if (body.notes !== undefined) update.notes = body.notes;
  if (body.status === "contacted") update.last_contacted_at = new Date().toISOString();

  const { error } = await db.from("prospects").update(update).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/prospects — { ids: [...] } or { deleteAll: true }
export async function DELETE(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = createServiceClient();

  if (body.deleteAll === true) {
    const { error } = await db.from("prospects").delete().not("id", "is", null);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const { ids } = body;
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: "ids required" }, { status: 400 });
  const { error } = await db.from("prospects").delete().in("id", ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
