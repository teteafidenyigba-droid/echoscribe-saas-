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
    <div style={s.root}>
      {/* ── PANNEAU GAUCHE ── */}
      <div style={s.left}>
        <div style={s.leftOverlay} />
        <div style={s.leftContent}>
          {/* Logo */}
          <Link href="/" style={s.logo}>
            <svg width="38" height="26" viewBox="0 0 38 26" fill="none">
              <polyline points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={s.logoText}>
              Echo<span style={{ fontStyle:"normal", fontWeight:700, color:"#38bdf8" }}>Scribe</span>
            </span>
          </Link>

          {/* Tagline */}
          <div style={s.tagline}>
            <h1 style={s.h1}>Dictée médicale<br/>augmentée par l'IA</h1>
            <p style={s.desc}>De la voix au compte rendu signable<br/>en moins de 30 secondes.</p>
          </div>

          {/* Features */}
          <ul style={s.features}>
            {["Transcription Whisper temps réel","Rédaction IA — normes SFR/HAS","Historique 12h · Export PDF & Word","Données hébergées en Europe"].map(f => (
              <li key={f} style={s.featureItem}>
                <span style={s.check}>✦</span>{f}
              </li>
            ))}
          </ul>

          <p style={s.leftFooter}>Rejoignez 500+ médecins échographistes</p>
        </div>
      </div>

      {/* ── PANNEAU DROIT ── */}
      <div style={s.right}>
        <div style={s.formWrap}>
          {/* Logo mobile */}
          <Link href="/" style={{ ...s.logo, display:"none", marginBottom:32, ...s.logoMobile }}>
            <svg width="32" height="22" viewBox="0 0 38 26" fill="none">
              <polyline points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={s.logoText}>Echo<span style={{ fontStyle:"normal", fontWeight:700, color:"#38bdf8" }}>Scribe</span></span>
          </Link>

          <h2 style={s.formTitle}>Connexion</h2>
          <p style={s.formSub}>Accédez à votre espace de dictée</p>

          {autreAppareil && (
            <div style={s.warningBox}>
              <strong>⚠️ Autre appareil connecté</strong>
              <p style={{ margin:"4px 0 0", fontSize:12 }}>Connectez-vous ici pour basculer la session — l&apos;autre sera déconnecté.</p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={s.label}>Email professionnel</label>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="dr.dupont@clinique.fr" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Mot de passe</label>
              <input type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" style={s.input} />
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Connexion…" : "Se connecter →"}
            </button>
          </form>

          <p style={s.footerText}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ color:"#38bdf8", textDecoration:"none", fontWeight:600 }}>
              Essai gratuit 7 jours
            </Link>
          </p>

          <p style={s.legal}>Données médicales hébergées en Europe · RGPD</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background:"#030d1a", minHeight:"100vh" }} />}>
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
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  /* ── LEFT ── */
  left: {
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundImage: "url('/medical-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  leftOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(3,13,26,0.82) 0%, rgba(4,22,55,0.72) 60%, rgba(6,30,70,0.65) 100%)",
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "48px 52px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#e2eaf5",
  },
  logoText: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 26,
    fontStyle: "italic",
    color: "#e2eaf5",
    letterSpacing: "-0.01em",
  },
  tagline: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: 24,
  },
  h1: {
    fontSize: 42,
    fontWeight: 400,
    fontStyle: "italic",
    color: "#ffffff",
    lineHeight: 1.18,
    marginBottom: 16,
    letterSpacing: "-0.02em",
  },
  desc: {
    fontSize: 16,
    color: "rgba(125,211,252,0.85)",
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.65,
    letterSpacing: "0.01em",
  },
  features: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 32px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "rgba(200,216,234,0.88)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  check: {
    color: "#38bdf8",
    fontSize: 11,
    flexShrink: 0,
  },
  leftFooter: {
    fontSize: 12,
    color: "rgba(125,211,252,0.5)",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  /* ── RIGHT ── */
  right: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 420,
    background: "#030d1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 40px",
    height: "100%",
    overflowY: "auto",
    borderLeft: "1px solid rgba(56,189,248,0.1)",
  },
  formWrap: {
    width: "100%",
    maxWidth: 340,
  },
  logoMobile: { display: "none" },
  formTitle: {
    fontSize: 28,
    fontWeight: 600,
    color: "#e8f4fd",
    marginBottom: 6,
    letterSpacing: "-0.01em",
  },
  formSub: {
    fontSize: 13,
    color: "#4a7a96",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 32,
  },
  label: {
    display: "block",
    fontSize: 11,
    color: "#7bacc2",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 6,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(56,189,248,0.2)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#e8f4fd",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: 4,
    background: "linear-gradient(135deg, #0552a3 0%, #0A66C2 100%)",
    border: "none",
    borderRadius: 9,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "'EB Garamond', serif",
    fontWeight: 600,
    letterSpacing: "0.02em",
    cursor: "pointer",
    boxShadow: "0 4px 24px rgba(10,102,194,0.4)",
    transition: "opacity 0.15s",
  },
  warningBox: {
    background: "rgba(251,191,36,0.08)",
    border: "1px solid rgba(251,191,36,0.3)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#fde68a",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.5,
    marginBottom: 16,
  },
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4a7a96",
    marginTop: 24,
    fontFamily: "'JetBrains Mono', monospace",
  },
  legal: {
    textAlign: "center",
    fontSize: 11,
    color: "rgba(74,122,150,0.5)",
    marginTop: 32,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.04em",
  },
};
