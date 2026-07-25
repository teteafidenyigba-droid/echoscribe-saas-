"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  cold:          { label: "À contacter",  color: "#94a3b8" },
  contacted:     { label: "Contacté",     color: "#f59e0b" },
  replied:       { label: "A répondu",    color: "#3b82f6" },
  demo:          { label: "Démo",         color: "#8b5cf6" },
  trial:         { label: "Essai",        color: "#06b6d4" },
  converted:     { label: "Converti ✓",  color: "#22c55e" },
  unsubscribed:  { label: "Désabonné",   color: "#ef4444" },
  invalid:       { label: "Invalide",    color: "#e11d48" },
};

type Prospect = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  specialty: string | null;
  phone: string | null;
  city: string | null;
  postal_code: string | null;
  status: string;
  notes: string | null;
  last_contacted_at: string | null;
  created_at: string;
};

const DEFAULT_SUBJECT = "EchoScribe — dictée médicale en compte rendu structuré en 30 secondes";
const DEFAULT_BODY = `En tant que médecin échographiste libéral, vous rédigez probablement plusieurs comptes rendus par jour.

EchoScribe transforme votre dictée vocale en compte rendu d'échographie structuré en moins de 30 secondes, conforme aux standards de la SFR.

✓ Essai gratuit 7 jours — sans carte bancaire
✓ Compatible tous navigateurs
✓ Données hébergées en France

Cliquez ci-dessous pour découvrir EchoScribe gratuitement.`;

