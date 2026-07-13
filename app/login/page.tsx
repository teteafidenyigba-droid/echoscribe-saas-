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
      {/* Fond : image filtrée en mode échographe */}
      <div style={s.bgImage} />
      <div style={s.bgOverlay} />

      {/* Contenu centré */}
      <div style={s.center}>
        <div style={s.card}>

          {/* Logo */}
          <Link href="/" style={s.logoLink}>
            <svg width="34" height="22" viewBox="0 0 38 26" fill="none" style={{ flexShrink: 0 }}>
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

          {/* Ligne de scan — signature */}
          <div style={s.scanLine}>
            <div style={s.scanGlow} />
          </div>

          <h1 style={s.title}>Connexion</h1>
          <p style={s.sub}>Accédez à votre espace de dictée</p>

          {autreAppareil && (
            <div style={s.warningBox}>
              <strong>⚠️ Autre appareil connecté</strong>
              <p style={{ margin: "4px 0 0", fontSize: 12 }}>
                Connectez-vous ici pour basculer — l&apos;autre session sera déconnectée.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} style={s.form}>
            <div>
              <label style={s.label}>Email professionnel</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="dr.dupont@clinique.fr"
                style={s.input}
              />
            </div>
            <div>
              <label style={s.label}>Mot de passe</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={s.input}
              />
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Connexion…" : "Se connecter →"}
            </button>
          </form>

          <p style={s.register}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={s.registerLink}>Essai gratuit 7 jours</Link>
          </p>

          <p style={s.legal}>Hébergement Europe · RGPD · HDS</p>
        </div>
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
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'EB Garamond', Georgia, serif",
    overflow: "hidden",
  },

  /* Fond image filtrée mode échographe */
  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/medical-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "grayscale(100%) brightness(0.55) sepia(0.6) hue-rotate(170deg) saturate(3)",
    transform: "scale(1.04)",
  },

  /* Overlay sombre par-dessus */
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg, rgba(0,8,24,0.72) 0%, rgba(0,14,38,0.68) 100%)",
  },

  /* Carte centrale */
  center: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 400,
    background: "rgba(0,10,28,0.88)",
    border: "1px solid rgba(0,180,216,0.22)",
    borderRadius: 18,
    padding: "40px 36px 36px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 0 0 1px rgba(0,180,216,0.06), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(0,180,216,0.12)",
  },

  logoLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    textDecoration: "none",
    marginBottom: 28,
  },
  logoText: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 26,
    color: "#e8f4fd",
    letterSpacing: "-0.01em",
  },

  /* Ligne de scan — signature visuelle */
  scanLine: {
    position: "relative",
    height: 1,
    background: "linear-gradient(90deg, transparent 0%, rgba(0,180,216,0.15) 20%, rgba(0,180,216,0.5) 50%, rgba(0,180,216,0.15) 80%, transparent 100%)",
    marginBottom: 28,
  },
  scanGlow: {
    position: "absolute",
    top: -2,
    left: "50%",
    transform: "translateX(-50%)",
    width: 60,
    height: 5,
    background: "rgba(0,180,216,0.25)",
    borderRadius: 4,
    filter: "blur(4px)",
  },

  title: {
    fontSize: 26,
    fontWeight: 600,
    color: "#e8f4fd",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: "-0.01em",
  },
  sub: {
    fontSize: 13,
    color: "#4a7a96",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 28,
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  label: {
    display: "block",
    fontSize: 10,
    color: "#4a7a96",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    background: "rgba(0,180,216,0.04)",
    border: "1px solid rgba(0,180,216,0.18)",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#e8f4fd",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },

  warningBox: {
    background: "rgba(251,191,36,0.07)",
    border: "1px solid rgba(251,191,36,0.25)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#fde68a",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.5,
  },
  errorBox: {
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },

  btn: {
    width: "100%",
    padding: "13px",
    marginTop: 4,
    background: "linear-gradient(135deg, #0552a3 0%, #0a66c2 100%)",
    border: "none",
    borderRadius: 9,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "'EB Garamond', serif",
    fontWeight: 600,
    letterSpacing: "0.03em",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(10,102,194,0.45)",
    transition: "opacity 0.15s, transform 0.1s",
  },

  register: {
    textAlign: "center",
    fontSize: 13,
    color: "#3d5a6e",
    fontFamily: "'JetBrains Mono', monospace",
    marginTop: 24,
  },
  registerLink: {
    color: "#00b4d8",
    textDecoration: "none",
    fontWeight: 600,
  },
  legal: {
    textAlign: "center",
    fontSize: 10,
    color: "rgba(0,180,216,0.3)",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: 20,
  },
};
