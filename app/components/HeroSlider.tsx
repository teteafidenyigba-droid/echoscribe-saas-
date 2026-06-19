"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    specialty: "Radiologie · Échographie abdominale",
    headline: "Radiologues,",
    subline: "votre compte rendu en 30 secondes.",
    desc: "Dictez votre échographie abdominale. EchoScribe structure automatiquement INDICATION, RÉSULTATS et CONCLUSION — conforme SFR, prêt à signer.",
    thumbLabel: "Abdominal",
    thumbImg: "/thumb-abdo.jpg",
    color: "#15627a",
    dictation: [
      { text: "Bonjour, installez-vous. Comment allez-vous ? — Bien merci. ", noise: true },
      { text: "Quels médicaments prenez-vous ? — Du paracétamol. ", noise: true },
      { text: "Allongez-vous, inspirez… ", noise: true },
      { text: "Foie de taille normale, contours réguliers, sans lésion. Vésicule alithiasique. Reins sans anomalie. ", noise: false },
      { text: "C'est terminé, vous pouvez vous rhabiller.", noise: true },
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
    headline: "Gynécologues,",
    subline: "dictez, EchoScribe rédige.",
    desc: "Examen pelvien, obstétrique, suivi de grossesse — EchoScribe reconnaît le contexte et génère un compte rendu structuré en moins de 30 secondes.",
    thumbLabel: "Gynécologie",
    thumbImg: "/thumb-gyneco.jpg",
    color: "#1c7f9e",
    dictation: [
      { text: "Comment allez-vous ? Vous avez des douleurs ? — Oui, pelviennes depuis 2 jours. ", noise: true },
      { text: "Allongez-vous s'il vous plaît. ", noise: true },
      { text: "Utérus en antéversion, contours réguliers, endomètre à 8 mm. Ovaires de taille normale, sans lésion décelable. Pas d'épanchement. ", noise: false },
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
    specialty: "Endocrinologie · Échographie thyroïdienne",
    headline: "Échographistes,",
    subline: "votre temps vaut plus que ça.",
    desc: "Thyroïde, parathyroïdes, nodules EU-TIRADS — EchoScribe maîtrise la terminologie et génère un compte rendu conforme en 30 secondes.",
    thumbLabel: "Thyroïde",
    thumbImg: "/thumb-thyroid.jpg",
    color: "#0e3c4c",
    dictation: [
      { text: "Penchez la tête en arrière, ne bougez plus. ", noise: true },
      { text: "Thyroïde de taille normale, échostructure homogène. Nodule du lobe droit isoéchogène, contours réguliers, sans microcalcification, EU-TIRADS 3. Pas d'adénopathie cervicale. ", noise: false },
      { text: "C'est bon, c'est terminé.", noise: true },
    ],
    cr: [
      { sec: "RÉSULTATS" },
      { organ: "Thyroïde", desc: "de taille normale, d'échostructure homogène." },
      { organ: "Lobe droit", desc: "nodule isoéchogène, contours réguliers, sans microcalcification." },
      { organ: "Aires cervicales", desc: "absence d'adénopathie suspecte." },
      { sec: "CONCLUSION" },
      { bullet: "Nodule du lobe droit classé EU-TIRADS 3." },
      { bullet: "Surveillance selon recommandations en vigueur." },
    ],
  },
  {
    specialty: "Vasculaire · Doppler veineux",
    headline: "Angiologues,",
    subline: "fini la saisie manuelle.",
    desc: "Doppler veineux, artériel, carotidien — EchoScribe comprend le vocabulaire vasculaire et formate votre compte rendu en temps réel.",
    thumbLabel: "Doppler",
    thumbImg: "/thumb-cardio.jpg",
    color: "#c45d4a",
    dictation: [
      { text: "Vous avez le mollet gonflé depuis quand ? — Depuis deux jours. Des médicaments ? — La pilule. ", noise: true },
      { text: "Allongez-vous et détendez la jambe. ", noise: true },
      { text: "Réseau veineux profond du membre inférieur droit perméable et compressible du carrefour fémoral à la veine poplitée. Pas de thrombose. Réseau superficiel continent. ", noise: false },
      { text: "Respirez normalement… terminé.", noise: true },
    ],
    cr: [
      { sec: "RÉSULTATS" },
      { organ: "Réseau veineux profond", desc: "perméable et compressible du carrefour fémoral à la veine poplitée, sans thrombose décelable." },
      { organ: "Réseau superficiel", desc: "continent, sans reflux significatif." },
      { sec: "CONCLUSION" },
      { bullet: "Absence de thrombose veineuse du membre inférieur droit." },
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
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  function goTo(i: number) {
    if (i === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 400);
  }

  const slide = slides[current];

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      padding: "70px 24px 60px",
      backgroundImage: "url('/hero-bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
    }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(140deg, rgba(10,20,48,0.93) 0%, rgba(15,36,64,0.88) 40%, rgba(20,80,140,0.80) 80%, rgba(20,100,180,0.75) 100%)",
      }} />
      <style>{`
        .hero-inner {
          position: relative; z-index: 2;
          max-width: 1140px; margin: 0 auto;
          display: grid; grid-template-columns: 1.05fr .95fr;
          gap: 48px; align-items: start; padding: 72px 0 60px;
          min-height: 520px;
        }
        .hero-thumbs { display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap; }
        .hero-demo-card { display: block; }
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr !important; gap: 36px !important; padding: 48px 0 44px !important; }
          .hero-demo-card { display: none !important; }
        }
        @media (max-width: 480px) {
          .hero-thumbs button > div { width: 72px !important; height: 50px !important; }
        }
        .thumb-btn { padding:0; border:none; cursor:pointer; background:transparent; outline:none; transition: transform .25s; }
        .thumb-btn:hover { transform: scale(1.05) !important; }
      `}</style>

      <div className="hero-inner">
        {/* LEFT — Slider text */}
        <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease", minHeight: 420 }}>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.25)",
            borderRadius: 999, padding: "6px 16px", fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", color: "#a8d4e0",
            letterSpacing: "0.08em", marginBottom: 26, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c45d4a", boxShadow: "0 0 8px #c45d4a", display: "inline-block" }} />
            {slide.specialty}
          </div>

          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.06, letterSpacing: "-.01em", color: "#ffffff", marginBottom: 18 }}>
            {slide.headline}<br />
            <em style={{ fontStyle: "italic", color: "#7ecfe0" }}>{slide.subline}</em>
          </h1>

          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.65, color: "rgba(255,255,255,.75)", marginBottom: 30, maxWidth: "34ch" }}>
            {slide.desc}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, marginBottom: 22 }}>
            <Link href="/register" style={{
              background: "#c45d4a", borderRadius: 11, color: "#fff",
              textDecoration: "none", fontSize: 15, padding: "13px 26px",
              fontWeight: 600, boxShadow: "0 6px 20px rgba(196,93,74,.45)",
              display: "inline-block",
            }}>
              Commencer — 7 jours gratuits
            </Link>
            <a href="#fonctionnement" style={{
              background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.25)",
              borderRadius: 11, color: "#fff", textDecoration: "none",
              fontSize: 15, padding: "13px 20px", fontWeight: 500, display: "inline-block",
            }}>
              Découvrir la spécificité
            </a>
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
            Sans engagement · Sans carte requise
          </p>

          {/* Thumbnails */}
          <div className="hero-thumbs">
            {slides.map((s, i) => (
              <button key={i} className="thumb-btn" onClick={() => goTo(i)}
                style={{ transform: i === current ? "scale(1.07)" : "scale(1)" }}>
                <div style={{
                  position: "relative", borderRadius: 10, overflow: "hidden", width: 88, height: 60,
                  border: `2px solid ${i === current ? s.color : "#dde5e7"}`,
                  boxShadow: i === current ? `0 0 14px ${s.color}55` : "none",
                  opacity: i === current ? 1 : 0.5, transition: "all .3s",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.thumbImg} alt={s.thumbLabel} style={{ width: 88, height: 60, objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,.7))",
                    padding: "4px 5px",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                    color: i === current ? "#fff" : "#ccc", fontWeight: 700, textAlign: "center",
                  }}>{s.thumbLabel}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Demo card */}
        <div className="hero-demo-card" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" }}>
          <div style={{ background: "#fff", border: "1px solid #dde5e7", borderRadius: 18, boxShadow: "0 1px 2px rgba(14,48,58,.05),0 14px 40px rgba(14,48,58,.07)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderBottom: "1px solid #dde5e7", background: "#f1f6f7" }}>
              {[1,2,3].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#d7dee0", display: "inline-block" }} />)}
              <span style={{ marginLeft: 8, fontSize: 12, color: "#5b6b71", fontWeight: 600 }}>EchoScribe — en direct</span>
              <span style={{ marginLeft: "auto", background: "rgba(21,98,122,.1)", borderRadius: 6, padding: "2px 9px", color: slide.color, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>✓ 28s</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {/* Dictation */}
              <div style={{ padding: "16px 18px", borderRight: "1px solid #dde5e7", background: "#fcfdfd" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 10 }}>① Ce que vous dictez</p>
                <p style={{ fontSize: 12.5, color: "#4a5a60", lineHeight: 1.75 }}>
                  «{" "}
                  {slide.dictation.map((seg, i) =>
                    seg.noise
                      ? <span key={i} style={{ color: "#8aa0a6", textDecoration: "line-through", textDecorationColor: "#c45d4a", opacity: .6 }}>{seg.text}</span>
                      : <span key={i}>{seg.text}</span>
                  )}
                  »
                </p>
              </div>
              {/* Compte rendu */}
              <div style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase" as const, color: "#1c7f9e", marginBottom: 10 }}>② Le compte rendu généré</p>
                <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                  {slide.cr.map((ln, i) =>
                    "sec" in ln ? (
                      <span key={i} style={{ fontWeight: 700, color: slide.color, display: "block", margin: i === 0 ? "0 0 3px" : "8px 0 3px", fontSize: 11, letterSpacing: ".02em" }}>{ln.sec}</span>
                    ) : "organ" in ln ? (
                      <div key={i} style={{ marginBottom: 2 }}>
                        <strong style={{ color: "#0e3c4c" }}>{ln.organ} :</strong>{" "}
                        <span style={{ color: "#3c4d53" }}>{ln.desc}</span>
                      </div>
                    ) : (
                      <div key={i} style={{ marginBottom: 2, color: "#3c4d53" }}>• {"bullet" in ln ? ln.bullet : ""}</div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
