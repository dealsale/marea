"use client";

// Themed illustrative artwork per tour (no external images needed).
const themes: Record<string, { from: string; to: string; icon: JSX.Element }> = {
  graffiti: {
    from: "#2247cf",
    to: "#2247cf",
    icon: (
      <g>
        <path d="M30 140 L60 60 L90 140 Z" fill="#fff" opacity="0.9" />
        <rect x="110" y="55" width="26" height="85" rx="6" fill="#fbbf24" />
        <circle cx="170" cy="80" r="26" fill="#34d399" />
        <path d="M150 140 q20 -50 45 0" stroke="#fff" strokeWidth="8" fill="none" />
      </g>
    ),
  },
  english: {
    from: "#1b39a6",
    to: "#2563eb",
    icon: (
      <g>
        <circle cx="100" cy="95" r="42" fill="none" stroke="#fff" strokeWidth="6" opacity="0.9" />
        <path d="M58 95 h84 M100 53 v84" stroke="#fff" strokeWidth="5" opacity="0.9" />
        <ellipse cx="100" cy="95" rx="20" ry="42" fill="none" stroke="#fff" strokeWidth="5" opacity="0.9" />
      </g>
    ),
  },
  sunset: {
    from: "#b45309",
    to: "#2247cf",
    icon: (
      <g>
        <circle cx="100" cy="105" r="34" fill="#fde047" />
        <rect x="20" y="120" width="160" height="30" fill="#fff" opacity="0.15" />
        <path d="M20 135 h160 M40 150 h120" stroke="#fff" strokeWidth="4" opacity="0.5" />
      </g>
    ),
  },
  vip: {
    from: "#16307a",
    to: "#a21caf",
    icon: (
      <g>
        <path d="M60 120 L80 60 L100 100 L120 60 L140 120 Z" fill="#fbbf24" />
        <rect x="58" y="120" width="84" height="14" rx="4" fill="#fbbf24" />
        <circle cx="80" cy="60" r="6" fill="#fff" />
        <circle cx="120" cy="60" r="6" fill="#fff" />
        <circle cx="100" cy="52" r="6" fill="#fff" />
      </g>
    ),
  },
  food: {
    from: "#be123c",
    to: "#2247cf",
    icon: (
      <g>
        <circle cx="100" cy="100" r="40" fill="none" stroke="#fff" strokeWidth="6" />
        <circle cx="100" cy="100" r="20" fill="#fbbf24" />
        <path d="M50 60 v40 M50 60 a8 8 0 0 1 16 0 v40" stroke="#fff" strokeWidth="5" fill="none" />
        <path d="M150 60 v80 M150 60 c-10 5 -10 25 0 30" stroke="#fff" strokeWidth="5" fill="none" />
      </g>
    ),
  },
  workshop: {
    from: "#2247cf",
    to: "#0891b2",
    icon: (
      <g>
        <rect x="70" y="60" width="18" height="55" rx="9" fill="#fff" />
        <rect x="72" y="45" width="14" height="18" rx="3" fill="#fbbf24" />
        <circle cx="130" cy="95" r="24" fill="#34d399" opacity="0.9" />
        <circle cx="115" cy="120" r="12" fill="#f472b6" opacity="0.9" />
      </g>
    ),
  },
};

export function isPhoto(image: string) {
  return /^(https?:\/\/|data:image\/)/.test(image || "");
}

export function TourImage({ image, className = "" }: { image: string; className?: string }) {
  if (isPhoto(image)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className={className} style={{ objectFit: "cover", width: "100%", height: "100%" }} />;
  }
  const theme = themes[image] ?? themes.graffiti;
  return (
    <svg viewBox="0 0 200 170" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`tg-${image}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.from} />
          <stop offset="100%" stopColor={theme.to} />
        </linearGradient>
      </defs>
      <rect width="200" height="170" fill={`url(#tg-${image})`} />
      <g opacity="0.25">
        {[...Array(6)].map((_, i) => (
          <circle key={i} cx={(i * 43) % 200} cy={(i * 57) % 170} r={18 + (i % 3) * 10} fill="#fff" opacity="0.08" />
        ))}
      </g>
      {theme.icon}
    </svg>
  );
}
