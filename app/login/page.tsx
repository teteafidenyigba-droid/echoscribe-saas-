"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const autreAppareil = searchParams.get("error") === "autre_appareil";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Email ou mot de passe incorrect."
        : error.message);
      setLoading(false);
    } else {
      await fetch("/api/auth/session-init", { method: "POST" });
      router.push("/app");
      router.refresh();
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        .es-input:focus { border-color: #0a66c2 !important; outline: none; }
        .es-btn:hover:not(:disabled) { background: #0552a3 !important; }
        .es-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 768px) {
          .es-left { display: none !important; }
          .es-right { width: 100% !important; }
        }
      `}</style>

      <div style={s.root}>
        {/* Panneau gauche — graphique */}
        <div className="es-left" style={s.left}>
          {/* Grande onde ECG décorative */}
          {/* Contenu */}
          <div style={s.leftContent}>
            <Link href="/" style={s.logoLinkLeft}>
              <svg width="28" height="18" viewBox="0 0 38 26" fill="none">
                <polyline
                  points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                  stroke="#00b4d8" strokeWidth="2.4"
                  strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
              </svg>
              <span style={s.logoTextLeft}>
                <em>Echo</em><strong style={{ fontStyle: "normal", color: "#00b4d8" }}>Scribe</strong>
              </span>
            </Link>

            <div style={s.leftBody}>
              <h1 style={s.headline}>
                La dictée médicale<br />
                <em style={{ color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>réinventée.</em>
              </h1>
              <p style={s.desc}>
                Comptes rendus d&apos;échographie générés en quelques secondes.
                Précis, conformes, prêts à signer.
              </p>

            </div>

            <p style={s.leftFooter}>
              Fait pour les radiologues et échographistes
            </p>
          </div>
        </div>

        {/* Panneau droit — formulaire */}
        <div className="es-right" style={s.right}>
          <div style={s.formWrap}>
            {/* Logo mobile uniquement */}
            <Link href="/" style={{ ...s.logoLinkLeft, display: "none", marginBottom: 32 } as React.CSSProperties}>
              <svg width="24" height="16" viewBox="0 0 38 26" fill="none">
                <polyline points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                  stroke="#0a66c2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span style={{ ...s.logoTextLeft, color: "#0d2540" }}>
                <em>Echo</em><strong style={{ fontStyle: "normal", color: "#0a66c2" }}>Scribe</strong>
              </span>
            </Link>

            <h2 style={s.formTitle}>Connexion</h2>
            <p style={s.formSub}>Accédez à votre espace</p>

            {autreAppareil && (
              <div style={s.warningBox}>
                <strong>Autre appareil connecté</strong>
                <p style={{ marginTop: 4, fontSize: 13 }}>
                  Cette session sera déconnectée dès votre connexion ici.
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Email professionnel</label>
                <input
                  className="es-input"
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="dr.dupont@clinique.fr"
                  style={s.input}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Mot de passe</label>
                <input
                  className="es-input"
                  type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={s.input}
                />
              </div>

              {error && <div style={s.errorBox}>{error}</div>}

              <button className="es-btn" type="submit" disabled={loading} style={s.btn}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>

            <p style={s.register}>
              Pas encore de compte ?{" "}
              <Link href="/register" style={s.registerLink}>Essai gratuit 7 jours</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f8fafc", minHeight: "100vh" }} />}>
      <LoginForm />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },

  /* Panneau gauche */
  left: {
    position: "relative",
    width: "55%",
    background: "linear-gradient(145deg, #050f1e 0%, #0a1f3d 60%, #0d2952 100%)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  ecgBig: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    width: "100%",
    transform: "translateY(-50%)",
    opacity: 1,
  },

  leftContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "44px 56px",
  },

  logoLinkLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoTextLeft: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 22,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: "-0.01em",
  },

  leftBody: {
    marginTop: "auto",
    marginBottom: "auto",
  },

  headline: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 58,
    fontWeight: 400,
    color: "#ffffff",
    lineHeight: 1.1,
    letterSpacing: "-0.025em",
    marginBottom: 24,
  },

  desc: {
    fontSize: 15,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.7,
    maxWidth: 360,
    marginBottom: 40,
    fontWeight: 400,
  },

  badges: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  badge: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  leftFooter: {
    fontSize: 10,
    color: "rgba(255,255,255,0.15)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "'Inter', sans-serif",
  },

  /* Panneau droit */
  right: {
    width: "45%",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    overflowY: "auto",
  },

  formWrap: {
    width: "100%",
    maxWidth: 360,
  },

  formTitle: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 36,
    fontWeight: 600,
    color: "#0d2540",
    letterSpacing: "-0.02em",
    marginBottom: 6,
  },
  formSub: {
    fontSize: 14,
    color: "#8a9ab0",
    marginBottom: 36,
    fontWeight: 400,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#4a6080",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    border: "1.5px solid #dce6f0",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    color: "#0d2540",
    fontFamily: "'Inter', sans-serif",
    background: "#f8fafc",
    transition: "border-color 0.15s",
  },

  warningBox: {
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#92400e",
    fontSize: 13,
    marginBottom: 20,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#b91c1c",
    fontSize: 13,
  },

  btn: {
    width: "100%",
    padding: "13px",
    marginTop: 4,
    background: "#0a66c2",
    border: "none",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "background 0.15s",
  },

  register: {
    textAlign: "center",
    fontSize: 13,
    color: "#8a9ab0",
    marginTop: 28,
  },
  registerLink: {
    color: "#0a66c2",
    textDecoration: "none",
    fontWeight: 600,
  },
};
