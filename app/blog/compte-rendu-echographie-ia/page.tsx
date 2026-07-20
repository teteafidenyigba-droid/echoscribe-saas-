import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "../../components/Logo";

export const metadata: Metadata = {
  title: "Compte rendu d'échographie par IA : guide complet pour le radiologue | EchoScribe",
  description: "Comment l'IA transforme la rédaction du compte rendu d'échographie. Conformité SFR/HAS, gain de temps, sans micro externe. Guide complet pour radiologues.",
  alternates: { canonical: "https://echoscribe.fr/blog/compte-rendu-echographie-ia" },
  openGraph: {
    title: "Compte rendu d'échographie par IA : ce qui change pour le radiologue",
    description: "Comment l'IA transforme la rédaction du compte rendu d'échographie. Conformité SFR/HAS, gain de temps, sans micro externe.",
    url: "https://echoscribe.fr/blog/compte-rendu-echographie-ia",
    type: "article",
    publishedTime: "2025-07-20",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Compte rendu d'échographie par IA : ce qui change pour le radiologue",
  "description": "Comment l'intelligence artificielle transforme la rédaction des comptes rendus échographiques. Gain de temps, conformité SFR/HAS, et impact sur la pratique quotidienne.",
  "datePublished": "2025-07-20",
  "dateModified": "2025-07-20",
  "author": { "@type": "Organization", "name": "EchoScribe", "url": "https://echoscribe.fr" },
  "publisher": { "@type": "Organization", "name": "EchoScribe", "logo": { "@type": "ImageObject", "url": "https://echoscribe.fr/og-image.png" } },
  "url": "https://echoscribe.fr/blog/compte-rendu-echographie-ia",
  "inLanguage": "fr",
  "about": ["Échographie médicale", "Intelligence artificielle médicale", "Dictée vocale", "Compte rendu radiologique"],
  "audience": { "@type": "MedicalAudience", "audienceType": "Radiologue, échographiste" },
};

export default function ArticlePage() {
  return (
    <div style={{ background: "#eaf4fb", minHeight: "100vh", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .article-body h2 { font-size: clamp(22px, 2.8vw, 28px); font-weight: 800; color: #0d2540; margin: 48px 0 16px; line-height: 1.2; }
        .article-body h3 { font-size: clamp(18px, 2vw, 22px); font-weight: 700; color: #1e3a5f; margin: 32px 0 12px; }
        .article-body p { font-size: 17px; line-height: 1.85; color: #1a3050; margin-bottom: 20px; }
        .article-body ul { margin: 0 0 20px 0; padding-left: 24px; }
        .article-body li { font-size: 16px; line-height: 1.8; color: #1a3050; margin-bottom: 8px; }
        .article-body strong { color: #0d2540; }
        .article-body a { color: #0a66c2; }
        .callout { background: #dbeafe; border-left: 4px solid #0a66c2; border-radius: 0 12px 12px 0; padding: 18px 24px; margin: 32px 0; }
        .callout p { margin: 0; color: #1e3a5f; font-size: 16px; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "rgba(234,244,251,0.97)", borderBottom: "1px solid #c8ddef", padding: "0 48px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(16px)", boxShadow: "0 1px 16px rgba(13,37,64,.18)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo size={26} />
        </Link>
        <Link href="/register" style={{ background: "#c45d4a", color: "#fff", textDecoration: "none", padding: "9px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
          Essai gratuit 7 jours →
        </Link>
      </nav>

      {/* Hero article */}
      <section style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 100%)", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
            <Link href="/blog" style={{ color: "#7dd3fc", textDecoration: "none", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>← Blog</Link>
            <span style={{ color: "#4a6a8a" }}>·</span>
            <span style={{ background: "#1e3a5f", border: "1px solid #38bdf8", color: "#38bdf8", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", borderRadius: 999 }}>Guide</span>
            <span style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "'JetBrains Mono', monospace" }}>20 juillet 2025 · 6 min</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
            Compte rendu d&apos;échographie par IA :<br />
            <em style={{ fontStyle: "italic", color: "#38bdf8" }}>ce qui change pour le radiologue</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 660 }}>
            Un médecin échographiste passe en moyenne 30 à 40 % de son temps de consultation à rédiger ses comptes rendus. L'IA change la donne — voici comment, et ce que ça implique concrètement.
          </p>
        </div>
      </section>

      {/* Corps de l'article */}
      <article style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 80px" }}>
        <div className="article-body">

          <h2>Le problème : le compte rendu d'échographie prend trop de temps</h2>
          <p>
            En radiologie et en échographie, le compte rendu est un document médico-légal obligatoire. Il doit être structuré, précis, et conforme aux recommandations de la <strong>Société Française de Radiologie (SFR)</strong> et de la <strong>Haute Autorité de Santé (HAS)</strong>. En pratique, cela représente 5 à 15 minutes de rédaction par examen — multiplié par 20 à 40 examens par jour, c'est une part considérable de la journée.
          </p>
          <p>
            Les solutions existantes — Dragon Medical, Nuance, dictaphones classiques — imposent un matériel dédié, une formation longue, et des abonnements coûteux. L'intelligence artificielle ouvre une troisième voie.
          </p>

          <h2>Comment fonctionne la dictée médicale par IA</h2>
          <p>
            Le principe est simple : le médecin <strong>dicte pendant ou après l'examen</strong>, naturellement, comme il parlerait à un confrère. L'IA prend en charge :
          </p>
          <ul>
            <li>La <strong>transcription vocale</strong> en temps réel (reconnaissance de la parole médicale)</li>
            <li>Le <strong>filtrage</strong> des échanges avec le patient, des hésitations, des "euh"</li>
            <li>La <strong>structuration</strong> automatique en INDICATION / RÉSULTATS / CONCLUSION / CAT</li>
            <li>La <strong>correction terminologique</strong> : hyperéchogène, EU-TIRADS, BI-RADS, O-RADS, Bosniak, IOTA…</li>
            <li>La mise en forme prête à coller dans le logiciel métier</li>
          </ul>

          <div className="callout">
            <p><strong>Résultat observé :</strong> un compte rendu complet généré en moins de 30 secondes, contre 5 à 15 minutes en rédaction manuelle. Soit un gain de 70 à 90 % du temps de rédaction.</p>
          </div>

          <h2>Conformité SFR et HAS : ce qu'impose la réglementation</h2>
          <p>
            Un compte rendu échographique conforme doit obligatoirement comporter :
          </p>
          <ul>
            <li>L'<strong>indication</strong> de l'examen (motif clinique, contexte)</li>
            <li>Les <strong>résultats</strong> : description organe par organe, mesures précises, terminologie standard</li>
            <li>La <strong>conclusion</strong> diagnostique avec cotation si applicable (EU-TIRADS 1-5, BI-RADS 0-6, etc.)</li>
            <li>La <strong>conduite à tenir</strong> (CAT) avec délai de suivi recommandé</li>
          </ul>
          <p>
            L'IA médicale spécialisée, comme celle utilisée dans <Link href="/">EchoScribe</Link>, est calibrée sur ces exigences précises. Elle ne génère pas un texte généraliste — elle produit un document qui suit la structure imposée et utilise le vocabulaire exact attendu par les confrères et les instances.
          </p>

          <h2>Faut-il un microphone externe ?</h2>
          <p>
            C'est la question que posent presque tous les médecins qui découvrent la dictée IA. La réponse est <strong>non</strong> — et c'est l'une des avancées les plus significatives par rapport aux générations précédentes.
          </p>
          <p>
            Les modèles de reconnaissance vocale actuels (Whisper d'OpenAI, notamment) sont suffisamment performants pour fonctionner avec le <strong>microphone intégré d'un ordinateur portable standard</strong>. Pas de dictaphone, pas de perche, pas de pédale de déclenchement. On ouvre l'ordinateur, on se connecte, on dicte.
          </p>

          <h2>EchoScribe vs Dragon Medical : quelle différence ?</h2>
          <p>
            Dragon Medical est la référence historique de la dictée médicale. Il reste performant, mais présente plusieurs contraintes que l'IA nouvelle génération résout :
          </p>
          <ul>
            <li><strong>Dragon Medical</strong> : micro dédié obligatoire, formation initiale 2-4h, abonnement 150-300€/mois, installation locale</li>
            <li><strong>EchoScribe</strong> : micro PC suffisant, prise en main en 5 minutes, 69€/mois, 100 % web (aucune installation)</li>
          </ul>
          <p>
            La différence fondamentale : Dragon transcrit ce que vous dites. EchoScribe <strong>comprend</strong> ce que vous dites et <strong>rédige</strong> le compte rendu. Ce n'est pas le même niveau de traitement.
          </p>

          <h2>Ce que ça change dans la pratique quotidienne</h2>
          <p>
            Au-delà du gain de temps, les médecins qui utilisent la dictée IA rapportent plusieurs effets sur leur exercice :
          </p>
          <ul>
            <li>Moins de fatigue cognitive en fin de journée (moins de temps à "chercher ses mots")</li>
            <li>Des comptes rendus plus homogènes et plus complets</li>
            <li>Plus de temps disponible pour le dialogue avec le patient</li>
            <li>Une réduction du risque d'erreur sur les cotations et les mesures</li>
          </ul>

          <div className="callout">
            <p><strong>Important :</strong> EchoScribe est un outil d'aide à la rédaction. Chaque compte rendu généré doit être relu, validé et signé par le médecin responsable. L'IA ne remplace pas le jugement clinique.</p>
          </div>

          <h2>Comment commencer ?</h2>
          <p>
            <Link href="/register">L'essai gratuit de 7 jours</Link> permet de tester EchoScribe sur ses propres dictées, sans engagement et sans carte bancaire. La prise en main prend moins de 5 minutes : créer un compte, ouvrir l'application, dicter le premier examen.
          </p>
          <p>
            Le micro intégré de votre ordinateur suffit. Aucune installation, aucun matériel à commander.
          </p>

        </div>

        {/* CTA inline */}
        <div style={{ background: "linear-gradient(140deg, #0f2440, #1e3a5f)", borderRadius: 20, padding: "40px", textAlign: "center", marginTop: 56 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7dd3fc", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>ESSAI GRATUIT — 7 JOURS</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 12, fontFamily: "'EB Garamond', serif" }}>Votre prochain compte rendu prend 30 secondes.</h2>
          <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 28, fontSize: 15 }}>Micro PC intégré suffisant · Sans engagement · Sans installation</p>
          <Link href="/register" style={{ background: "#c45d4a", color: "#fff", textDecoration: "none", padding: "14px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, boxShadow: "0 6px 24px rgba(196,93,74,.4)", display: "inline-block" }}>
            Essayer gratuitement →
          </Link>
        </div>

        {/* Retour blog */}
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #c8ddef" }}>
          <Link href="/blog" style={{ color: "#0a66c2", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>← Retour au blog</Link>
        </div>
      </article>

      {/* Footer */}
      <footer style={{ background: "#0d1f35", textAlign: "center", padding: "24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4a6a8a" }}>
        <Link href="/" style={{ color: "#4a6a8a", textDecoration: "none" }}>← Retour au site</Link>
        <span style={{ margin: "0 16px" }}>·</span>
        © {new Date().getFullYear()} EchoScribe
      </footer>
    </div>
  );
}
