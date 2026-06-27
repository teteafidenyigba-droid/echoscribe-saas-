"use client";
import { useState } from "react";

const FAQS = [
  { q: "Est-ce que mes données restent chez moi ?", a: "Oui, totalement. L'audio est traité dans votre navigateur et n'est jamais transmis. Effacement automatique après 12h. Secret médical garanti." },
  { q: "Est-ce que ça marche avec mon logiciel métier ?", a: "Oui. Doctolib, HelloDoc, WEDA, Medistory, Axisante, Word… il suffit de copier-coller. La mise en page est conservée." },
  { q: "C'est certifié dispositif médical ?", a: "C'est un outil d'aide à la rédaction. Le compte rendu doit être relu et signé par le médecin. EchoScribe assiste — il ne remplace pas votre jugement clinique." },
  { q: "Je peux arrêter quand je veux ?", a: "Oui, sans engagement ni pénalité. Un clic dans votre espace facturation. Vous gardez l'accès jusqu'à la fin de la période payée." },
  { q: "L'essai gratuit, c'est vraiment gratuit ?", a: "7 jours offerts, sans engagement. Aucun prélèvement automatique. À la fin, vous choisissez ou vous partez — sans friction." },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ background: "#eaf4fb", padding: "64px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0a5fa8", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f2440" }}>Questions fréquentes</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                border: "1px solid #c8ddef",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(10,95,168,0.07)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 26px", background: "none", border: "none", cursor: "pointer",
                  textAlign: "left", gap: 16,
                }}
              >
                <span style={{ fontSize: 16, color: "#0d2540", fontWeight: 700 }}>{item.q}</span>
                <span style={{
                  fontSize: 22, color: "#0a5fa8", fontWeight: 300, flexShrink: 0,
                  transition: "transform .2s", display: "inline-block",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 26px 20px", fontSize: 15, lineHeight: 1.8, color: "#2a5070" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
