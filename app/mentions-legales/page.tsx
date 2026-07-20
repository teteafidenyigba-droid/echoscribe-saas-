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
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
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
<p><strong>Dernière mise à jour :</strong> Juillet 2025</p>

<h2>1. Éditeur du site</h2>
<p>
  Le site EchoScribe (ci-après « le Service ») est édité par :<br>
  <strong>CONNEXION MED</strong><br>
  Société par actions simplifiée (SAS) au capital de 3 000 €<br>
  RCS Orléans n° <strong>981 614 882</strong><br>
  Date d'immatriculation : 28 janvier 2024<br>
  Email : contact@echoscribe.fr
</p>


<h2>3. Hébergement</h2>
<p>
  Le site est hébergé par :<br>
  <strong>Vercel Inc.</strong><br>
  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
</p>
<p>
  Base de données hébergée par :<br>
  <strong>Supabase Inc.</strong><br>
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
