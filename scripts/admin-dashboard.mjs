/**
 * EchoScribe Admin Dashboard — local
 * Usage : node scripts/admin-dashboard.mjs
 * Ouvre automatiquement un dashboard dans le navigateur
 */

import http from "http";
import { exec } from "child_process";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const lines = readFileSync(resolve(__dirname, "../.env.local"), "utf-8").split("\n");
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {}
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PORT = 4242;

async function query(table, select = "*", extra = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}${extra}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
  });
  return res.json();
}

async function getData() {
  const [profiles, subscriptions, errors, support, admins] = await Promise.all([
    query("profiles", "id,email,full_name,created_at,blocked"),
    query("subscriptions", "user_id,status,trial_start,trial_end,current_period_start,current_period_end,stripe_subscription_id,stripe_customer_id,price_id,cancel_at_period_end,canceled_at", "&order=created_at.desc"),
    query("relay_errors", "id,relay,error,created_at,user_id", "&order=created_at.desc&limit=50").catch(() => []),
    query("support_messages", "id,email,message,status,created_at", "&order=created_at.desc").catch(() => []),
    query("admins", "id,email,created_at"),
  ]);

  const subMap = {};
  if (Array.isArray(subscriptions)) subscriptions.forEach(s => subMap[s.user_id] = s);

  const users = Array.isArray(profiles) ? profiles.map(p => ({ ...p, subscription: subMap[p.id] ?? null })) : [];

  const now = new Date();
  const stats = {
    totalUsers: users.length,
    activeSubs: users.filter(u => u.subscription?.status === "active").length,
    trialSubs: users.filter(u => u.subscription?.status === "trialing" && u.subscription?.trial_end && new Date(u.subscription.trial_end) > now).length,
    expiredTrials: users.filter(u => u.subscription?.status === "trialing" && u.subscription?.trial_end && new Date(u.subscription.trial_end) <= now).length,
    canceledSubs: users.filter(u => u.subscription?.status === "canceled").length,
    noSub: users.filter(u => !u.subscription).length,
    totalErrors: Array.isArray(errors) ? errors.length : 0,
    openSupport: Array.isArray(support) ? support.filter(m => m.status === "open").length : 0,
  };

  const allSubs = Array.isArray(subscriptions) ? subscriptions : [];

  // Enrichir chaque sub avec l'email du profil
  const profileMap = {};
  if (Array.isArray(profiles)) profiles.forEach(p => profileMap[p.id] = p);
  const enrichedSubs = allSubs.map(s => ({ ...s, profile: profileMap[s.user_id] ?? null }));

  return { users, subscriptions: enrichedSubs, errors: Array.isArray(errors) ? errors : [], support: Array.isArray(support) ? support : [], admins: Array.isArray(admins) ? admins : [], stats };
}

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function badgeHtml(status) {
  const map = {
    active: ["#14532d","#86efac"],
    trialing: ["#1e3a5f","#93c5fd"],
    canceled: ["#450a0a","#fca5a5"],
    past_due: ["#78350f","#fde68a"],
    open: ["#1e3a5f","#93c5fd"],
    closed: ["#14532d","#86efac"],
  };
  const [bg, color] = map[status] ?? ["#1a1a2e","#6b8aaa"];
  return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700">${status ?? "aucun"}</span>`;
}

