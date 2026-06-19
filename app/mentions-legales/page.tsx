import Link from "next/link";

export const metadata = {
  title: "Mentions légales — EchoScribe",
};

export default function MentionsLegalesPage() {
  return <LegalPage title="Mentions légales" content={content} />;
}

function LegalPage({ title, content }: { title: string; content: string }) {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#c45d4a" }}>Scribe</span>
        </Link>
      </nav>
      <div style={s.content}>
        <h1 style={s.h1}>{title}</h1>
        <div
          style={s.body}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div style={{ marginTop: 40, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/cgu" style={s.link}>CGU</Link>
          <Link href="/confidentialite" style={s.link}>Politique de confidentialité</Link>
          <Link href="/" style={s.link}>← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}

const content = `
<p><strong>Dernière mise à jour :</strong> Juin 2025</p>

<h2>1. Éditeur du site</h2>
<p>
  Le site EchoScribe (ci-après « le Service ») est édité par :<br>
  <strong>[VOTRE NOM / RAISON SOCIALE]</strong><br>
  [Forme juridique] au capital de [X]€<br>
  SIRET : [NUMÉRO SIRET]<br>
  Siège social : [ADRESSE COMPLÈTE]<br>
  Email : contact@echoscribe.fr<br>
  Numéro de TVA intracommunautaire : FR[NUMÉRO]
</p>

<h2>2. Directeur de la publication</h2>
<p>[NOM DU DIRECTEUR DE PUBLICATION], en qualité de [TITRE].</p>

<h2>3. Hébergement</h2>
<p>
  Le site est hébergé par :<br>
  <strong>Vercel Inc.</strong><br>
  340 Pine Street, Suite 701, San Francisco, CA 94104, USA<br>
  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
</p>
<p>
  Base de données hébergée par :<br>
  <strong>Supabase Inc.</strong><br>
  970 Toa Payoh North, Singapore<br>
  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">https://supabase.com</a>
</p>

<h2>4. Propriété intellectuelle</h2>
<p>
  L'ensemble des éléments constituant le site EchoScribe (textes, graphiques, logiciels, code source, algorithmes, prompts IA) est protégé par le droit de la propriété intellectuelle français et international. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation préalable et écrite de l'éditeur.
</p>

<h2>5. Responsabilité médicale</h2>
<p>
  EchoScribe est un <strong>outil d'aide à la rédaction</strong> destiné aux professionnels de santé. Les comptes rendus générés par l'intelligence artificielle constituent des <strong>propositions</strong> qui doivent obligatoirement être vérifiées, validées et signées par le médecin responsable avant tout usage clinique.
</p>
<p>
  EchoScribe ne constitue pas un dispositif médical au sens de la réglementation européenne MDR 2017/745. L'éditeur ne saurait être tenu responsable de tout préjudice résultant d'une utilisation du service sans validation médicale préalable.
</p>

<h2>6. Limitation de responsabilité</h2>
<p>
  L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le service, mais ne garantit pas l'exhaustivité, l'exactitude ou l'actualité des contenus générés par les modèles d'intelligence artificielle.
</p>

<h2>7. Loi applicable et juridiction</h2>
<p>
  Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
</p>

<h2>8. Contact</h2>
<p>Pour toute question : <a href="mailto:contact@echoscribe.fr">contact@echoscribe.fr</a></p>
`;

const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#fbfaf7",
    minHeight: "100vh",
    fontFamily: "'Inter Tight', system-ui, sans-serif",
    color: "#14303a",
  },
  nav: {
    borderBottom: "1px solid #dde8eb",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
  },
  logo: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 22,
    fontStyle: "italic",
    color: "#14303a",
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
    color: "#14303a",
    marginBottom: 36,
  },
  body: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#3c5a63",
  },
  link: {
    color: "#15627a",
    textDecoration: "none",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
  },
};
