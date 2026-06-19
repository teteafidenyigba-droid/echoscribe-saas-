"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  user: { email: string; name: string };
}

export default function AppClient({ user }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName = user.name !== user.email ? user.name : user.email;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#fbfaf7" }}>
      {/* Top bar */}
      <div style={{
        background: "rgba(251,250,247,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #dde8eb",
        padding: "0 20px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 200,
        boxShadow: "0 1px 8px rgba(14,48,58,0.07)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 26,
            fontStyle: "italic",
            color: "#14303a",
            letterSpacing: "-0.01em",
          }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#c45d4a" }}>Scribe</span>
          </span>
          <span style={{
            background: "#15627a",
            borderRadius: 999,
            padding: "3px 10px",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "#ffffff",
            fontFamily: "'JetBrains Mono', monospace",
          }}>IA v5</span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#5b7a84",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as const,
            maxWidth: 200,
          }}>
            {displayName}
          </span>
          <Link href="/billing" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#ffffff",
            textDecoration: "none",
            padding: "7px 16px",
            background: "#15627a",
            border: "none",
            borderRadius: 8,
            whiteSpace: "nowrap" as const,
          }}>
            Mon abonnement
          </Link>
          <button onClick={handleLogout} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#c45d4a",
            background: "transparent",
            border: "1.5px solid #c45d4a",
            borderRadius: 8,
            padding: "5px 14px",
            cursor: "pointer",
            whiteSpace: "nowrap" as const,
            fontWeight: 700,
          }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* App iframe */}
      <iframe
        src="/echoscribe-app.html"
        style={{ flex: 1, border: "none", width: "100%", display: "block" }}
        title="EchoScribe Application"
        allow="microphone"
      />
    </div>
  );
}
