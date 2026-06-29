"use client";
import { useEffect, useState, useCallback } from "react";

const S: Record<string, React.CSSProperties> = {
  root: { minHeight: "100dvh", background: "#0d1b2a", color: "#e2eaf3", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 56, background: "rgba(20,36,56,0.98)", borderBottom: "1px solid #1e3a5f", flexShrink: 0 },
  logo: { fontFamily: "'EB Garamond',serif", fontSize: 22, fontStyle: "italic", color: "#e2eaf3" },
  nav: { display: "flex", gap: 4, padding: "0 28px", background: "#111e2d", borderBottom: "1px solid #1e3a5f" },
  navBtn: (active: boolean): React.CSSProperties => ({ padding: "10px 18px", fontSize: 12, cursor: "pointer", border: "none", borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent", background: "transparent", color: active ? "#60a5fa" : "#6b8aaa", fontFamily: "inherit", transition: "all 0.15s" }),
  body: { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
  card: { background: "#132030", border: "1px solid #1e3a5f", borderRadius: 10, padding: "20px 24px", marginBottom: 16 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginBottom: 24 },
  stat: { background: "#132030", border: "1px solid #1e3a5f", borderRadius: 10, padding: "16px 20px", textAlign: "center" as const },
  statNum: { fontSize: 28, fontWeight: 700, color: "#60a5fa", display: "block" },
  statLabel: { fontSize: 11, color: "#6b8aaa", marginTop: 4, display: "block" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, padding: "8px 10px", fontSize: 11, color: "#6b8aaa", borderBottom: "1px solid #1e3a5f", whiteSpace: "nowrap" as const },
  td: { padding: "9px 10px", borderBottom: "1px solid #0f1d2e", verticalAlign: "middle" as const },
  btn: (variant: "blue"|"red"|"green"|"gray"): React.CSSProperties => ({
    padding: "4px 10px", fontSize: 11, borderRadius: 6, cursor: "pointer", border: "none", fontFamily: "inherit",
    background: variant === "blue" ? "#1e40af" : variant === "red" ? "#7f1d1d" : variant === "green" ? "#14532d" : "#1e3a5f",
    color: variant === "blue" ? "#93c5fd" : variant === "red" ? "#fca5a5" : variant === "green" ? "#86efac" : "#93c5fd",
    marginRight: 4,
  }),
  badge: (s: string): React.CSSProperties => ({
    padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700,
    background: s === "active" ? "#14532d" : s === "trialing" ? "#1e3a5f" : s === "canceled" ? "#450a0a" : "#1a1a2e",
    color: s === "active" ? "#86efac" : s === "trialing" ? "#93c5fd" : s === "canceled" ? "#fca5a5" : "#6b8aaa",
  }),
  input: { background: "#0d1b2a", border: "1px solid #1e3a5f", borderRadius: 6, color: "#e2eaf3", padding: "6px 10px", fontSize: 12, fontFamily: "inherit", width: "100%" },
  textarea: { background: "#0d1b2a", border: "1px solid #1e3a5f", borderRadius: 6, color: "#e2eaf3", padding: "8px 10px", fontSize: 12, fontFamily: "inherit", width: "100%", minHeight: 100, resize: "vertical" as const },
  modal: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox: { background: "#132030", border: "1px solid #1e3a5f", borderRadius: 12, padding: 28, width: 480, maxWidth: "90vw" },
};

type Tab = "overview"|"users"|"subscriptions"|"errors"|"support"|"admins";

type User = { id: string; email: string; full_name: string; created_at: string; blocked: boolean; crCount: number; subscription: { status: string; trial_end: string | null; current_period_end: string | null } | null };
type ErrorLog = { id: string; relay: string; error: string; created_at: string; profiles: { email: string } | null };
type SupportMsg = { id: string; email: string; message: string; status: string; created_at: string };
type Admin = { id: string; email: string; created_at: string };
type Stats = { totalUsers: number; activeSubs: number; trialSubs: number; canceledSubs: number; totalCR: number; totalErrors: number; openSupport: number };

function fmt(d: string) { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtDt(d: string) { return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }

export default function AdminClient() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [support, setSupport] = useState<SupportMsg[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<null|{ type: string; user?: User; msg?: SupportMsg }>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = useCallback(async () => {
    if (tab === "overview") {
      const r = await fetch("/api/admin/stats"); setStats(await r.json());
    } else if (tab === "users" || tab === "subscriptions") {
      const r = await fetch("/api/admin/users"); setUsers(await r.json());
    } else if (tab === "errors") {
      const r = await fetch("/api/admin/errors"); setErrors(await r.json());
    } else if (tab === "support") {
      const r = await fetch("/api/admin/support"); setSupport(await r.json());
    } else if (tab === "admins") {
      const r = await fetch("/api/admin/admins"); setAdmins(await r.json());
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  async function blockUser(u: User, blocked: boolean) {
    await fetch(`/api/admin/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blocked }) });
    notify(blocked ? `${u.email} bloqué` : `${u.email} débloqué`); load();
  }

  async function deleteUser(u: User) {
    if (!confirm(`Supprimer définitivement ${u.email} ?`)) return;
    await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    notify(`${u.email} supprimé`); load();
  }

  async function sendEmail() {
    setLoading(true);
    await fetch(`/api/admin/users/${modal!.user!.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: form.subject, message: form.message }) });
    setLoading(false); setModal(null); notify("Email envoyé");
  }

  async function extendTrial() {
    setLoading(true);
    await fetch(`/api/admin/subscriptions/${modal!.user!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ days: parseInt(form.days ?? "7") }) });
    setLoading(false); setModal(null); notify("Essai prolongé"); load();
  }

  async function replySupport() {
    setLoading(true);
    await fetch(`/api/admin/support/${modal!.msg!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "closed", reply: form.reply }) });
    setLoading(false); setModal(null); notify("Réponse envoyée"); load();
  }

  async function addAdmin() {
    if (!form.adminEmail) return;
    await fetch("/api/admin/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.adminEmail }) });
    setForm({}); notify("Admin ajouté"); load();
  }

  async function removeAdmin(a: Admin) {
    if (!confirm(`Retirer ${a.email} des admins ?`)) return;
    await fetch(`/api/admin/admins/${a.id}`, { method: "DELETE" });
    notify("Admin retiré"); load();
  }

  const filteredUsers = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Vue d'ensemble" },
    { key: "users", label: "Utilisateurs" },
    { key: "subscriptions", label: "Abonnements" },
    { key: "errors", label: "Erreurs" },
    { key: "support", label: "Support" },
    { key: "admins", label: "Admins" },
  ];

  return (
    <div style={S.root}>
      {/* Topbar */}
      <div style={S.topbar}>
        <span style={S.logo}>Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#3b82f6" }}>Scribe</span> <span style={{ fontSize: 12, color: "#6b8aaa", fontFamily: "JetBrains Mono" }}>· Admin</span></span>
        <a href="/app" style={{ color: "#6b8aaa", fontSize: 12, textDecoration: "none" }}>← Retour à l'app</a>
      </div>

      {/* Nav tabs */}
      <div style={S.nav}>
        {TABS.map(t => <button key={t.key} style={S.navBtn(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>)}
      </div>

      <div style={S.body}>

        {/* OVERVIEW */}
        {tab === "overview" && stats && (
          <>
            <h2 style={{ color: "#93c5fd", marginBottom: 16, fontWeight: 600 }}>Vue d'ensemble</h2>
            <div style={S.statGrid}>
              {[
                { n: stats.totalUsers, l: "Utilisateurs" },
                { n: stats.activeSubs, l: "Abonnés actifs" },
                { n: stats.trialSubs, l: "En essai" },
                { n: stats.canceledSubs, l: "Annulés" },
                { n: stats.totalCR, l: "Comptes rendus" },
                { n: stats.totalErrors, l: "Erreurs relay" },
                { n: stats.openSupport, l: "Support ouvert" },
              ].map(({ n, l }) => (
                <div key={l} style={S.stat}>
                  <span style={S.statNum}>{n}</span>
                  <span style={S.statLabel}>{l}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* USERS */}
        {tab === "users" && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
              <h2 style={{ color: "#93c5fd", fontWeight: 600, margin: 0 }}>Utilisateurs ({filteredUsers.length})</h2>
              <input style={{ ...S.input, width: 240 }} placeholder="Rechercher email / nom…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={S.card}>
              <table style={S.table}>
                <thead>
                  <tr>{["Email","Nom","Inscription","CR","Statut","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ opacity: u.blocked ? 0.5 : 1 }}>
                      <td style={S.td}>{u.email}</td>
                      <td style={S.td}>{u.full_name || "—"}</td>
                      <td style={S.td}>{fmt(u.created_at)}</td>
                      <td style={S.td}>{u.crCount}</td>
                      <td style={S.td}><span style={S.badge(u.subscription?.status ?? "none")}>{u.subscription?.status ?? "aucun"}</span></td>
                      <td style={S.td}>
                        <button style={S.btn("blue")} onClick={() => { setModal({ type: "email", user: u }); setForm({ subject: "", message: "" }); }}>Email</button>
                        <button style={S.btn(u.blocked ? "green" : "gray")} onClick={() => blockUser(u, !u.blocked)}>{u.blocked ? "Débloquer" : "Bloquer"}</button>
                        <button style={S.btn("red")} onClick={() => deleteUser(u)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SUBSCRIPTIONS */}
        {tab === "subscriptions" && (
          <>
            <h2 style={{ color: "#93c5fd", fontWeight: 600, marginBottom: 16 }}>Abonnements</h2>
            <div style={S.card}>
              <table style={S.table}>
                <thead>
                  <tr>{["Email","Statut","Fin essai","Fin période","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={S.td}>{u.email}</td>
                      <td style={S.td}><span style={S.badge(u.subscription?.status ?? "none")}>{u.subscription?.status ?? "aucun"}</span></td>
                      <td style={S.td}>{u.subscription?.trial_end ? fmt(u.subscription.trial_end) : "—"}</td>
                      <td style={S.td}>{u.subscription?.current_period_end ? fmt(u.subscription.current_period_end) : "—"}</td>
                      <td style={S.td}>
                        <button style={S.btn("blue")} onClick={() => { setModal({ type: "extend", user: u }); setForm({ days: "7" }); }}>Prolonger essai</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ERRORS */}
        {tab === "errors" && (
          <>
            <h2 style={{ color: "#93c5fd", fontWeight: 600, marginBottom: 16 }}>Erreurs relay ({errors.length})</h2>
            <div style={S.card}>
              <table style={S.table}>
                <thead>
                  <tr>{["Date","Relay","Erreur","User"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {errors.map(e => (
                    <tr key={e.id}>
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmtDt(e.created_at)}</td>
                      <td style={S.td}><span style={S.badge("trialing")}>{e.relay}</span></td>
                      <td style={{ ...S.td, maxWidth: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.error}</td>
                      <td style={S.td}>{e.profiles?.email ?? "—"}</td>
                    </tr>
                  ))}
                  {errors.length === 0 && <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", color: "#6b8aaa" }}>Aucune erreur enregistrée</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SUPPORT */}
        {tab === "support" && (
          <>
            <h2 style={{ color: "#93c5fd", fontWeight: 600, marginBottom: 16 }}>Messages support</h2>
            {support.map(m => (
              <div key={m.id} style={{ ...S.card, borderColor: m.status === "open" ? "#1e40af" : "#1e3a5f" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#93c5fd" }}>{m.email}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={S.badge(m.status === "open" ? "trialing" : "active")}>{m.status}</span>
                    <span style={{ color: "#6b8aaa", fontSize: 11 }}>{fmtDt(m.created_at)}</span>
                  </div>
                </div>
                <p style={{ color: "#c8d8ea", margin: "0 0 12px" }}>{m.message}</p>
                {m.status === "open" && (
                  <button style={S.btn("blue")} onClick={() => { setModal({ type: "reply", msg: m }); setForm({ reply: "" }); }}>Répondre & fermer</button>
                )}
              </div>
            ))}
            {support.length === 0 && <div style={{ color: "#6b8aaa", textAlign: "center", padding: 40 }}>Aucun message de support</div>}
          </>
        )}

        {/* ADMINS */}
        {tab === "admins" && (
          <>
            <h2 style={{ color: "#93c5fd", fontWeight: 600, marginBottom: 16 }}>Administrateurs</h2>
            <div style={S.card}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input style={{ ...S.input, width: 280 }} placeholder="Email du nouvel admin" value={form.adminEmail ?? ""} onChange={e => setForm({ ...form, adminEmail: e.target.value })} />
                <button style={{ ...S.btn("green"), padding: "6px 16px" }} onClick={addAdmin}>Ajouter</button>
              </div>
              <table style={S.table}>
                <thead><tr>{["Email","Ajouté le","Action"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a.id}>
                      <td style={S.td}>{a.email}</td>
                      <td style={S.td}>{fmt(a.created_at)}</td>
                      <td style={S.td}><button style={S.btn("red")} onClick={() => removeAdmin(a)}>Retirer</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      {modal && (
        <div style={S.modal} onClick={() => setModal(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            {modal.type === "email" && (
              <>
                <h3 style={{ color: "#93c5fd", marginTop: 0 }}>Email à {modal.user!.email}</h3>
                <div style={{ marginBottom: 10 }}><label style={{ color: "#6b8aaa", fontSize: 11 }}>Sujet</label><input style={{ ...S.input, marginTop: 4 }} value={form.subject ?? ""} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ color: "#6b8aaa", fontSize: 11 }}>Message</label><textarea style={{ ...S.textarea, marginTop: 4 }} value={form.message ?? ""} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={S.btn("blue")} onClick={sendEmail} disabled={loading}>{loading ? "Envoi…" : "Envoyer"}</button>
                  <button style={S.btn("gray")} onClick={() => setModal(null)}>Annuler</button>
                </div>
              </>
            )}
            {modal.type === "extend" && (
              <>
                <h3 style={{ color: "#93c5fd", marginTop: 0 }}>Prolonger l'essai — {modal.user!.email}</h3>
                <div style={{ marginBottom: 16 }}><label style={{ color: "#6b8aaa", fontSize: 11 }}>Nombre de jours à ajouter</label><input type="number" style={{ ...S.input, marginTop: 4 }} value={form.days ?? "7"} onChange={e => setForm({ ...form, days: e.target.value })} /></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={S.btn("green")} onClick={extendTrial} disabled={loading}>{loading ? "…" : "Prolonger"}</button>
                  <button style={S.btn("gray")} onClick={() => setModal(null)}>Annuler</button>
                </div>
              </>
            )}
            {modal.type === "reply" && (
              <>
                <h3 style={{ color: "#93c5fd", marginTop: 0 }}>Répondre à {modal.msg!.email}</h3>
                <p style={{ color: "#c8d8ea", fontSize: 12, marginBottom: 12 }}>{modal.msg!.message}</p>
                <div style={{ marginBottom: 16 }}><label style={{ color: "#6b8aaa", fontSize: 11 }}>Votre réponse</label><textarea style={{ ...S.textarea, marginTop: 4 }} value={form.reply ?? ""} onChange={e => setForm({ ...form, reply: e.target.value })} /></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={S.btn("blue")} onClick={replySupport} disabled={loading}>{loading ? "Envoi…" : "Répondre & fermer"}</button>
                  <button style={S.btn("gray")} onClick={() => setModal(null)}>Annuler</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#14532d", color: "#86efac", padding: "10px 20px", borderRadius: 8, fontSize: 12, zIndex: 2000, border: "1px solid #166534" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
