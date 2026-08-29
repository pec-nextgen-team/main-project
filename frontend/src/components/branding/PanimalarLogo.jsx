import React from 'react';

/**
 * Official Panimalar Engineering College Emblem (High-Fidelity SVG Vector)
 * Incorporates the circular crest, Tamil Nadu educational emblem elements,
 * three gears (Veena, Transceiver, Computer), and official motto:
 * "PROSPERITY ENDURANCE CHARACTER", "JAI SAKTHI EDUCATIONAL TRUST"
 */
export function PanimalarLogo({ className = "w-12 h-12", showText = false, textClassName = "text-white" }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 400 480"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Panimalar Engineering College Official Emblem"
      >
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="30%" stopColor="#F5B800" />
            <stop offset="70%" stopColor="#D98200" />
            <stop offset="100%" stopColor="#B36200" />
          </linearGradient>
          <linearGradient id="skyBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="100%" stopColor="#FFEEC2" />
          </linearGradient>
          <linearGradient id="ribbonOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <path id="topTextArc" d="M 50,200 A 150,150 0 1,1 350,200" fill="none" />
          <path id="bottomTextArc" d="M 50,200 A 150,150 0 0,0 350,200" fill="none" />
        </defs>

        {/* Outer Ring Gold Border */}
        <circle cx="200" cy="200" r="195" fill="#FFFFFF" stroke="url(#crestGold)" strokeWidth="6" />
        <circle cx="200" cy="200" r="185" fill="#FFFFFF" stroke="#C5221F" strokeWidth="3" />
        
        {/* Outer Circular Navy/Crimson Text Path */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="#C5221F" strokeWidth="1" />
        
        {/* Inner Sky Blue Circle */}
        <circle cx="200" cy="200" r="148" fill="url(#skyBlue)" stroke="#C5221F" strokeWidth="4" />

        {/* Central Traditional Scalloped Shield Background */}
        <path
          d="M 125,120 C 140,90 260,90 275,120 C 290,155 315,160 310,210 C 305,255 240,285 200,290 C 160,285 95,255 90,210 C 85,160 110,155 125,120 Z"
          fill="url(#shieldBg)"
          stroke="#C5221F"
          strokeWidth="3"
        />

        {/* Red Crown Arch at Top of Shield */}
        <path
          d="M 160,98 Q 200,80 240,98 Q 200,108 160,98 Z"
          fill="#DC2626"
        />

        {/* --- Top Gear (Pink/Magenta - Veena / Arts & Science) --- */}
        <g transform="translate(200, 145)">
          <circle cx="0" cy="0" r="32" fill="#FDF2F8" stroke="#DB2777" strokeWidth="3" strokeDasharray="6 3" />
          <circle cx="0" cy="0" r="26" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2" />
          {/* Veena Symbol */}
          <path d="M -8,-15 C -4,-18 4,-18 8,-15 C 10,-12 6,-6 4,4 L 10,12 C 8,16 0,18 -6,14 C -10,10 -8,4 -3,4 L -2,-10 Z" fill="#BE185D" />
          <circle cx="-5" cy="12" r="5" fill="#9D174D" />
          <circle cx="4" cy="-14" r="3" fill="#9D174D" />
        </g>

        {/* --- Left Gear (Blue - Telecommunication / Transceiver) --- */}
        <g transform="translate(155, 220)">
          <circle cx="0" cy="0" r="34" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="3" strokeDasharray="7 3" />
          <circle cx="0" cy="0" r="28" fill="#DBEAFE" stroke="#1E40AF" strokeWidth="2" />
          {/* Transceiver / Mobile Device Symbol */}
          <rect x="-8" y="-12" width="16" height="24" rx="3" fill="#1E40AF" />
          <rect x="-6" y="-9" width="12" height="10" fill="#93C5FD" />
          <line x1="-8" y1="-12" x2="-8" y2="-20" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
          {/* Keypad dots */}
          <circle cx="-3" cy="4" r="1" fill="#FFFFFF" />
          <circle cx="0" cy="4" r="1" fill="#FFFFFF" />
          <circle cx="3" cy="4" r="1" fill="#FFFFFF" />
          <circle cx="-3" cy="8" r="1" fill="#FFFFFF" />
          <circle cx="0" cy="8" r="1" fill="#FFFFFF" />
          <circle cx="3" cy="8" r="1" fill="#FFFFFF" />
        </g>

        {/* --- Right Gear (Green - Computer Science & Engineering) --- */}
        <g transform="translate(245, 220)">
          <circle cx="0" cy="0" r="34" fill="#F0FDF4" stroke="#15803D" strokeWidth="3" strokeDasharray="7 3" />
          <circle cx="0" cy="0" r="28" fill="#DCFCE7" stroke="#166534" strokeWidth="2" />
          {/* Desktop Monitor & Keyboard Symbol */}
          <rect x="-11" y="-12" width="22" height="15" rx="2" fill="#166534" />
          <rect x="-9" y="-10" width="18" height="11" fill="#BBF7D0" />
          <line x1="-3" y1="3" x2="3" y2="3" stroke="#166534" strokeWidth="2" />
          <line x1="-6" y1="5" x2="6" y2="5" stroke="#166534" strokeWidth="2" />
          <rect x="-12" y="7" width="24" height="4" rx="1" fill="#166534" />
        </g>

        {/* Orange Ribbon Across Middle-Bottom */}
        <g>
          {/* Ribbon Ends */}
          <path d="M 45,260 L 80,240 L 75,290 Z" fill="#C2410C" />
          <path d="M 355,260 L 320,240 L 325,290 Z" fill="#C2410C" />
          {/* Main Curved Banner */}
          <path
            d="M 50,255 Q 200,320 350,255 L 340,290 Q 200,355 60,290 Z"
            fill="url(#ribbonOrange)"
            stroke="#C2410C"
            strokeWidth="2"
          />
          {/* Ribbon Motto Text */}
          <text
            x="200"
            y="292"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="15"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="Arial, sans-serif"
          >
            PROSPERITY ENDURANCE CHARACTER
          </text>
        </g>

        {/* Red College Name Curved Text Around Top Ring */}
        <text fill="#B91C1C" fontSize="15" fontWeight="900" letterSpacing="2.5" fontFamily="Arial, sans-serif">
          <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
            PANIMALAR ENGINEERING COLLEGE - CHENNAI
          </textPath>
        </text>

        {/* Red Autonomous Subtitle Arc */}
        <text fill="#0F172A" fontSize="11" fontWeight="bold" letterSpacing="1.8" fontFamily="Arial, sans-serif">
          <textPath href="#topTextArc" startOffset="50%" textAnchor="middle" dy="18">
            AN AUTONOMOUS INSTITUTION
          </textPath>
        </text>

        {/* Trust Name Around Bottom Ring */}
        <text fill="#0A1930" fontSize="16" fontWeight="900" letterSpacing="3" fontFamily="Arial, sans-serif">
          <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle" dy="25">
            JAI SAKTHI EDUCATIONAL TRUST
          </textPath>
        </text>

        {/* Red Stars on Sides */}
        <polygon points="40,200 44,212 56,212 46,220 50,232 40,224 30,232 34,220 24,212 36,212" fill="#DC2626" />
        <polygon points="360,200 364,212 376,212 366,220 370,232 360,224 350,232 354,220 344,212 356,212" fill="#DC2626" />

        {/* Traditional Magenta Lotus / Kolam Base Ornament at Bottom */}
        <g transform="translate(200, 425)">
          <path
            d="M 0,-15 C -25,-40 -50,-10 -30,10 C -15,20 0,5 0,0 C 0,5 15,20 30,10 C 50,-10 25,-40 0,-15 Z"
            fill="none"
            stroke="#DB2777"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M -45,-5 C -65,-25 -80,5 -55,18 C -35,28 -20,10 -20,5"
            fill="none"
            stroke="#DB2777"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 45,-5 C 65,-25 80,5 55,18 C 35,28 20,10 20,5"
            fill="none"
            stroke="#DB2777"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="0" cy="22" r="5" fill="#DB2777" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-base font-bold tracking-tight leading-tight uppercase ${textClassName}`}>
            Panimalar Engineering College
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            An Autonomous Institution • Chennai
          </span>
        </div>
      )}
    </div>
  );
}

export default PanimalarLogo;