async function renderHTML() {
  const { users, subscriptions, errors, support, admins, stats } = await getData();
  const now = new Date();

  const userRows = users.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(u => {
    const sub = u.subscription;
    const isExpired = sub?.status === "trialing" && sub?.trial_end && new Date(sub.trial_end) <= now;
    const statusLabel = isExpired ? "expired" : (sub?.status ?? "aucun");
    return `<tr>
      <td>${u.email ?? "—"}</td>
      <td>${u.full_name ?? "—"}</td>
      <td>${fmt(u.created_at)}</td>
      <td>${badgeHtml(statusLabel)}</td>
      <td>${sub?.trial_end ? fmt(sub.trial_end) : "—"}</td>
      <td>${sub?.current_period_end ? fmt(sub.current_period_end) : "—"}</td>
    </tr>`;
  }).join("");

  const errorRows = errors.map(e => `<tr>
    <td style="white-space:nowrap">${fmt(e.created_at)}</td>
    <td>${badgeHtml("trialing").replace("trialing", e.relay ?? "?")}</td>
    <td style="max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.error ?? ""}</td>
  </tr>`).join("") || `<tr><td colspan="3" style="text-align:center;color:#6b8aaa;padding:20px">Aucune erreur</td></tr>`;

  const supportCards = support.map(m => `
    <div style="background:#132030;border:1px solid ${m.status==="open"?"#1e40af":"#1e3a5f"};border-radius:10px;padding:16px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="color:#93c5fd">${m.email}</span>
        <div>${badgeHtml(m.status)} <span style="color:#6b8aaa;font-size:10px;margin-left:8px">${fmt(m.created_at)}</span></div>
      </div>
      <p style="color:#c8d8ea;font-size:12px;margin:0">${m.message}</p>
    </div>`).join("") || `<div style="color:#6b8aaa;text-align:center;padding:30px">Aucun message</div>`;

  const adminRows = admins.map(a => `<tr><td>${a.email}</td><td>${fmt(a.created_at)}</td></tr>`).join("");

  // Onglet abonnements — groupés par statut
  const subsActive = subscriptions.filter(s => s.status === "active");
  const subsTrial = subscriptions.filter(s => s.status === "trialing" && s.trial_end && new Date(s.trial_end) > now);
  const subsExpired = subscriptions.filter(s => s.status === "trialing" && s.trial_end && new Date(s.trial_end) <= now);
  const subsCanceled = subscriptions.filter(s => s.status === "canceled");
  const subsPastDue = subscriptions.filter(s => s.status === "past_due");

  function subRow(s) {
    const isExpired = s.status === "trialing" && s.trial_end && new Date(s.trial_end) <= now;
    const displayStatus = isExpired ? "expired" : s.status;
    const planLabel = s.price_id?.includes("year") ? "Annuel" : s.price_id ? "Mensuel" : "—";
    const cancelNote = s.cancel_at_period_end ? " · <span style='color:#fbbf24'>annulation prévue</span>" : "";
    return `<tr>
      <td>${s.profile?.email ?? s.user_id?.slice(0,8) ?? "—"}</td>
      <td>${s.profile?.full_name ?? "—"}</td>
      <td>${badgeHtml(displayStatus)}</td>
      <td>${planLabel}</td>
      <td>${fmt(s.trial_start)}</td>
      <td>${fmt(s.trial_end)}</td>
      <td>${fmt(s.current_period_start)}</td>
      <td>${fmt(s.current_period_end)}${cancelNote}</td>
      <td style="font-size:10px;color:#6b8aaa">${s.stripe_subscription_id?.slice(0,20) ?? "essai local"}</td>
    </tr>`;
  }

  function subSection(title, list, color) {
    if (list.length === 0) return `<p style="color:#6b8aaa;font-size:12px;margin-bottom:20px">Aucun — ${title}</p>`;
    return `
      <h3 style="color:${color};font-size:13px;margin:20px 0 10px;font-family:Georgia,serif">${title} (${list.length})</h3>
      <div class="card" style="margin-bottom:20px"><table>
        <thead><tr><th>Email</th><th>Nom</th><th>Statut</th><th>Plan</th><th>Début essai</th><th>Fin essai</th><th>Début période</th><th>Fin période</th><th>ID Stripe</th></tr></thead>
        <tbody>${list.map(subRow).join("")}</tbody>
      </table></div>`;
  }

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>EchoScribe Admin</title>
<meta http-equiv="refresh" content="30">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0d1b2a;color:#e2eaf3;font-family:'JetBrains Mono',monospace;font-size:13px}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:52px;background:rgba(20,36,56,0.98);border-bottom:1px solid #1e3a5f}
.logo{font-family:Georgia,serif;font-size:20px;font-style:italic}
.nav{display:flex;gap:2px;padding:0 28px;background:#111e2d;border-bottom:1px solid #1e3a5f}
.nav a{padding:9px 16px;font-size:11px;cursor:pointer;border-bottom:2px solid transparent;color:#6b8aaa;text-decoration:none;display:block}
.nav a.active,.nav a:hover{border-bottom-color:#3b82f6;color:#60a5fa}
.body{padding:24px 28px;max-width:1300px;margin:0 auto}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:24px}
.stat{background:#132030;border:1px solid #1e3a5f;border-radius:10px;padding:14px 16px;text-align:center}
.stat-num{font-size:26px;font-weight:700;display:block}
.stat-label{font-size:10px;color:#6b8aaa;margin-top:3px;display:block}
.card{background:#132030;border:1px solid #1e3a5f;border-radius:10px;overflow:hidden;margin-bottom:20px}
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:8px 12px;font-size:10px;color:#6b8aaa;border-bottom:1px solid #1e3a5f;text-transform:uppercase;background:#0f1d2e}
td{padding:9px 12px;border-bottom:1px solid #0f1d2e;font-size:12px}
tr:last-child td{border-bottom:none}
h2{color:#93c5fd;font-size:15px;margin-bottom:14px;font-family:Georgia,serif}
.tab-content{display:none}.tab-content.active{display:block}
.refresh{font-size:10px;color:#6b8aaa}
</style></head><body>
<div class="topbar">
  <span class="logo">Echo<span style="font-style:normal;font-weight:700;color:#3b82f6">Scribe</span> <span style="font-size:11px;color:#6b8aaa;font-style:normal">· Dashboard Admin</span></span>
  <span class="refresh">Mis à jour : ${new Date().toLocaleTimeString("fr-FR")} · Rafraîchissement auto 30s</span>
</div>
<div class="nav">
  <a href="#" class="active" onclick="show('overview',this)">Vue d'ensemble</a>
  <a href="#" onclick="show('users',this)">Utilisateurs (${stats.totalUsers})</a>
  <a href="#" onclick="show('subscriptions',this)">Abonnements (${subscriptions.length})</a>
  <a href="#" onclick="show('errors',this)">Erreurs (${stats.totalErrors})</a>
  <a href="#" onclick="show('support',this)">Support (${stats.openSupport} ouvert)</a>
  <a href="#" onclick="show('admins',this)">Admins</a>
</div>
<div class="body">

  <div id="overview" class="tab-content active">
    <div class="stat-grid">
      <div class="stat"><span class="stat-num">${stats.totalUsers}</span><span class="stat-label">Utilisateurs</span></div>
      <div class="stat"><span class="stat-num" style="color:#86efac">${stats.activeSubs}</span><span class="stat-label">Abonnés actifs</span></div>
      <div class="stat"><span class="stat-num" style="color:#93c5fd">${stats.trialSubs}</span><span class="stat-label">En essai</span></div>
      <div class="stat"><span class="stat-num" style="color:#fbbf24">${stats.expiredTrials}</span><span class="stat-label">Essais expirés</span></div>
      <div class="stat"><span class="stat-num" style="color:#fca5a5">${stats.canceledSubs}</span><span class="stat-label">Annulés</span></div>
      <div class="stat"><span class="stat-num" style="color:#6b8aaa">${stats.noSub}</span><span class="stat-label">Sans abonnement</span></div>
      <div class="stat"><span class="stat-num" style="color:#f97316">${stats.openSupport}</span><span class="stat-label">Support ouvert</span></div>
    </div>
    <h2>Derniers utilisateurs</h2>
    <div class="card"><table>
      <thead><tr><th>Email</th><th>Nom</th><th>Inscription</th><th>Statut</th><th>Fin essai</th><th>Fin période</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table></div>
  </div>

  <div id="users" class="tab-content">
    <h2>Tous les utilisateurs (${stats.totalUsers})</h2>
    <div class="card"><table>
      <thead><tr><th>Email</th><th>Nom</th><th>Inscription</th><th>Statut</th><th>Fin essai</th><th>Fin période</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table></div>
  </div>

  <div id="subscriptions" class="tab-content">
    <h2>Abonnements — vue complète</h2>
    <div class="stat-grid" style="grid-template-columns:repeat(5,1fr)">
      <div class="stat"><span class="stat-num" style="color:#86efac">${subsActive.length}</span><span class="stat-label">Actifs (payants)</span></div>
      <div class="stat"><span class="stat-num" style="color:#93c5fd">${subsTrial.length}</span><span class="stat-label">Essais en cours</span></div>
      <div class="stat"><span class="stat-num" style="color:#fbbf24">${subsExpired.length}</span><span class="stat-label">Essais expirés</span></div>
      <div class="stat"><span class="stat-num" style="color:#fca5a5">${subsCanceled.length}</span><span class="stat-label">Annulés</span></div>
      <div class="stat"><span class="stat-num" style="color:#f97316">${subsPastDue.length}</span><span class="stat-label">Paiement échoué</span></div>
    </div>
    ${subSection("✅ Abonnements actifs (payants)", subsActive, "#86efac")}
    ${subSection("⏳ Essais gratuits en cours", subsTrial, "#93c5fd")}
    ${subSection("⏰ Essais expirés (non convertis)", subsExpired, "#fbbf24")}
    ${subSection("❌ Annulés", subsCanceled, "#fca5a5")}
    ${subSection("⚠️ Paiement échoué", subsPastDue, "#f97316")}
  </div>

  <div id="errors" class="tab-content">
    <h2>Erreurs relay (${stats.totalErrors})</h2>
    <div class="card"><table>
      <thead><tr><th>Date</th><th>Relay</th><th>Erreur</th></tr></thead>
      <tbody>${errorRows}</tbody>
    </table></div>
  </div>

  <div id="support" class="tab-content">
    <h2>Messages support</h2>
    ${supportCards}
  </div>

  <div id="admins" class="tab-content">
    <h2>Administrateurs</h2>
    <div class="card"><table>
      <thead><tr><th>Email</th><th>Ajouté le</th></tr></thead>
      <tbody>${adminRows}</tbody>
    </table></div>
  </div>

</div>
<script>
function show(id, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  el.classList.add('active');
  return false;
}
</script>
</body></html>`;
}

const server = http.createServer(async (req, res) => {
  const html = await renderHTML();
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`\n✅ Dashboard admin ouvert sur http://localhost:${PORT}`);
  console.log(`   Rafraîchissement automatique toutes les 30 secondes\n`);
  exec(`start http://localhost:${PORT}`);
});
