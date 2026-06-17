import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "#dce8f5", minHeight: "100vh", color: "#1e3a5f", fontFamily: "'EB Garamond', Georgia, serif" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(220,232,245,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #c0d4e8", padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68, boxShadow: "0 1px 8px rgba(30,58,95,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 26, fontStyle: "italic", color: "#1e3a5f" }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#1e7fc5" }}>Scribe</span>
          </span>
          <span style={{
            background: "#1e3a5f", borderRadius: 999, padding: "3px 10px",
            fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" as const,
            color: "#ffffff", fontFamily: "'JetBrains Mono', monospace",
          }}>IA v5</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#4a6a8a", textDecoration: "none", fontSize: 15, padding: "8px 16px" }}>
            Connexion
          </Link>
          <Link href="/register" style={{
            background: "#1e3a5f", borderRadius: 10, color: "#ffffff",
            textDecoration: "none", fontSize: 15, padding: "10px 22px", fontWeight: 600,
            boxShadow: "0 2px 8px rgba(30,58,95,0.3)",
          }}>
            Essai gratuit 7 jours →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #1e5a8a 50%, #1e7fc5 100%)",
        padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, left: -60, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 820, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 999, padding: "7px 20px", fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace", color: "#ffffff",
            letterSpacing: "0.1em", marginBottom: 36,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block" }} />
            Conforme aux standards SFR · Certifié usage médical
          </div>

          <h1 style={{ fontSize: "clamp(40px, 6vw, 66px)", fontWeight: 700, lineHeight: 1.1, color: "#ffffff", marginBottom: 28 }}>
            Votre dictée médicale<br />
            <span style={{ color: "#7dd3fc" }}>transformée en compte rendu</span><br />
            en 30 secondes
          </h1>

          <p style={{ fontSize: 19, lineHeight: 1.8, color: "rgba(255,255,255,0.82)", marginBottom: 48, maxWidth: 620, margin: "0 auto 48px" }}>
            EchoScribe génère automatiquement des comptes rendus d'échographie structurés et conformes aux recommandations de la Société Française de Radiologie — sans effort, sans frappe.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <Link href="/register" style={{
              background: "#ffffff", borderRadius: 12, color: "#1e3a5f",
              textDecoration: "none", fontSize: 18, padding: "16px 40px",
              display: "inline-block", fontWeight: 700,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
              Commencer gratuitement →
            </Link>
            <a href="#comment" style={{
              background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.35)",
              borderRadius: 12, color: "#ffffff", textDecoration: "none",
              fontSize: 18, padding: "16px 36px", display: "inline-block", fontWeight: 600,
            }}>
              Voir comment ça marche
            </a>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
            7 jours d'essai gratuit · Aucune carte requise · Résiliable en un clic
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #c0d4e8", padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            { n: "< 30s", label: "Compte rendu généré" },
            { n: "80+", label: "Corrections médicales auto" },
            { n: "100%", label: "Conforme normes SFR" },
            { n: "7 jours", label: "Essai gratuit sans CB" },
          ].map((s) => (
            <div key={s.n} style={{ padding: "8px 0" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#1e3a5f", fontFamily: "'EB Garamond', serif" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "#4a6a8a", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "88px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#1e7fc5", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>FONCTIONNALITÉS</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#1e3a5f" }}>Tout ce dont vous avez besoin</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {[
            { icon: "🎙", title: "Dictée vocale intelligente", desc: "Dictez naturellement en français médical. Correction automatique de la terminologie échographique en temps réel (hyperéchogène, Wirsung, EU-TIRADS…)." },
            { icon: "✦", title: "Correction médicale SFR", desc: "Plus de 80 corrections automatiques adaptées au vocabulaire de l'échographie. Filtrage intelligent des hésitations et instructions au patient." },
            { icon: "⬡", title: "IA de dernière génération", desc: "Propulsé par les meilleurs modèles d'IA du marché pour des comptes rendus structurés INDICATION / RÉSULTATS / CONCLUSION / CAT en quelques secondes." },
            { icon: "📋", title: "Compatible avec votre logiciel", desc: "Copie en un clic dans le presse-papiers. Compatible Doctolib, Mediboard, Crossway et tout traitement de texte." },
            { icon: "🔒", title: "Sécurité & RGPD", desc: "Audio traité localement, jamais stocké sur nos serveurs. Texte supprimé automatiquement après 12h. Conforme RGPD." },
            { icon: "📱", title: "Mobile & tablette", desc: "Optimisé pour smartphone et tablette. Dictez directement en salle d'échographie depuis n'importe quel appareil." },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#ffffff", border: "1px solid #c0d4e8", borderRadius: 16,
              padding: "32px 28px", boxShadow: "0 2px 16px rgba(30,58,95,0.07)",
            }}>
              <div style={{ fontSize: 38, marginBottom: 18 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, color: "#1e3a5f", marginBottom: 12, fontWeight: 700 }}>{f.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#4a6a8a" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e5a8a 100%)", padding: "88px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#7dd3fc", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>COMMENT ÇA MARCHE</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", marginBottom: 56 }}>
            De la dictée au compte rendu en 4 étapes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { n: "01", title: "Appuyez sur le micro", desc: "Dictez votre examen naturellement, y compris les instructions au patient — EchoScribe trie tout automatiquement." },
              { n: "02", title: "L'IA corrige en temps réel", desc: "Filtrage des hésitations, correction de la terminologie médicale, détection du type d'examen (abdominal, pelvien, Doppler…)." },
              { n: "03", title: "Générez le compte rendu", desc: "En un clic, l'IA structure un compte rendu complet INDICATION / RÉSULTATS / CONCLUSION / CAT en moins de 30 secondes." },
              { n: "04", title: "Copiez et collez", desc: "Copiez le résultat dans votre logiciel, signez et validez. C'est prêt." },
            ].map((s) => (
              <div key={s.n} style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 14, padding: "24px 28px", textAlign: "left",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: "#7dd3fc", fontWeight: 700, flexShrink: 0, minWidth: 48 }}>
                  {s.n}
                </span>
                <div>
                  <div style={{ fontSize: 19, color: "#ffffff", fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.72)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "88px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#1e7fc5", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>TARIFS</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>Simple et transparent</h2>
          <p style={{ fontSize: 17, color: "#4a6a8a" }}>7 jours d'essai gratuit · Résiliable à tout moment · Aucun frais caché</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {/* Monthly */}
          <div style={{ background: "#ffffff", border: "1px solid #c0d4e8", borderRadius: 20, padding: "40px 36px", boxShadow: "0 2px 16px rgba(30,58,95,0.08)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8aaac8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Mensuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: "#1e3a5f" }}>59€</span>
              <span style={{ fontSize: 17, color: "#8aaac8" }}>/mois</span>
            </div>
            <p style={{ fontSize: 13, color: "#8aaac8", marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>Résiliable à tout moment</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "Correction médicale SFR", "Historique 12h", "Support email"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, fontSize: 16, color: "#1e3a5f" }}>
                <span style={{ color: "#1e7fc5", fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=monthly" style={{
              display: "block", textAlign: "center", marginTop: 32, padding: "14px",
              background: "#1e3a5f", borderRadius: 10, color: "#ffffff",
              textDecoration: "none", fontSize: 16, fontWeight: 600,
            }}>
              Démarrer l'essai →
            </Link>
          </div>

          {/* Yearly */}
          <div style={{ background: "#1e3a5f", borderRadius: 20, padding: "40px 36px", position: "relative", boxShadow: "0 8px 40px rgba(30,58,95,0.35)" }}>
            <div style={{
              position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)",
              background: "#1e7fc5", color: "#ffffff", borderRadius: 999,
              padding: "5px 20px", fontSize: 12, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
            }}>✦ MEILLEURE OFFRE — 25% d'économie</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8aaac8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Annuel</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: "#ffffff" }}>699€</span>
              <span style={{ fontSize: 17, color: "#8aaac8" }}>/an</span>
            </div>
            <p style={{ fontSize: 14, color: "#7dd3fc", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Soit 58,25€/mois</p>
            <p style={{ fontSize: 13, color: "#8aaac8", marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>Facturé annuellement · Résiliable</p>
            {["Dictée vocale illimitée", "IA de dernière génération", "Correction médicale SFR", "Historique 12h", "Support prioritaire", "Nouvelles fonctionnalités en avant-première"].map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, fontSize: 16, color: "#ffffff" }}>
                <span style={{ color: "#7dd3fc", fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register?plan=yearly" style={{
              display: "block", textAlign: "center", marginTop: 32, padding: "14px",
              background: "#1e7fc5", borderRadius: 10, color: "#ffffff",
              textDecoration: "none", fontSize: 16, fontWeight: 700,
            }}>
              Démarrer l'essai →
            </Link>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#8aaac8", fontFamily: "'JetBrains Mono', monospace", marginTop: 32 }}>
          Paiement sécurisé par Stripe · Facture TVA disponible · Remboursement 14 jours
        </p>
      </section>

      {/* FAQ */}
      <section style={{ background: "#ffffff", padding: "88px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#1e7fc5", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: "#1e3a5f" }}>Questions fréquentes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "Mes données audio sont-elles conservées ?", a: "Non. L'audio est traité localement dans votre navigateur et n'est jamais stocké sur nos serveurs. Votre confidentialité est totalement préservée." },
              { q: "EchoScribe est-il certifié dispositif médical ?", a: "EchoScribe est un outil d'aide à la rédaction. Le compte rendu généré doit être validé et signé par le médecin responsable. Il ne remplace pas le jugement clinique du praticien." },
              { q: "Compatible avec quel logiciel médical ?", a: "Le résultat est copié dans le presse-papiers avec un formatage riche (HTML). Compatible avec Doctolib, Mediboard, Crossway et tout traitement de texte." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement ni pénalité. La résiliation se fait en un clic depuis votre espace facturation. Vous gardez l'accès jusqu'à la fin de la période payée." },
              { q: "Comment fonctionne l'essai gratuit ?", a: "7 jours gratuits sans carte de crédit requise. À la fin, choisissez un plan ou l'accès est suspendu automatiquement." },
            ].map((item) => (
              <div key={item.q} style={{ background: "#f4f8fc", border: "1px solid #c0d4e8", borderRadius: 12, padding: "22px 28px" }}>
                <div style={{ fontSize: 17, color: "#1e3a5f", fontWeight: 700, marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: "#4a6a8a" }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e7fc5 100%)", textAlign: "center", padding: "96px 24px" }}>
        <h2 style={{ fontSize: 40, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>
          Prêt à gagner 2h par jour ?
        </h2>
        <p style={{ fontSize: 19, color: "rgba(255,255,255,0.78)", marginBottom: 44, maxWidth: 520, margin: "0 auto 44px" }}>
          Rejoignez les radiologues et échographistes qui dictent et publient leurs comptes rendus en 30 secondes.
        </p>
        <Link href="/register" style={{
          display: "inline-block", padding: "18px 52px",
          background: "#ffffff", borderRadius: 12,
          color: "#1e3a5f", textDecoration: "none", fontSize: 20, fontWeight: 700,
          boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
        }}>
          Commencer gratuitement →
        </Link>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace", marginTop: 20 }}>
          7 jours gratuits · Sans carte bancaire · Sans engagement
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#132540", padding: "44px 24px", textAlign: "center",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 2,
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
