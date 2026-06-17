import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      style={{
        background: "#f0f7f4",
        minHeight: "100vh",
        color: "#1a2e3d",
        fontFamily: "'EB Garamond', Georgia, serif",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffff",
          borderBottom: "1px solid #d0e8df",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontStyle: "italic", color: "#1a2e3d" }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#0f6e56" }}>Scribe</span>
          </span>
          <span style={{
            background: "#e8f5ee", border: "1px solid #9ecfb8", borderRadius: 999,
            padding: "3px 10px", fontSize: 9, letterSpacing: "0.14em",
            textTransform: "uppercase" as const, color: "#0f6e56",
            fontFamily: "'JetBrains Mono', monospace",
          }}>IA v5</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#4a7a6a", textDecoration: "none", fontSize: 15, padding: "8px 16px" }}>
            Connexion
          </Link>
          <Link href="/register" style={{
            background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)",
            borderRadius: 10, color: "#ffffff", textDecoration: "none",
            fontSize: 15, padding: "9px 20px", fontWeight: 600,
          }}>
            Essai gratuit 7 jours →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "96px 24px 80px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#e8f5ee", border: "1px solid #9ecfb8",
          borderRadius: 999, padding: "5px 16px", fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace", color: "#0f6e56",
          letterSpacing: "0.1em", marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f6e56", display: "inline-block" }} />
          Conforme aux standards SFR · Certifié usage médical
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 600, lineHeight: 1.15, color: "#1a2e3d", marginBottom: 20 }}>
          Dictée échographique IA —<br />
          <span style={{ color: "#0f6e56" }}>compte rendu structuré</span><br />
          en 30 secondes
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.75, color: "#3d5a52", marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
          EchoScribe transforme votre dictée vocale en compte rendu d'échographie professionnel, structuré et conforme aux recommandations de la Société Française de Radiologie.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{
            background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)",
            borderRadius: 12, color: "#ffffff", textDecoration: "none",
            fontSize: 18, padding: "15px 32px", display: "inline-block", fontWeight: 600,
          }}>
            Commencer l'essai gratuit →
          </Link>
          <a href="#tarifs" style={{
            background: "#ffffff", border: "1px solid #9ecfb8",
            borderRadius: 12, color: "#0f6e56", textDecoration: "none",
            fontSize: 18, padding: "15px 32px", display: "inline-block",
          }}>
            Voir les tarifs
          </a>
        </div>

        <p style={{ fontSize: 12, color: "#6a9a8a", fontFamily: "'JetBrains Mono', monospace", marginTop: 20 }}>
          7 jours d'essai · Aucune carte requise · Résiliable en un clic
        </p>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 600, color: "#1a2e3d", marginBottom: 56 }}>
          Tout ce dont vous avez besoin
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { icon: "🎙", title: "Dictée vocale intelligente", desc: "Dictez naturellement en français médical. EchoScribe corrige automatiquement la terminologie échographique en temps réel (hyperéchogène, Wirsung, EU-TIRADS…)." },
            { icon: "✦", title: "Correction médicale SFR", desc: "Plus de 80 corrections automatiques adaptées au vocabulaire de l'échographie. Filtrage intelligent des instructions au patient et des hésitations." },
            { icon: "⬡", title: "Génération IA de pointe", desc: "Propulsé par les meilleurs modèles d'IA du marché. Raisonnement approfondi pour des comptes rendus structurés INDICATION / RÉSULTATS / CONCLUSION / CAT." },
            { icon: "📋", title: "Compatible Doctolib", desc: "Copie en un clic dans le presse-papiers avec formatage riche (gras, soulignement). Collez directement dans Doctolib, Mediboard ou votre logiciel métier." },
            { icon: "🔒", title: "Données sécurisées", desc: "Audio non conservé sur nos serveurs. Texte supprimé localement après 12h. Conforme RGPD." },
            { icon: "📱", title: "Mobile & tablette", desc: "Interface optimisée pour smartphone et tablette. Utilisez EchoScribe directement en salle d'échographie depuis votre appareil mobile." },
          ].map((f) => (
            <div key={f.title} style={{ background: "#ffffff", border: "1px solid #d0e8df", borderRadius: 14, padding: "28px 24px", boxShadow: "0 2px 8px rgba(15,110,86,0.06)" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, color: "#1a2e3d", marginBottom: 10, fontWeight: 600 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3d5a52" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: "#1a2e3d", marginBottom: 48 }}>
          Comment ça fonctionne ?
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            { n: "01", title: "Appuyez sur le micro", desc: "Cliquez sur le bouton microphone et commencez à dicter votre examen normalement, y compris les instructions au patient." },
            { n: "02", title: "L'IA corrige en temps réel", desc: "EchoScribe filtre les hésitations, corrige la terminologie médicale et détecte le type d'examen (abdominal, pelvien, Doppler…)." },
            { n: "03", title: "Générez le compte rendu", desc: "En un clic (ou automatiquement avec les mots-clés déclencheurs), l'IA rédige un compte rendu structuré en moins de 30 secondes." },
            { n: "04", title: "Copiez et validez", desc: "Copiez le résultat en un clic et collez-le dans votre logiciel. Signez et validez en tant que médecin responsable." },
          ].map((s) => (
            <div key={s.n} style={{
              display: "flex", gap: 20, alignItems: "flex-start",
              background: "#ffffff", border: "1px solid #d0e8df",
              borderRadius: 14, padding: "22px 24px", textAlign: "left",
              boxShadow: "0 2px 8px rgba(15,110,86,0.06)",
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: "#0f6e56", fontWeight: 700, flexShrink: 0, minWidth: 40 }}>
                {s.n}
              </span>
              <div>
                <div style={{ fontSize: 17, color: "#1a2e3d", fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#3d5a52" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 600, color: "#1a2e3d", marginBottom: 12 }}>
          Tarifs simples et transparents
        </h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#3d5a52", marginBottom: 52 }}>
          7 jours d'essai gratuit inclus · Résiliable à tout moment · Aucun frais caché
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {/* Monthly */}
          <div style={{ background: "#ffffff", border: "1px solid #d0e8df", borderRadius: 16, padding: "36px 32px", boxShadow: "0 2px 8px rgba(15,110,86,0.06)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a9a8a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Mensuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: "#1a2e3d" }}>59€</span>
              <span style={{ fontSize: 16, color: "#6a9a8a" }}>/mois</span>
            </div>
            <p style={{ fontSize: 13, color: "#6a9a8a", marginBottom: 28, fontFamily: "'JetBrains Mono', monospace" }}>
              Puis 59€/mois · Résiliable à tout moment
            </p>
            {["Dictée vocale illimitée", "IA de dernière génération", "Correction médicale SFR", "Historique 12h", "Support email"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, fontSize: 15, color: "#1a2e3d" }}>
                <span style={{ color: "#0f6e56", fontSize: 14 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=monthly" style={{
              display: "block", textAlign: "center", marginTop: 28, padding: "13px",
              background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)",
              borderRadius: 10, color: "#ffffff", textDecoration: "none", fontSize: 16, fontWeight: 600,
            }}>
              Essai gratuit 7 jours →
            </Link>
          </div>

          {/* Yearly */}
          <div style={{ background: "#e8f5ee", border: "2px solid #0f6e56", borderRadius: 16, padding: "36px 32px", position: "relative", boxShadow: "0 4px 16px rgba(15,110,86,0.12)" }}>
            <div style={{
              position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
              background: "#0f6e56", color: "#ffffff", borderRadius: 999,
              padding: "4px 16px", fontSize: 12, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
            }}>✦ ÉCONOMISEZ 25%</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0f6e56", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Annuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: "#1a2e3d" }}>699€</span>
              <span style={{ fontSize: 16, color: "#6a9a8a" }}>/an</span>
            </div>
            <p style={{ fontSize: 13, color: "#0f6e56", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>Soit 58,25€/mois</p>
            <p style={{ fontSize: 13, color: "#6a9a8a", marginBottom: 28, fontFamily: "'JetBrains Mono', monospace" }}>Facturé annuellement · Résiliable à tout moment</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "Correction médicale SFR", "Historique 12h", "Support prioritaire", "Accès aux nouvelles fonctionnalités"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, fontSize: 15, color: "#1a2e3d" }}>
                <span style={{ color: "#0f6e56", fontSize: 14 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=yearly" style={{
              display: "block", textAlign: "center", marginTop: 28, padding: "13px",
              background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)",
              borderRadius: 10, color: "#ffffff", textDecoration: "none", fontSize: 16, fontWeight: 700,
            }}>
              Essai gratuit 7 jours →
            </Link>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#6a9a8a", fontFamily: "'JetBrains Mono', monospace", marginTop: 28 }}>
          Paiement sécurisé par Stripe · Facture TVA française disponible · Remboursement 14 jours
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 600, color: "#1a2e3d", marginBottom: 48 }}>
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
            <div key={item.q} style={{ background: "#ffffff", border: "1px solid #d0e8df", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(15,110,86,0.06)" }}>
              <div style={{ fontSize: 16, color: "#1a2e3d", fontWeight: 600, marginBottom: 8 }}>{item.q}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#3d5a52" }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: "center", padding: "80px 24px 100px", maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: "#1a2e3d", marginBottom: 16 }}>
          Prêt à gagner du temps ?
        </h2>
        <p style={{ fontSize: 16, color: "#3d5a52", marginBottom: 36 }}>
          Rejoignez les radiologues et échographistes qui utilisent déjà EchoScribe au quotidien.
        </p>
        <Link href="/register" style={{
          display: "inline-block", padding: "16px 40px",
          background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)",
          borderRadius: 12, color: "#ffffff", textDecoration: "none", fontSize: 20, fontWeight: 600,
        }}>
          Commencer gratuitement →
        </Link>
        <p style={{ fontSize: 12, color: "#6a9a8a", fontFamily: "'JetBrains Mono', monospace", marginTop: 16 }}>
          7 jours gratuits · Sans carte bancaire · Sans engagement
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #d0e8df", padding: "40px 24px", textAlign: "center",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6a9a8a", lineHeight: 2,
        background: "#ffffff",
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontStyle: "italic", color: "#1a2e3d" }}>
            Echo<span style={{ fontStyle: "normal", color: "#0f6e56" }}>Scribe</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Link href="/mentions-legales" style={{ color: "#6a9a8a", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/cgu" style={{ color: "#6a9a8a", textDecoration: "none" }}>CGU</Link>
          <Link href="/confidentialite" style={{ color: "#6a9a8a", textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/login" style={{ color: "#6a9a8a", textDecoration: "none" }}>Connexion</Link>
        </div>
        <div>© {new Date().getFullYear()} EchoScribe · Outil d'aide à la rédaction médicale · À valider par le médecin responsable</div>
      </footer>
    </div>
  );
}
