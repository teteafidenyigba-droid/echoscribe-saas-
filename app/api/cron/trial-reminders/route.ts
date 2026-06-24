import { createServiceClient } from "@/lib/supabase/server";
import { sendTrialReminderEmail, sendTrialExpiryEmail } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Protect the cron endpoint
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();

  // Window for "3 days before expiry": trial_end between 71h and 73h from now
  const in3daysMin = new Date(now.getTime() + 71 * 60 * 60 * 1000);
  const in3daysMax = new Date(now.getTime() + 73 * 60 * 60 * 1000);

  // Window for "expired today": trial_end between 1h ago and now
  const expiredMin = new Date(now.getTime() - 60 * 60 * 1000);

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("user_id, trial_end, status")
    .eq("status", "trialing")
    .not("trial_end", "is", null);

  if (!subs?.length) return NextResponse.json({ sent: 0 });

  const userIds = subs.map((s) => s.user_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p])
  );

  let reminderCount = 0;
  let expiryCount = 0;

  for (const sub of subs) {
    const trialEnd = new Date(sub.trial_end);
    const profile = profileMap[sub.user_id];
    if (!profile?.email) continue;

    const name = profile.full_name ?? profile.email;

    // 3-day reminder
    if (trialEnd >= in3daysMin && trialEnd <= in3daysMax) {
      try {
        await sendTrialReminderEmail(profile.email, name);
        reminderCount++;
      } catch {}
    }

    // Expiry email (trial just ended in the last hour)
    if (trialEnd >= expiredMin && trialEnd <= now) {
      try {
        await sendTrialExpiryEmail(profile.email, name);
        expiryCount++;
      } catch {}
    }
  }

  return NextResponse.json({ reminders: reminderCount, expirations: expiryCount });
}
