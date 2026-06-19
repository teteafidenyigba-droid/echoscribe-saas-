import Link from "next/link";
import HeroSlider from "./components/HeroSlider";

export default function LandingPage() {
  return (
    <div style={{ background: "#fbfaf7", minHeight: "100vh", color: "#14303a", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <style>{`
        :root {
          --ink: #14303a; --teal: #15627a; --teal-dk: #0e3c4c; --teal-2: #1c7f9e;
          --soft: #e9f1f3; --soft-2: #f1f6f7; --paper: #fbfaf7;
          --clay: #c45d4a; --clay-dk: #a9472f; --clay-soft: #f7e8e3;
          --line: #dde5e7; --gray: #5b6b71; --gray-2: #86969b;
        }
        @media (max-width: 768px) {
          .nav-wrap { padding: 0 18px !important; height: 62px !important; }
          .nav-links { display: none !important; }
          .nav-cta-text { display: none !important; }
          .nav-cta-short { display: inline !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 44px 0 40px !important; }
          .hero-demo { display: none !important; }
          .hero-h1 { font-size: clamp(34px, 8vw, 52px) !important; }
          .stat-item { border-right: none !important; border-bottom: 1px solid var(--line) !important; padding-bottom: 18px !important; }
          .stat-item:last-child { border-bottom: none !important; }
          .problem-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .faq-item { padding: 20px 22px !important; }
          .cta-section { padding: 72px 20px !important; }
          .section-pad { padding-top: 56px !important; padding-bottom: 56px !important; }
        }
        @media (max-width: 480px) {
          .hero-h1 { font-size: clamp(28px, 9vw, 42px) !important; }
        }
        .feature-card { transition: transform .2s, box-shadow .2s; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(21,98,122,.18) !important; }
        .faq-card { transition: border-color .15s, box-shadow .15s; }
        .faq-card:hover { border-color: var(--teal) !important; box-shadow: 0 4px 18px rgba(21,98,122,.12) !important; }
        .btn-clay { transition: background .15s, transform .15s, box-shadow .15s; }
        .btn-clay:hover { background: var(--clay-dk) !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196,93,74,.35) !important; }
        .btn-teal { transition: background .15s, transform .15s; }
        .btn-teal:hover { background: var(--teal-dk) !important; transform: translateY(-1px); }
        .noise-text { color: #8aa0a6; }
        .noise-text.struck { text-decoration: line-through; text-decoration-color: var(--clay); opacity: .55; }
      `}</style>

      {/* NAV */}
      <nav className="nav-wrap" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(251,250,247,.92)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid #dde5e7", padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 66, boxShadow: "0 1px 8px rgba(14,60,76,.07)",
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <svg viewBox="0 0 40 24" width="26" height="18" style={{ color: "#c45d4a" }} aria-hidden="true">
            <path d="M1 12 H7 l3-9 4 19 4-15 3 11 3-7 h11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
          <span className="logo-text" style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 23, fontWeight: 600, color: "#15627a", letterSpacing: "-0.02em" }}>
            EchoScribe
          </span>
        </a>
        <div className="nav-links" style={{ display: "flex", gap: 26, fontSize: 14.5, fontWeight: 500 }}>
          {[["#specificite","Spécificité"],["#fonctionnement","Fonctionnement"],["#tarifs","Tarifs"],["#faq","FAQ"]].map(([h,l]) => (
            <a key={h} href={h} style={{ color: "#3a4c52", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link className="nav-login" href="/login" style={{
            color: "#14303a", textDecoration: "none", fontSize: 14, padding: "8px 16px", borderRadius: 9,
            border: "1px solid #dde5e7", fontWeight: 500,
          }}>Connexion</Link>
          <Link className="nav-cta btn-clay" href="/register" style={{
            background: "#c45d4a", borderRadius: 10, color: "#fff", textDecoration: "none",
            fontSize: 14, padding: "9px 20px", fontWeight: 600,
            boxShadow: "0 4px 14px rgba(196,93,74,.28)",
          }}>
            <span className="nav-cta-text">Essai gratuit 7 jours</span>
            <span className="nav-cta-short" style={{ display: "none" }}>Essai →</span>
          </Link>
        </div>
      </nav>

      <div id="top" />

      <HeroSlider />

      {/* STATS */}
      <section style={{ background: "#fff", borderTop: "1px solid #dde5e7", borderBottom: "1px solid #dde5e7", padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", textAlign: "center" }}>
          {[
            { n: "< 30s", label: "Compte rendu généré", sub: "contre 5–10 min manuellement" },
            { n: "80+", label: "Corrections médicales", sub: "vocabulaire échographique" },
            { n: "100%", label: "Conforme SFR/HAS", sub: "structure standardisée" },
            { n: "7 jours", label: "Essai gratuit", sub: "sans carte bancaire" },
          ].map((s, i) => (
            <div key={s.n} className="stat-item" style={{ padding: "12px 16px", borderRight: i < 3 ? "1px solid #dde5e7" : "none" }}>
              <div className="stat-num" style={{ fontSize: 38, fontWeight: 600, color: "#15627a", fontFamily: "'Fraunces', serif", lineHeight: 1.1 }}>{s.n}</div>
              <div style={{ fontSize: 14, color: "#14303a", fontWeight: 600, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "#86969b", marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "linear-gradient(90deg, #0e3c4c, #15627a)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" as const, alignItems: "center" }}>
          {[
            { icon: "🔒", text: "RGPD & Secret médical" },
            { icon: "⚡", text: "< 30 secondes" },
            { icon: "🎙", text: "Dictée vocale IA" },
            { icon: "✦", text: "Conforme SFR" },
            { icon: "🛡", text: "Données locales" },
          ].map((t) => (
            <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8, color: "#cfe3ea", fontSize: 13, fontWeight: 500 }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span> {t.text}
            </div>
          ))}
        </div>
      </section>

      {/* SPÉCIFICITÉ */}
      <section id="specificite" style={{ background: "linear-gradient(180deg,#0e3c4c,#15627a)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#c45d4a", marginBottom: 16 }}>La spécificité EchoScribe</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(24px,3vw,34px)", fontWeight: 600, color: "#fff", lineHeight: 1.1 }}>
              Il rédige le compte rendu — il ne se contente pas de transcrire.
            </h2>
            <p style={{ color: "#cfe3ea", marginTop: 14, fontSize: 16.5, lineHeight: 1.65 }}>
              Dicter du texte, beaucoup d'outils le font. La spécificité d'EchoScribe est ailleurs : il connaît l'échographie et produit, à votre place, un compte rendu structuré et conforme, prêt à signer.
            </p>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              "Un compte rendu structuré SFR/HAS — et non une transcription brute à reprendre.",
              "Un vocabulaire échographique français : abdominal, vasculaire, pelvien, cervical, scrotal, MSK.",
              "Clé en main : créez votre compte en 2 minutes, dictez immédiatement.",
            ].map((pt) => (
              <div key={pt} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "#cfe3ea" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2, color: "#c45d4a" }}>
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDÉO */}
      <section className="video-section section-pad" style={{ background: "#e9f1f3", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 14 }}>DÉMONSTRATION</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 34, fontWeight: 600, color: "#0e3c4c", marginBottom: 12 }}>Voyez EchoScribe en action</h2>
          <p style={{ fontSize: 17, color: "#5b6b71", marginBottom: 44 }}>De la dictée au compte rendu structuré en moins de 30 secondes.</p>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 18, boxShadow: "0 12px 48px rgba(14,60,76,.15)", border: "1px solid #dde5e7" }}>
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

      {/* PROBLÈME / SOLUTION */}
      <section className="section-pad" style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 14 }}>POURQUOI ECHOSCRIBE ?</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 600, color: "#14303a" }}>
              2 à 3 heures de rédaction par jour.<br />
              <span style={{ color: "#15627a" }}>EchoScribe vous les rend.</span>
            </h2>
          </div>
          <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="problem-card" style={{ background: "#fff5f2", border: "1.5px solid #f5c4bc", borderRadius: 20, padding: "38px 34px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fde8e3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>✗</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#a9472f", letterSpacing: ".12em" }}>SANS ECHOSCRIBE</span>
              </div>
              {[
                ["5–10 min", "par compte rendu en saisie manuelle"],
                ["Terminologie", "complexe, souvent mal orthographiée"],
                ["Structure", "à reconstruire à chaque rapport"],
                ["Relecture", "longue et source de stress"],
                ["Concentration", "épuisée sur la frappe, pas le diagnostic"],
              ].map(([bold, rest]) => (
                <div key={bold} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f5c4bc" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c45d4a", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ margin: 0, fontSize: 15, color: "#14303a", lineHeight: 1.55 }}>
                    <strong style={{ color: "#a9472f" }}>{bold}</strong> {rest}
                  </p>
                </div>
              ))}
            </div>
            <div className="problem-card" style={{ background: "#edf6f5", border: "1.5px solid #a8cfd6", borderRadius: 20, padding: "38px 34px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#c8eee9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>✓</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0e3c4c", letterSpacing: ".12em" }}>AVEC ECHOSCRIBE</span>
              </div>
              {[
                ["< 30 secondes", "par compte rendu, de la dictée à la signature"],
                ["Terminologie", "corrigée automatiquement en temps réel"],
                ["Structure SFR", "générée automatiquement (INDICATION / RÉSULTATS / CAT)"],
                ["Validation", "rapide — relisez, cliquez, signez"],
                ["Concentration", "sur ce qui compte : l'analyse et le diagnostic"],
              ].map(([bold, rest]) => (
                <div key={bold} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #a8ddd7" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#15627a", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ margin: 0, fontSize: 15, color: "#14303a", lineHeight: 1.55 }}>
                    <strong style={{ color: "#0e3c4c" }}>{bold}</strong> {rest}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link className="btn-clay" href="/register" style={{
              display: "inline-block", padding: "15px 40px",
              background: "#c45d4a", borderRadius: 11, color: "#fff", textDecoration: "none",
              fontSize: 16, fontWeight: 600, boxShadow: "0 6px 20px rgba(196,93,74,.28)",
            }}>Récupérer mes 2 heures par jour →</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fonctionnement" className="section-pad" style={{ background: "#f1f6f7", padding: "88px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 14 }}>FONCTIONNALITÉS</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 600, color: "#14303a", marginBottom: 12 }}>Tout ce dont vous avez besoin</h2>
            <p style={{ fontSize: 17, color: "#5b6b71", maxWidth: 500, margin: "0 auto" }}>Conçu par et pour les radiologues et échographistes francophones.</p>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              { icon: "🎙", title: "Dictée vocale intelligente", desc: "Dictez naturellement. Correction automatique de la terminologie échographique : hyperéchogène, Wirsung, EU-TIRADS, vésiculaire…" },
              { icon: "⚡", title: "Génération en 30 secondes", desc: "L'IA structure votre dictée en compte rendu complet INDICATION / RÉSULTATS / CONCLUSION / CAT en moins de 30 secondes." },
              { icon: "📋", title: "Export PDF et Word", desc: "Téléchargez chaque compte rendu en PDF ou Word. Collez directement dans Doctolib, Mediboard, Crossway ou votre logiciel." },
              { icon: "🔒", title: "Sécurité & RGPD", desc: "Audio traité localement, jamais stocké. Données supprimées après 12h. Conforme RGPD et secret médical." },
              { icon: "✦", title: "80+ corrections SFR", desc: "Base médicale spécialisée en échographie. Filtrage automatique des hésitations et instructions au patient." },
              { icon: "📱", title: "Partout, sur tous vos écrans", desc: "Smartphone, tablette, ordinateur. Utilisez EchoScribe en salle d'examen, à votre bureau ou en déplacement." },
            ].map((f) => (
              <div key={f.title} className="feature-card" style={{
                background: "#fff", border: "1px solid #dde5e7", borderRadius: 18,
                padding: "28px 26px", boxShadow: "0 4px 18px rgba(14,60,76,.06)",
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: "#e9f1f3", display: "grid", placeItems: "center", fontSize: 22, marginBottom: 16, color: "#15627a" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, color: "#14303a", marginBottom: 9, fontWeight: 600 }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#5b6b71" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "linear-gradient(140deg, #0e3c4c 0%, #15627a 100%)", padding: "88px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#c45d4a", marginBottom: 14 }}>COMMENT ÇA MARCHE</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 34, fontWeight: 600, color: "#fff", marginBottom: 14 }}>Trois gestes, et le compte rendu est prêt</h2>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,.6)", marginBottom: 52 }}>Aussi simple que de parler à un collègue.</p>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, textAlign: "left" }}>
            {[
              { n: "1", title: "Dictez", desc: "Parlez librement. EchoScribe transcrit, corrige les termes et filtre les consignes au patient." },
              { n: "2", title: "L'IA structure", desc: "Au mot-clé « c'est terminé », le compte rendu s'écrit au fil de l'eau — sections, organes, conclusion." },
              { n: "3", title: "Collez & validez", desc: "Relisez, validez et collez dans Doctolib, Weda, HelloDoc… Aucun diagnostic posé par l'IA." },
            ].map((s) => (
              <div key={s.n} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(127,211,196,.18)", borderRadius: 16, padding: "26px 24px" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#c45d4a", border: "none", display: "grid", placeItems: "center", marginBottom: 16, fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, color: "#fff", marginBottom: 8, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.68)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link className="btn-clay" href="/register" style={{
              display: "inline-block", padding: "14px 36px",
              background: "#c45d4a", borderRadius: 11, color: "#fff", textDecoration: "none",
              fontSize: 16, fontWeight: 600, boxShadow: "0 6px 20px rgba(196,93,74,.3)",
            }}>Essayer gratuitement pendant 7 jours →</Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="section-pad" style={{ background: "#f1f6f7", padding: "88px 24px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 14 }}>TARIFS</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 600, color: "#14303a", marginBottom: 12 }}>Un prix prévisible, tout compris</h2>
            <p style={{ fontSize: 17, color: "#5b6b71" }}>7 jours d'essai gratuit · Résiliable à tout moment · Aucun frais caché</p>
          </div>
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {/* Mensuel */}
            <div className="pricing-card-base" style={{ background: "#fff", border: "1.5px solid #dde5e7", borderRadius: 20, padding: "32px 30px", boxShadow: "0 4px 18px rgba(14,60,76,.07)", display: "flex", flexDirection: "column" as const }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 10 }}>Mensuel</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 600, color: "#0e3c4c", lineHeight: 1 }}>59 €</span>
                <span style={{ fontSize: 16, color: "#86969b", fontWeight: 500 }}>/mois</span>
              </div>
              <p style={{ fontSize: 13, color: "#86969b", marginBottom: 28 }}>Résiliable à tout moment</p>
              {["Génération illimitée de comptes rendus","Claude, GPT-4o et Gemini inclus","Export PDF et Word","80+ corrections médicales SFR","Support email sous 24h"].map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, fontSize: 14.5, color: "#3f5057" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2, color: "#15627a" }}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </div>
              ))}
              <Link className="btn-teal" href="/register?plan=monthly" style={{
                display: "block", textAlign: "center", marginTop: "auto", paddingTop: 24,
                padding: "13px 20px", background: "#15627a", borderRadius: 11, color: "#fff",
                textDecoration: "none", fontSize: 15, fontWeight: 600,
              }}>Démarrer l'essai gratuit</Link>
            </div>
            {/* Annuel */}
            <div className="pricing-card pricing-card-base" style={{ background: "#fff", border: "1.5px solid #15627a", borderRadius: 20, padding: "32px 30px", boxShadow: "0 8px 32px rgba(14,60,76,.12)", display: "flex", flexDirection: "column" as const, position: "relative" as const }}>
              <div className="pricing-badge" style={{
                position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                background: "#c45d4a", color: "#fff", borderRadius: 999,
                padding: "5px 20px", fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap" as const,
                boxShadow: "0 4px 14px rgba(196,93,74,.3)",
              }}>✦ MEILLEURE OFFRE — 2 mois offerts</div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 10 }}>Annuel</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 600, color: "#0e3c4c", lineHeight: 1 }}>699 €</span>
                <span style={{ fontSize: 16, color: "#86969b", fontWeight: 500 }}>/an</span>
              </div>
              <p style={{ fontSize: 14, color: "#15627a", fontWeight: 600, marginBottom: 4 }}>Soit 58 €/mois</p>
              <p style={{ fontSize: 13, color: "#86969b", marginBottom: 28 }}>Facturé annuellement · Résiliable</p>
              {["Tout le plan mensuel inclus","Support prioritaire","Nouvelles fonctionnalités en avant-première","~165 h libérées par an"].map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, fontSize: 14.5, color: "#3f5057" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2, color: "#15627a" }}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </div>
              ))}
              <Link className="btn-clay" href="/register?plan=yearly" style={{
                display: "block", textAlign: "center", marginTop: "auto", paddingTop: 24,
                padding: "13px 20px", background: "#c45d4a", borderRadius: 11, color: "#fff",
                textDecoration: "none", fontSize: 15, fontWeight: 600,
                boxShadow: "0 4px 14px rgba(196,93,74,.28)",
              }}>Choisir l'annuel</Link>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#86969b", marginTop: 32 }}>
            🔒 Paiement sécurisé par Stripe · Facture disponible · Remboursement 14 jours
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-pad" style={{ background: "#fff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 14 }}>FAQ</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 600, color: "#14303a" }}>Ce que les praticiens demandent</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {[
              { q: "Faut-il changer d'échographe ou de logiciel ?", a: "Non. EchoScribe est indépendant de votre matériel et logiciel métier. Vous collez le compte rendu là où vous travaillez déjà (Doctolib, Weda, HelloDoc, MediStory…)." },
              { q: "Les données des patients sont-elles transmises ?", a: "Non. Aucune donnée identifiante n'est saisie ni transmise. L'audio reste local, les brouillons sont effacés automatiquement après 12 heures." },
              { q: "L'IA pose-t-elle un diagnostic ?", a: "Non. EchoScribe est un outil d'aide à la rédaction. Il ne pose aucun diagnostic et n'invente aucune mesure : le médecin relit, valide et signe chaque compte rendu." },
              { q: "Dois-je gérer une clé API ou créer un compte chez OpenAI ?", a: "Non. Vous créez uniquement un compte EchoScribe. Claude, GPT-4o et Gemini sont inclus dans l'abonnement — aucune clé API à gérer." },
              { q: "Comment fonctionne l'essai gratuit ?", a: "7 jours gratuits, sans carte bancaire requise. À la fin de la période, vous choisissez un plan ou votre accès est suspendu automatiquement." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement ni pénalité. La résiliation se fait en un clic depuis votre espace facturation." },
            ].map((item) => (
              <div key={item.q} className="faq-item faq-card" style={{ background: "#fff", border: "1px solid #dde5e7", borderRadius: 14, padding: "22px 28px" }}>
                <div className="faq-q" style={{ fontSize: 16, color: "#14303a", fontWeight: 600, marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: "#5b6b71" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" style={{ padding: "24px 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(160deg, #15627a, #0e3c4c)", borderRadius: 24, padding: "54px 40px", textAlign: "center", position: "relative" as const, overflow: "hidden" }}>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 600, color: "#fff", marginBottom: 14 }}>
              Prêt à dicter votre premier compte rendu ?
            </h2>
            <p style={{ fontSize: 17, color: "#cfe3ea", margin: "0 auto 28px", maxWidth: "48ch", lineHeight: 1.65 }}>
              7 jours gratuits, sans carte bancaire. Opérationnel en 5 minutes.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
              <Link className="btn-clay" href="/register" style={{
                display: "inline-block", padding: "15px 32px",
                background: "#c45d4a", borderRadius: 11, color: "#fff", textDecoration: "none",
                fontSize: 17, fontWeight: 600, boxShadow: "0 6px 20px rgba(196,93,74,.35)",
              }}>Commencer gratuitement</Link>
              <Link href="/login" style={{
                display: "inline-block", padding: "15px 28px",
                background: "rgba(255,255,255,.12)", borderRadius: 11, color: "#fff", textDecoration: "none",
                fontSize: 17, fontWeight: 500, border: "1px solid rgba(255,255,255,.25)",
              }}>Se connecter</Link>
            </div>
            <svg viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", width: "100%", height: 34, color: "#c45d4a", opacity: .3, position: "absolute", left: 0, bottom: 0 }}>
              <path d="M0 20 Q 30 20 45 20 T 90 20 105 6 120 34 135 20 q 20 0 60 0 15-24 30 8 15-20 30 12 q 20 0 240 0 15 -28 30 6 15 -18 30 12 q 25 0 480 0" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".9"/>
            </svg>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "46px 24px 60px", color: "#5b6b71", fontSize: 14, borderTop: "1px solid #dde5e7", background: "#fbfaf7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" as const, alignItems: "center" }}>
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <svg viewBox="0 0 40 24" width="22" height="15" style={{ color: "#c45d4a" }} aria-hidden="true">
              <path d="M1 12 H7 l3-9 4 19 4-15 3 11 3-7 h11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#15627a" }}>EchoScribe</span>
          </a>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, fontSize: 13.5 }}>
            {[
              ["/mentions-legales","Mentions légales"],
              ["/cgu","CGU"],
              ["/confidentialite","Confidentialité"],
              ["/login","Connexion"],
            ].map(([h,l]) => (
              <Link key={h} href={h} style={{ color: "#5b6b71", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </div>
        <p style={{ maxWidth: 760, margin: "18px auto 0", fontSize: 12.5, color: "#8c999d", lineHeight: 1.55, textAlign: "center" }}>
          EchoScribe est un outil d'aide à la rédaction, destiné aux professionnels de santé. Il ne constitue pas un dispositif de diagnostic. Audio non conservé · Texte local supprimé après 12 h · Chaque compte rendu est relu, validé et signé par le médecin. © {new Date().getFullYear()} EchoScribe.
        </p>
      </footer>
    </div>
  );
}
