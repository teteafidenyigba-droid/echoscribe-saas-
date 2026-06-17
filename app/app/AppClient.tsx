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
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#f0f7f4" }}>
      {/* Top bar */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #d0dde8",
        padding: "0 20px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 200,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 28,
            fontStyle: "italic",
            color: "#1a2e3d",
            letterSpacing: "-0.02em",
          }}>
            Echo<span style={{ fontStyle: "normal", fontWeight: 700, color: "#0f6e56" }}>Scribe</span>
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#7a94a8",
            background: "#e8f5ee",
            border: "1px solid #9ecfb8",
            borderRadius: 999,
            padding: "2px 8px",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}>IA v5</span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#7a94a8",
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
            color: "#0f6e56",
            textDecoration: "none",
            padding: "6px 14px",
            background: "#e8f5ee",
            border: "1px solid #9ecfb8",
            borderRadius: 8,
            whiteSpace: "nowrap" as const,
          }}>
            Mon abonnement
          </Link>
          <button onClick={handleLogout} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#7a94a8",
            background: "transparent",
            border: "1px solid #d0dde8",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            whiteSpace: "nowrap" as const,
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
