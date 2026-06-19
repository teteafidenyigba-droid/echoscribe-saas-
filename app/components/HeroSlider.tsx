"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    specialty: "Radiologie · Échographie abdominale",
    headline: "Radiologues,",
    subline: "votre compte rendu en 30 secondes.",
    desc: "Dictez votre échographie abdominale. EchoScribe structure automatiquement INDICATION, RÉSULTATS et CONCLUSION — conforme SFR, prêt à signer.",
    icon: "🫁",
    badge: "Foie · Reins · Vésicule · Rate",
    color: "#38bdf8",
    thumbLabel: "Abdominal",
    thumbImg: "/thumb-abdo.jpg",
    sample: [
      { label: "RÉSULTATS", text: "Foie de taille normale, aux contours réguliers, sans lésion focale décelable.\nVésicule biliaire : alithiasique, à parois fines.\nReins : sans anomalie décelable." },
      { label: "CONCLUSION", text: "• Échographie abdominale sans particularité." },
    ],
  },
  {
    specialty: "Gynécologie · Échographie pelvienne",
    headline: "Gynécologues,",
    subline: "dictez, EchoScribe rédige.",
    desc: "Examen pelvien, obstétrique, suivi de grossesse — EchoScribe reconnaît le contexte et génère un compte rendu structuré en moins de 30 secondes.",
    icon: "🩺",
    badge: "Utérus · Ovaires · Obstétrique",
    color: "#f472b6",
    thumbLabel: "Gynécologie",
    thumbImg: "/thumb-gyneco.jpg",
    sample: [
      { label: "RÉSULTATS", text: "Utérus en antéversion, contours réguliers, endomètre à 8 mm d'épaisseur.\nOvaires de taille normale, sans lésion décelable.\nCul-de-sac : absence d'épanchement." },
      { label: "CONCLUSION", text: "• Échographie pelvienne sans anomalie décelable." },
    ],
  },
  {
    specialty: "Cardiologie · Échographie cardiaque",
    headline: "Cardiologues,",
    subline: "fini la saisie manuelle.",
    desc: "Doppler, ETT, ETO — EchoScribe comprend le vocabulaire cardiologique et formate votre compte rendu en temps réel, sans frappe.",
    icon: "❤️",
    badge: "ETT · Doppler · Fraction d'éjection",
    color: "#f87171",
    thumbLabel: "Cardiologie",
    thumbImg: "/thumb-cardio.jpg",
    sample: [
      { label: "RÉSULTATS", text: "VG non dilaté, fonction systolique conservée. FEVG estimée à 62%.\nPas de trouble de la cinétique segmentaire.\nValvulopathie : fuite mitrale minime grade I." },
      { label: "CONCLUSION", text: "• Fonction systolique conservée.\n• Hypertrophie concentrique modérée du VG." },
    ],
  },
  {
    specialty: "Endocrinologie · Échographie thyroïdienne",
    headline: "Échographistes,",
    subline: "votre temps vaut plus que ça.",
    desc: "Thyroïde, parathyroïdes, nodules EU-TIRADS — EchoScribe maîtrise la terminologie et génère un compte rendu conforme en 30 secondes.",
    icon: "🔬",
    badge: "Thyroïde · EU-TIRADS · Nodules",
    color: "#4ade80",
    thumbLabel: "Thyroïde",
    thumbImg: "/thumb-thyroid.jpg",
    sample: [
      { label: "RÉSULTATS", text: "Thyroïde de taille normale, échostructure homogène.\nNodule du lobe droit : isoéchogène, 9 × 6 mm, contours réguliers, sans microcalcification.\nAires cervicales : absence d'adénopathie suspecte." },
      { label: "CONCLUSION", text: "• Nodule du lobe droit classé EU-TIRADS 3.\n• Surveillance selon recommandations en vigueur." },
    ],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setFading(false);
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      padding: "70px 20px 60px",
      backgroundImage: "url('/hero-bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
    }}>
      <style>{`
        .hero-overlay {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(140deg, rgba(10,20,48,0.93) 0%, rgba(15,36,64,0.88) 40%, rgba(20,80,140,0.80) 80%, rgba(20,100,180,0.75) 100%);
        }
        .hero-inner {
          position: relative; z-index: 2;
          max-width: 1080px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
        }
        .hero-btns-row {
          display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px;
        }
        .hero-thumbs {
          display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap;
        }
        .hero-mockup-panel { display: block; }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-mockup-panel { display: none !important; }
          .hero-btns-row a { flex: 1; text-align: center; font-size: 15px !important; padding: 13px 16px !important; }
          .hero-thumbs { gap: 8px; }
          .hero-badge { font-size: 10px !important; padding: 5px 12px !important; }
          section[data-hero] { padding: 56px 16px 48px !important; }
        }
        @media (max-width: 480px) {
          .hero-thumbs button div { width: 72px !important; height: 50px !important; }
          .hero-thumbs button div img { width: 72px !important; height: 50px !important; }
        }
      `}</style>

      <div className="hero-overlay" />

      <div className="hero-inner">
        {/* LEFT — Text */}
        <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>

          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(125,211,252,0.12)", border: "1px solid rgba(125,211,252,0.3)",
            borderRadius: 999, padding: "7px 18px", fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", color: "#7dd3fc",
            letterSpacing: "0.08em", marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80", display: "inline-block" }} />
            {slide.specialty}
          </div>

          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.1, color: "#ffffff", marginBottom: 18, letterSpacing: "-0.02em" }}>
            {slide.headline}<br />
            <span style={{ background: `linear-gradient(90deg, ${slide.color}, #a5f3fc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {slide.subline}
            </span>
          </h1>

          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, color: "rgba(255,255,255,0.78)", marginBottom: 32, maxWidth: 500 }}>
            {slide.desc}
          </p>

          <div className="hero-btns-row">
            <Link href="/register" style={{
              background: "linear-gradient(135deg,#ffffff,#e8f4ff)", borderRadius: 12, color: "#0a4a8a",
              textDecoration: "none", fontSize: 16, padding: "14px 32px",
              display: "inline-block", fontWeight: 800,
              boxShadow: "0 6px 28px rgba(0,0,0,0.28)", border: "2px solid rgba(255,255,255,0.8)",
            }}>
              Démarrer gratuitement →
            </Link>
            <a href="#comment" style={{
              background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.25)",
              borderRadius: 12, color: "#ffffff", textDecoration: "none",
              fontSize: 16, padding: "14px 24px", display: "inline-block", fontWeight: 500,
            }}>
              ▶ Voir la démo
            </a>
          </div>

          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", marginBottom: 0 }}>
            7 jours gratuits · Aucune carte requise · Résiliable en un clic
          </p>

          {/* Thumbnails nav */}
          <div className="hero-thumbs">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 400); }}
                style={{ padding: 0, border: "none", cursor: "pointer", background: "transparent", outline: "none",
                  transform: i === current ? "scale(1.06)" : "scale(1)", transition: "all 0.3s ease" }}
              >
                <div style={{
                  position: "relative", borderRadius: 10, overflow: "hidden", width: 90, height: 62,
                  border: `2px solid ${i === current ? s.color : "rgba(255,255,255,0.2)"}`,
                  boxShadow: i === current ? `0 0 16px ${s.color}88` : "none",
                  opacity: i === current ? 1 : 0.45, transition: "all 0.3s ease",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.thumbImg} alt={s.thumbLabel} style={{ width: 90, height: 62, objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                    padding: "4px 5px",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                    color: i === current ? s.color : "#fff", fontWeight: 700, textAlign: "center",
                  }}>{s.thumbLabel}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Mock compte rendu (desktop only) */}
        <div className="hero-mockup-panel" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>
          <div style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 20, padding: "28px", backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>EchoScribe — Compte rendu</span>
              <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, padding: "2px 10px", color: "#4ade80", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>✓ 23s</span>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16,
              background: `rgba(${slide.color === "#38bdf8" ? "56,189,248" : slide.color === "#f472b6" ? "244,114,182" : slide.color === "#f87171" ? "248,113,113" : "74,222,128"},0.12)`,
              border: `1px solid ${slide.color}40`, borderRadius: 8, padding: "5px 12px",
            }}>
              <span style={{ fontSize: 16 }}>{slide.icon}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: slide.color, fontWeight: 600 }}>{slide.badge}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.9, color: "rgba(255,255,255,0.82)" }}>
              {slide.sample.map((s) => (
                <div key={s.label} style={{ marginBottom: 10 }}>
                  <span style={{ color: slide.color, fontWeight: 700 }}>{s.label} : </span>
                  <span style={{ whiteSpace: "pre-line" }}>{s.text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8 }}>
              <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 12px", color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>📋 Copier</span>
              <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 12px", color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>✎ Modifier</span>
              <span style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 6, padding: "4px 12px", color: "#4ade80", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>Conforme SFR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
