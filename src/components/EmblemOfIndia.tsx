import React from 'react';

interface EmblemOfIndiaProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'monochrome' | 'navy';
}

/**
 * State Emblem of India (Lion Capital of Ashoka) with Satyameva Jayate.
 * Compliant with State Emblem of India (Prohibition of Improper Use) Act, 2005
 * for official government educational portals.
 */
export const EmblemOfIndia: React.FC<EmblemOfIndiaProps> = ({
  className = '',
  size = 48,
  variant = 'navy'
}) => {
  const primaryColor =
    variant === 'gold' ? '#B45309' : variant === 'monochrome' ? 'currentColor' : '#0B2545';
  const secondaryColor =
    variant === 'gold' ? '#D97706' : variant === 'monochrome' ? 'currentColor' : '#133E87';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="भारत का राज्य चिन्ह - State Emblem of India"
      role="img"
    >
      <title>भारत का राज्य चिन्ह (State Emblem of India)</title>
      
      {/* Central Lion Head and Mane */}
      <path
        d="M50 14 C44 14, 38 18, 38 25 C38 31, 41 36, 43 40 C41 42, 39 45, 39 48 C39 52, 42 56, 45 58 C44 61, 44 64, 46 66 L54 66 C56 64, 56 61, 55 58 C58 56, 61 52, 61 48 C61 45, 59 42, 57 40 C59 36, 62 31, 62 25 C62 18, 56 14, 50 14 Z"
        fill={primaryColor}
      />
      {/* Central Lion Facial Profile Details */}
      <path
        d="M48 20 Q50 18 52 20 Q54 23 52 26 Q50 28 48 26 Z"
        fill="#FFFFFF"
        opacity="0.85"
      />
      <circle cx="45" cy="24" r="1.5" fill="#FFFFFF" />
      <circle cx="55" cy="24" r="1.5" fill="#FFFFFF" />
      <path d="M47 30 Q50 33 53 30" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M44 35 Q50 39 56 35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left Lion (Profile) */}
      <path
        d="M36 24 C31 22, 26 25, 24 30 C22 35, 23 41, 26 46 C24 48, 22 52, 23 56 C24 60, 27 63, 31 65 C33 65, 36 63, 37 60 C36 56, 36 50, 37 45 C36 38, 36 31, 36 24 Z"
        fill={secondaryColor}
      />
      <circle cx="28" cy="32" r="1.3" fill="#FFFFFF" />
      <path d="M26 38 Q30 40 33 37" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

      {/* Right Lion (Profile) */}
      <path
        d="M64 24 C69 22, 74 25, 76 30 C78 35, 77 41, 74 46 C76 48, 78 52, 77 56 C76 60, 73 63, 69 65 C67 65, 64 63, 63 60 C64 56, 64 50, 63 45 C64 38, 64 31, 64 24 Z"
        fill={secondaryColor}
      />
      <circle cx="72" cy="32" r="1.3" fill="#FFFFFF" />
      <path d="M74 38 Q70 40 67 37" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

      {/* Abacus Base Platform */}
      <rect x="20" y="67" width="60" height="5" rx="1.5" fill={primaryColor} />
      <rect x="16" y="73" width="68" height="15" rx="2" fill={secondaryColor} />

      {/* Ashoka Chakra in Central Relief on Abacus */}
      <circle cx="50" cy="80.5" r="5.5" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
      <circle cx="50" cy="80.5" r="1.2" fill="#FFFFFF" />
      {/* 24-spoke hint spokes */}
      <line x1="50" y1="75.2" x2="50" y2="85.8" stroke="#FFFFFF" strokeWidth="0.8" />
      <line x1="44.7" y1="80.5" x2="55.3" y2="80.5" stroke="#FFFFFF" strokeWidth="0.8" />
      <line x1="46.2" y1="76.7" x2="53.8" y2="84.3" stroke="#FFFFFF" strokeWidth="0.8" />
      <line x1="46.2" y1="84.3" x2="53.8" y2="76.7" stroke="#FFFFFF" strokeWidth="0.8" />

      {/* Bull Motif on Left of Abacus */}
      <ellipse cx="30" cy="80.5" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="27" cy="79" r="1.2" fill="#FFFFFF" opacity="0.9" />
      <path d="M26 82 L25 85 M28 82 L29 85 M32 82 L31 85 M34 82 L35 85" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />

      {/* Galloping Horse Motif on Right of Abacus */}
      <ellipse cx="70" cy="80.5" rx="4.2" ry="2.2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="73" cy="78.8" r="1.2" fill="#FFFFFF" opacity="0.9" />
      <path d="M67 82 L65 85 M69 82 L68 85 M72 82 L73 85 M74 81 L76 84" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />

      {/* Inverted Lotus / Bell Base */}
      <path
        d="M22 90 C30 92, 40 94, 50 94 C60 94, 70 92, 78 90 L80 94 C70 97, 60 98, 50 98 C40 98, 30 97, 20 94 Z"
        fill={primaryColor}
      />
      <rect x="24" y="99" width="52" height="2.5" rx="1" fill={secondaryColor} />

      {/* National Motto: सत्यमेव जयते (Satyameva Jayate) */}
      <text
        x="50"
        y="112"
        textAnchor="middle"
        fontFamily="'Noto Sans Devanagari', sans-serif"
        fontSize="8.5"
        fontWeight="700"
        fill={primaryColor}
        letterSpacing="0.4"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
};