export default function CatLogo({ size = 40, desaturated = false, sad = false }) {
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
      {/* Ears — drooped slightly when sad */}
      <polygon points="38,80 55,32 78,80" fill={sad ? "#c8ddd4" : "#A8D5BA"} />
      <polygon points="122,80 145,32 162,80" fill={sad ? "#c8ddd4" : "#A8D5BA"} />
      <polygon points="46,76 55,48 70,76" fill="#F4C2C2" />
      <polygon points="130,76 145,48 154,76" fill="#F4C2C2" />

      {/* Head */}
      <ellipse cx="100" cy="108" rx="62" ry="58" fill={sad ? "#c8ddd4" : "#A8D5BA"} />

      {/* Face highlight */}
      <ellipse cx="100" cy="112" rx="44" ry="38" fill="#C8E8D5" opacity="0.4" />

      {sad ? (
        <>
          {/* Sad eyes — T T style (filled teardrop pupils looking down) */}
          <path d="M76 96 Q82 106 88 96" stroke="#3D3D3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M112 96 Q118 106 124 96" stroke="#3D3D3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Worried inner brows */}
          <path d="M74 88 Q82 84 88 90" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M112 90 Q118 84 126 88" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
          {/* Tears */}
          <ellipse cx="76" cy="110" rx="3" ry="5" fill="#A8D5BA" opacity="0.8" />
          <ellipse cx="124" cy="110" rx="3" ry="5" fill="#A8D5BA" opacity="0.8" />
          {/* Sad mouth — small frown */}
          <path d="M90 130 Q100 124 110 130" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          {/* Happy eyes — closed arc style */}
          <path d="M74 100 Q82 90 90 100" stroke="#3D3D3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M110 100 Q118 90 126 100" stroke="#3D3D3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Happy mouth */}
          <path d="M96 122 Q100 128 104 122" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M88 126 Q94 132 100 128" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M112 126 Q106 132 100 128" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Nose */}
      <polygon points="100,116 96,122 104,122" fill="#F4C2C2" />

      {/* Whiskers */}
      <line x1="40" y1="115" x2="88" y2="118" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="40" y1="122" x2="88" y2="122" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="112" y1="118" x2="160" y2="115" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="112" y1="122" x2="160" y2="122" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Body */}
      <ellipse cx="100" cy="172" rx="48" ry="32" fill={sad ? "#c8ddd4" : "#A8D5BA"} />

      {/* Paws */}
      <ellipse cx="72" cy="192" rx="16" ry="10" fill="#C8E8D5" />
      <ellipse cx="128" cy="192" rx="16" ry="10" fill="#C8E8D5" />

      {/* Tail — drooped low when sad */}
      {sad ? (
        <path d="M148 185 Q165 195 158 178 Q152 165 140 172" stroke={sad ? "#c8ddd4" : "#A8D5BA"} strokeWidth="14" strokeLinecap="round" fill="none" />
      ) : (
        <>
          <path d="M148 178 Q178 165 172 145 Q166 128 148 138" stroke="#A8D5BA" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M148 178 Q178 165 172 145 Q166 128 148 138" stroke="#7DBFA0" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        </>
      )}

      {/* Toe lines */}
      <line x1="66" y1="192" x2="66" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="72" y1="193" x2="72" y2="199" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="78" y1="192" x2="78" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="122" y1="192" x2="122" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="128" y1="193" x2="128" y2="199" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="134" y1="192" x2="134" y2="198" stroke="#7DBFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
