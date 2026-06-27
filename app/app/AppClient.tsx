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
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0A66C2" }}>
      {/* Top bar */}
      <div style={{
        background: "rgba(234,244,251,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #c8ddef",
        padding: "0 20px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 200,
        boxShadow: "0 1px 16px rgba(13,37,64,0.18)",
      }}>
        <div />

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#2a5070",
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
            background: "linear-gradient(135deg, #1e3a5f, #1e5a8a)",
            border: "none",
            borderRadius: 8,
            whiteSpace: "nowrap" as const,
            boxShadow: "0 2px 8px rgba(30,58,95,0.3)",
          }}>
            Mon abonnement
          </Link>
          <button onClick={handleLogout} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#0a5fa8",
            background: "transparent",
            border: "2px solid #0a5fa8",
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
        src="/echoscribe-app.html?v=v5pro18"
        style={{ flex: 1, border: "none", width: "100%", display: "block", background: "transparent" }}
        title="EchoScribe Application"
        allow="microphone"
        allowTransparency={true}
      />
    </div>
  );
}
