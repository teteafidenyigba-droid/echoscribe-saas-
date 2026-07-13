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
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        .es-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .es-input:focus { border-color: #0a66c2 !important; box-shadow: 0 0 0 3px rgba(10,102,194,0.1) !important; outline: none; }
        .es-btn { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
        .es-btn:hover:not(:disabled) { background: #084fa0 !important; box-shadow: 0 6px 24px rgba(10,102,194,0.4) !important; transform: translateY(-1px); }
        .es-btn:active:not(:disabled) { transform: translateY(0); }
        .es-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        @media (max-width: 900px) {
          .es-left { display: none !important; }
          .es-right { width: 100% !important; }
        }
      `}</style>

      <div style={s.root}>

        {/* ── Panneau gauche ── */}
        <div className="es-left" style={s.left}>
          <div style={s.leftBg} />
          <div style={s.leftOverlay} />

          <div style={s.leftContent}>
            {/* Logo */}
            <Link href="/" style={s.logoLink}>
              <svg width="38" height="25" viewBox="0 0 38 26" fill="none">
                <polyline points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                  stroke="#c45d4a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span style={s.logoText}><em>Echo</em><strong style={{ fontStyle:"normal", color:"#0a6abf" }}>Scribe</strong></span>
            </Link>

            {/* Corps */}
            <div style={s.leftBody}>
              <p style={s.eyebrow}>Dictée médicale augmentée par l&apos;IA</p>
              <h1 style={s.headline}>
                Le compte rendu<br />en quelques<br /><em>secondes.</em>
              </h1>
              <p style={s.leftDesc}>
                Spécialisé pour les radiologues et échographistes.<br />
                Précis, conforme, prêt à signer.
              </p>

            </div>

          </div>
        </div>

        {/* ── Panneau droit ── */}
        <div className="es-right" style={s.right}>
          <div style={s.formWrap}>

            {/* Logo (visible si gauche masqué) */}
            <div style={s.mobileLogoWrap}>
              <Link href="/" style={s.logoLink}>
                <svg width="26" height="17" viewBox="0 0 38 26" fill="none">
                  <polyline points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                    stroke="#c45d4a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span style={{ ...s.logoText, color: "#0d2540" }}>
                  <em>Echo</em><strong style={{ fontStyle:"normal", color:"#0a6abf" }}>Scribe</strong>
                </span>
              </Link>
            </div>

            {/* En-tête formulaire */}
            <div style={s.formHeader}>
              <h2 style={s.formTitle}>Connexion</h2>
              <p style={s.formSub}>Bon retour parmi nous</p>
            </div>

            {autreAppareil && (
              <div style={s.warningBox}>
                <span style={{ fontWeight: 600 }}>Autre appareil connecté.</span>{" "}
                Cette session sera déconnectée dès votre connexion ici.
              </div>
            )}

            <form onSubmit={handleLogin} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Email professionnel</label>
                <input className="es-input" type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="dr.dupont@clinique.fr"
                  style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Mot de passe</label>
                <input className="es-input" type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={s.input} />
              </div>

              {error && <div style={s.errorBox}>{error}</div>}

              <button className="es-btn" type="submit" disabled={loading} style={s.btn}>
                {loading ? "Connexion…" : "Se connecter →"}
              </button>
            </form>

            <div style={s.dividerRow}>
              <span style={s.dividerLine} />
              <span style={s.dividerText}>ou</span>
              <span style={s.dividerLine} />
            </div>

            <p style={s.register}>
              Pas encore de compte ?{" "}
              <Link href="/register" style={s.registerLink}>Commencer l&apos;essai gratuit</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f5f7fa", minHeight: "100vh" }} />}>
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

  /* ── Gauche ── */
  left: {
    position: "relative",
    width: "52%",
    flexShrink: 0,
    overflow: "hidden",
  },
  leftBg: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/medical-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center 20%",
  },
  leftOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg, rgba(5,15,35,0.90) 0%, rgba(8,28,65,0.85) 50%, rgba(10,35,80,0.80) 100%)",
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "44px 52px",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoText: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 32,
    color: "#e8f4fd",
    letterSpacing: "-0.01em",
  },
  leftBody: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  eyebrow: {
    fontSize: 11,
    color: "rgba(0,180,216,0.7)",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 20,
    fontWeight: 500,
  },
  headline: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 62,
    fontWeight: 400,
    color: "#ffffff",
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
    marginBottom: 24,
  },
  leftDesc: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.7,
    marginBottom: 44,
  },
  quote: {
    borderLeft: "2px solid rgba(0,180,216,0.35)",
    paddingLeft: 20,
  },
  quoteText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "'EB Garamond', serif",
    fontStyle: "italic",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  quoteCite: {
    fontSize: 11,
    color: "rgba(0,180,216,0.55)",
    fontFamily: "'Inter', sans-serif",
    fontStyle: "normal",
    letterSpacing: "0.03em",
  },
  leftFooter: {
    fontSize: 10,
    color: "rgba(255,255,255,0.18)",
    letterSpacing: "0.07em",
    textTransform: "uppercase" as const,
    fontFamily: "'Inter', sans-serif",
  },

  /* ── Droite ── */
  right: {
    flex: 1,
    background: "#f5f7fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    overflowY: "auto",
  },
  formWrap: {
    width: "100%",
    maxWidth: 380,
  },
  mobileLogoWrap: {
    display: "none",
    marginBottom: 36,
  },
  formHeader: {
    marginBottom: 36,
  },
  formTitle: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 40,
    fontWeight: 600,
    color: "#0d2540",
    letterSpacing: "-0.025em",
    marginBottom: 6,
    lineHeight: 1,
  },
  formSub: {
    fontSize: 14,
    color: "#8a9ab0",
    fontWeight: 400,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#4a6080",
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    border: "1.5px solid #dce6f0",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 14,
    color: "#0d2540",
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
  },
  warningBox: {
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#92400e",
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "11px 16px",
    color: "#b91c1c",
    fontSize: 13,
  },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: 6,
    background: "#0a66c2",
    border: "none",
    borderRadius: 10,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.01em",
    boxShadow: "0 4px 16px rgba(10,102,194,0.28)",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "28px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#dce6f0",
  },
  dividerText: {
    fontSize: 12,
    color: "#aab8cc",
    fontWeight: 500,
  },
  register: {
    textAlign: "center",
    fontSize: 14,
    color: "#8a9ab0",
  },
  registerLink: {
    color: "#0a66c2",
    textDecoration: "none",
    fontWeight: 600,
  },
  legalRight: {
    textAlign: "center",
    fontSize: 10,
    color: "#c0cdd8",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    marginTop: 28,
  },
};
