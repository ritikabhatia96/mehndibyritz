export default function PeacockSVG({ className = '' }: { className?: string }) {
  return (
    <svg
      width="72"
      height="80"
      viewBox="0 0 72 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tail feathers — behind body, flowing down */}
      <path d="M 7 46 Q 0 57 2 69 Q 3 74 5 78" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 10 49 Q 4 60 6 71 Q 8 75 11 78" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 14 51 Q 9 62 11 72 Q 13 76 17 78" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 18 53 Q 14 63 17 72 Q 19 76 24 78" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 22 54 Q 19 64 22 72 Q 24 75 30 77" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Eye spots on tail */}
      <circle cx="5" cy="70" r="3.5" stroke="#8B4513" strokeWidth="1" fill="#fdf8f0"/>
      <circle cx="5" cy="70" r="1.7" fill="#8B4513"/>
      <circle cx="8" cy="72" r="3.5" stroke="#8B4513" strokeWidth="1" fill="#fdf8f0"/>
      <circle cx="8" cy="72" r="1.7" fill="#8B4513"/>
      <circle cx="13" cy="73" r="3.5" stroke="#8B4513" strokeWidth="1" fill="#fdf8f0"/>
      <circle cx="13" cy="73" r="1.7" fill="#8B4513"/>
      <circle cx="19" cy="74" r="3.5" stroke="#8B4513" strokeWidth="1" fill="#fdf8f0"/>
      <circle cx="19" cy="74" r="1.7" fill="#8B4513"/>
      <circle cx="26" cy="73" r="3.5" stroke="#8B4513" strokeWidth="1" fill="#fdf8f0"/>
      <circle cx="26" cy="73" r="1.7" fill="#8B4513"/>

      {/* Body */}
      <ellipse cx="26" cy="52" rx="19" ry="15" fill="#8B4513"/>

      {/* Feather texture on body */}
      <path d="M 9 47 Q 18 44 33 48" stroke="#6B3410" strokeWidth="0.8" fill="none"/>
      <path d="M 8 52 Q 17 49 32 53" stroke="#6B3410" strokeWidth="0.8" fill="none"/>
      <path d="M 9 57 Q 17 54 30 58" stroke="#6B3410" strokeWidth="0.8" fill="none"/>

      {/* Neck */}
      <path d="M 37 43 Q 44 31 48 22" stroke="#8B4513" strokeWidth="9" strokeLinecap="round" fill="none"/>

      {/* Head */}
      <circle cx="49" cy="18" r="9" fill="#8B4513"/>

      {/* Crest */}
      <line x1="47" y1="10" x2="42" y2="2" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="42" cy="2" r="2" fill="#8B4513"/>
      <line x1="49" y1="9" x2="48" y2="0" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="48" cy="0" r="2" fill="#8B4513"/>
      <line x1="51" y1="10" x2="56" y2="2" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="56" cy="2" r="2" fill="#8B4513"/>

      {/* Eye */}
      <circle cx="53" cy="15" r="2.8" fill="white"/>
      <circle cx="53.5" cy="15" r="1.3" fill="#1a0a00"/>

      {/* Beak */}
      <path d="M 57 18 L 68 19.5 L 57 21 Z" fill="#8B4513"/>

      {/* Legs */}
      <line x1="21" y1="65" x2="18" y2="74" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="65" x2="28" y2="74" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Feet */}
      <line x1="14" y1="74" x2="18" y2="74" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="18" y1="74" x2="23" y2="74" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="18" y1="74" x2="17" y2="78" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="24" y1="74" x2="28" y2="74" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="28" y1="74" x2="33" y2="74" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="28" y1="74" x2="27" y2="78" stroke="#8B4513" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
