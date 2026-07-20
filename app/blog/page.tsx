import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "../components/Logo";

export const metadata: Metadata = {
  title: "Blog — Dictée médicale IA et compte rendu échographie | EchoScribe",
  description: "Conseils, guides et actualités sur la dictée médicale par IA pour radiologues et échographistes. Conformité SFR/HAS, bonnes pratiques, gain de temps.",
  alternates: { canonical: "https://echoscribe.fr/blog" },
};

const articles = [
  {
    slug: "compte-rendu-echographie-ia",
    title: "Compte rendu d'échographie par IA : ce qui change pour le radiologue",
    description: "Comment l'intelligence artificielle transforme la rédaction des comptes rendus échographiques. Gain de temps, conformité SFR/HAS, et impact sur la pratique quotidienne.",
    date: "2025-07-20",
    readTime: "6 min",
    tag: "Guide",
  },
];

export default function BlogPage() {
  return (
    <div style={{ background: "#eaf4fb", minHeight: "100vh", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .blog-card { transition: box-shadow .2s, transform .2s; }
        .blog-card:hover { box-shadow: 0 12px 36px rgba(10,95,168,.18) !important; transform: translateY(-4px); }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "rgba(234,244,251,0.97)", borderBottom: "1px solid #c8ddef", padding: "0 48px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(16px)", boxShadow: "0 1px 16px rgba(13,37,64,.18)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo size={26} />
        </Link>
        <Link href="/register" style={{ background: "#c45d4a", color: "#fff", textDecoration: "none", padding: "9px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: "0 2px 10px rgba(196,93,74,.35)" }}>
          Essai gratuit 7 jours →
        </Link>
      </nav>

      {/* Header */}
      <section style={{ background: "linear-gradient(140deg, #0f2440 0%, #1e3a5f 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#7dd3fc", marginBottom: 16 }}>RESSOURCES</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>Blog EchoScribe</h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", maxWidth: 520, margin: "0 auto" }}>Guides pratiques sur la dictée médicale par IA et la rédaction de comptes rendus échographiques.</p>
      </section>

      {/* Articles */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px" }}>
        {articles.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: "none" }}>
            <div className="blog-card" style={{ background: "#fff", border: "1.5px solid #c8ddef", borderRadius: 20, padding: "36px 40px", boxShadow: "0 4px 20px rgba(10,95,168,.08)", display: "block" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", borderRadius: 999, letterSpacing: ".08em" }}>{a.tag}</span>
                <span style={{ fontSize: 12, color: "#8a9ab0", fontFamily: "'JetBrains Mono', monospace" }}>{a.date} · {a.readTime} de lecture</span>
              </div>
              <h2 style={{ fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#0d2540", marginBottom: 12, lineHeight: 1.25 }}>{a.title}</h2>
              <p style={{ fontSize: 15, color: "#2a5070", lineHeight: 1.75, marginBottom: 20 }}>{a.description}</p>
              <span style={{ color: "#0a66c2", fontWeight: 600, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Lire l'article →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(140deg, #0f2440, #1e7fc5)", textAlign: "center", padding: "64px 24px" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Prêt à gagner du temps sur vos comptes rendus ?</h2>
        <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 32, fontSize: 16 }}>7 jours d'essai gratuit · Sans engagement · Micro PC intégré suffisant</p>
        <Link href="/register" style={{ background: "#c45d4a", color: "#fff", textDecoration: "none", padding: "16px 40px", borderRadius: 12, fontSize: 17, fontWeight: 700, boxShadow: "0 6px 24px rgba(196,93,74,.4)" }}>
          Essayer gratuitement →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0d1f35", textAlign: "center", padding: "24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4a6a8a" }}>
        <Link href="/" style={{ color: "#4a6a8a", textDecoration: "none" }}>← Retour au site</Link>
        <span style={{ margin: "0 16px" }}>·</span>
        © {new Date().getFullYear()} EchoScribe
      </footer>
    </div>
  );
}