export default function ProspectsClient({ adminEmail }: { adminEmail: string }) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ first_name: "", last_name: "", email: "", specialty: "", city: "", postal_code: "", phone: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Campaign modal
  const [showCampaign, setShowCampaign] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState(DEFAULT_SUBJECT);
  const [campaignBody, setCampaignBody] = useState(DEFAULT_BODY);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState<{ sent: number; skipped: number; errors: number } | null>(null);

  // Import CSV generic
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Import RPPS ANS (.txt)
  const [rppsLoading, setRppsLoading] = useState(false);
  const [rppsProgress, setRppsProgress] = useState("");
  const rppsRef = useRef<HTMLInputElement>(null);
  const [clearLoading, setClearLoading] = useState(false);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), status: statusFilter, search });
    const res = await fetch(`/api/admin/prospects?${params}`);
    const json = await res.json();
    setProspects(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => { fetchProspects(); }, [fetchProspects]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === prospects.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(prospects.map(p => p.id)));
    }
  };

  const updateStatus = async (ids: string[], status: string) => {
    await fetch("/api/admin/prospects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status }),
    });
    fetchProspects();
    setSelected(new Set());
  };

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.size} prospect(s) ?`)) return;
    await fetch("/api/admin/prospects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected] }),
    });
    fetchProspects();
    setSelected(new Set());
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    const res = await fetch("/api/admin/prospects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    const json = await res.json();
    setAddLoading(false);
    if (!res.ok) { setAddError(json.error || "Erreur"); return; }
    setShowAdd(false);
    setAddForm({ first_name: "", last_name: "", email: "", specialty: "", city: "", postal_code: "", phone: "" });
    fetchProspects();
  };

  const handleCampaign = async () => {
    setCampaignLoading(true);
    setCampaignResult(null);
    const ids = selected.size > 0 ? [...selected] : prospects.map(p => p.id);
    const res = await fetch("/api/admin/campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, subject: campaignSubject, body: campaignBody }),
    });
    const json = await res.json();
    setCampaignLoading(false);
    setCampaignResult(json);
    if (!json.error) fetchProspects();
  };

  const handleClearAll = async () => {
    if (!window.confirm(`Supprimer les ${total.toLocaleString("fr-FR")} prospects ? Cette action est irréversible.`)) return;
    setClearLoading(true);
    const res = await fetch("/api/admin/prospects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deleteAll: true }) });
    setClearLoading(false);
    if (res.ok) { setRppsProgress(""); fetchProspects(); }
  };

  const handleImportRPPS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRppsLoading(true);
    setRppsProgress("Lecture du fichier…");

    try {
      console.log("[RPPS-v3] fichier:", file.name, "taille:", file.size);
      // Lire les 4 premiers Ko pour détecter l'entête (sans charger 774 Mo)
      const headerRaw = await file.slice(0, 4096).text();
      const headerClean = headerRaw.replace(/^﻿/, "");
      const headerLines = headerClean.split(/\r\n|\r|\n/);
      const firstLine = headerLines.find(l => l.trim().length > 0) || "";

      // Si l'entête est vide : afficher aperçu hexadécimal pour diagnostic
      if (firstLine.length === 0) {
        const preview = Array.from(headerClean.slice(0, 80)).map(c => {
          const code = c.charCodeAt(0);
          return code < 32 || code > 126 ? `[${code.toString(16)}]` : c;
        }).join("");
        setRppsProgress(`✗ Entête vide — aperçu: ${preview || "(fichier vide)"}`);
        setRppsLoading(false);
        if (rppsRef.current) rppsRef.current.value = "";
        return;
      }

      const countPipe = (firstLine.match(/\|/g) || []).length;
      const countSemi = (firstLine.match(/;/g) || []).length;
      const countTab  = (firstLine.match(/\t/g) || []).length;
      const maxCount  = Math.max(countPipe, countSemi, countTab);
      const sep = maxCount === 0 ? "|"
                : countPipe >= countSemi && countPipe >= countTab ? "|"
                : countSemi >= countTab ? ";" : "\t";

      // Normalise : retire accents (̀-ͯ), lowercase, underscore/tiret → espace
      const normalize = (s: string) =>
        s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[_-]/g, " ");

      const header = firstLine.split(sep).map(h => normalize(h.trim().replace(/"/g, "")));

      // norm utilisé pour les valeurs de cellules (filtre médecin/libéral)
      const norm = (s: string) => normalize(s);

      const col = (candidates: string[]): number => {
        // Exact match first to avoid "type identifiant pp" matching "identifiant pp"
        for (const c of candidates) {
          const n = normalize(c);
          const idx = header.findIndex(h => h === n);
          if (idx !== -1) return idx;
        }
        // Fallback: partial match
        for (const c of candidates) {
          const n = normalize(c);
          const idx = header.findIndex(h => h.includes(n));
          if (idx !== -1) return idx;
        }
        return -1;
      };

      // Indices hardcodés validés sur le fichier ANS ps-libreacces-personne-activite.txt
      // (56 colonnes, séparateur |)
      // Fallback dynamique si le fichier a une structure différente
      const iRPPS     = col(["identifiant pp"]) !== -1 ? col(["identifiant pp"]) : 1;
      const iNom      = col(["nom d exercice", "nom"]) !== -1 ? col(["nom d exercice", "nom"]) : 7;
      const iPrenom   = col(["prenom d exercice", "prenom"]) !== -1 ? col(["prenom d exercice", "prenom"]) : 8;
      const iProfCode = col(["code profession"]) !== -1 ? col(["code profession"]) : 9;
      const iSpecLib  = col(["libelle savoir faire"]) !== -1 ? col(["libelle savoir faire"]) : 16;
      const iModeCode = col(["code mode exercice"]) !== -1 ? col(["code mode exercice"]) : 17;
      const iModeLib  = col(["libelle mode exercice"]) !== -1 ? col(["libelle mode exercice"]) : 18;
      const iCP       = col(["code postal (coord. structure)", "code postal"]) !== -1 ? col(["code postal (coord. structure)", "code postal"]) : 35;
      const iVille    = col(["libelle commune (coord. structure)", "libelle commune"]) !== -1 ? col(["libelle commune (coord. structure)", "libelle commune"]) : 37;
      const iEmail    = col(["adresse e mail (coord. structure)", "adresse e mail", "email"]) !== -1 ? col(["adresse e mail (coord. structure)", "adresse e mail", "email"]) : 43;

      const rawCols20 = firstLine.split(sep).slice(0, 20).map(h => h.trim().replace(/"/g, "").slice(0, 30)).join(" · ");

      // Spécialités cibles EchoScribe : radiologie, gynéco, cardio, imagerie
      const TARGET_SPECS = ["radiodiag", "radiolog", "imagerie", "gynecolog", "cardiol", "echograph"];

      const BATCH = 1000; // batches plus grands pour réduire le nb d'appels API
      const rows: Record<string, string>[] = [];
      let scanned = 0;
      let lineNum = 0; // 1 = entête, 2+ = données

      setRppsProgress("Analyse en cours…");

      // Lecture par blocs de 1 Mo — évite le OOM sur 774 Mo avec file.text()
      const CHUNK = 1024 * 1024;
      const decoder = new TextDecoder("utf-8");
      let offset = 0;
      let leftover = "";
      let bomStripped = false;

      const processLine = (line: string) => {
        if (!line.trim()) return;
        lineNum++;
        if (lineNum === 1) return; // skip header
        scanned++;

        const cells = line.split(sep);

        // Filtre médecin : code profession = 10
        if (cells[iProfCode]?.trim() !== "10") return;

        // Filtre libéral : Code mode exercice = L
        const modeCode = cells[iModeCode]?.trim().toUpperCase() ?? "";
        const modeLib  = norm(cells[iModeLib]?.trim() ?? "");
        if (modeCode !== "L" && !modeLib.startsWith("lib")) return;

        // Filtre spécialité : on n'importe que les médecins avec une spécialité cible connue
        const spec = norm(cells[iSpecLib]?.trim() ?? "");
        if (!spec || !TARGET_SPECS.some(s => spec.includes(s))) return;

        rows.push({
          first_name:  cells[iPrenom]?.trim() || "",
          last_name:   cells[iNom]?.trim() || "",
          specialty:   cells[iSpecLib]?.trim() || "",
          city:        cells[iVille]?.trim() || "",
          postal_code: cells[iCP]?.trim() || "",
          rpps_number: cells[iRPPS]?.trim() || "",
          email:       cells[iEmail]?.trim().toLowerCase() || "",
        });
      };

      while (offset < file.size) {
        const blob = file.slice(offset, offset + CHUNK);
        const buf = await blob.arrayBuffer();
        let chunk = decoder.decode(new Uint8Array(buf), { stream: offset + CHUNK < file.size });

        if (!bomStripped) {
          chunk = chunk.replace(/^﻿/, "");
          bomStripped = true;
        }

        leftover += chunk;
        const lines = leftover.split(/\r\n|\r|\n/);
        leftover = lines.pop() || "";

        for (const line of lines) processLine(line);

        if (rows.length % 500 === 0 && rows.length > 0) {
          setRppsProgress(`${rows.length} médecins libéraux trouvés (${Math.round(offset / file.size * 100)} %)…`);
          await new Promise(r => setTimeout(r, 0));
        }
        offset += CHUNK;
      }
      if (leftover.trim()) processLine(leftover);

      if (rows.length === 0) {
        setRppsProgress(`✗ 0 résultat | scanned=${scanned} lignes | prof=${iProfCode} mode=${iModeCode} | Cols: ${rawCols20}`);
        setRppsLoading(false);
        if (rppsRef.current) rppsRef.current.value = "";
        return;
      }

      // Dédupliquer par RPPS en gardant la ligne la plus complète (ville, email, spécialité)
      const score = (r: Record<string, string>) =>
        [r.city, r.postal_code, r.email, r.specialty].filter(Boolean).length;
      const byRpps = new Map<string, Record<string, string>>();
      const noRpps: Record<string, string>[] = [];
      for (const r of rows) {
        if (!r.rpps_number) { noRpps.push(r); continue; }
        const existing = byRpps.get(r.rpps_number);
        if (!existing || score(r) > score(existing)) byRpps.set(r.rpps_number, r);
      }
      const uniqueRows = [...byRpps.values(), ...noRpps];

      setRppsProgress(`${uniqueRows.length} médecins uniques trouvés — import en cours…`);

      let inserted = 0;
      for (let b = 0; b < uniqueRows.length; b += BATCH) {
        const res = await fetch("/api/admin/prospects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: uniqueRows.slice(b, b + BATCH) }),
        });
        const json = await res.json();
        if (!res.ok || json.error) {
          setRppsProgress(`✗ Erreur API batch ${Math.floor(b/BATCH)+1} : ${json.error || res.status}`);
          setRppsLoading(false);
          if (rppsRef.current) rppsRef.current.value = "";
          return;
        }
        inserted += json.inserted ?? 0;
        setRppsProgress(`Import : ${inserted}/${uniqueRows.length}…`);
      }

      setRppsProgress(`✓ ${inserted} médecins libéraux importés`);
      fetchProspects();
    } catch (err) {
      setRppsProgress(`✗ Erreur : ${err instanceof Error ? err.message : String(err)}`);
    }

    setRppsLoading(false);
    if (rppsRef.current) rppsRef.current.value = "";
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    setImportResult("");
    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, "").toLowerCase());
    const rows = lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim().replace(/"/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ""; });
      return row;
    }).filter(r => r.last_name || r.nom);

    // Normalize column names
    const normalized = rows.map(r => ({
      first_name: r.first_name || r.prénom || r.prenom || r["prénom d'exercice"] || "",
      last_name: r.last_name || r.nom || r["nom d'exercice"] || "",
      email: r.email || r.mail || r.courriel || "",
      specialty: r.specialty || r.spécialité || r.specialite || "",
      city: r.city || r.ville || r.commune || "",
      postal_code: r.postal_code || r.cp || r["code postal"] || "",
      phone: r.phone || r.téléphone || r.telephone || "",
      rpps_number: r.rpps_number || r.rpps || r["identifiant rpps"] || "",
    }));

    const res = await fetch("/api/admin/prospects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: normalized }),
    });
    const json = await res.json();
    setImportLoading(false);
    if (res.ok) {
      setImportResult(`✓ ${json.inserted} prospect(s) importé(s)`);
      fetchProspects();
    } else {
      setImportResult(`✗ ${json.error}`);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const stats = {
    total,
    withEmail: prospects.filter(p => p.email).length,
    converted: prospects.filter(p => p.status === "converted").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f5fb", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        .pr-btn { cursor: pointer; border: none; border-radius: 8px; font-family: inherit; font-size: 12px; font-weight: 600; padding: 7px 14px; transition: opacity .15s; }
        .pr-btn:hover { opacity: .85; }
        .pr-btn-primary { background: #0a66c2; color: #fff; }
        .pr-btn-ghost { background: transparent; color: #0a5fa8; border: 1.5px solid #c8ddef; }
        .pr-btn-danger { background: #ef4444; color: #fff; }
        .pr-btn-green { background: #22c55e; color: #fff; }
        .pr-input { border: 1.5px solid #dce6f0; border-radius: 8px; padding: 9px 12px; font-size: 13px; font-family: inherit; color: #0d2540; width: 100%; background: #fff; }
        .pr-input:focus { outline: none; border-color: #0a66c2; box-shadow: 0 0 0 3px rgba(10,102,194,.1); }
        .pr-row:hover { background: #f0f8ff; }
        .pr-row td { padding: 10px 14px; font-size: 13px; color: #0d2540; border-bottom: 1px solid #e8f0f8; }
        .pr-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .pr-modal { background: #fff; border-radius: 16px; width: 100%; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
      `}</style>

      {/* Top bar */}
      <div style={{ background: "rgba(234,244,251,.97)", borderBottom: "1px solid #c8ddef", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/app" style={{ textDecoration: "none", color: "#0d2540", fontSize: 18, fontFamily: "'EB Garamond', serif", fontWeight: 600 }}>
            ← EchoScribe
          </Link>
          <span style={{ fontSize: 11, background: "#0a66c2", color: "#fff", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>ADMIN</span>
          <span style={{ fontSize: 13, color: "#4a6a8a", fontWeight: 600 }}>Prospection</span>
        </div>
        <span style={{ fontSize: 11, color: "#7a8a9a", fontFamily: "monospace" }}>{adminEmail}</span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total prospects", value: total },
            { label: "Avec email", value: prospects.filter(p => p.email).length + (total > prospects.length ? "+" : "") },
            { label: "Convertis", value: prospects.filter(p => p.status === "converted").length },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #dce8f5", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#0d2540", fontFamily: "'EB Garamond', serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#7a8a9a", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions bar */}
        <div style={{ background: "#fff", border: "1px solid #dce8f5", borderRadius: 12, padding: "16px 20px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>

          {/* Search */}
          <input
            className="pr-input"
            style={{ maxWidth: 220 }}
            placeholder="Rechercher…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />

          {/* Status filter */}
          <select
            className="pr-input"
            style={{ maxWidth: 160 }}
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <div style={{ flex: 1 }} />

          {/* Vider la liste */}
          {total > 0 && (
            <button className="pr-btn pr-btn-ghost" style={{ color: "#ef4444", borderColor: "#fca5a5" }} onClick={handleClearAll} disabled={clearLoading}>
              {clearLoading ? "Suppression…" : "🗑 Vider la liste"}
            </button>
          )}

          {/* Import RPPS ANS */}
          <label style={{ cursor: "pointer" }}>
            <span className="pr-btn pr-btn-ghost" style={{ display: "inline-block", background: rppsLoading ? "#f0f5fb" : undefined }}>
              {rppsLoading ? "Traitement…" : "↑ Import RPPS ANS (.txt)"}
            </span>
            <input ref={rppsRef} type="file" accept=".txt" style={{ display: "none" }} disabled={rppsLoading} onChange={handleImportRPPS} />
          </label>
          {rppsProgress && (
            <span style={{ fontSize: 12, color: rppsProgress.startsWith("✓") ? "#22c55e" : rppsProgress.startsWith("✗") ? "#ef4444" : "#0a66c2" }}>
              {rppsProgress}
            </span>
          )}

          {/* Import CSV générique */}
          <label style={{ cursor: "pointer" }}>
            <span className="pr-btn pr-btn-ghost" style={{ display: "inline-block" }}>
              {importLoading ? "Import…" : "↑ Import CSV"}
            </span>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleImportCSV} />
          </label>
          {importResult && <span style={{ fontSize: 12, color: importResult.startsWith("✓") ? "#22c55e" : "#ef4444" }}>{importResult}</span>}

          {/* Add single */}
          <button className="pr-btn pr-btn-ghost" onClick={() => setShowAdd(true)}>+ Ajouter</button>

          {/* Campaign */}
          <button className="pr-btn pr-btn-primary" onClick={() => { setCampaignResult(null); setShowCampaign(true); }}>
            ✉ Campagne {selected.size > 0 ? `(${selected.size})` : `(${total})`}
          </button>
        </div>

        {/* Bulk actions when selection */}
        {selected.size > 0 && (
          <div style={{ background: "#e8f4ff", border: "1px solid #0a66c2", borderRadius: 10, padding: "10px 16px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#0d2540", fontWeight: 600 }}>{selected.size} sélectionné(s)</span>
            <button className="pr-btn pr-btn-ghost" onClick={() => updateStatus([...selected], "contacted")}>→ Contacté</button>
            <button className="pr-btn pr-btn-ghost" onClick={() => updateStatus([...selected], "converted")}>→ Converti</button>
            <button className="pr-btn pr-btn-ghost" onClick={() => updateStatus([...selected], "unsubscribed")}>→ Désabonné</button>
            <button className="pr-btn pr-btn-danger" onClick={deleteSelected}>Supprimer</button>
            <button className="pr-btn pr-btn-ghost" onClick={() => setSelected(new Set())}>Annuler</button>
          </div>
        )}

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #dce8f5", borderRadius: 12, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#7a8a9a", fontSize: 14 }}>Chargement…</div>
          ) : prospects.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#7a8a9a" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#0d2540", marginBottom: 8 }}>Aucun prospect</div>
              <div style={{ fontSize: 13 }}>Importez un CSV RPPS ou ajoutez des prospects manuellement</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fbff", borderBottom: "2px solid #dce8f5" }}>
                    <th style={{ padding: "10px 14px", width: 36 }}>
                      <input type="checkbox" checked={selected.size === prospects.length && prospects.length > 0} onChange={toggleAll} />
                    </th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Nom</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Spécialité</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Ville</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Statut</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dernier contact</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map(p => (
                    <tr key={p.id} className="pr-row" style={{ cursor: "pointer" }}>
                      <td onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.first_name} {p.last_name}</td>
                      <td style={{ color: p.email ? "#0a66c2" : "#aab8cc" }}>{p.email || "—"}</td>
                      <td style={{ color: "#4a6a8a" }}>{p.specialty || "—"}</td>
                      <td style={{ color: "#4a6a8a" }}>{p.city || "—"}{p.postal_code ? ` (${p.postal_code.slice(0, 2)})` : ""}</td>
                      <td>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background: `${STATUS_LABELS[p.status]?.color}22`,
                          color: STATUS_LABELS[p.status]?.color ?? "#94a3b8",
                        }}>
                          {STATUS_LABELS[p.status]?.label ?? p.status}
                        </span>
                      </td>
                      <td style={{ color: "#7a8a9a", fontSize: 12 }}>
                        {p.last_contacted_at
                          ? new Date(p.last_contacted_at).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 50 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "16px", borderTop: "1px solid #dce8f5" }}>
              <button className="pr-btn pr-btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Précédent</button>
              <span style={{ fontSize: 13, color: "#4a6a8a", padding: "7px 12px" }}>Page {page} / {Math.ceil(total / 50)}</span>
              <button className="pr-btn pr-btn-ghost" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)}>Suivant →</button>
            </div>
          )}
        </div>
      </div>

      {/* Add prospect modal */}
      {showAdd && (
        <div className="pr-modal-bg" onClick={() => setShowAdd(false)}>
          <div className="pr-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, color: "#0d2540", marginBottom: 20 }}>Ajouter un prospect</h3>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input className="pr-input" required placeholder="Prénom *" value={addForm.first_name} onChange={e => setAddForm(f => ({ ...f, first_name: e.target.value }))} />
                <input className="pr-input" required placeholder="Nom *" value={addForm.last_name} onChange={e => setAddForm(f => ({ ...f, last_name: e.target.value }))} />
              </div>
              <input className="pr-input" type="email" placeholder="Email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
              <input className="pr-input" placeholder="Spécialité (ex: Radiodiagnostic)" value={addForm.specialty} onChange={e => setAddForm(f => ({ ...f, specialty: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input className="pr-input" placeholder="Ville" value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))} />
                <input className="pr-input" placeholder="Code postal" value={addForm.postal_code} onChange={e => setAddForm(f => ({ ...f, postal_code: e.target.value }))} />
              </div>
              <input className="pr-input" placeholder="Téléphone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
              {addError && <div style={{ color: "#ef4444", fontSize: 13 }}>{addError}</div>}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" className="pr-btn pr-btn-ghost" onClick={() => setShowAdd(false)}>Annuler</button>
                <button type="submit" className="pr-btn pr-btn-primary" disabled={addLoading}>{addLoading ? "…" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign modal */}
      {showCampaign && (
        <div className="pr-modal-bg" onClick={() => !campaignLoading && setShowCampaign(false)}>
          <div className="pr-modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, color: "#0d2540", marginBottom: 6 }}>
              Envoyer une campagne
            </h3>
            <p style={{ fontSize: 13, color: "#7a8a9a", marginBottom: 20 }}>
              {selected.size > 0
                ? `${selected.size} prospect(s) sélectionné(s)`
                : `Tous les prospects de la vue actuelle (${total} max)`}
              {" "}— uniquement ceux avec email et statut ≠ désabonné/invalide.
            </p>

            {campaignResult ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0d2540", marginBottom: 16 }}>Campagne envoyée</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
                  <div><div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>{campaignResult.sent}</div><div style={{ fontSize: 12, color: "#7a8a9a" }}>Envoyés</div></div>
                  <div><div style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b" }}>{campaignResult.skipped}</div><div style={{ fontSize: 12, color: "#7a8a9a" }}>Ignorés</div></div>
                  <div><div style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>{campaignResult.errors}</div><div style={{ fontSize: 12, color: "#7a8a9a" }}>Erreurs</div></div>
                </div>
                <button className="pr-btn pr-btn-ghost" onClick={() => setShowCampaign(false)}>Fermer</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#4a6080", display: "block", marginBottom: 6 }}>Objet de l'email</label>
                  <input className="pr-input" value={campaignSubject} onChange={e => setCampaignSubject(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#4a6080", display: "block", marginBottom: 6 }}>
                    Corps du message <span style={{ fontWeight: 400, color: "#94a3b8" }}>(la salutation "Bonjour [Prénom]" est ajoutée automatiquement)</span>
                  </label>
                  <textarea
                    className="pr-input"
                    rows={10}
                    value={campaignBody}
                    onChange={e => setCampaignBody(e.target.value)}
                    style={{ resize: "vertical", lineHeight: 1.6 }}
                  />
                </div>
                <div style={{ background: "#f8fbff", border: "1px solid #dce8f5", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#4a6a8a" }}>
                  Un bouton <strong>"Essayer EchoScribe gratuitement →"</strong> pointant vers la page d'inscription est ajouté automatiquement.
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button className="pr-btn pr-btn-ghost" onClick={() => setShowCampaign(false)}>Annuler</button>
                  <button
                    className="pr-btn pr-btn-primary"
                    disabled={campaignLoading || !campaignSubject.trim() || !campaignBody.trim()}
                    onClick={handleCampaign}
                  >
                    {campaignLoading ? "Envoi en cours…" : "Envoyer la campagne"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
