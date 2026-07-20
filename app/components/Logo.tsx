interface LogoProps {
  dark?: boolean;
  size?: number;
}

export function Logo({ dark = false, size = 26 }: LogoProps) {
  const echoColor = dark ? "#e2eaf5" : "#0d2540";
  const scribeColor = dark ? "#38bdf8" : "#0a6abf";
  const iw = Math.round(size * 1.12);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg
        width={iw}
        height={size}
        viewBox="0 0 30 26"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Outer arc — lightest */}
        <path d="M2.5 22 Q15 3 27.5 22" stroke="#e8c0b0" strokeWidth="2" strokeLinecap="round" />
        {/* Middle arc */}
        <path d="M6 21 Q15 7 24 21" stroke="#d4806a" strokeWidth="2.2" strokeLinecap="round" />
        {/* Inner arc */}
        <path d="M9.5 20 Q15 12 20.5 20" stroke="#c45d4a" strokeWidth="2.2" strokeLinecap="round" />
        {/* Mic capsule */}
        <rect x="10" y="20" width="10" height="6" rx="3" fill="#c45d4a" />
      </svg>
      <span
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: size,
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        <span style={{ color: echoColor }}>Echo</span>
        <span style={{ fontStyle: "normal", fontWeight: 700, color: scribeColor }}>Scribe</span>
      </span>
    </span>
  );
}
