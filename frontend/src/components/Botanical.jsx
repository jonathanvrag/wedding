/**
 * Botanical SVG Decorations
 * Following frontend-design skill: unexpected, distinctive, organic
 */

export function BotanicalTop({ className = "" }) {
  return (
    <div className={`absolute top-0 right-0 pointer-events-none ${className}`}>
      <svg 
        viewBox="0 0 200 200" 
        className="w-48 h-48 text-primary opacity-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        {/* Main stem */}
        <path d="M180 20 Q195 50 180 80 Q165 110 130 140 Q100 165 60 180" />
        {/* Branch 1 */}
        <path d="M170 35 Q185 50 175 65" />
        {/* Branch 2 */}
        <path d="M160 60 Q175 70 165 90" />
        {/* Leaf shapes */}
        <path d="M180 80 Q195 75 190 65 Q185 85 175 90" />
        <path d="M165 110 Q180 105 175 95 Q170 115 160 120" />
        {/* Curved tendril */}
        <path 
          d="M130 140 Q110 150 100 140" 
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  )
}

export function BotanicalBottom({ className = "" }) {
  return (
    <div className={`absolute bottom-0 left-0 pointer-events-none ${className}`}>
      <svg 
        viewBox="0 0 200 200" 
        className="w-48 h-48 text-primary opacity-10 rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        {/* Main stem */}
        <path d="M180 20 Q195 50 180 80 Q165 110 130 140 Q100 165 60 180" />
        {/* Branch 1 */}
        <path d="M170 35 Q185 50 175 65" />
        {/* Branch 2 */}
        <path d="M160 60 Q175 70 165 90" />
        {/* Leaf shapes */}
        <path d="M180 80 Q195 75 190 65 Q185 85 175 90" />
        <path d="M165 110 Q180 105 175 95 Q170 115 160 120" />
        {/* Curved tendril */}
        <path 
          d="M130 140 Q110 150 100 140" 
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  )
}

export function BotanicalCorner({ className = "", position = "top-right" }) {
  const rotations = {
    "top-right": "rotate-0",
    "top-left": "rotate-90",
    "bottom-right": "rotate-270",
    "bottom-left": "rotate-180"
  }
  
  return (
    <div className={`pointer-events-none ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className={`w-24 h-24 text-primary opacity-15 ${rotations[position]}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        {/* Organic leaf cluster */}
        <path d="M80 10 Q95 20 85 35 Q70 50 50 60 Q30 70 15 80" />
        <path d="M75 15 Q90 30 80 40" />
        <path d="M65 25 Q80 35 70 50" />
        <path d="M55 35 Q70 45 60 55" />
        {/* Inner detail */}
        <circle cx="45" cy="55" r="2" fill="currentColor" />
      </svg>
    </div>
  )
}