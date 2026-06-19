import Link from "next/link";
import HeroSlider from "./components/HeroSlider";

export default function LandingPage() {
  return (
    <div style={{ background: "#eaf4fb", minHeight: "100vh", color: "#0d2540", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <style>{`
        @media (max-width: 768px) {
          /* Nav */
          .nav-wrap { padding: 0 16px !important; height: 60px !important; }
          .nav-cta-text { display: none; }
          .nav-cta-short { display: inline !important; }
          .nav-login { font-size: 13px !important; padding: 6px 12px !important; }
          .nav-cta { padding: 7px 14px !important; font-size: 13px !important; }
          .logo-text { font-size: 22px !important; }

          /* Sections padding */
          .section-pad { padding-top: 56px !important; padding-bottom: 56px !important; }

          /* Stats */
          .stat-item { border-right: none !important; border-bottom: 1px solid #c8dce8 !important; padding-bottom: 20px !important; }
          .stat-item:last-child { border-bottom: none !important; }

          /* Problem/Solution */
          .problem-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .problem-card { padding: 28px 22px !important; }

          /* Pricing */
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-card-base { padding: 36px 24px !important; }
          .pricing-badge {
            font-size: 10px !important; padding: 5px 14px !important;
            white-space: normal !important; text-align: center;
            left: 50% !important; transform: translateX(-50%) !important;
            width: max-content !important; max-width: 80% !important;
          }

          /* Features */
          .features-grid { gap: 16px !important; }
          .feature-card { padding: 24px 20px !important; }

          /* How it works */
          .how-step { padding: 20px 18px !important; gap: 14px !important; }

          /* FAQ */
          .faq-item { padding: 20px 20px !important; }

          /* CTA final */
          .cta-section { padding: 72px 20px !important; }

          /* Spécificité */
          .specificity-grid { grid-template-columns: 1fr !important; gap: 36px !important; }

          /* Video */
          .video-section { padding: 56px 16px !important; }
          .video-section h2 { font-size: 26px !important; }
          .video-section p { font-size: 15px !important; }

          /* Trust bar */
          .trust-bar { gap: 18px !important; padding: 14px 16px !important; }
          .trust-item { font-size: 11px !important; }
        }

        @media (max-width: 480px) {
          .logo-text { font-size: 20px !important; }
          .section-title { font-size: 24px !important; }
          .cta-section a { font-size: 17px !important; padding: 15px 32px !important; }
          .faq-item .faq-q { font-size: 15px !important; }
          .how-step { flex-direction: row !important; }
          .stat-num { font-size: 32px !important; }
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
        background: "rgba(234,244,251,0.97)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #c8ddef", padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 70, boxShadow: "0 1px 16px rgba(13,37,64,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,11 6,11 9,3 12,19 15,8 18,14 21,11 34,11" stroke="#c45d4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="logo-text" style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, fontStyle: "italic", color: "#0d2540", letterSpacing: "-0.01em" }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#0a6abf" }}>Scribe</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link className="nav-login" href="/login" style={{
            color: "#0a5fa8", textDecoration: "none", fontSize: 15, padding: "8px 18px", borderRadius: 8,
            border: "2px solid #0a5fa8", fontWeight: 700,
          }}>
            Connexion
          </Link>
          <Link className="nav-cta" href="/register" style={{
            background: "#c45d4a",
            borderRadius: 10, color: "#ffffff", textDecoration: "none",
            fontSize: 15, padding: "10px 24px", fontWeight: 600,
            boxShadow: "0 2px 10px rgba(196,93,74,0.4)",
          }}>
            <span className="nav-cta-text">Essai gratuit 7 jours →</span>
            <span className="nav-cta-short" style={{ display: "none" }}>Essai gratuit →</span>
          </Link>
        </div>
      </nav>

      <HeroSlider />

      {/* BANDEAU SÉPARATEUR */}
      <div style={{ background: "#7dd3fc", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "nowrap", overflow: "hidden" }}>
        {[
          "CR structuré SFR/HAS",
          "Vocabulaire écho natif",
          "Prêt à signer en 30s",
          "Temps gagné = temps patient",
        ].map((item, i) => (
          <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#0f2440", letterSpacing: "0.10em", textTransform: "uppercase", whiteSpace: "nowrap", padding: "0 24px", borderRight: i < 3 ? "1px solid rgba(15,36,64,0.25)" : "none" }}>
            {item}
          </span>
        ))}
      </div>

      {/* SPÉCIALITÉS CIBLES */}
      <section style={{ background: "#ffffff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a5fa8", marginBottom: 12, textAlign: "center" }}>
            CONÇU POUR VOTRE SPÉCIALITÉ
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#0f2440", textAlign: "center", marginBottom: 52, lineHeight: 1.2 }}>
            Trois spécialités, un seul outil — taillé pour chacune.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28 }}>
            {[
              {
                icon: "🫁",
                title: "Radiologue",
                color: "#38bdf8",
                bg: "#f0f9ff",
                border: "#bae6fd",
                items: ["Abdomen · Pelvis · Thorax", "Conforme SFR / HAS", "Terminologie radiologique native"],
                badge: "Foie · Reins · Vésicule",
              },
              {
                icon: "🔊",
                title: "Échographiste",
                color: "#a78bfa",
                bg: "#f5f3ff",
                border: "#ddd6fe",
                items: ["Abdominal · Vasculaire · MSK", "Obstétrique & gynécologie", "Rapport structuré en 30 s"],
                badge: "Pelvien · Cervical · Scrotal",
              },
              {
                icon: "❤️",
                title: "Cardiologue",
                color: "#f87171",
                bg: "#fff1f2",
                border: "#fecdd3",
                items: ["ETT · Doppler · Stress", "FEVG · Cinétique · Valves", "Vocabulaire cardiologique natif"],
                badge: "Fraction d'éjection · Holter",
              },
            ].map((sp, i) => (
              <div key={i} style={{
                background: sp.bg,
                border: `2px solid ${sp.border}`,
                borderRadius: 20,
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{sp.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f2440", marginBottom: 6 }}>{sp.title}</h3>
                <span style={{
                  display: "inline-block", marginBottom: 24,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: sp.color, background: `${sp.color}18`, borderRadius: 6, padding: "4px 10px",
                }}>
                  {sp.badge}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {sp.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: sp.color, fontWeight: 700, fontSize: 15, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 15, color: "#2a4a6a", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="section-pad" style={{ background: "#eaf4fb", padding: "80px 24px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>TARIFS</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#0d2540", marginBottom: 12 }}>Simple et transparent</h2>
          <p style={{ fontSize: 17, color: "#2a5070" }}>7 jours d'essai gratuit · Résiliable à tout moment · Aucun frais caché</p>
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, alignItems: "stretch" }}>
          <div className="pricing-card-base" style={{ background: "#ffffff", border: "1.5px solid #7ab0d4", borderRadius: 24, padding: "44px 40px", boxShadow: "0 6px 28px rgba(10,95,168,0.13)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3a7aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Mensuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 700, color: "#0d2540", letterSpacing: "-0.02em" }}>59€</span>
              <span style={{ fontSize: 17, color: "#3a7aaa" }}>/mois</span>
            </div>
            <p style={{ fontSize: 13, color: "#3a7aaa", marginBottom: 36, fontFamily: "'JetBrains Mono', monospace" }}>Résiliable à tout moment</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "600+ corrections médicales SFR", "Historique 12h", "Support email sous 24h"].map((f) => (
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
          <div className="pricing-card pricing-card-base" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 100%)", borderRadius: 24, padding: "44px 40px", position: "relative", boxShadow: "0 12px 48px rgba(30,58,95,0.4)", display: "flex", flexDirection: "column" }}>
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
            {["Dictée vocale illimitée", "IA de dernière génération", "600+ corrections médicales SFR", "Historique 12h", "Support prioritaire", "Nouvelles fonctionnalités en avant-première"].map((f) => (
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
        </div>
      </section>

      {/* SPÉCIFICITÉ ECHOSCRIBE */}
      <section style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 60%, #1a6aaa 100%)", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Gauche */}
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7dd3fc", marginBottom: 16 }}>
              LA SPÉCIFICITÉ ECHOSCRIBE
            </p>
            <h2 style={{ fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.15, marginBottom: 24 }}>
              Il rédige le compte rendu —{" "}
              <span style={{ fontStyle: "italic" }}>il ne se contente pas de transcrire.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>
              Dicter du texte, beaucoup d'outils le font. La spécificité d'EchoScribe est ailleurs : il connaît l'échographie et produit, à votre place, un compte rendu structuré et conforme, prêt à signer.
            </p>
          </div>
          {/* Droite */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { bold: "Un compte rendu structuré", text: "SFR/HAS — et non une transcription brute à reprendre." },
              { bold: "Un vocabulaire échographique français", text: ": abdominal, vasculaire, pelvien, cervical, scrotal, MSK." },
              { bold: "Clé en main", text: ": un simple code d'accès, aucun compte ni clé API à créer." },
              { bold: "Prêt à coller partout", text: ": Doctolib, HelloDoc, WEDA, Medistory, Axisante… mise en page conservée." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#7dd3fc", fontSize: 18, fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: "#ffffff" }}>{item.bold}</strong>{" "}{item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" className="video-section section-pad" style={{ background: "#eaf4fb", padding: "80px 24px", textAlign: "center" }}>
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
      <section style={{ background: "#ffffff", borderTop: "1px solid #c8ddef", borderBottom: "1px solid #c8ddef", padding: "44px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0, textAlign: "center" }}>
          {[
            { n: "< 30s", label: "Compte rendu généré", sub: "contre 5-10 min manuellement" },
            { n: "600+", label: "Corrections médicales", sub: "vocabulaire échographique" },
            { n: "100%", label: "Conforme SFR", sub: "structure standardisée" },
            { n: "7 jours", label: "Essai gratuit", sub: "sans carte bancaire" },
          ].map((s, i) => (
            <div key={s.n} className="stat-item" style={{ padding: "12px 16px", borderRight: i < 3 ? "1px solid #e2eaf2" : "none" }}>
              <div className="stat-num" style={{ fontSize: 40, fontWeight: 700, color: "#0a5fa8", fontFamily: "'EB Garamond', serif", lineHeight: 1.1 }}>{s.n}</div>
              <div style={{ fontSize: 14, color: "#0d2540", fontWeight: 700, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#3a7aaa", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>


      {/* FEATURES */}
      <section className="section-pad" style={{ background: "#ffffff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>LES ATOUTS</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "#0f2440", marginBottom: 0 }}>Ce qui rend EchoScribe unique</h2>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { icon: "📊", title: "Le compte rendu, pas juste la dictée", desc: "Là où les autres transcrivent, EchoScribe rédige : structure, terminologie, conclusion et conduite à tenir, dans votre style.", bg: "linear-gradient(135deg,#e0f0ff,#c0dcf5)" },
              { icon: "🛡", title: "Données anonymes, en local", desc: "Aucune donnée identifiante n'est saisie ni transmise. La dictée reste sur votre poste ; effacement automatique après 12 h.", bg: "linear-gradient(135deg,#e0f0ff,#c0dcf5)" },
              { icon: "✅", title: "Conforme SFR / HAS", desc: "Dictionnaire de 600+ termes échographiques, classifications EU-TIRADS, BI-RADS, O-RADS, IOTA, Bosniak. Aucune mesure inventée.", bg: "linear-gradient(135deg,#e0f0ff,#c0dcf5)" },
              { icon: "→", title: "Zéro configuration", desc: "Un simple code d'accès. Pas de compte chez un fournisseur d'IA, pas de clé API, pas de carte bancaire à renseigner ailleurs.", bg: "linear-gradient(135deg,#e0f0ff,#c0dcf5)" },
              { icon: "+", title: "Compatible tout matériel", desc: "Fonctionne avec n'importe quel échographe et n'importe quel logiciel métier, par simple copier-coller. Rien à remplacer.", bg: "linear-gradient(135deg,#e0f0ff,#c0dcf5)" },
              { icon: "💡", title: "Conçu par un médecin échographiste", desc: "Pensé sur le terrain, pour le terrain. Le ton, la structure et les exigences viennent d'une vraie pratique d'imagerie.", bg: "linear-gradient(135deg,#e0f0ff,#c0dcf5)" },
            ].map((f, i) => (
              <div key={f.title} className="feature-card" style={{
                background: "#ffffff", border: "1px solid #c8ddef", borderRadius: 20,
                padding: "32px 28px", boxShadow: "0 2px 12px rgba(10,95,168,0.07)",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 48, height: 48, borderRadius: 14, marginBottom: 20, fontSize: 20,
                  background: ["linear-gradient(135deg,#dbeafe,#bfdbfe)", "linear-gradient(135deg,#dbeafe,#bfdbfe)", "linear-gradient(135deg,#dbeafe,#bfdbfe)", "linear-gradient(135deg,#dbeafe,#bfdbfe)", "linear-gradient(135deg,#dbeafe,#bfdbfe)", "linear-gradient(135deg,#dbeafe,#bfdbfe)"][i],
                  color: "#1e40af",
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, color: "#0d2540", marginBottom: 10, fontWeight: 700, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#4a6a8a" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment" className="section-pad" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 60%, #1a6aaa 100%)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7dd3fc", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>COMMENT ÇA MARCHE</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#ffffff" }}>De la dictée au compte rendu en 4 étapes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[
              { n: "01", title: "Appuyez sur le micro", desc: "Dictez naturellement, instructions patient incluses.", icon: "🎙" },
              { n: "02", title: "L'IA corrige", desc: "Terminologie corrigée, hésitations filtrées, type d'examen détecté.", icon: "⚡" },
              { n: "03", title: "Le CR se génère", desc: "Compte rendu structuré complet en moins de 30 secondes.", icon: "✦" },
              { n: "04", title: "Copiez et signez", desc: "Collez dans votre logiciel, relisez, signez.", icon: "✅" },
            ].map((s) => (
              <div key={s.n} className="how-step" style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(125,211,252,0.15)",
                borderRadius: 16, padding: "24px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#7dd3fc", fontWeight: 700, marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontSize: 16, color: "#ffffff", fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/register" style={{
              display: "inline-block", padding: "15px 44px",
              background: "#ffffff", borderRadius: 12,
              color: "#1e3a5f", textDecoration: "none", fontSize: 17, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            }}>
              Essayer gratuitement pendant 7 jours →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" style={{ background: "#eaf4fb", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</p>
            <h2 className="gradient-title" style={{ fontSize: 32, fontWeight: 700 }}>Questions fréquentes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { q: "Mes données audio sont-elles conservées ?", a: "Non. L'audio est traité localement et n'est jamais envoyé ni stocké sur nos serveurs. Secret médical totalement préservé." },
              { q: "EchoScribe est-il certifié dispositif médical ?", a: "C'est un outil d'aide à la rédaction. Le CR généré doit être relu, validé et signé par le médecin responsable." },
              { q: "Compatible avec quel logiciel médical ?", a: "Formatage riche (HTML). Compatible avec Doctolib, Mediboard, Crossway, Word et LibreOffice." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement ni pénalité, en un clic depuis votre espace facturation." },
              { q: "Comment fonctionne l'essai gratuit ?", a: "7 jours gratuits, sans carte de crédit. À la fin, vous choisissez un plan ou l'accès est suspendu automatiquement." },
            ].map((item, i) => (
              <div key={i} className="faq-item faq-card" style={{ background: "#ffffff", border: "1px solid #c8ddef", borderRadius: 14, padding: "22px 26px", boxShadow: "0 2px 10px rgba(10,95,168,0.07)" }}>
                <div className="faq-q" style={{ fontSize: 16, color: "#0d2540", fontWeight: 700, marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#2a5070" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 50%, #1e7fc5 100%)", textAlign: "center", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
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
