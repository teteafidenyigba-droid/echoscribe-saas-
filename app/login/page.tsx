"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
      router.push("/app");
      router.refresh();
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link href="/" style={styles.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#c45d4a" }}>Scribe</span>
        </Link>
        <h1 style={styles.title}>Connexion</h1>
        <p style={styles.sub}>Accédez à votre espace de dictée</p>

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
          <Link href="/register" style={{ color: "#c45d4a" }}>
            Essai gratuit 7 jours
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#fbfaf7",
    backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(21,98,122,0.10) 0%, transparent 60%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'Inter Tight', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dde8eb",
    borderRadius: 18,
    padding: "44px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 4px 32px rgba(14,48,58,0.08)",
  },
  logo: {
    display: "block",
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 26,
    fontStyle: "italic",
    color: "#14303a",
    textDecoration: "none",
    marginBottom: 28,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: "#14303a",
    marginBottom: 6,
    textAlign: "center",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  sub: {
    fontSize: 14,
    color: "#5b7a84",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 28,
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#3c5a63",
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 6,
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    background: "#f4f8f9",
    border: "1px solid #c8dce3",
    borderRadius: 9,
    padding: "11px 14px",
    color: "#14303a",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
  },
  errorBox: {
    background: "rgba(196,93,74,0.07)",
    border: "1px solid rgba(196,93,74,0.35)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#c45d4a",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "#15627a",
    border: "none",
    borderRadius: 10,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "'Fraunces', Georgia, serif",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 4,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#5b7a84",
    marginTop: 20,
    fontFamily: "'JetBrains Mono', monospace",
  },
};
