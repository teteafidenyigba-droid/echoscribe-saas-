interface LogoProps {
  dark?: boolean;
  size?: number;
}

export function Logo({ dark = false, size = 26 }: LogoProps) {
  const echoColor = dark ? "#e2eaf5" : "#1d3558";
  const scribeColor = dark ? "#7dc8f5" : "#3b6cb7";
  const iw = Math.round(size * 1.25);
  const ih = Math.round(size * 0.95);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {/* Mic capsule + arcs pointing right */}
      <svg
        width={iw}
        height={ih}
        viewBox="0 0 50 40"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Capsule */}
        <rect x="2" y="8" width="12" height="24" rx="6" fill="#c45d4a" />
        {/* Arc 1 — inner, darkest */}
        <path d="M16 15 Q25 20 16 25" stroke="#c45d4a" strokeWidth="2.8" strokeLinecap="round" />
        {/* Arc 2 — middle */}
        <path d="M18 11 Q33 20 18 29" stroke="#d4907a" strokeWidth="2.8" strokeLinecap="round" />
        {/* Arc 3 — outer, lightest */}
        <path d="M20 6 Q45 20 20 34" stroke="#eac0b0" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
      {/* Text */}
      <span
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: size,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "0.01em",
        }}
      >
        <span style={{ color: echoColor }}>Echo</span>
        <span style={{ color: scribeColor }}>Scribe</span>
      </span>
    </span>
  );
}
