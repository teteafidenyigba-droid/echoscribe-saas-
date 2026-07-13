"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://echoscribe.fr/reset-password",
    });
    if (error) {
      setError("Une erreur est survenue. Vérifiez votre adresse e-mail.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .es-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .es-input:focus { border-color: #0a66c2 !important; box-shadow: 0 0 0 3px rgba(10,102,194,0.1) !important; outline: none; }
        .es-btn { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
        .es-btn:hover:not(:disabled) { background: #084fa0 !important; box-shadow: 0 6px 24px rgba(10,102,194,0.4) !important; transform: translateY(-1px); }
        .es-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8a9ab0", textDecoration: "none", marginBottom: 32 }}>
            ← Retour à la connexion
          </Link>

          <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 38, fontWeight: 600, color: "#0d2540", letterSpacing: "-0.025em", marginBottom: 10, lineHeight: 1 }}>
            Mot de passe oublié
          </h2>
          <div style={{ width: 36, height: 3, background: "#c45d4a", borderRadius: 2, marginBottom: 14 }} />

          {!sent ? (
            <>
              <p style={{ fontSize: 14, color: "#8a9ab0", marginBottom: 28, lineHeight: 1.6 }}>
                Saisissez votre adresse e-mail. Vous recevrez un lien pour créer un nouveau mot de passe.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080", letterSpacing: "0.01em" }}>Adresse e-mail</label>
                  <input
                    className="es-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dr.dupont@clinique.fr"
                    style={{ width: "100%", border: "1.5px solid #dce6f0", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#0d2540", fontFamily: "'Inter', sans-serif", background: "#ffffff" }}
                  />
                </div>
                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 16px", color: "#b91c1c", fontSize: 13 }}>
                    {error}
                  </div>
                )}
                <button
                  className="es-btn"
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "14px", marginTop: 6, background: "#0a66c2", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 4px 16px rgba(10,102,194,0.28)" }}
                >
                  {loading ? "Envoi…" : "Envoyer le lien →"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
              <p style={{ fontSize: 16, color: "#0d2540", fontWeight: 600, marginBottom: 10 }}>E-mail envoyé</p>
              <p style={{ fontSize: 14, color: "#8a9ab0", lineHeight: 1.7, marginBottom: 28 }}>
                Si un compte existe pour <strong style={{ color: "#0d2540" }}>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants.
              </p>
              <Link href="/login" style={{ fontSize: 14, color: "#0a66c2", textDecoration: "none", fontWeight: 600 }}>
                Retour à la connexion
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
