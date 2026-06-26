"use client";
import { useEffect, useRef } from "react";

const EX = [
  {
    label: "Abdominal complète",
    dict: [
      { t: "Bonjour, installez-vous. Comment allez-vous ? — Ça va, une gêne du côté droit. ", noise: true },
      { t: "Quels médicaments prenez-vous ? — Du paracétamol et un comprimé pour la tension. ", noise: true },
      { t: "Allongez-vous, remontez le tee-shirt. Inspirez et bloquez… voilà. ", noise: true },
      { t: "Foie normal, contours réguliers, pas de lésion, tronc porte perméable. ", noise: false },
      { t: "Vésicule alithiasique, parois fines. Voies biliaires non dilatées. ", noise: false },
      { t: "Pancréas RAS. Rate normale. ", noise: false },
      { t: "Vous aviez bien bu un verre d'eau avant de venir ? — Oui. ", noise: true },
      { t: "Aorte de calibre normal, pas d'anévrisme. ", noise: false },
      { t: "Tournez-vous sur le côté gauche s'il vous plaît. ", noise: true },
      { t: "Rein droit : grand axe 115, index cortical 12. Rein gauche symétrique, RAS. ", noise: false },
      { t: "Pensez à refaire votre prise de sang chez votre médecin traitant. ", noise: true },
      { t: "Vessie à parois fines, contenu anéchogène. Pas d'épanchement. ", noise: false },
      { t: "C'est terminé, vous pouvez vous rhabiller.", noise: true },
    ],
    report: [
      { sec: "RÉSULTATS" },
      { organ: "Foie", desc: "de taille normale, aux contours réguliers, d'échostructure homogène, sans lésion focale décelable ; tronc porte perméable." },
      { organ: "Vésicule biliaire", desc: "alithiasique, à parois fines." },
      { organ: "Voies biliaires", desc: "non dilatées." },
      { organ: "Pancréas", desc: "d'échostructure homogène, sans dilatation du canal de Wirsung." },
      { organ: "Rate", desc: "de taille normale, homogène." },
      { organ: "Aorte abdominale", desc: "de calibre normal, sans anévrisme." },
      { organ: "Reins", desc: "rein droit de taille normale (grand axe 115 mm), à index cortical conservé (12 mm) ; rein gauche de morphologie symétrique. Pas de dilatation pyélocalicielle ni de lithiase décelable." },
      { organ: "Vessie", desc: "à parois fines, à contenu anéchogène." },
      { organ: "Cavité péritonéale", desc: "absence d'épanchement." },
      { sec: "CONCLUSION" },
      { bullet: "Échographie abdominale complète sans anomalie décelable." },
      { legal: "Compte rendu généré avec assistance et validé par le médecin signataire." },
    ],
  },
  {
    label: "Thyroïde",
    dict: [
      { t: "Bonjour, asseyez-vous. Comment ça va ? — Bien, merci. ", noise: true },
      { t: "Vous prenez un traitement pour la thyroïde ? — Oui, un comprimé chaque matin. ", noise: true },
      { t: "Penchez un peu la tête en arrière. Ne bougez plus, j'enregistre. ", noise: true },
      { t: "Thyroïde normale, homogène. Nodule lobe droit, isoéchogène, contours réguliers, pas de microcalcification, EU-TIRADS 3. Pas d'adénopathie suspecte. ", noise: false },
      { t: "C'est bon, c'est terminé.", noise: true },
    ],
    report: [
      { sec: "RÉSULTATS" },
      { organ: "Thyroïde", desc: "de taille normale, d'échostructure homogène." },
      { organ: "Lobe droit", desc: "nodule isoéchogène, à contours réguliers, sans microcalcification." },
      { organ: "Aires cervicales", desc: "absence d'adénopathie d'allure suspecte." },
      { sec: "CONCLUSION" },
      { bullet: "Nodule du lobe droit thyroïdien classé EU-TIRADS 3." },
      { bullet: "Surveillance selon les recommandations en vigueur." },
      { legal: "Compte rendu généré avec assistance et validé par le médecin signataire." },
    ],
  },
  {
    label: "Doppler veineux",
    dict: [
      { t: "Bonjour, installez-vous. Comment allez-vous ? — Ça va, le mollet gonflé depuis deux jours. ", noise: true },
      { t: "Des médicaments en ce moment ? — Juste la pilule. ", noise: true },
      { t: "Allongez-vous et détendez la jambe. ", noise: true },
      { t: "Réseau profond du membre inférieur droit perméable et compressible, du carrefour fémoral à la poplitée. Pas de thrombose. Réseau superficiel continent. ", noise: false },
      { t: "Respirez normalement… terminé.", noise: true },
    ],
    report: [
      { sec: "RÉSULTATS" },
      { organ: "Réseau veineux profond", desc: "perméable et compressible du carrefour fémoral à la veine poplitée, sans thrombose décelable." },
      { organ: "Réseau veineux superficiel", desc: "continent, sans reflux significatif." },
      { sec: "CONCLUSION" },
      { bullet: "Absence de thrombose veineuse du membre inférieur droit." },
      { legal: "Compte rendu généré avec assistance et validé par le médecin signataire." },
    ],
  },
];

