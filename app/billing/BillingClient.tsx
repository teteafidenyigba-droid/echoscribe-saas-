"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Subscription = {
  status: string;
  trial_end?: string;
  current_period_end?: string;
  price_id?: string;
  cancel_at_period_end?: boolean;
} | null;

interface Props {
  user: { email: string; name: string };
  subscription: Subscription;
  hasStripeCustomer: boolean;
  searchParams: { success?: string; canceled?: string; welcome?: string; plan?: string };
}

export default function BillingClient({ user, subscription, hasStripeCustomer, searchParams }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const isActive = subscription?.status === "active" || subscription?.status === "trialing";
  const isTrialing = subscription?.status === "trialing";
  const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end) : null;
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;

  async function handleCheckout(plan: "monthly" | "yearly") {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const text = await res.text();
    if (!text) { alert("Erreur Stripe : réponse vide. Vérifiez les clés dans .env.local"); setLoading(null); return; }
    const data = JSON.parse(text);
    if (data.url) window.location.href = data.url;
    else { alert("Erreur Stripe : " + (data.error || JSON.stringify(data))); setLoading(null); }
  }

  async function handlePortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={s.page}>
      {/* NAV */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
        </Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={s.userEmail}>{user.email}</span>
          {isActive && (
            <Link href="/app" style={s.navBtn}>
              ← Application
            </Link>
          )}
          <button onClick={handleLogout} style={{ ...s.navBtn, background: "transparent", color: "#38bdf8", cursor: "pointer", border: "1px solid rgba(56,189,248,0.18)" }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={s.content}>
        <h1 style={s.h1}>Mon abonnement</h1>

        {/* Banners */}
        {searchParams.success && (
          <div style={s.successBox}>
            ✓ Abonnement activé ! Votre essai de 7 jours commence maintenant.
          </div>
        )}
        {searchParams.welcome && (
          <div style={s.successBox}>
            ✓ Compte créé ! Choisissez votre plan pour démarrer votre essai gratuit de 7 jours.
          </div>
        )}
        {searchParams.canceled && (
          <div style={s.infoBox}>
            Paiement annulé. Votre abonnement actuel n'a pas été modifié.
          </div>
        )}

        {/* Current status */}
        {subscription && (
          <div style={s.card}>
            <div style={s.cardTitle}>Statut actuel</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  ...s.badge,
                  background: isActive ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.10)",
                  border: `1px solid ${isActive ? "rgba(21,98,122,0.35)" : "rgba(56,189,248,0.35)"}`,
                  color: isActive ? "#38bdf8" : "#38bdf8",
                }}
              >
                {isTrialing ? "⏳ Essai en cours" : isActive ? "✓ Actif" : subscription.status === "canceled" ? "Annulé" : subscription.status}
              </span>
              {isTrialing && trialEnd && (
                <span style={s.dimText}>Essai gratuit jusqu'au {fmtDate(trialEnd)}</span>
              )}
              {!isTrialing && periodEnd && isActive && (
                <span style={s.dimText}>
                  {subscription.cancel_at_period_end
                    ? `Accès jusqu'au ${fmtDate(periodEnd)} (annulé)`
                    : `Prochain renouvellement le ${fmtDate(periodEnd)}`}
                </span>
              )}
            </div>
            {hasStripeCustomer && (
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                style={{ ...s.secondaryBtn, marginTop: 20 }}
              >
                {loading === "portal" ? "Chargement…" : "Gérer via Stripe →"}
              </button>
            )}
          </div>
        )}

        {/* Plans */}
        {!isActive && (
          <>
            <h2 style={s.h2}>Choisissez votre plan</h2>
            <div style={s.plans}>
              <div style={s.planCard}>
                <div style={s.planName}>Mensuel</div>
                <div style={s.planPrice}>
                  59€ <span style={{ fontSize: 16, color: "#4a7a96" }}>/mois</span>
                </div>
                <p style={s.planDesc}>7 jours d'essai gratuit inclus</p>
                <button
                  onClick={() => handleCheckout("monthly")}
                  disabled={!!loading}
                  style={s.primaryBtn}
                >
                  {loading === "monthly" ? "Redirection…" : "Commencer l'essai →"}
                </button>
              </div>

              <div style={{ ...s.planCard, borderColor: "rgba(196,93,74,0.4)", background: "rgba(196,93,74,0.03)" }}>
                <div style={{ ...s.planName, color: "#38bdf8" }}>Annuel · <span style={{ color: "#38bdf8" }}>-25%</span></div>
                <div style={s.planPrice}>
                  699€ <span style={{ fontSize: 16, color: "#4a7a96" }}>/an</span>
                </div>
                <p style={{ ...s.planDesc, color: "#38bdf8" }}>Soit 58€/mois · 7 jours d'essai</p>
                <button
                  onClick={() => handleCheckout("yearly")}
                  disabled={!!loading}
                  style={{ ...s.primaryBtn, background: "#c45d4a" }}
                >
                  {loading === "yearly" ? "Redirection…" : "Commencer l'essai →"}
                </button>
              </div>
            </div>

            <p style={s.dimText}>
              Paiement sécurisé par Stripe · Aucun débit pendant l'essai · Résiliable à tout moment
            </p>
          </>
        )}

        {isActive && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/app"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "#c45d4a",
                border: "none",
                borderRadius: 10,
                color: "#ffffff",
                textDecoration: "none",
                fontSize: 18,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
              }}
            >
              Accéder à l'application →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#07101e",
    minHeight: "100vh",
    fontFamily: "'Inter Tight', system-ui, sans-serif",
    color: "#e2eaf5",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(251,250,247,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(56,189,248,0.15)",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  logo: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 22,
    fontStyle: "italic",
    color: "#e2eaf5",
    textDecoration: "none",
  },
  userEmail: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "#4a7a96",
  },
  navBtn: {
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(56,189,248,0.18)",
    borderRadius: 8,
    color: "#38bdf8",
    textDecoration: "none",
    fontSize: 13,
    padding: "7px 14px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  content: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 24px",
  },
  h1: {
    fontSize: 32,
    fontWeight: 600,
    color: "#e2eaf5",
    marginBottom: 28,
    fontFamily: "'Fraunces', Georgia, serif",
  },
  h2: {
    fontSize: 22,
    fontWeight: 600,
    color: "#e2eaf5",
    margin: "36px 0 20px",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  successBox: {
    background: "rgba(56,189,248,0.07)",
    border: "1px solid rgba(56,189,248,0.3)",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#38bdf8",
    fontSize: 15,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 20,
  },
  infoBox: {
    background: "rgba(56,189,248,0.07)",
    border: "1px solid rgba(56,189,248,0.3)",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#38bdf8",
    fontSize: 15,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 20,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(56,189,248,0.15)",
    borderRadius: 14,
    padding: "24px",
    marginBottom: 24,
    boxShadow: "0 2px 12px rgba(56,189,248,0.05)",
  },
  cardTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#4a7a96",
    marginBottom: 14,
  },
  badge: {
    borderRadius: 999,
    padding: "4px 14px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
  },
  dimText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "#4a7a96",
    textAlign: "center",
    marginTop: 16,
  },
  plans: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    marginBottom: 16,
  },
  planCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(56,189,248,0.15)",
    borderRadius: 14,
    padding: "28px 24px",
    boxShadow: "0 2px 12px rgba(56,189,248,0.05)",
  },
  planName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#4a7a96",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  planPrice: {
    fontSize: 38,
    fontWeight: 600,
    color: "#e2eaf5",
    marginBottom: 6,
  },
  planDesc: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "#4a7a96",
    marginBottom: 20,
  },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    background: "#c45d4a",
    border: "none",
    borderRadius: 10,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "'Fraunces', Georgia, serif",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "10px 20px",
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(56,189,248,0.18)",
    borderRadius: 9,
    color: "#38bdf8",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    cursor: "pointer",
  },
};
