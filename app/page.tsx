import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", color: "#1e3a5f", fontFamily: "'EB Garamond', Georgia, serif" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#ffffff", borderBottom: "1px solid #e2eaf2",
        padding: "0 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 68,
        boxShadow: "0 1px 6px rgba(30,58,95,0.07)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, fontStyle: "italic", color: "#1e3a5f" }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#1e7fc5" }}>Scribe</span>
          </span>
          <span style={{
            background: "#e8f2fa", border: "1px solid #b8d6ef", borderRadius: 999,
            padding: "3px 10px", fontSize: 9, letterSpacing: "0.14em",
            textTransform: "uppercase" as const, color: "#1e7fc5",
            fontFamily: "'JetBrains Mono', monospace",
          }}>IA v5</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#4a6a8a", textDecoration: "none", fontSize: 15, padding: "8px 16px" }}>
            Connexion
          </Link>
          <Link href="/register" style={{
            background: "#1e3a5f", borderRadius: 10, color: "#ffffff",
            textDecoration: "none", fontSize: 15, padding: "10px 22px", fontWeight: 600,
          }}>
            Essai gratuit 7 jours →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#e8f2fa", border: "1px solid #b8d6ef",
          borderRadius: 999, padding: "6px 18px", fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace", color: "#1e7fc5",
          letterSpacing: "0.1em", marginBottom: 36,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1e7fc5", display: "inline-block" }} />
          Conforme aux standards SFR · Certifié usage médical
        </div>

        <h1 style={{ fontSize: "clamp(38px, 6vw, 62px)", fontWeight: 700, lineHeight: 1.12, color: "#1e3a5f", marginBottom: 24 }}>
          Dictée échographique IA —<br />
          <span style={{ color: "#1e7fc5" }}>compte rendu structuré</span><br />
          en 30 secondes
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.75, color: "#4a6a8a", marginBottom: 40, maxWidth: 600, margin: "0 auto 48px" }}>
          EchoScribe transforme votre dictée vocale en compte rendu d'échographie professionnel, structuré et conforme aux recommandations de la Société Française de Radiologie.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{
            background: "#1e3a5f", borderRadius: 12, color: "#ffffff",
            textDecoration: "none", fontSize: 18, padding: "16px 36px",
            display: "inline-block", fontWeight: 600,
            boxShadow: "0 4px 16px rgba(30,58,95,0.25)",
          }}>
            Commencer l'essai gratuit →
          </Link>
          <a href="#tarifs" style={{
            background: "#ffffff", border: "2px solid #1e3a5f",
            borderRadius: 12, color: "#1e3a5f", textDecoration: "none",
            fontSize: 18, padding: "16px 36px", display: "inline-block", fontWeight: 600,
          }}>
            Voir les tarifs
          </a>
        </div>

        <p style={{ fontSize: 13, color: "#8aaac8", fontFamily: "'JetBrains Mono', monospace", marginTop: 24 }}>
          7 jours d'essai · Aucune carte requise · Résiliable en un clic
        </p>
      </section>

      {/* SÉPARATEUR */}
      <div style={{ background: "#f0f5fb", borderTop: "1px solid #e2eaf2", borderBottom: "1px solid #e2eaf2", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { n: "30s", label: "Compte rendu généré" },
            { n: "80+", label: "Corrections médicales" },
            { n: "100%", label: "Conforme SFR" },
            { n: "0€", label: "Pour démarrer" },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#1e3a5f", fontFamily: "'EB Garamond', serif" }}>{s.n}</div>
              <div style={{ fontSize: 14, color: "#4a6a8a", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{ padding: "88px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 700, color: "#1e3a5f", marginBottom: 60 }}>
          Tout ce dont vous avez besoin
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { icon: "🎙", title: "Dictée vocale intelligente", desc: "Dictez naturellement en français médical. EchoScribe corrige automatiquement la terminologie échographique en temps réel (hyperéchogène, Wirsung, EU-TIRADS…)." },
            { icon: "✦", title: "Correction médicale SFR", desc: "Plus de 80 corrections automatiques adaptées au vocabulaire de l'échographie. Filtrage intelligent des instructions au patient et des hésitations." },
            { icon: "⬡", title: "Génération IA de pointe", desc: "Propulsé par les meilleurs modèles d'IA du marché. Raisonnement approfondi pour des comptes rendus structurés INDICATION / RÉSULTATS / CONCLUSION / CAT." },
            { icon: "📋", title: "Compatible Doctolib", desc: "Copie en un clic dans le presse-papiers avec formatage riche. Collez directement dans Doctolib, Mediboard ou votre logiciel métier." },
            { icon: "🔒", title: "Données sécurisées", desc: "Audio non conservé sur nos serveurs. Texte supprimé localement après 12h. Conforme RGPD." },
            { icon: "📱", title: "Mobile & tablette", desc: "Interface optimisée pour smartphone et tablette. Utilisez EchoScribe directement en salle d'échographie depuis votre appareil mobile." },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#ffffff", border: "1px solid #e2eaf2", borderRadius: 16,
              padding: "32px 28px", boxShadow: "0 2px 12px rgba(30,58,95,0.06)",
              transition: "box-shadow 0.2s",
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 19, color: "#1e3a5f", marginBottom: 10, fontWeight: 700 }}>{f.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4a6a8a" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#f0f5fb", padding: "88px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#1e3a5f", marginBottom: 56 }}>
            Comment ça fonctionne ?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { n: "01", title: "Appuyez sur le micro", desc: "Cliquez sur le bouton microphone et commencez à dicter votre examen normalement, y compris les instructions au patient." },
              { n: "02", title: "L'IA corrige en temps réel", desc: "EchoScribe filtre les hésitations, corrige la terminologie médicale et détecte le type d'examen (abdominal, pelvien, Doppler…)." },
              { n: "03", title: "Générez le compte rendu", desc: "En un clic, l'IA rédige un compte rendu structuré INDICATION / RÉSULTATS / CONCLUSION / CAT en moins de 30 secondes." },
              { n: "04", title: "Copiez et validez", desc: "Copiez le résultat en un clic et collez-le dans votre logiciel. Signez et validez en tant que médecin responsable." },
            ].map((s) => (
              <div key={s.n} style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                background: "#ffffff", border: "1px solid #e2eaf2",
                borderRadius: 14, padding: "24px 28px", textAlign: "left",
                boxShadow: "0 2px 8px rgba(30,58,95,0.06)",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: "#1e7fc5", fontWeight: 700, flexShrink: 0, minWidth: 44 }}>
                  {s.n}
                </span>
                <div>
                  <div style={{ fontSize: 18, color: "#1e3a5f", fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: "#4a6a8a" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "88px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>
          Tarifs simples et transparents
        </h2>
        <p style={{ textAlign: "center", fontSize: 17, color: "#4a6a8a", marginBottom: 56 }}>
          7 jours d'essai gratuit inclus · Résiliable à tout moment · Aucun frais caché
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {/* Monthly */}
          <div style={{ background: "#ffffff", border: "1px solid #e2eaf2", borderRadius: 20, padding: "40px 36px", boxShadow: "0 2px 12px rgba(30,58,95,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8aaac8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Mensuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: "#1e3a5f" }}>59€</span>
              <span style={{ fontSize: 17, color: "#8aaac8" }}>/mois</span>
            </div>
            <p style={{ fontSize: 13, color: "#8aaac8", marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>
              Puis 59€/mois · Résiliable à tout moment
            </p>
            {["Dictée vocale illimitée", "IA de dernière génération", "Correction médicale SFR", "Historique 12h", "Support email"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, fontSize: 16, color: "#1e3a5f" }}>
                <span style={{ color: "#1e7fc5", fontSize: 16, fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=monthly" style={{
              display: "block", textAlign: "center", marginTop: 32, padding: "14px",
              background: "#1e3a5f", borderRadius: 10, color: "#ffffff",
              textDecoration: "none", fontSize: 16, fontWeight: 600,
            }}>
              Essai gratuit 7 jours →
            </Link>
          </div>

          {/* Yearly */}
          <div style={{ background: "#1e3a5f", border: "none", borderRadius: 20, padding: "40px 36px", position: "relative", boxShadow: "0 8px 32px rgba(30,58,95,0.3)" }}>
            <div style={{
              position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
              background: "#1e7fc5", color: "#ffffff", borderRadius: 999,
              padding: "5px 18px", fontSize: 12, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
            }}>✦ ÉCONOMISEZ 25%</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8aaac8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Annuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: "#ffffff" }}>699€</span>
              <span style={{ fontSize: 17, color: "#8aaac8" }}>/an</span>
            </div>
            <p style={{ fontSize: 13, color: "#1e7fc5", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>Soit 58,25€/mois</p>
            <p style={{ fontSize: 13, color: "#8aaac8", marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>Facturé annuellement · Résiliable à tout moment</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "Correction médicale SFR", "Historique 12h", "Support prioritaire", "Accès aux nouvelles fonctionnalités"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, fontSize: 16, color: "#ffffff" }}>
                <span style={{ color: "#1e7fc5", fontSize: 16, fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=yearly" style={{
              display: "block", textAlign: "center", marginTop: 32, padding: "14px",
              background: "#1e7fc5", borderRadius: 10, color: "#ffffff",
              textDecoration: "none", fontSize: 16, fontWeight: 700,
            }}>
              Essai gratuit 7 jours →
            </Link>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#8aaac8", fontFamily: "'JetBrains Mono', monospace", marginTop: 32 }}>
          Paiement sécurisé par Stripe · Facture TVA française disponible · Remboursement 14 jours
        </p>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f0f5fb", padding: "88px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 700, color: "#1e3a5f", marginBottom: 52 }}>
            Questions fréquentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "Mes données audio sont-elles conservées ?", a: "Non. L'audio capturé par votre microphone est traité localement dans votre navigateur. Aucun fichier audio n'est jamais conservé sur nos serveurs." },
              { q: "EchoScribe est-il certifié dispositif médical ?", a: "EchoScribe est un outil d'aide à la rédaction. Le compte rendu généré est une proposition à valider et signer obligatoirement par le médecin responsable. Il ne se substitue pas au jugement clinique du praticien." },
              { q: "Compatible avec quel logiciel médical ?", a: "Le résultat est copié dans le presse-papiers avec un formatage riche (HTML). Il est compatible avec Doctolib, Mediboard, Crossway, ainsi que tout traitement de texte (Word, LibreOffice)." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement ni pénalité. La résiliation est effectuée en un clic depuis votre espace facturation. Vous conservez l'accès jusqu'à la fin de la période payée." },
              { q: "Comment fonctionne l'essai gratuit ?", a: "L'essai de 7 jours est gratuit et sans carte de crédit requise à l'inscription. À la fin de l'essai, vous choisissez un plan pour continuer. Sans action de votre part, l'accès est suspendu." },
            ].map((item) => (
              <div key={item.q} style={{ background: "#ffffff", border: "1px solid #e2eaf2", borderRadius: 12, padding: "22px 28px", boxShadow: "0 1px 6px rgba(30,58,95,0.06)" }}>
                <div style={{ fontSize: 17, color: "#1e3a5f", fontWeight: 700, marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: "#4a6a8a" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "#1e3a5f", textAlign: "center", padding: "88px 24px" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>
          Prêt à gagner du temps ?
        </h2>
        <p style={{ fontSize: 18, color: "#8aaac8", marginBottom: 40 }}>
          Rejoignez les radiologues et échographistes qui utilisent déjà EchoScribe au quotidien.
        </p>
        <Link href="/register" style={{
          display: "inline-block", padding: "18px 48px",
          background: "#ffffff", borderRadius: 12,
          color: "#1e3a5f", textDecoration: "none", fontSize: 20, fontWeight: 700,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          Commencer gratuitement →
        </Link>
        <p style={{ fontSize: 13, color: "#8aaac8", fontFamily: "'JetBrains Mono', monospace", marginTop: 20 }}>
          7 jours gratuits · Sans carte bancaire · Sans engagement
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#132540", borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "40px 24px", textAlign: "center",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4a6a8a", lineHeight: 2,
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontStyle: "italic", color: "#e2eaf2" }}>
            Echo<span style={{ fontStyle: "normal", color: "#1e7fc5" }}>Scribe</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Link href="/mentions-legales" style={{ color: "#8aaac8", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/cgu" style={{ color: "#8aaac8", textDecoration: "none" }}>CGU</Link>
          <Link href="/confidentialite" style={{ color: "#8aaac8", textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/login" style={{ color: "#8aaac8", textDecoration: "none" }}>Connexion</Link>
        </div>
        <div style={{ color: "#4a6a8a" }}>© {new Date().getFullYear()} EchoScribe · Outil d'aide à la rédaction médicale · À valider par le médecin responsable</div>
      </footer>
    </div>
  );
}
