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
      // Enregistre la session unique → invalide les autres appareils
      await fetch("/api/auth/session-init", { method: "POST" });
      router.push("/app");
      router.refresh();
    }
  }

  return (
    <div style={styles.card}>
      <Link href="/" style={styles.logo}>
        Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
      </Link>
      <h1 style={styles.title}>Connexion</h1>
      <p style={styles.sub}>Accédez à votre espace de dictée</p>

      {autreAppareil && (
        <div style={styles.warningBox}>
          <div style={{ fontSize: 15, marginBottom: 6, fontWeight: 600 }}>⚠️ Autre appareil connecté</div>
          <p>Ce compte est déjà ouvert sur un autre appareil. Connectez-vous ici pour basculer la session sur cet appareil — l&apos;autre sera automatiquement déconnecté.</p>
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={styles.label}>Email professionnel</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dr.dupont@clinique.fr"
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? "Connexion…" : "Se connecter →"}
        </button>
      </form>

        <p style={styles.footerText}>
          Pas encore de compte ?{" "}
          <Link href="/register" style={{ color: "#38bdf8" }}>
            Essai gratuit 7 jours
          </Link>
        </p>
      </div>
  );
}

export default function LoginPage() {
  return (
    <div style={styles.page}>
      <Suspense fallback={<div style={{ color: "#7bacc2" }}>Chargement…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#07101e",
    backgroundImage:
      "linear-gradient(160deg,rgba(5,16,34,0.88) 0%,rgba(7,20,45,0.82) 100%), url('/medical-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(56,189,248,0.2)",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
  },
  logo: {
    display: "block",
    fontFamily: "'EB Garamond', serif",
    fontSize: 24,
    fontStyle: "italic",
    color: "#e2eaf5",
    textDecoration: "none",
    marginBottom: 28,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: "#e2eaf5",
    marginBottom: 6,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: "#7bacc2",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 28,
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#c8d8ea",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 6,
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(56,189,248,0.18)",
    borderRadius: 9,
    padding: "11px 14px",
    color: "#c8d8ea",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
  },
  warningBox: {
    background: "rgba(251,191,36,0.08)",
    border: "1px solid rgba(251,191,36,0.35)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#fde68a",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.6,
    marginBottom: 4,
  },
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.35)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg,#0c2840,#0e3352)",
    border: "1px solid rgba(56,189,248,0.45)",
    borderRadius: 10,
    color: "#7dd3fc",
    fontSize: 17,
    fontFamily: "'EB Garamond', serif",
    cursor: "pointer",
    marginTop: 4,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#c8d8ea",
    marginTop: 20,
    fontFamily: "'JetBrains Mono', monospace",
  },
};
