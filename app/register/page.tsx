"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#07101e",
    backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(14,50,82,0.55) 0%, transparent 55%)",
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
    maxWidth: 440,
  },
  logo: {
    display: "block",
    fontFamily: "'EB Garamond', serif",
    fontSize: 24,
    fontStyle: "italic",
    color: "#e2eaf5",
    textDecoration: "none",
    marginBottom: 28,
    textAlign: "center" as const,
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
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.35)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },
  successBox: {
    background: "rgba(74,222,128,0.07)",
    border: "1px solid rgba(74,222,128,0.3)",
    borderRadius: 8,
    padding: "16px 14px",
    color: "#86efac",
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.6,
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
    const { data, error } = await supabase.auth.signUp({
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
    } else if (data.user && data.user.identities?.length === 0) {
      // Email déjà utilisé — Supabase ne retourne pas d'erreur mais identities est vide
      setError("Un compte existe déjà avec cette adresse email. Connectez-vous ou utilisez une autre adresse.");
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div style={styles.card}>
        <Link href="/" style={styles.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
        </Link>
        <div style={styles.successBox}>
          <div style={{ fontSize: 18, marginBottom: 10 }}>✓ Vérifiez votre email</div>
          <p>Un lien de confirmation vous a été envoyé à <strong>{email}</strong>.</p>
          <p style={{ marginTop: 8 }}>Cliquez sur le lien pour activer votre compte et démarrer votre essai de 7 jours.</p>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#4a7a96", marginTop: 20, fontFamily: "'JetBrains Mono', monospace" }}>
          Déjà un compte ? <Link href="/login" style={{ color: "#38bdf8" }}>Se connecter</Link>
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <Link href="/" style={styles.logo}>
        Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "#e2eaf5", marginBottom: 4, textAlign: "center" }}>
        Créer votre compte
      </h1>
      <p style={{ fontSize: 13, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 28, textAlign: "center" }}>
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

      <p style={{ fontSize: 11, color: "#2d4a5e", fontFamily: "'JetBrains Mono', monospace", marginTop: 14, textAlign: "center", lineHeight: 1.6 }}>
        En vous inscrivant, vous acceptez nos{" "}
        <Link href="/cgu" style={{ color: "#4a7a96" }}>CGU</Link> et notre{" "}
        <Link href="/confidentialite" style={{ color: "#4a7a96" }}>politique de confidentialité</Link>.
      </p>

      <p style={{ textAlign: "center", fontSize: 14, color: "#4a7a96", marginTop: 16, fontFamily: "'JetBrains Mono', monospace" }}>
        Déjà un compte ? <Link href="/login" style={{ color: "#38bdf8" }}>Se connecter</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div style={styles.page}>
      <Suspense fallback={<div style={{ color: "#7bacc2" }}>Chargement…</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
