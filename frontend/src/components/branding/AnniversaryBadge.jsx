import React from 'react';

/**
 * Official Panimalar "26 Years of Excellence in Education" Celebratory Crest
 * Faithfully matches the gold laurel wreath, deep navy medallion, "26",
 * "years of EXCELLENCE IN EDUCATION", and "PANIMALAR" ribbon.
 */
export function AnniversaryBadge({ className = "w-20 h-24", compact = false }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-slate-900/90 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/40 text-xs font-semibold shadow-sm">
        <span className="text-amber-400 font-extrabold">26</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-200">Years of Excellence</span>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Panimalar 26 Years of Excellence in Education"
    >
      <defs>
        <linearGradient id="goldBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="30%" stopColor="#F5B800" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="blueRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <path id="archText" d="M 30,65 A 70,70 0 0,1 170,65" fill="none" />
      </defs>

      {/* Top 3 White Stars */}
      <polygon points="100,6 102,12 108,12 103,16 105,22 100,18 95,22 97,16 92,12 98,12" fill="#FFFFFF" />
      <polygon points="76,12 78,17 83,17 79,20 81,25 76,22 71,25 73,20 69,17 74,17" fill="#FFFFFF" />
      <polygon points="124,12 126,17 131,17 127,20 129,25 124,22 119,25 121,20 117,17 122,17" fill="#FFFFFF" />

      {/* "CELEBRATING" Curved Text */}
      <text
        fill="#FFFFFF"
        fontSize="12"
        fontWeight="800"
        letterSpacing="2.5"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#archText" startOffset="50%" textAnchor="middle">
          CELEBRATING
        </textPath>
      </text>

      {/* Gold Laurel Wreath Left */}
      <g stroke="url(#goldBadgeGrad)" strokeWidth="2.5" fill="url(#goldBadgeGrad)">
        {/* Branch stem left */}
        <path d="M 90,205 C 15,190 10,80 35,45" fill="none" strokeWidth="2" />
        {/* Leaves left */}
        <path d="M 32,50 Q 20,45 22,60 Q 30,55 32,50 Z" />
        <path d="M 24,70 Q 10,68 15,82 Q 22,76 24,70 Z" />
        <path d="M 18,92 Q 5,92 12,105 Q 18,98 18,92 Z" />
        <path d="M 16,115 Q 4,118 13,130 Q 18,122 16,115 Z" />
        <path d="M 18,138 Q 8,144 19,154 Q 22,145 18,138 Z" />
        <path d="M 25,160 Q 18,170 30,176 Q 31,166 25,160 Z" />
        <path d="M 40,180 Q 35,192 48,194 Q 47,184 40,180 Z" />
      </g>

      {/* Gold Laurel Wreath Right */}
      <g stroke="url(#goldBadgeGrad)" strokeWidth="2.5" fill="url(#goldBadgeGrad)">
        {/* Branch stem right */}
        <path d="M 110,205 C 185,190 190,80 165,45" fill="none" strokeWidth="2" />
        {/* Leaves right */}
        <path d="M 168,50 Q 180,45 178,60 Q 170,55 168,50 Z" />
        <path d="M 176,70 Q 190,68 185,82 Q 178,76 176,70 Z" />
        <path d="M 182,92 Q 195,92 188,105 Q 182,98 182,92 Z" />
        <path d="M 184,115 Q 196,118 187,130 Q 182,122 184,115 Z" />
        <path d="M 182,138 Q 192,144 181,154 Q 178,145 182,138 Z" />
        <path d="M 175,160 Q 182,170 170,176 Q 169,166 175,160 Z" />
        <path d="M 160,180 Q 165,192 152,194 Q 153,184 160,180 Z" />
      </g>

      {/* Main Scalloped Gold Medallion Outer Border */}
      <circle cx="100" cy="115" r="62" fill="#0A1930" stroke="url(#goldBadgeGrad)" strokeWidth="7" />
      <circle cx="100" cy="115" r="54" fill="#0A1930" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* Medallion Text Content */}
      {/* Big "26" */}
      <text
        x="100"
        y="110"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="44"
        fontWeight="900"
        fontFamily="'Arial Black', Impact, sans-serif"
        letterSpacing="-1"
      >
        26
      </text>

      {/* "— years of —" */}
      <g>
        <line x1="48" y1="120" x2="65" y2="120" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <text
          x="100"
          y="124"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="bold"
          fontStyle="italic"
          fontFamily="Georgia, serif"
        >
          years of
        </text>
        <line x1="135" y1="120" x2="152" y2="120" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* "EXCELLENCE IN EDUCATION" */}
      <text
        x="100"
        y="140"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="9.5"
        fontWeight="800"
        letterSpacing="0.8"
        fontFamily="Arial, sans-serif"
      >
        EXCELLENCE IN
      </text>
      <text
        x="100"
        y="152"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="9.5"
        fontWeight="800"
        letterSpacing="0.8"
        fontFamily="Arial, sans-serif"
      >
        EDUCATION
      </text>

      {/* Bottom Blue "PANIMALAR" Ribbon Banner */}
      <g transform="translate(0, 155)">
        {/* Ribbon Fold Tails */}
        <path d="M 12,38 L 28,12 L 28,45 Z" fill="#0F172A" />
        <path d="M 188,38 L 172,12 L 172,45 Z" fill="#0F172A" />
        {/* Main Ribbon Body with Curve */}
        <path
          d="M 15,35 Q 100,52 185,35 L 180,12 Q 100,28 20,12 Z"
          fill="url(#blueRibbonGrad)"
          stroke="#3B82F6"
          strokeWidth="1.5"
        />
        {/* Ribbon Inner Accent Lines */}
        <path
          d="M 22,17 Q 100,32 178,17"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="0.8"
        />
        <path
          d="M 18,30 Q 100,47 182,30"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="0.8"
        />
        {/* "PANIMALAR" Text */}
        <text
          x="100"
          y="28"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="900"
          letterSpacing="3.5"
          fontFamily="Arial, sans-serif"
        >
          PANIMALAR
        </text>
      </g>
    </svg>
  );
}

export default AnniversaryBadge;