export default function DemoAnimation() {
  const curExRef = useRef(0);
  const tokenRef = useRef(0);
  const startedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dictEl = document.getElementById("es-dictOut");
    const crEl = document.getElementById("es-crOut");
    const titleEl = document.getElementById("es-cbarTitle");
    const noteEl = document.getElementById("es-lnote");
    const replayBtn = document.getElementById("es-replayBtn") as HTMLButtonElement | null;
    const tabsEl = document.getElementById("es-ltabs");

    if (!dictEl || !crEl || !titleEl || !noteEl || !replayBtn || !tabsEl) return;

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    function guard(my: number) { if (my !== tokenRef.current) throw "cancel"; }

    async function typeInto(el: HTMLElement, text: string, my: number, sp: number) {
      if (reduced) { el.textContent += text; return; }
      for (let i = 0; i < text.length; i++) {
        guard(my);
        el.textContent += text[i];
        if (text[i] !== " ") await sleep(sp);
      }
    }

    function addCursor(el: HTMLElement) {
      const c = document.createElement("span");
      c.className = "es-cur";
      el.appendChild(c);
      return c;
    }

    async function play() {
      const my = ++tokenRef.current;
      startedRef.current = true;
      const ex = EX[curExRef.current];
      dictEl.innerHTML = ""; crEl.innerHTML = "";
      replayBtn.disabled = true; noteEl.textContent = "";
      titleEl.textContent = "EchoScribe — écoute…";

      const spans = ex.dict.map((seg) => {
        const s = document.createElement("span");
        if (seg.noise) s.className = "es-noise";
        dictEl.appendChild(s);
        return s;
      });
      const c = addCursor(dictEl);

      try {
        for (let i = 0; i < ex.dict.length; i++) {
          await typeInto(spans[i], ex.dict[i].t, my, 6);
        }
        c.remove(); guard(my);

        await sleep(reduced ? 0 : 520); guard(my);
        titleEl.textContent = "EchoScribe — filtrage du bruit";
        spans.forEach((s, i) => { if (ex.dict[i].noise) s.classList.add("es-struck"); });

        await sleep(reduced ? 0 : 900); guard(my);
        titleEl.textContent = "EchoScribe — génération…";
        crEl.innerHTML = '<span class="es-genbadge"><span class="es-sp"></span> Rédaction du compte rendu…</span>';
        await sleep(reduced ? 0 : 850); guard(my);
        crEl.innerHTML = "";

        for (const ln of ex.report) {
          guard(my);
          if ("sec" in ln) {
            const e = document.createElement("span");
            e.className = "es-sec"; e.textContent = ln.sec as string;
            crEl.appendChild(e); await sleep(reduced ? 0 : 120);
          } else if ("organ" in ln) {
            const d = document.createElement("div"); d.className = "es-ln";
            const b = document.createElement("b"); b.textContent = ln.organ + " : ";
            const sp = document.createElement("span");
            d.appendChild(b); d.appendChild(sp); crEl.appendChild(d);
            await typeInto(sp, ln.desc as string, my, 8);
          } else if ("bullet" in ln) {
            const d = document.createElement("div"); d.className = "es-ln";
            d.appendChild(document.createTextNode("• "));
            const sp = document.createElement("span");
            d.appendChild(sp); crEl.appendChild(d);
            await typeInto(sp, ln.bullet as string, my, 8);
          } else if ("legal" in ln) {
            const e = document.createElement("span");
            e.className = "es-legal"; e.textContent = ln.legal as string;
            crEl.appendChild(e);
          }
        }

        titleEl.textContent = "EchoScribe — compte rendu prêt";
        noteEl.textContent = "Bavardage, traitements et consignes filtrés ; les dictées abrégées sont développées en phrases complètes, et seules les valeurs dictées (115 mm, 12 mm) sont conservées.";
      } catch (_) { /* annulé */ }
      finally { if (my === tokenRef.current) replayBtn.disabled = false; }
    }

    // Build tabs
    tabsEl.innerHTML = "";
    EX.forEach((ex, i) => {
      const b = document.createElement("button");
      b.className = "es-ltab" + (i === 0 ? " es-on" : "");
      b.textContent = ex.label;
      b.onclick = () => {
        if (curExRef.current === i && startedRef.current) return;
        curExRef.current = i;
        [...tabsEl.children].forEach((c) => c.classList.remove("es-on"));
        b.classList.add("es-on");
        play();
      };
      tabsEl.appendChild(b);
    });

    replayBtn.onclick = () => play();

    // Autoplay when visible
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !startedRef.current) { play(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    if (containerRef.current) io.observe(containerRef.current);

    return () => { io.disconnect(); tokenRef.current++; };
  }, []);

  return (
    <>
      <style>{`
        .es-ltab{border:1px solid #dde5e7;background:#fff;border-radius:999px;padding:9px 17px;font-size:14px;font-weight:600;color:#3a4c52;cursor:pointer;transition:.15s;font-family:inherit}
        .es-ltab.es-on{background:#15627a;border-color:#15627a;color:#fff}
        .es-ltab:hover:not(.es-on){border-color:#15627a;color:#15627a}
        .es-noise{color:#8aa0a6;transition:color .5s,opacity .5s}
        .es-noise.es-struck{text-decoration:line-through;text-decoration-color:#c45d4a;text-decoration-thickness:2px;opacity:.5}
        .es-cur{display:inline-block;width:2px;height:1.02em;background:#15627a;vertical-align:-2px;margin-left:1px;animation:es-blink 1s step-end infinite}
        @keyframes es-blink{50%{opacity:0}}
        @keyframes es-spin{to{transform:rotate(360deg)}}
        .es-sec{font-weight:700;color:#15627a;display:block;margin:11px 0 3px;font-size:12px;letter-spacing:.03em}
        .es-sec:first-child{margin-top:0}
        .es-ln{margin:1px 0}
        .es-ln b{color:#0e3c4c}
        .es-legal{display:block;margin-top:12px;padding-top:9px;border-top:1px dashed #dde5e7;font-size:11.5px;color:#5b6b71;font-style:italic}
        .es-genbadge{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#c45d4a;font-weight:600}
        .es-sp{width:13px;height:13px;border:2px solid #e8cabf;border-top-color:#c45d4a;border-radius:50%;animation:es-spin .8s linear infinite;display:inline-block}
        @media(prefers-reduced-motion:reduce){.es-cur{animation:none}.es-sp{animation:none}}
      `}</style>

      <div ref={containerRef}>
        {/* Tabs */}
        <div id="es-ltabs" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }} />

        {/* Console */}
        <div style={{ background: "#fff", border: "1px solid #dde5e7", borderRadius: 18, boxShadow: "0 1px 2px rgba(14,48,58,.05),0 14px 40px rgba(14,48,58,.07)", overflow: "hidden" }}>
          {/* Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderBottom: "1px solid #dde5e7", background: "#f1f6f7" }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#d7dee0", display: "inline-block" }} />)}
            <span id="es-cbarTitle" style={{ marginLeft: 8, fontSize: 12.5, color: "#5b6b71", fontWeight: 600 }}>EchoScribe — prêt</span>
          </div>

          {/* Panes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: 20, borderRight: "1px solid #dde5e7", background: "#fcfdfd" }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#1c7f9e", marginBottom: 12 }}>① Ce que vous dictez</h4>
              <div id="es-dictOut" style={{ fontSize: 14.5, lineHeight: 1.8, color: "#43545b", minHeight: 172 }} />
            </div>
            <div style={{ padding: 20 }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "#1c7f9e", marginBottom: 12 }}>② Le compte rendu EchoScribe</h4>
              <div id="es-crOut" style={{ fontSize: 14, lineHeight: 1.6, minHeight: 172 }} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
          <button id="es-replayBtn" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #dde5e7", background: "#fff", borderRadius: 11, padding: "11px 18px", fontWeight: 600, fontSize: 14, color: "#14303a", cursor: "pointer", fontFamily: "inherit" }}>
            ▷&nbsp; Rejouer
          </button>
          <span id="es-lnote" style={{ fontSize: 13.5, color: "#5b6b71" }}>
            Anamnèse, traitements, échanges avec le patient, consignes : tout le non-échographique est filtré.
          </span>
        </div>
      </div>
    </>
  );
}
