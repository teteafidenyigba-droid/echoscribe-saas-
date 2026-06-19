"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
    maxWidth: 440,
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
    textAlign: "center" as const,
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
  successBox: {
    background: "rgba(21,98,122,0.07)",
    border: "1px solid rgba(21,98,122,0.3)",
    borderRadius: 8,
    padding: "16px 14px",
    color: "#15627a",
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.6,
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
};

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "monthly";
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, selected_plan: plan },
        emailRedirectTo: `${appUrl}/api/auth/callback?plan=${plan}`,
      },
    });
    if (error) {
      setError(error.message || error.name || JSON.stringify(error));
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div style={styles.card}>
        <Link href="/" style={styles.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#c45d4a" }}>Scribe</span>
        </Link>
        <div style={styles.successBox}>
          <div style={{ fontSize: 18, marginBottom: 10 }}>✓ Vérifiez votre email</div>
          <p>Un lien de confirmation vous a été envoyé à <strong>{email}</strong>.</p>
          <p style={{ marginTop: 8 }}>Cliquez sur le lien pour activer votre compte et démarrer votre essai de 7 jours.</p>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#5b7a84", marginTop: 20, fontFamily: "'JetBrains Mono', monospace" }}>
          Déjà un compte ? <Link href="/login" style={{ color: "#c45d4a" }}>Se connecter</Link>
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <Link href="/" style={styles.logo}>
        Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#c45d4a" }}>Scribe</span>
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "#14303a", marginBottom: 4, textAlign: "center", fontFamily: "'Fraunces', Georgia, serif" }}>
        Créer votre compte
      </h1>
      <p style={{ fontSize: 13, color: "#15627a", fontFamily: "'JetBrains Mono', monospace", marginBottom: 28, textAlign: "center" }}>
        7 jours d'essai gratuit · {plan === "yearly" ? "699€/an" : "59€/mois"} ensuite
      </p>

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={styles.label}>Prénom et nom</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Marie Dupont"
            style={styles.input}
          />
        </div>
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
          <label style={styles.label}>Mot de passe (min. 8 caractères)</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? "Création du compte…" : "Démarrer l'essai gratuit →"}
        </button>
      </form>

      <p style={{ fontSize: 11, color: "#8aa0a6", fontFamily: "'JetBrains Mono', monospace", marginTop: 14, textAlign: "center", lineHeight: 1.6 }}>
        En vous inscrivant, vous acceptez nos{" "}
        <Link href="/cgu" style={{ color: "#15627a" }}>CGU</Link> et notre{" "}
        <Link href="/confidentialite" style={{ color: "#15627a" }}>politique de confidentialité</Link>.
      </p>

      <p style={{ textAlign: "center", fontSize: 14, color: "#5b7a84", marginTop: 16, fontFamily: "'JetBrains Mono', monospace" }}>
        Déjà un compte ? <Link href="/login" style={{ color: "#c45d4a" }}>Se connecter</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div style={styles.page}>
      <Suspense fallback={<div style={{ color: "#5b7a84" }}>Chargement…</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
