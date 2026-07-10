"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  user: { email: string; name: string };
  panel?: "main" | "settings" | "history";
}

export default function AppClient({ user, panel = "main" }: Props) {
  const backHref = panel !== "main" ? "/app" : null;
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName = user.name !== user.email ? user.name : user.email;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0A66C2" }}>
      <style>{`
        .es-topbar { padding: 0 20px; height: 60px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; z-index: 200; background: rgba(234,244,251,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #c8ddef; box-shadow: 0 1px 16px rgba(13,37,64,0.18); }
        .es-logo-text { font-family: 'EB Garamond', serif; font-size: 28px; font-style: italic; color: #0d2540; letter-spacing: -0.01em; }
        .es-email { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #2a5070; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
        .es-btn-abo { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ffffff; text-decoration: none; padding: 7px 16px; background: linear-gradient(135deg,#1e3a5f,#1e5a8a); border: none; border-radius: 8px; white-space: nowrap; box-shadow: 0 2px 8px rgba(30,58,95,0.3); }
        .es-bottombar { height: 52px; display: flex; align-items: center; justify-content: center; gap: 12px; flex-shrink: 0; background: rgba(234,244,251,0.97); backdrop-filter: blur(16px); border-top: 1px solid #c8ddef; box-shadow: 0 -1px 12px rgba(13,37,64,0.12); }
        .es-btn-settings { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: 2px solid #c8ddef; border-radius: 8px; padding: 5px 20px; cursor: pointer; white-space: nowrap; text-decoration: none; }
        .es-btn-settings:hover { background: #e8f1fb; border-color: #0a5fa8; }
        .es-btn-back { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: none; padding: 5px 14px; cursor: pointer; white-space: nowrap; text-decoration: none; }
        .es-btn-logout { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #0a5fa8; background: transparent; border: 2px solid #0a5fa8; border-radius: 8px; padding: 5px 14px; cursor: pointer; white-space: nowrap; font-weight: 700; }
        @media (max-width: 600px) {
          .es-topbar { padding: 0 12px; height: 52px; }
          .es-logo-text { font-size: 20px; }
          .es-email { display: none; }
          .es-btn-abo { display: none; }
          .es-btn-logout { padding: 5px 10px; font-size: 10px; }
        }
      `}</style>

      {/* Top bar */}
      <div className="es-topbar">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="30" height="20" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,11 6,11 9,3 12,19 15,8 18,14 21,11 34,11" stroke="#c45d4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="es-logo-text">
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#0a6abf" }}>Scribe</span>
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="es-email">{displayName}</span>
          <Link href="/billing" className="es-btn-abo">Mon abonnement</Link>
          <button onClick={handleLogout} className="es-btn-logout">Déconnexion</button>
        </div>
      </div>

      {/* App iframe */}
      <iframe
        src={`/echoscribe-app.html?v=v5pro75${panel === "settings" ? "&panel=settings" : panel === "history" ? "&panel=history" : ""}`}
        style={{ flex: 1, border: "none", width: "100%", display: "block", background: "transparent" }}
        title="EchoScribe Application"
        allow="microphone"
        allowTransparency={true}
      />

      {/* Bottom nav */}
      <div className="es-bottombar">
        {backHref
          ? <Link href={backHref} className="es-btn-back">← Retour à l'application</Link>
          : <>
              <Link href="/app/historique" className="es-btn-settings">Historique</Link>
              <Link href="/app/parametres" className="es-btn-settings">Paramètres</Link>
            </>
        }
      </div>
    </div>
  );
}
