import Link from "next/link";
import HeroSlider from "./components/HeroSlider";

export default function LandingPage() {
  return (
    <div style={{ background: "#b8d4ef", minHeight: "100vh", color: "#0d2540", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .nav-wrap { padding: 0 16px !important; }
          .nav-cta-text::after { content: "Essai gratuit →"; }
          .nav-cta-text { display: none; }
          .nav-cta-short { display: inline !important; }
          .nav-login { font-size: 13px !important; padding: 6px 10px !important; }
          .nav-cta { padding: 8px 12px !important; font-size: 13px !important; }
          .problem-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .stat-item { border-right: none !important; border-bottom: 1px solid #c8dce8; padding-bottom: 20px !important; }
          .stat-item:last-child { border-bottom: none; }
          .hero-mockup { padding: 20px 16px !important; }
          .hero-mockup-text { font-size: 11px !important; }
          .pricing-badge { font-size: 10px !important; padding: 5px 14px !important; white-space: normal !important; text-align: center; }
          .pricing-card { padding: 44px 24px !important; }
          .how-step { padding: 20px 18px !important; gap: 16px !important; }
          .faq-item { padding: 20px 20px !important; }
        }
        @media (max-width: 480px) {
          .hero-btns a { width: 100%; text-align: center; box-sizing: border-box; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .logo-text { font-size: 22px !important; }
        }
        .feature-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(10,95,168,0.22) !important;
        }
        .faq-card {
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .faq-card:hover {
          border-color: #0a5fa8 !important;
          box-shadow: 0 6px 24px rgba(10,95,168,0.15) !important;
        }
        .cta-btn-primary {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(0,0,0,0.32) !important;
        }
        .section-label {
          background: linear-gradient(90deg, #0a5fa8, #38a8e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-title {
          background: linear-gradient(135deg, #0d2540 0%, #0a6abf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-wrap" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(170,205,235,0.97)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #7ab0d4", padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 70, boxShadow: "0 1px 16px rgba(13,37,64,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="logo-text" style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontStyle: "italic", color: "#0d2540", letterSpacing: "-0.01em" }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#0a6abf" }}>Scribe</span>
          </span>
          <span style={{
            background: "#1e3a5f", borderRadius: 999, padding: "3px 10px",
            fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase" as const,
            color: "#7dd3fc", fontFamily: "'JetBrains Mono', monospace",
          }}>IA v5</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link className="nav-login" href="/login" style={{
            color: "#0a5fa8", textDecoration: "none", fontSize: 15, padding: "8px 18px", borderRadius: 8,
            border: "2px solid #0a5fa8", fontWeight: 700,
          }}>
            Connexion
          </Link>
          <Link className="nav-cta" href="/register" style={{
            background: "linear-gradient(135deg, #1e3a5f, #1e5a8a)",
            borderRadius: 10, color: "#ffffff", textDecoration: "none",
            fontSize: 15, padding: "10px 24px", fontWeight: 600,
            boxShadow: "0 2px 10px rgba(30,58,95,0.35)",
          }}>
            <span className="nav-cta-text">Essai gratuit 7 jours →</span>
            <span className="nav-cta-short" style={{ display: "none" }}>Essai gratuit →</span>
          </Link>
        </div>
      </nav>

      <HeroSlider />

      {/* VIDEO */}
      <section style={{ background: "#e2f0fb", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>DÉMONSTRATION</p>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>Voyez EchoScribe en action</h2>
          <p style={{ fontSize: 17, color: "#4a6a8a", marginBottom: 44 }}>De la dictée au compte rendu structuré en moins de 30 secondes.</p>
          <div style={{
            position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden",
            borderRadius: 20, boxShadow: "0 12px 48px rgba(30,58,95,0.2)",
            border: "1px solid #c8ddef",
          }}>
            <iframe
              src="https://www.youtube.com/embed/vBfA1qF_a-0"
              title="EchoScribe - L'IA au service de la radiologie"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#ffffff", borderTop: "2px solid #7ab0d4", borderBottom: "2px solid #7ab0d4", padding: "44px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0, textAlign: "center" }}>
          {[
            { n: "< 30s", label: "Compte rendu généré", sub: "contre 5-10 min manuellement" },
            { n: "80+", label: "Corrections médicales", sub: "vocabulaire échographique" },
            { n: "100%", label: "Conforme SFR", sub: "structure standardisée" },
            { n: "7 jours", label: "Essai gratuit", sub: "sans carte bancaire" },
          ].map((s, i) => (
            <div key={s.n} className="stat-item" style={{ padding: "12px 16px", borderRight: i < 3 ? "1px solid #e2eaf2" : "none" }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#0a5fa8", fontFamily: "'EB Garamond', serif", lineHeight: 1.1 }}>{s.n}</div>
              <div style={{ fontSize: 14, color: "#0d2540", fontWeight: 700, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#3a7aaa", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "linear-gradient(90deg, #0a4a8a, #0a6abf, #1a90d8)", padding: "18px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { icon: "🔒", text: "RGPD & Secret médical" },
            { icon: "⚡", text: "< 30 secondes" },
            { icon: "🎙", text: "Dictée vocale IA" },
            { icon: "✦", text: "Conforme SFR" },
            { icon: "🛡", text: "Données locales" },
          ].map((t) => (
            <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8, color: "#ffffff", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span> {t.text}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "80px 24px", maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>TARIFS</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#0d2540", marginBottom: 12 }}>Simple et transparent</h2>
          <p style={{ fontSize: 17, color: "#2a5070" }}>7 jours d'essai gratuit · Résiliable à tout moment · Aucun frais caché</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, alignItems: "stretch" }}>
          <div style={{ background: "#ffffff", border: "1.5px solid #7ab0d4", borderRadius: 24, padding: "44px 40px", boxShadow: "0 6px 28px rgba(10,95,168,0.13)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3a7aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Mensuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 700, color: "#0d2540", letterSpacing: "-0.02em" }}>59€</span>
              <span style={{ fontSize: 17, color: "#3a7aaa" }}>/mois</span>
            </div>
            <p style={{ fontSize: 13, color: "#3a7aaa", marginBottom: 36, fontFamily: "'JetBrains Mono', monospace" }}>Résiliable à tout moment</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "80+ corrections médicales SFR", "Historique 12h", "Support email sous 24h"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, fontSize: 16, color: "#0d2540" }}>
                <span style={{ color: "#0a5fa8", fontWeight: 700, fontSize: 17 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=monthly" style={{
              display: "block", textAlign: "center", marginTop: "auto", paddingTop: 36, padding: "15px",
              border: "2px solid #0d2540", borderRadius: 12, color: "#0d2540",
              textDecoration: "none", fontSize: 16, fontWeight: 700,
            }}>
              Démarrer l'essai gratuit →
            </Link>
          </div>
          <div className="pricing-card" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 100%)", borderRadius: 24, padding: "44px 40px", position: "relative", boxShadow: "0 12px 48px rgba(30,58,95,0.4)", display: "flex", flexDirection: "column" }}>
            <div className="pricing-badge" style={{
              position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
              background: "linear-gradient(90deg, #1e7fc5, #38bdf8)", color: "#ffffff", borderRadius: 999,
              padding: "6px 22px", fontSize: 12, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(30,127,197,0.4)",
            }}>✦ MEILLEURE OFFRE — économisez 25%</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7dd3fc", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Annuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 56, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>699€</span>
              <span style={{ fontSize: 17, color: "#8aaac8" }}>/an</span>
            </div>
            <p style={{ fontSize: 14, color: "#7dd3fc", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>Soit 58,25€/mois</p>
            <p style={{ fontSize: 13, color: "#8aaac8", marginBottom: 36, fontFamily: "'JetBrains Mono', monospace" }}>Facturé annuellement · Résiliable</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "80+ corrections médicales SFR", "Historique 12h", "Support prioritaire", "Nouvelles fonctionnalités en avant-première"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, fontSize: 16, color: "#ffffff" }}>
                <span style={{ color: "#7dd3fc", fontWeight: 700, fontSize: 17 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=yearly" style={{
              display: "block", textAlign: "center", marginTop: "auto", paddingTop: 36, padding: "15px",
              background: "linear-gradient(90deg, #1e7fc5, #38bdf8)",
              borderRadius: 12, color: "#ffffff",
              textDecoration: "none", fontSize: 16, fontWeight: 700,
              boxShadow: "0 4px 16px rgba(30,127,197,0.4)",
            }}>
              Démarrer l'essai gratuit →
            </Link>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#2a5070", fontFamily: "'JetBrains Mono', monospace", marginTop: 36 }}>
          🔒 Paiement sécurisé par Stripe · Facture TVA disponible · Remboursement 14 jours
        </p>
      </section>

      {/* PROBLÈME / SOLUTION */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={{ textAlign: "center", padding: "72px 24px 52px" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>POURQUOI ECHOSCRIBE ?</p>
          <h2 className="gradient-title" style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, marginBottom: 0 }}>
            Avant. Après.
          </h2>
        </div>

        <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* AVANT — rouge sombre */}
          <div style={{
            background: "linear-gradient(145deg, #1a0808, #3a0f0f)",
            borderRadius: "24px 0 0 24px", padding: "52px 44px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(239,68,68,0.06)" }} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 999, padding: "6px 18px",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#fca5a5", letterSpacing: "0.14em",
            }}>
              ✗ AVANT ECHOSCRIBE
            </div>
            <div style={{ fontSize: "clamp(44px,6vw,72px)", fontWeight: 700, color: "#ef4444", fontFamily: "'EB Garamond', serif", lineHeight: 1, marginBottom: 8 }}>2–3h</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 36 }}>de rédaction par jour</div>
            {[
              { icon: "⏱", text: "5 à 10 min par compte rendu" },
              { icon: "✎", text: "Saisie manuelle fastidieuse" },
              { icon: "⚠", text: "Erreurs de terminologie fréquentes" },
              { icon: "📋", text: "Structures à mémoriser et reproduire" },
              { icon: "😓", text: "Fatigue cognitive en fin de journée" },
            ].map((item) => (
              <div key={item.text} style={{
                display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16,
                padding: "12px 16px", background: "rgba(239,68,68,0.07)",
                borderRadius: 10, border: "1px solid rgba(239,68,68,0.15)",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* APRÈS — vert sombre */}
          <div style={{
            background: "linear-gradient(145deg, #061a10, #0a3020)",
            borderRadius: "0 24px 24px 0", padding: "52px 44px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(74,222,128,0.06)" }} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
              background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 999, padding: "6px 18px",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#86efac", letterSpacing: "0.14em",
            }}>
              ✓ AVEC ECHOSCRIBE
            </div>
            <div style={{ fontSize: "clamp(44px,6vw,72px)", fontWeight: 700, color: "#4ade80", fontFamily: "'EB Garamond', serif", lineHeight: 1, marginBottom: 8 }}>&lt; 30s</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 36 }}>par compte rendu généré</div>
            {[
              { icon: "🎙", text: "Dictez naturellement, comme à un secrétaire" },
              { icon: "⚡", text: "Compte rendu structuré en 30 secondes" },
              { icon: "✦", text: "Terminologie médicale corrigée automatiquement" },
              { icon: "📋", text: "Format INDICATION / RÉSULTATS / CONCLUSION / CAT" },
              { icon: "✅", text: "Conforme SFR, prêt à relire et signer" },
            ].map((item) => (
              <div key={item.text} style={{
                display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16,
                padding: "12px 16px", background: "rgba(74,222,128,0.07)",
                borderRadius: 10, border: "1px solid rgba(74,222,128,0.15)",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA centré */}
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <Link href="/register" style={{
            display: "inline-block", padding: "16px 44px",
            background: "linear-gradient(135deg,#0a4a8a,#1a90d8)",
            borderRadius: 12, color: "#ffffff", textDecoration: "none",
            fontSize: 17, fontWeight: 700, boxShadow: "0 6px 24px rgba(10,74,138,0.35)",
          }}>
            Récupérer mes 2 heures par jour →
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#d4e8f7", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>FONCTIONNALITÉS</p>
            <h2 className="gradient-title" style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Tout ce dont vous avez besoin</h2>
            <p style={{ fontSize: 17, color: "#2a5070", maxWidth: 520, margin: "0 auto" }}>Conçu par et pour les radiologues et échographistes francophones.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { icon: "🎙", title: "Dictée vocale intelligente", desc: "Dictez naturellement. Correction automatique de la terminologie échographique : hyperéchogène, Wirsung, EU-TIRADS, vésiculaire…" },
              { icon: "⚡", title: "Génération en 30 secondes", desc: "L'IA structure votre dictée en compte rendu complet INDICATION / RÉSULTATS / CONCLUSION / CAT en moins de 30 secondes." },
              { icon: "📋", title: "Copie en un clic", desc: "Formatage riche (gras, structure). Collez directement dans Doctolib, Mediboard, Crossway ou Word." },
              { icon: "🔒", title: "Sécurité & RGPD", desc: "Audio traité localement, jamais stocké. Données supprimées après 12h. Conforme RGPD et secret médical." },
              { icon: "✦", title: "80+ corrections SFR", desc: "Base de données médicale spécialisée en échographie. Filtrage automatique des hésitations et instructions au patient." },
              { icon: "📱", title: "Partout, sur tous vos écrans", desc: "Smartphone, tablette, ordinateur. Utilisez EchoScribe en salle d'examen, à votre bureau ou en déplacement." },
            ].map((f, i) => (
              <div key={f.title} className="feature-card" style={{
                background: "#ffffff", border: "1px solid #7ab0d4", borderRadius: 20,
                padding: "32px 28px", boxShadow: "0 4px 20px rgba(10,95,168,0.10)",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 56, height: 56, borderRadius: 16, marginBottom: 20, fontSize: 26,
                  background: ["linear-gradient(135deg,#e0f0ff,#c0dcf5)", "linear-gradient(135deg,#e8f5e0,#c8edc0)", "linear-gradient(135deg,#fff4e0,#ffe0b0)", "linear-gradient(135deg,#f0e0ff,#dcc0f0)", "linear-gradient(135deg,#e0f8ff,#b0e8f8)", "linear-gradient(135deg,#ffe0e8,#f8c0cc)"][i % 6],
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 19, color: "#0d2540", marginBottom: 10, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#2a5070" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 60%, #1a6aaa 100%)", padding: "96px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7dd3fc", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>COMMENT ÇA MARCHE</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>De la dictée au compte rendu en 4 étapes</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", marginBottom: 60 }}>Aussi simple que de parler à un collègue.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { n: "01", title: "Appuyez sur le micro", desc: "Dictez votre examen naturellement — y compris les instructions au patient. EchoScribe trie tout automatiquement.", icon: "🎙" },
              { n: "02", title: "L'IA corrige en temps réel", desc: "Terminologie médicale corrigée, hésitations filtrées, type d'examen détecté (abdominal, pelvien, Doppler, thyroïde…).", icon: "⚡" },
              { n: "03", title: "Le compte rendu se génère", desc: "En un clic, un compte rendu structuré et complet est rédigé en moins de 30 secondes.", icon: "✦" },
              { n: "04", title: "Copiez, collez, signez", desc: "Collez dans votre logiciel, relisez rapidement et signez. Votre compte rendu est prêt.", icon: "✅" },
            ].map((s) => (
              <div key={s.n} className="how-step" style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(125,211,252,0.15)",
                borderRadius: 16, padding: "26px 30px", textAlign: "left",
              }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#7dd3fc", fontWeight: 700, marginTop: 4 }}>{s.n}</div>
                </div>
                <div>
                  <div style={{ fontSize: 19, color: "#ffffff", fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.68)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 52 }}>
            <Link href="/register" style={{
              display: "inline-block", padding: "17px 48px",
              background: "#ffffff", borderRadius: 12,
              color: "#1e3a5f", textDecoration: "none", fontSize: 18, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            }}>
              Essayer gratuitement pendant 7 jours →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#e2f0fb", padding: "88px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>FAQ</p>
            <h2 className="gradient-title" style={{ fontSize: 36, fontWeight: 700 }}>Questions fréquentes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { q: "Mes données audio sont-elles conservées ?", a: "Non. L'audio est traité localement dans votre navigateur et n'est jamais envoyé ni stocké sur nos serveurs. Votre confidentialité et le secret médical sont totalement préservés." },
              { q: "EchoScribe est-il certifié dispositif médical ?", a: "EchoScribe est un outil d'aide à la rédaction. Le compte rendu généré doit être relu, validé et signé par le médecin responsable. Il ne remplace pas le jugement clinique du praticien." },
              { q: "Compatible avec quel logiciel médical ?", a: "Le compte rendu est copié avec un formatage riche (HTML). Compatible avec Doctolib, Mediboard, Crossway, Word et LibreOffice." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement ni pénalité. La résiliation se fait en un clic depuis votre espace facturation. Vous conservez l'accès jusqu'à la fin de la période payée." },
              { q: "Comment fonctionne l'essai gratuit ?", a: "7 jours gratuits, sans carte de crédit requise. À la fin de la période, vous choisissez un plan ou votre accès est suspendu automatiquement." },
            ].map((item, i) => (
              <div key={i} className="faq-item faq-card" style={{ background: "#ffffff", border: "1px solid #7ab0d4", borderRadius: 14, padding: "24px 30px", boxShadow: "0 3px 14px rgba(10,95,168,0.1)" }}>
                <div style={{ fontSize: 17, color: "#0d2540", fontWeight: 700, marginBottom: 10 }}>{item.q}</div>
                <div style={{ fontSize: 15, lineHeight: 1.75, color: "#2a5070" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 50%, #1e7fc5 100%)", textAlign: "center", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(125,211,252,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "#ffffff", marginBottom: 20, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Prêt à récupérer<br />2 heures par jour ?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 48, lineHeight: 1.7 }}>
            Rejoignez les radiologues et échographistes qui ont transformé leur pratique avec EchoScribe.
          </p>
          <Link className="cta-btn-primary" href="/register" style={{
            display: "inline-block", padding: "19px 56px",
            background: "linear-gradient(135deg, #ffffff 0%, #e8f4ff 100%)",
            borderRadius: 14, color: "#0a4a8a",
            textDecoration: "none", fontSize: 20, fontWeight: 800,
            boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
            letterSpacing: "-0.01em", border: "2px solid rgba(255,255,255,0.8)",
          }}>
            Commencer gratuitement →
          </Link>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "'JetBrains Mono', monospace", marginTop: 22 }}>
            7 jours gratuits · Sans carte bancaire · Sans engagement
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#080f1d", padding: "48px 24px", textAlign: "center",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 2.2,
      }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontStyle: "italic", color: "#e2eaf2" }}>
            Echo<span style={{ fontStyle: "normal", color: "#1e7fc5" }}>Scribe</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          {[
            { href: "/mentions-legales", label: "Mentions légales" },
            { href: "/cgu", label: "CGU" },
            { href: "/confidentialite", label: "Confidentialité" },
            { href: "/login", label: "Connexion" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "#4a6a8a", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ color: "#2a4a6a" }}>© {new Date().getFullYear()} EchoScribe · Outil d'aide à la rédaction médicale · À valider par le médecin responsable</div>
      </footer>
    </div>
  );
}
