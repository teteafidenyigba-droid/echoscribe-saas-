"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "../components/Logo";
import { checkPassword, isPasswordValid, PASSWORD_RULES } from "@/lib/password";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cguAccepted, setCguAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "monthly";
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isPasswordValid(password)) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
      return;
    }
    if (!cguAccepted) {
      setError("Vous devez accepter les CGU pour créer un compte.");
      return;
    }
    setLoading(true);

    // Vérification IP anti-abus essai gratuit
    try {
      const ipCheck = await fetch("/api/auth/check-ip");
      const ipData = await ipCheck.json();
      if (!ipData.allowed) {
        setError(ipData.reason || "Un essai gratuit a déjà été utilisé depuis votre réseau.");
        setLoading(false);
        return;
      }
    } catch {
      // Si la vérification échoue, on laisse passer (pas de blocage sur erreur réseau)
    }

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
      setError("Un compte existe déjà avec cette adresse email. Connectez-vous ou utilisez une autre adresse.");
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        .reg-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .reg-input:focus { border-color: #0a66c2 !important; box-shadow: 0 0 0 3px rgba(10,102,194,0.1) !important; outline: none; }
        .reg-btn { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
        .reg-btn:hover:not(:disabled) { background: #084fa0 !important; box-shadow: 0 6px 24px rgba(10,102,194,0.4) !important; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        @media (max-width: 900px) {
          .reg-left { display: none !important; }
          .reg-right { width: 100% !important; overflow-y: auto !important; }
        }
      `}</style>

      <div style={s.root}>
        {/* ── Panneau gauche ── */}
        <div className="reg-left" style={s.left}>
          <div style={s.leftBg} />
          <div style={s.leftOverlay} />
          <div style={s.leftContent}>
            <Link href="/" style={s.logoLink}>
              <Logo dark size={24} />
            </Link>
            <div style={s.leftBody}>
              <h1 style={s.headline}>
                Le compte rendu<br />en quelques<br /><em>secondes.</em>
              </h1>
            </div>
          </div>
        </div>

        {/* ── Panneau droit ── */}
        <div className="reg-right" style={s.right}>
          <div style={s.formWrap}>

            {success ? (
              <>
                <div style={s.formHeader}>
                  <h2 style={s.formTitle}>Vérifiez votre email</h2>
                  <div style={s.titleAccent} />
                </div>
                <div style={s.successBox}>
                  <p>Un lien de confirmation a été envoyé à <strong>{email}</strong>.</p>
                  <p style={{ marginTop: 8 }}>Cliquez sur le lien pour activer votre compte et démarrer votre essai de 7 jours.</p>
                </div>
                <p style={s.loginLink}>
                  Déjà un compte ? <Link href="/login" style={s.registerLink}>Se connecter</Link>
                </p>
              </>
            ) : (
              <>
                <div style={s.formHeader}>
                  <h2 style={s.formTitle}>Créer votre compte</h2>
                  <div style={s.titleAccent} />
                  <p style={s.formSub}>7 jours gratuits · aucune carte requise</p>
                </div>

                <form onSubmit={handleRegister} style={s.form}>
                  <div style={s.field}>
                    <label style={s.label}>Prénom et nom</label>
                    <input className="reg-input" type="text" required value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Dr. Marie Dupont"
                      style={s.input} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Email</label>
                    <input className="reg-input" type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="dr.dupont@clinique.fr"
                      style={s.input} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Mot de passe</label>
                    <input className="reg-input" type="password" required value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={s.input} />
                    {password.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 6 }}>
                        {PASSWORD_RULES.map(({ key, label }) => {
                          const ok = checkPassword(password)[key];
                          return (
                            <span key={key} style={{ fontSize: 11, color: ok ? "#16a34a" : "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
                              <span style={{ fontSize: 10 }}>{ok ? "✓" : "○"}</span> {label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={cguAccepted}
                      onChange={e => setCguAccepted(e.target.checked)}
                      style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0, accentColor: "#0a66c2", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 12, color: "#4a6080", lineHeight: 1.5 }}>
                      J&apos;accepte les{" "}
                      <Link href="/cgu" target="_blank" style={{ color: "#0a66c2", textDecoration: "underline" }}>CGU</Link>
                      {" "}et la{" "}
                      <Link href="/confidentialite" target="_blank" style={{ color: "#0a66c2", textDecoration: "underline" }}>politique de confidentialité</Link>
                      {" "}d&apos;EchoScribe.
                    </span>
                  </label>

                  {error && <div style={s.errorBox}>{error}</div>}

                  <button className="reg-btn" type="submit" disabled={loading || !cguAccepted} style={s.btn}>
                    {loading ? "Création du compte…" : "Démarrer l'essai gratuit →"}
                  </button>
                </form>

                <div style={s.dividerRow}>
                  <span style={s.dividerLine} />
                  <span style={s.dividerText}>ou</span>
                  <span style={s.dividerLine} />
                </div>

                <p style={s.loginLink}>
                  Déjà un compte ? <Link href="/login" style={s.registerLink}>Se connecter</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f5f7fa", minHeight: "100vh" }} />}>
      <RegisterForm />
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
    padding: "44px 56px",
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
    color: "rgba(255,255,255,0.9)",
    letterSpacing: "-0.01em",
  },
  leftBody: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  headline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 64,
    fontWeight: 300,
    color: "#ffffff",
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
  },
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
  formHeader: {
    marginBottom: 32,
  },
  formTitle: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 40,
    fontWeight: 600,
    color: "#0d2540",
    letterSpacing: "-0.025em",
    marginBottom: 10,
    lineHeight: 1,
  },
  titleAccent: {
    width: 36,
    height: 3,
    background: "#c45d4a",
    borderRadius: 2,
    marginBottom: 14,
  },
  formSub: {
    fontSize: 14,
    color: "#8a9ab0",
    fontWeight: 400,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
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
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    border: "1.5px solid #dce6f0",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    color: "#0d2540",
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "11px 16px",
    color: "#b91c1c",
    fontSize: 13,
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 10,
    padding: "16px",
    color: "#166534",
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: 4,
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
  legal: {
    fontSize: 11,
    color: "#aab8cc",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 1.6,
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "24px 0",
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
  loginLink: {
    textAlign: "center",
    fontSize: 14,
    color: "#8a9ab0",
  },
  registerLink: {
    color: "#0a66c2",
    textDecoration: "none",
    fontWeight: 600,
  },
};
