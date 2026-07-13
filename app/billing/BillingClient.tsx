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

  const now = new Date();
  const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end) : null;
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const isTrialing = subscription?.status === "trialing";
  const trialExpired = isTrialing && trialEnd !== null && trialEnd < now;
  const isActive = (subscription?.status === "active" || (isTrialing && !trialExpired));

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
          <button onClick={handleLogout} style={{ ...s.navBtn, background: "transparent", color: "#4a7a96", cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={s.content}>
        <h1 style={s.h1}>Mon abonnement</h1>

        {/* Banners */}
        {trialExpired && (
          <div style={{ ...s.errorBox, marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>⏰ Votre essai gratuit est terminé</div>
            <p>Votre période d'essai de 7 jours a expiré le {trialEnd ? fmtDate(trialEnd) : ""}. Choisissez un abonnement ci-dessous pour retrouver l'accès à EchoScribe.</p>
          </div>
        )}
        {searchParams.success && (
          <div style={s.successBox}>
            ✓ Abonnement activé ! Votre essai de 7 jours commence maintenant.
          </div>
        )}
        {searchParams.welcome && (
          <div style={s.successBox}>
            ✓ Bienvenue ! Votre essai de 7 jours est actif — accédez à l'application dès maintenant.
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
                  background: isActive ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${isActive ? "rgba(74,222,128,0.35)" : "rgba(239,68,68,0.35)"}`,
                  color: isActive ? "#86efac" : "#fca5a5",
                }}
              >
                {trialExpired ? "⏰ Essai expiré" : isTrialing ? "⏳ Essai en cours" : isActive ? "✓ Actif" : subscription.status === "canceled" ? "Annulé" : subscription.status}
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
                  69€ <span style={{ fontSize: 16, color: "#7bacc2" }}>/mois</span>
                </div>
                <p style={s.planDesc}>Sans engagement · résiliable à tout moment</p>
                <button
                  onClick={() => handleCheckout("monthly")}
                  disabled={!!loading}
                  style={s.primaryBtn}
                >
                  {loading === "monthly" ? "Redirection…" : "Commencer l'essai →"}
                </button>
              </div>

              <div style={{ ...s.planCard, borderColor: "rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.03)" }}>
                <div style={{ ...s.planName, color: "#38bdf8" }}>Annuel · <span style={{ color: "#4ade80" }}>-25%</span></div>
                <div style={s.planPrice}>
                  799€ <span style={{ fontSize: 16, color: "#7bacc2" }}>/an</span>
                </div>
                <p style={{ ...s.planDesc, color: "#38bdf8" }}>Soit 58€/mois · économisez 25%</p>
                <button
                  onClick={() => handleCheckout("yearly")}
                  disabled={!!loading}
                  style={{ ...s.primaryBtn, background: "#38bdf8", color: "#07101e", border: "none" }}
                >
                  {loading === "yearly" ? "Redirection…" : "Commencer l'essai →"}
                </button>
              </div>
            </div>

            <p style={s.dimText}>
              Paiement sécurisé par Stripe · Résiliable à tout moment
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
                background: "linear-gradient(90deg,#0c2840,#0e3352)",
                border: "1px solid rgba(56,189,248,0.45)",
                borderRadius: 10,
                color: "#7dd3fc",
                textDecoration: "none",
                fontSize: 18,
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
    fontFamily: "'EB Garamond', Georgia, serif",
    color: "#c8d8ea",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(7,16,30,0.92)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(56,189,248,0.15)",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  logo: {
    fontFamily: "'EB Garamond', serif",
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
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(56,189,248,0.2)",
    borderRadius: 8,
    color: "#7bacc2",
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
  },
  h2: {
    fontSize: 22,
    fontWeight: 600,
    color: "#e2eaf5",
    margin: "36px 0 20px",
  },
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.35)",
    borderRadius: 10,
    padding: "16px 18px",
    color: "#fca5a5",
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.6,
  },
  successBox: {
    background: "rgba(74,222,128,0.07)",
    border: "1px solid rgba(74,222,128,0.3)",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#86efac",
    fontSize: 15,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 20,
  },
  infoBox: {
    background: "rgba(56,189,248,0.07)",
    border: "1px solid rgba(56,189,248,0.3)",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#7dd3fc",
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
    border: "1px solid rgba(56,189,248,0.2)",
    borderRadius: 14,
    padding: "28px 24px",
  },
  planName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#7bacc2",
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
    background: "linear-gradient(90deg,#0c2840,#0e3352)",
    border: "1px solid rgba(56,189,248,0.45)",
    borderRadius: 10,
    color: "#7dd3fc",
    fontSize: 16,
    fontFamily: "'EB Garamond', serif",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(56,189,248,0.25)",
    borderRadius: 9,
    color: "#7bacc2",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    cursor: "pointer",
  },
};
