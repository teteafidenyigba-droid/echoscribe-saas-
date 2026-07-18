"use client";

import { useState } from "react";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setName(""); setEmail(""); setMessage("");
    setDone(false); setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok || data.error) setError(data.error ?? "Une erreur est survenue.");
      else setDone(true);
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => { reset(); setOpen(true); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#7dd3fc", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        Nous contacter
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, padding: "36px 32px", boxShadow: "0 24px 64px rgba(10,20,40,0.3)", position: "relative" }}>
            <button
              onClick={() => setOpen(false)}
              style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#8a9ab0", lineHeight: 1 }}
            >
              ×
            </button>

            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 30, fontWeight: 600, color: "#0d2540", marginBottom: 6, letterSpacing: "-0.02em" }}>
              Nous contacter
            </h2>
            <div style={{ width: 32, height: 3, background: "#c45d4a", borderRadius: 2, marginBottom: 24 }} />

            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#0d2540", marginBottom: 8 }}>Message envoyé !</p>
                <p style={{ fontSize: 13, color: "#8a9ab0", lineHeight: 1.7 }}>Nous vous répondrons à <strong style={{ color: "#0d2540" }}>{email}</strong> dans les meilleurs délais.</p>
                <button
                  onClick={() => setOpen(false)}
                  style={{ marginTop: 24, background: "#0a66c2", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Nom</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Votre nom"
                    style={{ border: "1.5px solid #dce6f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0d2540", outline: "none", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Email</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    style={{ border: "1.5px solid #dce6f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0d2540", outline: "none", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Message</label>
                  <textarea
                    required value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Comment pouvons-nous vous aider ?"
                    rows={5}
                    style={{ border: "1.5px solid #dce6f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0d2540", outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }}
                  />
                </div>

                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#b91c1c", fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  style={{ width: "100%", padding: "13px", background: "#0a66c2", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", opacity: loading ? 0.6 : 1, boxShadow: "0 4px 16px rgba(10,102,194,.25)" }}
                >
                  {loading ? "Envoi en cours…" : "Envoyer →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
