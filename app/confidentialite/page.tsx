import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité — EchoScribe",
};

export default function ConfidentialitePage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>
          Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#38bdf8" }}>Scribe</span>
        </Link>
      </nav>
      <div style={s.content}>
        <h1 style={s.h1}>Politique de confidentialité</h1>
        <div style={s.body} dangerouslySetInnerHTML={{ __html: privacyContent }} />
        <div style={{ marginTop: 40, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/mentions-legales" style={s.link}>Mentions légales</Link>
          <Link href="/cgu" style={s.link}>CGU</Link>
          <Link href="/" style={s.link}>← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}

const privacyContent = `
<p><strong>Dernière mise à jour :</strong> Juin 2025</p>
<p>La présente Politique de confidentialité décrit comment EchoScribe collecte, utilise et protège vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679) et à la loi Informatique et Libertés.</p>

<h2>1. Responsable du traitement</h2>
<p>
  [VOTRE NOM / RAISON SOCIALE]<br>
  [ADRESSE]<br>
  Email DPO / contact RGPD : <a href="mailto:privacy@echoscribe.fr">privacy@echoscribe.fr</a>
</p>

<h2>2. Données collectées</h2>
<h3>2.1 Données de compte</h3>
<ul>
  <li>Adresse email professionnelle</li>
  <li>Nom et prénom</li>
  <li>Mot de passe (haché, jamais stocké en clair)</li>
  <li>Date d'inscription</li>
</ul>
<h3>2.2 Données d'abonnement</h3>
<ul>
  <li>Statut et historique d'abonnement</li>
  <li>Identifiant client Stripe (référence de paiement)</li>
  <li>Les données de carte bancaire sont gérées exclusivement par Stripe — EchoScribe n'y a jamais accès</li>
</ul>
<h3>2.3 Données médicales et dictées</h3>
<p><strong>EchoScribe ne collecte pas et ne conserve pas les données médicales :</strong></p>
<ul>
  <li>Les enregistrements audio sont traités localement dans votre navigateur — jamais stockés sur nos serveurs</li>
  <li>Les transcriptions et comptes rendus sont stockés uniquement dans votre navigateur (IndexedDB), avec suppression automatique après 12 heures</li>
</ul>
<h3>2.4 Données de navigation</h3>
<ul>
  <li>Logs d'accès techniques (adresse IP, navigateur) — conservation 30 jours maximum</li>
  <li>Aucun cookie publicitaire ou de tracking tiers</li>
</ul>

<h2>3. Finalités et bases légales</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
  <thead>
    <tr style="border-bottom:1px solid rgba(56,189,248,0.2);">
      <th style="text-align:left;padding:8px 0;color:#7bacc2;">Finalité</th>
      <th style="text-align:left;padding:8px 0;color:#7bacc2;">Base légale</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
      <td style="padding:8px 0;">Gestion du compte utilisateur</td>
      <td style="padding:8px 0;">Exécution du contrat</td>
    </tr>
    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
      <td style="padding:8px 0;">Facturation et abonnement</td>
      <td style="padding:8px 0;">Exécution du contrat / Obligation légale</td>
    </tr>
    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
      <td style="padding:8px 0;">Envoi d'emails transactionnels</td>
      <td style="padding:8px 0;">Exécution du contrat</td>
    </tr>
    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
      <td style="padding:8px 0;">Amélioration du service (logs techniques)</td>
      <td style="padding:8px 0;">Intérêt légitime</td>
    </tr>
  </tbody>
</table>

<h2>4. Destinataires des données</h2>
<p>Vos données sont partagées uniquement avec les sous-traitants nécessaires au fonctionnement du service :</p>
<ul>
  <li><strong>Supabase</strong> (authentification et base de données) — serveurs UE</li>
  <li><strong>Stripe</strong> (paiement) — certifié PCI DSS niveau 1</li>
  <li><strong>Resend</strong> (emails transactionnels)</li>
  <li><strong>Vercel</strong> (hébergement)</li>
</ul>
<p>Les modèles d'IA utilisés ne reçoivent que les données nécessaires à la génération du compte rendu, via une connexion sécurisée.</p>

<h2>5. Durée de conservation</h2>
<ul>
  <li>Données de compte : durée de l'abonnement + 3 ans (obligations légales comptables)</li>
  <li>Données d'abonnement : 10 ans (obligation légale)</li>
  <li>Dictées et comptes rendus : non conservés (suppression auto 12h côté navigateur)</li>
  <li>Logs techniques : 30 jours</li>
</ul>

<h2>6. Vos droits</h2>
<p>Conformément au RGPD, vous disposez des droits suivants :</p>
<ul>
  <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
  <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
  <li><strong>Droit à l'effacement</strong> : demander la suppression de votre compte</li>
  <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
  <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
  <li><strong>Droit de limitation</strong> : limiter le traitement de vos données</li>
</ul>
<p>Pour exercer ces droits : <a href="mailto:privacy@echoscribe.fr">privacy@echoscribe.fr</a></p>
<p>Vous pouvez également introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>

<h2>7. Sécurité</h2>
<p>EchoScribe met en œuvre les mesures techniques et organisationnelles suivantes :</p>
<ul>
  <li>Chiffrement des données en transit (HTTPS/TLS 1.3)</li>
  <li>Chiffrement des données au repos (AES-256 via Supabase)</li>
  <li>Authentification sécurisée via Supabase Auth (mots de passe hachés bcrypt)</li>
  <li>Clés API jamais transmises aux serveurs EchoScribe</li>
  <li>Accès aux données limité selon le principe du moindre privilège</li>
</ul>

<h2>8. Cookies</h2>
<p>EchoScribe utilise uniquement :</p>
<ul>
  <li>Des cookies de session nécessaires à l'authentification (Supabase Auth)</li>
  <li>Aucun cookie publicitaire, analytique ou de tracking tiers</li>
</ul>

<h2>9. Transferts hors UE</h2>
<p>Certains de nos sous-traitants sont basés aux États-Unis (Stripe, Vercel, Resend). Ces transferts sont encadrés par les Clauses Contractuelles Types (CCT) de la Commission européenne et le mécanisme EU-US Data Privacy Framework.</p>

<h2>10. Contact</h2>
<p>Pour toute question relative à vos données personnelles : <a href="mailto:privacy@echoscribe.fr">privacy@echoscribe.fr</a></p>
`;

const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#07101e",
    minHeight: "100vh",
    fontFamily: "'Inter Tight', system-ui, sans-serif",
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
    fontFamily: "'Fraunces', Georgia, serif",
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
