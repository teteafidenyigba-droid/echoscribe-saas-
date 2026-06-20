import Link from "next/link";
import HeroSlider from "./components/HeroSlider";

export default function LandingPage() {
  return (
    <div style={{ background: "#eaf4fb", minHeight: "100vh", color: "#0d2540", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <style>{`
        @media (max-width: 768px) {
          body, html { overflow-x: hidden; }

          /* Nav */
          .nav-wrap { padding: 0 16px !important; height: 60px !important; }
          .nav-cta-text { display: none !important; }
          .nav-cta-short { display: inline !important; }
          .nav-login { font-size: 13px !important; padding: 6px 12px !important; }
          .nav-cta { padding: 7px 14px !important; font-size: 13px !important; }
          .logo-text { font-size: 20px !important; }

          /* Sections padding */
          .section-pad { padding-top: 48px !important; padding-bottom: 48px !important; padding-left: 16px !important; padding-right: 16px !important; }

          /* Grilles → 1 colonne */
          .pricing-grid,
          .features-grid,
          .specificity-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Pricing */
          .pricing-card-base { padding: 32px 20px !important; }
          .pricing-badge {
            font-size: 10px !important; padding: 5px 12px !important;
            white-space: normal !important; text-align: center !important;
            width: max-content !important; max-width: 85% !important;
          }

          /* Features */
          .feature-card { padding: 22px 18px !important; }

          /* How it works — 1 col */
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .how-step { padding: 18px 16px !important; }

          /* FAQ → 1 colonne */
          .faq-grid { grid-template-columns: 1fr !important; }
          .faq-item { padding: 18px 20px !important; }
          .faq-q { font-size: 15px !important; }

          /* Specialites → 1 col */
          .specialites-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* En pratique → 1 col */
          .pratique-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Sous le capot → 1 col */
          .capot-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Bandeau → scroll horizontal */
          .bandeau-inner { overflow-x: auto !important; justify-content: flex-start !important; padding: 0 16px !important; }
          .bandeau-inner span { flex-shrink: 0 !important; font-size: 13px !important; padding: 0 16px !important; }

          /* Video */
          .video-section { padding: 48px 16px !important; }

          /* CTA */
          .cta-section { padding: 64px 20px !important; }
          .cta-btn-primary { font-size: 17px !important; padding: 15px 32px !important; }

          /* Stats */
          .stat-item { border-right: none !important; border-bottom: 1px solid #c8dce8 !important; padding-bottom: 16px !important; }
          .stat-item:last-child { border-bottom: none !important; }
          .stat-num { font-size: 32px !important; }
        }

        @media (max-width: 480px) {
          .logo-text { font-size: 18px !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .bandeau-inner span { font-size: 12px !important; padding: 0 12px !important; }
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
      <div style={{ background: "#7dd3fc", padding: "16px 48px" }}>
        <div className="bandeau-inner" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
          {[
            "Compte rendu structuré SFR / HAS",
            "Vocabulaire échographique natif",
            "Prêt à signer en 30 secondes",
            "Le temps gagné, c'est du temps dédié au patient",
          ].map((item, i) => (
            <span key={i} style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 16,
              fontStyle: "italic",
              fontWeight: 500,
              color: "#0a2240",
              whiteSpace: "nowrap",
              padding: "0 28px",
              borderRight: i < 3 ? "1.5px solid rgba(10,34,64,0.22)" : "none",
              lineHeight: 1,
            }}>
              {item}
            </span>
          ))}
        </div>
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
          <div className="specialites-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
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

      {/* EN PRATIQUE */}
      <section style={{ background: "#ffffff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a5fa8", marginBottom: 12 }}>EN PRATIQUE</p>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: "#0f2440", marginBottom: 48, lineHeight: 1.2 }}>
            Vous parlez. EchoScribe écrit.<br />
            <span style={{ color: "#0a6abf", fontStyle: "italic" }}>Vous signez.</span>
          </h2>
          <div className="pratique-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { icon: "🎙", color: "#dbeafe", accent: "#1e40af", title: "Dictez comme vous parlez", body: "Pas besoin d'adapter votre dictée. Vous parlez naturellement — EchoScribe filtre les échanges avec le patient, les hésitations, les \"euh\"." },
              { icon: "⚡", color: "#fef9c3", accent: "#92400e", title: "30 secondes. Pas plus.", body: "Un clic. L'IA structure votre dictée en compte rendu complet : INDICATION, RÉSULTATS, CONCLUSION, CAT. Terminologie SFR corrigée, mesures préservées." },
              { icon: "📋", color: "#dcfce7", accent: "#166534", title: "Collez. Relisez. Signez.", body: "Mise en page riche, prête à coller dans Doctolib, HelloDoc, WEDA, Medistory, Axisante ou Word. Rien à reformater." },
            ].map((c, i) => (
              <div key={i} style={{ borderRadius: 20, padding: "32px 28px", background: c.color, border: `1px solid ${c.color}` }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f2440", marginBottom: 12, lineHeight: 1.2 }}>{c.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#2a4a6a", margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" className="video-section section-pad" style={{ background: "#eaf4fb", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f2440", marginBottom: 8 }}>Voyez-le en action</h2>
          <p style={{ fontSize: 16, color: "#4a6a8a", marginBottom: 36, fontStyle: "italic" }}>De la dictée au compte rendu signable — en moins de 30 secondes.</p>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 20, boxShadow: "0 12px 48px rgba(30,58,95,0.2)", border: "1px solid #c8ddef" }}>
            <iframe src="https://www.youtube.com/embed/Z1wv-Ui6N94" title="EchoScribe démo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
          </div>
        </div>
      </section>

      {/* CE QU'ON A MIS DEDANS */}
      <section className="section-pad" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 60%, #1a6aaa 100%)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#ffffff", marginBottom: 48, lineHeight: 1.2 }}>
            3 points forts.
          </h2>
          <div className="capot-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: "🔬", title: "600+ corrections médicales", body: "EU-TIRADS, BI-RADS, O-RADS, IOTA, Bosniak… chaque terminologie échographique est reconnue et correctement orthographiée. Aucune mesure inventée." },
              { icon: "🔒", title: "Vos données ne quittent pas votre poste", body: "L'audio est traité localement. Rien n'est stocké sur nos serveurs. Effacement automatique après 12h. Secret médical garanti." },
              { icon: "🩺", title: "Fait par un médecin échographiste", body: "Pas un produit tech vendu aux médecins. Conçu sur le terrain, par quelqu'un qui a passé des heures à rédiger des comptes rendus." },
            ].map((c, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(125,211,252,0.18)", borderRadius: 18, padding: "28px 24px" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{c.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 10, lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" style={{ background: "#eaf4fb", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>LES VRAIES QUESTIONS</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f2440" }}>Ce que vous vous demandez sûrement</h2>
          </div>
          <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { q: "Est-ce que mes données restent chez moi ?", a: "Oui, totalement. L'audio est traité dans votre navigateur et n'est jamais transmis. Effacement automatique après 12h. Secret médical garanti." },
              { q: "Est-ce que ça marche avec mon logiciel métier ?", a: "Oui. Doctolib, HelloDoc, WEDA, Medistory, Axisante, Word… il suffit de copier-coller. La mise en page est conservée." },
              { q: "C'est certifié dispositif médical ?", a: "C'est un outil d'aide à la rédaction. Le compte rendu doit être relu et signé par le médecin. EchoScribe assiste — il ne remplace pas votre jugement clinique." },
              { q: "Je peux arrêter quand je veux ?", a: "Oui, sans engagement ni pénalité. Un clic dans votre espace facturation. Vous gardez l'accès jusqu'à la fin de la période payée." },
              { q: "L'essai gratuit, c'est vraiment gratuit ?", a: "7 jours offerts, sans engagement. Aucun prélèvement automatique. À la fin, vous choisissez ou vous partez — sans friction." },
            ].map((item, i) => (
              <div key={i} className="faq-item faq-card" style={{ background: "#ffffff", border: "1px solid #c8ddef", borderRadius: 14, padding: "22px 26px", boxShadow: "0 2px 10px rgba(10,95,168,0.07)" }}>
                <div className="faq-q" style={{ fontSize: 16, color: "#0d2540", fontWeight: 700, marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 14, lineHeight: 1.75, color: "#2a5070" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 50%, #1e7fc5 100%)", textAlign: "center", padding: "88px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7dd3fc", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>ESSAI GRATUIT — 7 JOURS</p>
          <h2 style={{ fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff", marginBottom: 16, lineHeight: 1.15 }}>
            Votre prochain compte rendu<br />
            <em style={{ fontStyle: "italic", color: "#7dd3fc" }}>prend 30 secondes.</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", marginBottom: 44, lineHeight: 1.7 }}>
            Sans installation. Sans API à configurer.<br />Juste votre voix — et le compte rendu qui s'écrit.
          </p>
          <Link className="cta-btn-primary" href="/register" style={{
            display: "inline-block", padding: "18px 52px",
            background: "#c45d4a", borderRadius: 14, color: "#ffffff",
            textDecoration: "none", fontSize: 19, fontWeight: 800,
            boxShadow: "0 8px 32px rgba(196,93,74,0.45)",
            letterSpacing: "-0.01em",
          }}>
            Essayer gratuitement →
          </Link>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28 }}>
            {["< 30s par CR", "600+ corrections", "7 jours offerts"].map((s) => (
              <span key={s} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
            ))}
          </div>
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
        <div style={{ marginBottom: 16 }}>
          <a href="mailto:contact@echoscribe.fr" style={{ color: "#7dd3fc", textDecoration: "none", fontSize: 13 }}>
            contact@echoscribe.fr
          </a>
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
