"use client";

import { useEffect, useRef, useState } from "react";

type Seg = { text: string; noise: boolean };
type CRLine =
  | { type: "section"; text: string }
  | { type: "organ"; organ: string; desc: string }
  | { type: "bullet"; text: string };

const DICTATION: Seg[] = [
  { text: "Inspirez, bloquez… Vous avez mal ici ? — Oui un peu. Expirez. ", noise: true },
  { text: "Foie de taille normale, contours réguliers. Vésicule alithiasique. Reins sans anomalie. Pas d'épanchement. ", noise: false },
  { text: "C'est terminé, vous pouvez vous rhabiller.", noise: true },
];

const CR: CRLine[] = [
  { type: "section", text: "RÉSULTATS" },
  { type: "organ", organ: "Foie", desc: " de taille normale, aux contours réguliers, sans lésion focale." },
  { type: "organ", organ: "Vésicule", desc: " alithiasique, à parois fines." },
  { type: "organ", organ: "Reins", desc: " sans anomalie décelable bilatéralement." },
  { type: "section", text: "CONCLUSION" },
  { type: "bullet", text: "• Échographie abdominale sans particularité." },
];

const FULL = DICTATION.map((s) => s.text).join("");
const NOISE1_LEN = DICTATION[0].text.length;
const MED_LEN = DICTATION[1].text.length;
const CR_PER_LINE = MED_LEN / CR.length;

export default function DemoAnimation() {
  const [typed, setTyped] = useState(0);
  const [crCount, setCrCount] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let chars = 0;

    function tick() {
      chars++;
      setTyped(chars);

      if (chars > NOISE1_LEN) {
        const medTyped = chars - NOISE1_LEN;
        setCrCount(Math.min(CR.length, Math.ceil(medTyped / CR_PER_LINE)));
      }

      if (chars >= FULL.length) {
        setDone(true);
        timer.current = setTimeout(() => {
          chars = 0;
          setTyped(0);
          setCrCount(0);
          setDone(false);
          timer.current = setTimeout(tick, 600);
        }, 4500);
        return;
      }

      // Vitesse : plus lente pour le bruit (naturel), plus rapide pour le médical
      let pos = 0;
      let delay = 55;
      for (const seg of DICTATION) {
        if (chars <= pos + seg.text.length) { delay = seg.noise ? 72 : 48; break; }
        pos += seg.text.length;
      }
      timer.current = setTimeout(tick, delay);
    }

    timer.current = setTimeout(tick, 900);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  // Rendu de la dictée avec zones barrées
  function renderDictation() {
    const nodes: React.ReactNode[] = [];
    let pos = 0;
    DICTATION.forEach((seg, si) => {
      const visible = Math.max(0, Math.min(typed - pos, seg.text.length));
      if (visible > 0) {
        const txt = seg.text.slice(0, visible);
        nodes.push(
          seg.noise ? (
            <span key={si} style={{ color: "#a0b4bc", textDecoration: "line-through", textDecorationColor: "#e05a3a" }}>
              {txt}
            </span>
          ) : (
            <span key={si} style={{ color: "#14303a" }}>{txt}</span>
          )
        );
      }
      pos += seg.text.length;
    });
    return nodes;
  }

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #dde5e7",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(10,20,48,0.14)",
      maxWidth: 760,
      margin: "0 auto",
      fontFamily: "'EB Garamond', Georgia, serif",
    }}>
      <style>{`
        @keyframes es-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes es-fadein { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        .es-crline { animation: es-fadein 0.35s ease both; }
      `}</style>

      {/* Barre titre */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderBottom: "1px solid #e8eef0", background: "#f4f8fa" }}>
        {[0,1,2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#d0dde3", display: "inline-block" }} />
        ))}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5b7a84", fontWeight: 600, marginLeft: 8 }}>
          EchoScribe — en direct
        </span>
        <span style={{
          marginLeft: "auto",
          background: done ? "rgba(74,222,128,0.12)" : "rgba(250,200,50,0.1)",
          border: `1px solid ${done ? "rgba(74,222,128,0.35)" : "rgba(250,180,0,0.25)"}`,
          borderRadius: 6, padding: "2px 10px",
          color: done ? "#16a34a" : "#a07010",
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          transition: "all 0.5s",
        }}>
          {done ? "✓ 23s" : "⏱ en cours…"}
        </span>
      </div>

      {/* Corps deux colonnes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Gauche — dictée */}
        <div style={{ padding: "16px 18px", borderRight: "1px solid #e8eef0", minHeight: 210 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#1c7f9e", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            ① CE QUE VOUS DICTEZ
          </p>
          <p style={{ fontSize: 13.5, color: "#3c5a63", lineHeight: 1.85, margin: 0 }}>
            {"« "}
            {renderDictation()}
            {typed < FULL.length && (
              <span style={{
                display: "inline-block", width: 2, height: 13, background: "#0a5fa8",
                marginLeft: 1, verticalAlign: "middle",
                animation: "es-blink 0.75s step-end infinite",
              }} />
            )}
            {" »"}
          </p>
        </div>

        {/* Droite — compte rendu */}
        <div style={{ padding: "16px 18px", minHeight: 210 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#1c7f9e", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            ② LE COMPTE RENDU GÉNÉRÉ
          </p>
          <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "#3c5a63" }}>
            {CR.slice(0, crCount).map((ln, i) => (
              <div key={i} className="es-crline" style={{ marginBottom: ln.type === "section" ? 4 : 3, marginTop: ln.type === "section" && i > 0 ? 10 : 0 }}>
                {ln.type === "section" && (
                  <div style={{ fontWeight: 800, color: "#0e3c4c", fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
                    {ln.text}
                  </div>
                )}
                {ln.type === "organ" && (
                  <div>
                    <strong style={{ color: "#14303a" }}>{ln.organ} :</strong>
                    {ln.desc}
                  </div>
                )}
                {ln.type === "bullet" && <div>{ln.text}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid #e8eef0", display: "flex", gap: 8, background: "#f9fbfc", flexWrap: "wrap" }}>
        {[
          { label: "📋 Copier", active: false },
          { label: "✎ Modifier", active: false },
          { label: "Conforme SFR", active: true },
        ].map((b) => (
          <span key={b.label} style={{
            borderRadius: 6, padding: "4px 12px", fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            background: b.active ? "rgba(74,222,128,0.1)" : "#eaf0f3",
            border: b.active ? "1px solid rgba(74,222,128,0.3)" : "none",
            color: b.active ? "#16a34a" : "#5b7a84",
          }}>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
