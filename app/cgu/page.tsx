import Link from "next/link";

export const metadata = {
  title: "Conditions Générales d'Utilisation — EchoScribe",
};

export default function CGUPage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
        </Link>
      </nav>
      <div style={s.content}>
        <h1 style={s.h1}>Conditions Générales d'Utilisation</h1>
        <div style={s.body} dangerouslySetInnerHTML={{ __html: cguContent }} />
        <div style={{ marginTop: 40, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/mentions-legales" style={s.link}>Mentions légales</Link>
          <Link href="/confidentialite" style={s.link}>Confidentialité</Link>
          <Link href="/" style={s.link}>← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}

const cguContent = `
<p><strong>Dernière mise à jour :</strong> Juillet 2025</p>
<p>Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du service EchoScribe (ci-après « le Service ») édité par la société <strong>CONNEXION MED</strong>, SAS au capital de 3 000 €, immatriculée au RCS d'Orléans sous le numéro 981 614 882 (ci-après « l'Éditeur »), par tout professionnel de santé (ci-après « l'Utilisateur »).</p>

<h2>1. Acceptation des CGU</h2>
<p>L'accès et l'utilisation du Service impliquent l'acceptation pleine et entière des présentes CGU. Si l'Utilisateur n'accepte pas les présentes CGU, il doit s'abstenir d'utiliser le Service.</p>

<h2>2. Description du Service</h2>
<p>EchoScribe est un service d'aide à la rédaction de comptes rendus d'échographie par intelligence artificielle, destiné exclusivement aux professionnels de santé dûment qualifiés et habilités à pratiquer l'échographie médicale (radiologues, médecins, sages-femmes, etc.).</p>
<p>Le Service permet :</p>
<ul>
  <li>La transcription vocale de dictées médicales en temps réel ;</li>
  <li>La correction automatique de terminologie médicale échographique ;</li>
  <li>La génération de comptes rendus structurés via des modèles d'IA de dernière génération.</li>
</ul>

<h2>3. Conditions d'accès</h2>
<p>Le Service est réservé aux professionnels de santé. En s'inscrivant, l'Utilisateur déclare exercer une profession de santé réglementée et utiliser le Service dans un cadre professionnel médical.</p>
<p>L'accès au Service est conditionné à la création d'un compte et à la souscription d'un abonnement actif.</p>

<h2>4. Responsabilité médicale — Clause essentielle</h2>
<p><strong>EchoScribe est un outil d'aide à la rédaction, non un dispositif médical certifié.</strong></p>
<p>Les comptes rendus générés par le Service constituent des <strong>propositions automatiques</strong> qui :</p>
<ul>
  <li>Doivent être relus, vérifiés et validés par le médecin responsable ;</li>
  <li>Doivent être signés par le praticien avant tout usage clinique ;</li>
  <li>Ne constituent pas un acte médical en eux-mêmes ;</li>
  <li>Peuvent contenir des erreurs ou omissions.</li>
</ul>
<p>L'éditeur décline toute responsabilité pour tout dommage résultant d'une utilisation des comptes rendus sans validation médicale préalable.</p>

<h2>5. Clés API et données</h2>
<p>Le Service utilise des modèles d'intelligence artificielle pour générer les comptes rendus. Les données saisies ne sont pas conservées au-delà de la session en cours.</p>
<p>L'audio dicté est traité localement ou transmis directement à l'API choisie et n'est jamais conservé sur les serveurs d'EchoScribe.</p>

<h2>6. Abonnement et facturation</h2>
<p>L'accès au Service est soumis à un abonnement mensuel (69€ HT/mois) ou annuel (799€ HT/an), après une période d'essai gratuit de 7 jours.</p>
<p>Le paiement est géré par Stripe. L'abonnement se renouvelle automatiquement sauf résiliation. La résiliation prend effet à la fin de la période en cours.</p>
<p>Conformément à l'article L. 221-28 du Code de la consommation, le droit de rétractation de 14 jours s'applique. Toutefois, si l'accès au Service est demandé avant l'expiration de ce délai, l'Utilisateur reconnaît expressément renoncer à ce droit.</p>

<h2>7. Utilisation acceptable</h2>
<p>L'Utilisateur s'engage à :</p>
<ul>
  <li>Utiliser le Service uniquement à des fins professionnelles médicales légitimes ;</li>
  <li>Ne pas tenter de contourner les mécanismes de sécurité ;</li>
  <li>Ne pas utiliser le Service pour des examens obstétricaux (non couvert par la base de données) ;</li>
  <li>Respecter le secret médical dans toute utilisation du Service.</li>
</ul>

<h2>8. Propriété intellectuelle</h2>
<p>Les comptes rendus générés restent la propriété de l'Utilisateur et du médecin signataire. EchoScribe ne revendique aucun droit sur les contenus médicaux générés.</p>

<h2>9. Modification des CGU</h2>
<p>L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. L'Utilisateur sera informé par email des modifications substantielles.</p>

<h2>10. Résiliation</h2>
<p>L'éditeur se réserve le droit de suspendre ou résilier l'accès de tout Utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité.</p>

<h2>11. Loi applicable</h2>
<p>Les présentes CGU sont soumises au droit français. Les litiges seront portés devant les juridictions compétentes du ressort du siège social de l'éditeur.</p>

<h2>12. Contact</h2>
<p>Pour toute question relative aux CGU : <a href="mailto:contact@echoscribe.fr">contact@echoscribe.fr</a></p>
`;

const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#07101e",
    minHeight: "100vh",
    fontFamily: "'EB Garamond', Georgia, serif",
    color: "#c8d8ea",
  },
  nav: {
    borderBottom: "1px solid rgba(56,189,248,0.1)",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
  },
  logo: {
    fontFamily: "'EB Garamond', serif",
    fontSize: 22,
    fontStyle: "italic",
    color: "#e2eaf5",
    textDecoration: "none",
  },
  content: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  h1: {
    fontSize: 32,
    fontWeight: 600,
    color: "#e2eaf5",
    marginBottom: 36,
  },
  body: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#b0c4d8",
  },
  link: {
    color: "#38bdf8",
    textDecoration: "none",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
  },
};
