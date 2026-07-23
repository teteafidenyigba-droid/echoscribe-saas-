"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../components/Logo";

interface Props {
  user: { email: string; name: string };
  panel?: "main" | "settings" | "history";
  usage?: { today: number; month: number };
  limits?: { daily: number; monthly: number; unlimited: boolean };
  isTrial?: boolean;
}

export default function AppClient({ user, panel = "main", usage, limits, isTrial = false }: Props) {
  const backHref = panel !== "main" ? "/app" : null;
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName = user.name !== user.email ? user.name : user.email;

  const tier = limits?.unlimited ? "cabinet"
    : limits?.daily === 70 ? "pro"
    : "standard";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0A66C2" }}>
      <style>{`
        .es-topbar { padding: 0 20px; height: 60px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; z-index: 200; background: rgba(234,244,251,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #c8ddef; box-shadow: 0 1px 16px rgba(13,37,64,0.18); }
        .es-logo-text { font-family: 'EB Garamond', serif; font-size: 28px; font-style: italic; color: #0d2540; letter-spacing: -0.01em; }
        .es-email { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #2a5070; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
        .es-btn-abo { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ffffff; text-decoration: none; padding: 7px 16px; background: linear-gradient(135deg,#1e3a5f,#1e5a8a); border: none; border-radius: 8px; white-space: nowrap; box-shadow: 0 2px 8px rgba(30,58,95,0.3); }
        .es-bottombar { height: 52px; display: flex; align-items: center; justify-content: center; gap: 12px; flex-shrink: 0; background: rgba(234,244,251,0.97); backdrop-filter: blur(16px); border-top: 1px solid #c8ddef; box-shadow: 0 -1px 12px rgba(13,37,64,0.12); }
        .es-btn-settings { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: 2px solid #c8ddef; border-radius: 8px; padding: 5px 20px; cursor: pointer; white-space: nowrap; text-decoration: none; }
        .es-btn-settings:hover { background: #e8f1fb; border-color: #0a5fa8; }
        .es-btn-back { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: none; padding: 5px 14px; cursor: pointer; white-space: nowrap; text-decoration: none; }
        .es-btn-logout { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: 2px solid #0a5fa8; border-radius: 8px; padding: 5px 14px; cursor: pointer; white-space: nowrap; font-weight: 700; }
        @media (max-width: 600px) {
          .es-topbar { padding: 0 12px; height: 52px; }
          .es-logo-text { font-size: 20px; }
          .es-email { display: none; }
          .es-btn-abo { display: none; }
          .es-btn-logout { padding: 5px 10px; font-size: 10px; }
        }
      `}</style>

      {/* Top bar */}
      <div className="es-topbar">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo size={22} />
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="es-email">{displayName}</span>
          <Link href="/billing" className="es-btn-abo">Mon abonnement</Link>
          <button onClick={handleLogout} className="es-btn-logout">Déconnexion</button>
        </div>
      </div>

      {/* Quota bar */}
      {usage && limits && !limits.unlimited && (
        <div style={{ background: "rgba(234,244,251,0.97)", borderBottom: "1px solid #c8ddef", padding: "4px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: usage.today >= limits.daily ? "#ef4444" : "#4a7a96" }}>
            Aujourd'hui : <strong>{usage.today}/{limits.daily}</strong> CR
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: usage.month >= limits.monthly ? "#ef4444" : "#4a7a96" }}>
            Ce mois : <strong>{usage.month}/{limits.monthly}</strong> CR
          </span>
          <div style={{ flex: 1, height: 4, background: "#dce8f0", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (usage.today / limits.daily) * 100)}%`, background: usage.today >= limits.daily ? "#ef4444" : usage.today >= limits.daily * 0.8 ? "#f59e0b" : "#0a66c2", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* Quota exceeded overlay */}
      {usage && limits && !limits.unlimited && (usage.today >= limits.daily || usage.month >= limits.monthly) ? (() => {
        const isStandard = !isTrial && limits.daily === 30;
        const isPro = !isTrial && limits.daily === 70;
        const upsell = isTrial
          ? { plan: "Standard", daily: 30, monthly: 500, price: "69€/mois", priceYear: "745€/an", key: "standard_monthly" }
          : isStandard
          ? { plan: "Pro", daily: 70, monthly: 1500, price: "129€/mois", priceYear: "1 392€/an", key: "pro_monthly" }
          : isPro
          ? { plan: "Cabinet", daily: null, monthly: null, price: "249€/mois", priceYear: "2 688€/an", key: "cabinet_monthly" }
          : null;
        const isDaily = usage.today >= limits.daily;
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0f6fb", padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>⏸</div>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, color: "#1e3a5f", marginBottom: 10 }}>
              {isDaily ? "Limite journalière atteinte" : "Limite mensuelle atteinte"}
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#4a7a96", marginBottom: 6 }}>
              {isTrial
                ? `Votre essai gratuit est limité à ${limits.daily} CR par jour.`
                : isDaily
                ? `Vous avez généré ${usage.today} CR aujourd'hui (max ${limits.daily}/jour).`
                : `Vous avez généré ${usage.month} CR ce mois (max ${limits.monthly}/mois).`}
            </p>
            {isDaily && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#7bacc2", marginBottom: 28 }}>{isTrial ? "Souscrivez à une offre pour continuer à utiliser EchoScribe." : "Votre quota sera réinitialisé demain à minuit."}</p>}
            {!isDaily && <div style={{ marginBottom: 28 }} />}

            {upsell && (
              <div style={{ background: "#ffffff", border: "2px solid #0a66c2", borderRadius: 16, padding: "24px 32px", maxWidth: 340, width: "100%", marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#0a66c2", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                  Offre recommandée
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 700, color: "#0d2540", marginBottom: 6 }}>
                  {upsell.plan}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4a7a96", marginBottom: 14 }}>
                  {upsell.daily ? `${upsell.daily} CR/jour · ${upsell.monthly?.toLocaleString("fr-FR")} CR/mois` : "CR illimités"}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "#0d2540" }}>{upsell.price}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7bacc2", marginBottom: 20 }}>
                  ou {upsell.priceYear} (−10%)
                </div>
                <Link
                  href="/billing"
                  style={{ display: "block", textAlign: "center", background: "#0a66c2", color: "#fff", textDecoration: "none", padding: "11px 0", borderRadius: 9, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 14px rgba(10,102,194,0.3)" }}
                >
                  Passer à {upsell.plan} →
                </Link>
              </div>
            )}

            <Link href="/billing" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#7bacc2", textDecoration: "underline" }}>
              Voir tous les forfaits
            </Link>
          </div>
        );
      })() : (
        <iframe
          src={`/echoscribe-app.html?v=v5pro86&tier=${tier}${panel === "settings" ? "&panel=settings" : panel === "history" ? "&panel=history" : ""}`}
          style={{ flex: 1, border: "none", width: "100%", display: "block", background: "transparent" }}
          title="EchoScribe Application"
          allow="microphone"
          allowTransparency={true}
        />
      )}

      {/* Bottom nav */}
      <div className="es-bottombar">
        {backHref
          ? <Link href={backHref} className="es-btn-back">← Retour à l'application</Link>
          : <>
              <Link href="/app/historique" className="es-btn-settings">Historique</Link>
              <Link href="/app/parametres" className="es-btn-settings">Paramètres</Link>
              <Link href="/app/support" className="es-btn-settings">Support</Link>
            </>
        }
      </div>
    </div>
  );
}
