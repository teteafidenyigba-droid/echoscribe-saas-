"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    specialty: "Radiologie · Échographie abdominale",
    label: "DICTÉE MÉDICALE POUR LA RADIOLOGIE",
    h1: ["Vous dictez.", "Le compte rendu s'écrit."],
    desc: "EchoScribe transforme votre voix, pendant l'examen, en compte rendu structuré conforme aux recommandations SFR / HAS — prêt à coller dans votre logiciel.",
    icon: "🫁",
    badge: "Foie · Reins · Vésicule · Rate",
    color: "#38bdf8",
    thumbLabel: "Abdominal",
    thumbImg: "/thumb-abdo.jpg",
    dictation: [
      { text: "Bonjour, comment allez-vous ? — Ça va, un peu mal au ventre. Quels médicaments prenez-vous ? — Du paracétamol et un comprimé pour la tension. Allongez-vous, inspirez… ", noise: true },
      { text: "Foie de taille normale, contours réguliers, sans lésion. Vésicule alithiasique. Reins sans anomalie. ", noise: false },
      { text: "Vous pouvez vous rhabiller, c'est terminé.", noise: true },
    ],
    cr: [
      { sec: "RÉSULTATS" },
      { organ: "Foie", desc: "de taille normale, aux contours réguliers, sans lésion focale décelable." },
      { organ: "Vésicule biliaire", desc: "alithiasique, à parois fines." },
      { organ: "Reins", desc: "sans anomalie décelable." },
      { sec: "CONCLUSION" },
      { bullet: "Échographie abdominale sans particularité." },
    ],
  },
  {
    specialty: "Gynécologie · Échographie pelvienne",
    label: "DICTÉE MÉDICALE POUR LA GYNÉCOLOGIE",
    h1: ["Vous examinez.", "Le compte rendu s'écrit."],
    desc: "EchoScribe capte votre dictée en salle, filtre les échanges patient, et génère un compte rendu pelvien structuré conforme HAS — en moins de 30 secondes.",
    icon: "🩺",
    badge: "Utérus · Ovaires · Obstétrique",
    color: "#f472b6",
    thumbLabel: "Gynécologie",
    thumbImg: "/thumb-gyneco.jpg",
    dictation: [
      { text: "Comment allez-vous ? Vous avez des douleurs ? — Oui pelviennes depuis 2 jours. Allongez-vous s'il vous plaît. ", noise: true },
      { text: "Utérus en antéversion, contours réguliers, endomètre à 8 mm. Ovaires de taille normale, sans lésion. Pas d'épanchement. ", noise: false },
      { text: "C'est terminé.", noise: true },
    ],
    cr: [
      { sec: "RÉSULTATS" },
      { organ: "Utérus", desc: "en antéversion, contours réguliers, endomètre à 8 mm d'épaisseur." },
      { organ: "Ovaires", desc: "de taille normale, sans lésion décelable." },
      { organ: "Cul-de-sac", desc: "absence d'épanchement." },
      { sec: "CONCLUSION" },
      { bullet: "Échographie pelvienne sans anomalie décelable." },
    ],
  },
  {
    specialty: "Cardiologie · Échographie cardiaque",
    label: "DICTÉE MÉDICALE POUR LA CARDIOLOGIE",
    h1: ["Vous écoutez le cœur.", "Le compte rendu s'écrit."],
    desc: "EchoScribe comprend le vocabulaire ETT / Doppler et structure votre compte rendu cardiologique en temps réel — FEVG, cinétique, valves — sans une frappe.",
    icon: "❤️",
    badge: "ETT · Doppler · Fraction d'éjection",
    color: "#f87171",
    thumbLabel: "Cardiologie",
    thumbImg: "/thumb-cardio.jpg",
    dictation: [
      { text: "Vous avez des essoufflements depuis quand ? — Depuis 3 semaines à l'effort. Installez-vous, ne bougez plus. ", noise: true },
      { text: "VG non dilaté, fonction systolique conservée, FEVG 62%. Pas de trouble de la cinétique. Fuite mitrale minime grade I. ", noise: false },
      { text: "Respirez normalement, c'est bon.", noise: true },
    ],
    cr: [
      { sec: "RÉSULTATS" },
      { organ: "VG", desc: "non dilaté, fonction systolique conservée. FEVG estimée à 62%." },
      { organ: "Cinétique", desc: "pas de trouble segmentaire." },
      { organ: "Valves", desc: "fuite mitrale minime grade I." },
      { sec: "CONCLUSION" },
      { bullet: "Fonction systolique conservée." },
      { bullet: "Hypertrophie concentrique modérée du VG." },
    ],
  },
  {
    specialty: "Endocrinologie · Échographie thyroïdienne",
    label: "DICTÉE MÉDICALE POUR L'ENDOCRINOLOGIE",
    h1: ["Vous explorez.", "Le compte rendu s'écrit."],
    desc: "Nodules, EU-TIRADS, parathyroïdes — EchoScribe maîtrise la terminologie thyroïdienne et génère un compte rendu conforme en moins de 30 secondes.",
    icon: "🔬",
    badge: "Thyroïde · EU-TIRADS · Nodules",
    color: "#4ade80",
    thumbLabel: "Thyroïde",
    thumbImg: "/thumb-thyroid.jpg",
    dictation: [
      { text: "Penchez la tête en arrière s'il vous plaît, ne bougez plus. ", noise: true },
      { text: "Thyroïde de taille normale, échostructure homogène. Nodule du lobe droit isoéchogène 9x6 mm, contours réguliers, sans microcalcification, EU-TIRADS 3. Pas d'adénopathie. ", noise: false },
      { text: "C'est bon, terminé.", noise: true },
    ],
    cr: [
      { sec: "RÉSULTATS" },
      { organ: "Thyroïde", desc: "de taille normale, d'échostructure homogène." },
      { organ: "Lobe droit", desc: "nodule isoéchogène 9 × 6 mm, contours réguliers, sans microcalcification." },
      { organ: "Aires cervicales", desc: "absence d'adénopathie suspecte." },
      { sec: "CONCLUSION" },
      { bullet: "Nodule classé EU-TIRADS 3." },
      { bullet: "Surveillance selon recommandations en vigueur." },
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
    }, 7000);
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

          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: ".16em",
            textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 20,
          }}>
            {slide.label}
          </p>

          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 800, lineHeight: 1.08, color: "#ffffff", marginBottom: 22, letterSpacing: "-0.02em" }}>
            {slide.h1[0]}<br />
            <em style={{ fontStyle: "italic", fontWeight: 800, color: slide.color }}>
              {slide.h1[1]}
            </em>
          </h1>

          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, color: "rgba(255,255,255,0.72)", marginBottom: 32, maxWidth: 460 }}>
            {slide.desc}
          </p>

          <div className="hero-btns-row">
            <Link href="/register" style={{
              background: "#c45d4a", borderRadius: 12, color: "#fff",
              textDecoration: "none", fontSize: 16, padding: "14px 32px",
              display: "inline-block", fontWeight: 700,
              boxShadow: "0 6px 24px rgba(196,93,74,0.45)", border: "none",
            }}>
              Essai gratuit 7 jours
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

        {/* RIGHT — Two-column demo card (desktop only) */}
        <div className="hero-mockup-panel" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>
          <div style={{ background: "#fff", border: "1px solid #dde5e7", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 40px rgba(10,20,48,0.18)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderBottom: "1px solid #e8eef0", background: "#f4f8fa" }}>
              {[1,2,3].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#d0dde3", display: "inline-block" }} />)}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5b7a84", fontWeight: 600, marginLeft: 8 }}>EchoScribe — en direct</span>
              <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)", borderRadius: 6, padding: "2px 10px", color: "#16a34a", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>✓ 23s</span>
            </div>
            {/* Two columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {/* Left — Dictation */}
              <div style={{ padding: "14px 16px", borderRight: "1px solid #e8eef0" }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 10 }}>① Ce que vous dictez</p>
                <p style={{ fontSize: 12, color: "#3c5a63", lineHeight: 1.75 }}>
                  «{" "}
                  {slide.dictation.map((seg, i) =>
                    seg.noise
                      ? <span key={i} style={{ color: "#a0b4bc", textDecoration: "line-through", textDecorationColor: "#e05a3a" }}>{seg.text}</span>
                      : <span key={i} style={{ color: "#14303a" }}>{seg.text}</span>
                  )}
                  »
                </p>
              </div>
              {/* Right — CR */}
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 10 }}>② Le compte rendu généré</p>
                <div style={{ fontSize: 12, lineHeight: 1.65, color: "#3c5a63" }}>
                  {slide.cr.map((ln, i) =>
                    "sec" in ln ? (
                      <div key={i} style={{ fontWeight: 700, color: "#0e3c4c", marginTop: i === 0 ? 0 : 8, marginBottom: 3, fontSize: 11 }}>{ln.sec}</div>
                    ) : "organ" in ln ? (
                      <div key={i} style={{ marginBottom: 2 }}>
                        <strong style={{ color: "#14303a" }}>{ln.organ} :</strong>{" "}{ln.desc}
                      </div>
                    ) : (
                      <div key={i} style={{ marginBottom: 2 }}>• {"bullet" in ln ? ln.bullet : ""}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #e8eef0", display: "flex", gap: 8, background: "#f9fbfc" }}>
              <span style={{ background: "#eaf0f3", borderRadius: 6, padding: "4px 12px", color: "#5b7a84", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>📋 Copier</span>
              <span style={{ background: "#eaf0f3", borderRadius: 6, padding: "4px 12px", color: "#5b7a84", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>✎ Modifier</span>
              <span style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, padding: "4px 12px", color: "#16a34a", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>Conforme SFR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
