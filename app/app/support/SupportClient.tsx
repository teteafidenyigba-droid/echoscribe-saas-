"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../../components/Logo";

const CATEGORIES = [
  { value: "bug",       label: "🐛  Bug technique" },
  { value: "question",  label: "❓  Question d'utilisation" },
  { value: "feature",   label: "💡  Demande de fonctionnalité" },
  { value: "billing",   label: "💳  Facturation / abonnement" },
  { value: "autre",     label: "💬  Autre" },
];

interface Props {
  user: { email: string; name: string };
}

export default function SupportClient({ user }: Props) {
  const [category, setCategory] = useState("question");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const displayName = user.name !== user.email ? user.name : user.email;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, message }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Une erreur est survenue.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#f0f5fb", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        .sp-input, .sp-select, .sp-textarea { transition: border-color .2s, box-shadow .2s; }
        .sp-input:focus, .sp-select:focus, .sp-textarea:focus {
          border-color: #0a66c2 !important;
          box-shadow: 0 0 0 3px rgba(10,102,194,.1) !important;
          outline: none;
        }
        .sp-btn { transition: background .15s, transform .1s; }
        .sp-btn:hover:not(:disabled) { background: #084fa0 !important; transform: translateY(-1px); }
        .sp-btn:disabled { opacity: .55; cursor: not-allowed; }
        .sp-nav-btn { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: 2px solid #c8ddef; border-radius: 8px; padding: 5px 20px; cursor: pointer; white-space: nowrap; text-decoration: none; }
        .sp-nav-btn:hover { background: #e8f1fb; border-color: #0a5fa8; }
      `}</style>

      {/* Top bar */}
      <div style={{ padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "rgba(234,244,251,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid #c8ddef", boxShadow: "0 1px 16px rgba(13,37,64,.18)" }}>
        <Link href="/app" style={{ textDecoration: "none" }}>
          <Logo size={26} />
        </Link>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#2a5070" }}>{displayName}</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 36, fontWeight: 600, color: "#0d2540", letterSpacing: "-0.025em", marginBottom: 8, lineHeight: 1 }}>
            Support technique
          </h2>
          <div style={{ width: 36, height: 3, background: "#c45d4a", borderRadius: 2, marginBottom: 24 }} />

          {done ? (
            <div style={{ textAlign: "center", paddingTop: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <p style={{ fontSize: 17, fontWeight: 600, color: "#0d2540", marginBottom: 8 }}>Message envoyé</p>
              <p style={{ fontSize: 14, color: "#8a9ab0", lineHeight: 1.7, marginBottom: 28 }}>
                Notre équipe vous répondra à <strong style={{ color: "#0d2540" }}>{user.email}</strong> dans les meilleurs délais.
              </p>
              <button
                onClick={() => router.push("/app")}
                className="sp-btn"
                style={{ background: "#0a66c2", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Retour à l&apos;application →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Pré-rempli */}
              <div style={{ background: "#eef4fb", border: "1px solid #c8ddef", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#2a5070" }}>
                <strong>{displayName}</strong> · {user.email}
              </div>

              {/* Catégorie */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Catégorie</label>
                <select
                  className="sp-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: "100%", border: "1.5px solid #dce6f0", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#0d2540", background: "#fff", fontFamily: "inherit" }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Sujet */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Sujet</label>
                <input
                  className="sp-input"
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Décrivez le problème en une phrase"
                  maxLength={120}
                  style={{ width: "100%", border: "1.5px solid #dce6f0", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#0d2540", background: "#fff", fontFamily: "inherit" }}
                />
              </div>

              {/* Message */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Message</label>
                <textarea
                  className="sp-textarea"
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème en détail : étapes pour reproduire, message d'erreur affiché, navigateur utilisé…"
                  rows={6}
                  style={{ width: "100%", border: "1.5px solid #dce6f0", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#0d2540", background: "#fff", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }}
                />
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 16px", color: "#b91c1c", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                className="sp-btn"
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px", background: "#0a66c2", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(10,102,194,.28)" }}
              >
                {loading ? "Envoi en cours…" : "Envoyer le message →"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexShrink: 0, background: "rgba(234,244,251,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid #c8ddef", boxShadow: "0 -1px 12px rgba(13,37,64,.12)" }}>
        <Link href="/app" className="sp-nav-btn">← Retour à l&apos;application</Link>
      </div>
    </div>
  );
}
