export default function CatLogo({ size = 40, desaturated = false }) {
  const scale = size / 200;
  const filter = desaturated ? "saturate(0.3) opacity(0.6)" : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter, flexShrink: 0 }}
    >
      {/* Ears */}
      <polygon points="38,80 58,30 78,80" fill="#A8D5BA" />
      <polygon points="122,80 142,30 162,80" fill="#A8D5BA" />
      <polygon points="46,76 58,46 70,76" fill="#F4C2C2" />
      <polygon points="130,76 142,46 154,76" fill="#F4C2C2" />

      {/* Head */}
      <ellipse cx="100" cy="108" rx="62" ry="58" fill="#A8D5BA" />

      {/* Face highlight */}
      <ellipse cx="100" cy="112" rx="44" ry="38" fill="#C8E8D5" opacity="0.5" />

      {/* Eyes — closed arc style */}
      <path d="M74 100 Q82 90 90 100" stroke="#3D3D3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M110 100 Q118 90 126 100" stroke="#3D3D3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <polygon points="100,116 96,122 104,122" fill="#F4C2C2" />

      {/* Mouth */}
      <path d="M96 122 Q100 128 104 122" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M88 126 Q94 132 100 128" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M112 126 Q106 132 100 128" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Whiskers */}
      <line x1="40" y1="115" x2="88" y2="118" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="40" y1="122" x2="88" y2="122" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="112" y1="118" x2="160" y2="115" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="112" y1="122" x2="160" y2="122" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Body */}
      <ellipse cx="100" cy="172" rx="48" ry="32" fill="#A8D5BA" />

      {/* Paws */}
      <ellipse cx="72" cy="192" rx="16" ry="10" fill="#C8E8D5" />
      <ellipse cx="128" cy="192" rx="16" ry="10" fill="#C8E8D5" />

      {/* Tail */}
      <path
        d="M148 178 Q178 165 172 145 Q166 128 148 138"
        stroke="#A8D5BA"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M148 178 Q178 165 172 145 Q166 128 148 138"
        stroke="#7DBFA0"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Toe lines on paws */}
      <line x1="66" y1="192" x2="66" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="72" y1="193" x2="72" y2="199" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="78" y1="192" x2="78" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="122" y1="192" x2="122" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="128" y1="193" x2="128" y2="199" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="134" y1="192" x2="134" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
