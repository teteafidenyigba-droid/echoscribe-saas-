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
      {/* Fond plein écran — image filtrée mode échographe */}
      <div style={s.bgImage} />
      <div style={s.bgOverlay} />

      {/* Tagline flottante en haut à gauche */}
      <div style={s.topLeft}>
        <p style={s.tagline}>Dictée médicale<br />augmentée par l&apos;IA</p>
      </div>

      {/* Panneau bas pleine largeur */}
      <div style={s.bottomPanel}>
        {/* Ligne de scan — signature echographique */}
        <div style={s.scanLine} />

        <form onSubmit={handleLogin} style={s.row}>
          {/* Logo */}
          <Link href="/" style={s.logoLink}>
            <svg width="30" height="20" viewBox="0 0 38 26" fill="none" style={{ flexShrink: 0 }}>
              <polyline
                points="0,13 7,13 10,3 14,23 18,9 22,17 26,13 38,13"
                stroke="#00b4d8" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
            </svg>
            <span style={s.logoText}>
              <em>Echo</em><strong style={{ fontStyle: "normal", color: "#00b4d8" }}>Scribe</strong>
            </span>
          </Link>

          <div style={s.divider} />

          {/* Champs */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="dr.dupont@clinique.fr"
              style={s.input}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Mot de passe</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={s.input}
            />
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "…" : "Se connecter →"}
          </button>

          <div style={s.divider} />

          <div style={s.registerBlock}>
            <Link href="/register" style={s.registerLink}>Essai gratuit 7 jours</Link>
            <span style={s.legal}>RGPD · HDS</span>
          </div>
        </form>

        {(error || autreAppareil) && (
          <div style={s.errorRow}>
            {autreAppareil
              ? "⚠️ Autre appareil connecté — cette session sera déconnectée."
              : error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background: "#000d1a", minHeight: "100vh" }} />}>
      <LoginForm />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'EB Garamond', Georgia, serif",
  },

  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/medical-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center 30%",
    filter: "grayscale(100%) brightness(0.6) sepia(0.5) hue-rotate(170deg) saturate(3)",
    transform: "scale(1.03)",
  },

  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,6,18,0.35) 0%, rgba(0,6,18,0.55) 60%, rgba(0,6,18,0.85) 100%)",
  },

  /* Tagline haut gauche */
  topLeft: {
    position: "absolute",
    top: 40,
    left: 48,
    zIndex: 2,
  },
  tagline: {
    fontSize: 42,
    fontWeight: 400,
    fontStyle: "italic",
    color: "rgba(232,244,253,0.88)",
    lineHeight: 1.2,
    margin: 0,
    letterSpacing: "-0.02em",
    textShadow: "0 2px 24px rgba(0,0,0,0.5)",
  },

  /* Panneau bas */
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    background: "rgba(0,8,22,0.90)",
    backdropFilter: "blur(20px)",
  },

  scanLine: {
    height: 1,
    background: "linear-gradient(90deg, transparent 0%, rgba(0,180,216,0.12) 15%, rgba(0,180,216,0.55) 50%, rgba(0,180,216,0.12) 85%, transparent 100%)",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "20px 48px",
    flexWrap: "wrap" as const,
  },

  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    textDecoration: "none",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 22,
    color: "#e8f4fd",
    letterSpacing: "-0.01em",
  },

  divider: {
    width: 1,
    height: 36,
    background: "rgba(0,180,216,0.18)",
    flexShrink: 0,
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 3,
  },
  label: {
    fontSize: 9,
    color: "rgba(0,180,216,0.55)",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
  },
  input: {
    background: "rgba(0,180,216,0.06)",
    border: "1px solid rgba(0,180,216,0.2)",
    borderRadius: 6,
    padding: "8px 12px",
    color: "#e8f4fd",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    outline: "none",
    width: 200,
    boxSizing: "border-box" as const,
  },

  btn: {
    padding: "10px 22px",
    background: "linear-gradient(135deg, #0552a3 0%, #0a66c2 100%)",
    border: "none",
    borderRadius: 7,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "'EB Garamond', serif",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    boxShadow: "0 3px 14px rgba(10,102,194,0.4)",
    flexShrink: 0,
    letterSpacing: "0.02em",
  },

  registerBlock: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    marginLeft: "auto",
  },
  registerLink: {
    color: "#00b4d8",
    textDecoration: "none",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
  },
  legal: {
    fontSize: 9,
    color: "rgba(0,180,216,0.3)",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.08em",
  },

  errorRow: {
    padding: "8px 48px 12px",
    fontSize: 12,
    color: "#fca5a5",
    fontFamily: "'JetBrains Mono', monospace",
    background: "rgba(239,68,68,0.06)",
  },
};
