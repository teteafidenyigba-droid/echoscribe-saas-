"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const code = searchParams.get("code");

    // DEBUG temporaire — affiche les params reçus
    const params = [
      token_hash ? `token_hash=✓(${token_hash.slice(0,8)}…)` : "token_hash=∅",
      type ? `type=${type}` : "type=∅",
      code ? `code=✓(${code.slice(0,8)}…)` : "code=∅",
    ].join(" | ");

    if (token_hash && type === "recovery") {
      supabase.auth.verifyOtp({ token_hash, type: "recovery" }).then(({ error }) => {
        if (error) {
          setError(`[OTP] ${error.message} — params: ${params}`);
        } else {
          setReady(true);
        }
      });
      return;
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError(`[PKCE] ${error.message} — params: ${params}`);
        } else {
          setReady(true);
          router.replace("/reset-password");
        }
      });
      return;
    }

    setError(`Aucun paramètre reçu — params: ${params}`);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message || "Une erreur est survenue. Réessayez ou demandez un nouveau lien.");
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .es-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .es-input:focus { border-color: #0a66c2 !important; box-shadow: 0 0 0 3px rgba(10,102,194,0.1) !important; outline: none; }
        .es-btn { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
        .es-btn:hover:not(:disabled) { background: #084fa0 !important; transform: translateY(-1px); }
        .es-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 38, fontWeight: 600, color: "#0d2540", letterSpacing: "-0.025em", marginBottom: 10, lineHeight: 1 }}>
            Nouveau mot de passe
          </h2>
          <div style={{ width: 36, height: 3, background: "#c45d4a", borderRadius: 2, marginBottom: 28 }} />

          {done ? (
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
              <p style={{ fontSize: 16, color: "#0d2540", fontWeight: 600, marginBottom: 10 }}>Mot de passe modifié</p>
              <p style={{ fontSize: 14, color: "#8a9ab0", lineHeight: 1.7 }}>Redirection vers la connexion…</p>
            </div>
          ) : error && !ready ? (
            <div>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px", color: "#b91c1c", fontSize: 14, marginBottom: 24 }}>
                {error}
              </div>
              <Link href="/forgot-password" style={{ display: "inline-block", fontSize: 14, color: "#0a66c2", textDecoration: "none", fontWeight: 600 }}>
                Demander un nouveau lien →
              </Link>
            </div>
          ) : !ready ? (
            <p style={{ fontSize: 14, color: "#8a9ab0" }}>Vérification du lien…</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Nouveau mot de passe</label>
                <input className="es-input" type="password" required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="8 caractères minimum"
                  style={{ width: "100%", border: "1.5px solid #dce6f0", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#0d2540", fontFamily: "'Inter', sans-serif", background: "#ffffff" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#4a6080" }}>Confirmer le mot de passe</label>
                <input className="es-input" type="password" required value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                  style={{ width: "100%", border: "1.5px solid #dce6f0", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#0d2540", fontFamily: "'Inter', sans-serif", background: "#ffffff" }} />
              </div>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 16px", color: "#b91c1c", fontSize: 13 }}>
                  {error}
                </div>
              )}
              <button className="es-btn" type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", marginTop: 6, background: "#0a66c2", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 4px 16px rgba(10,102,194,0.28)" }}>
                {loading ? "Enregistrement…" : "Enregistrer le mot de passe →"}
              </button>
            </form>
          )}

          {!done && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#aab8cc", marginTop: 28 }}>
              <Link href="/login" style={{ color: "#8a9ab0", textDecoration: "none" }}>← Retour à la connexion</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f5f7fa", minHeight: "100vh" }} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
