import React from 'react';

interface NipunBharatBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Official NIPUN Bharat FLN Mission Emblem Badge
 * (National Initiative for Proficiency in Reading with Understanding and Numeracy)
 * Ministry of Education, Government of India.
 */
export const NipunBharatBadge: React.FC<NipunBharatBadgeProps> = ({
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 shadow-2xs ${
        isSm ? 'px-2 py-1' : isLg ? 'px-3.5 py-2' : 'px-2.5 py-1.5'
      } ${className}`}
      title="निपुण भारत मिशन • राष्ट्रीय पायाभूत साक्षरता व संख्याज्ञान अभियान (NIPUN Bharat & FLN)"
    >
      {/* Tricolor Emblem Circle */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
        {/* Tricolor background arcs */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] opacity-25" />
        {/* Open Book & Sun Vector */}
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 relative z-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sun / Rising knowledge */}
          <circle cx="12" cy="7" r="2.5" fill="#FF9933" stroke="none" />
          <path d="M12 2v2M8 4l1 1M16 4l-1 1" stroke="#FF9933" strokeWidth="1.2" />
          {/* Open Book */}
          <path d="M2 18c3-1.5 6-1 10 1c4-2 7-2.5 10-1v-8c-3-1.5-6-1-10 1c-4-2-7-2.5-10-1z" fill="#FFFFFF" fillOpacity="0.8" />
          <path d="M12 11v8" stroke="#133E87" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Official Bilingual Badge Text */}
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 tracking-tight">
            निपुण भारत
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            NIPUN BHARAT
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-slate-600 font-medium hidden xs:inline truncate">
          FLN Mission • Govt. of India
        </span>
      </div>
    </div>
  );
};