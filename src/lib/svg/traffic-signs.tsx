// UAE Traffic Sign SVG Components
// Following international Vienna Convention standards used in UAE

export function StopSign() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon
        points="100,10 170,40 190,110 160,175 100,195 40,175 10,110 30,40"
        fill="#CC0000"
        stroke="#FFFFFF"
        strokeWidth="6"
      />
      <text x="100" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="52" fontWeight="bold" fontFamily="Arial">
        STOP
      </text>
    </svg>
  )
}

export function SpeedLimit60() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <text x="100" y="120" textAnchor="middle" fill="#000000" fontSize="72" fontWeight="bold" fontFamily="Arial">
        60
      </text>
    </svg>
  )
}

export function SpeedLimit80() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <text x="100" y="120" textAnchor="middle" fill="#000000" fontSize="72" fontWeight="bold" fontFamily="Arial">
        80
      </text>
    </svg>
  )
}

export function SpeedLimit100() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <text x="100" y="120" textAnchor="middle" fill="#000000" fontSize="64" fontWeight="bold" fontFamily="Arial">
        100
      </text>
    </svg>
  )
}

export function SpeedLimit120() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <text x="100" y="120" textAnchor="middle" fill="#000000" fontSize="64" fontWeight="bold" fontFamily="Arial">
        120
      </text>
    </svg>
  )
}

export function NoEntry() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#CC0000" stroke="#FFFFFF" strokeWidth="6" />
      <rect x="30" y="85" width="140" height="30" rx="4" fill="#FFFFFF" />
    </svg>
  )
}

export function NoParking() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <text x="100" y="125" textAnchor="middle" fill="#0066CC" fontSize="72" fontWeight="bold" fontFamily="Arial">
        P
      </text>
      <line x1="35" y1="165" x2="165" y2="35" stroke="#CC0000" strokeWidth="12" />
    </svg>
  )
}

export function NoPassing() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <ellipse cx="75" cy="110" rx="28" ry="35" fill="#000000" />
      <ellipse cx="125" cy="110" rx="28" ry="35" fill="#CC0000" />
      <line x1="35" y1="165" x2="165" y2="35" stroke="#CC0000" strokeWidth="12" />
    </svg>
  )
}

export function NoUTurn() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <path d="M 80 150 L 80 80 A 30 30 0 0 1 140 80 L 140 100 L 155 85 L 140 70 L 140 80 A 30 30 0 0 0 80 80" fill="none" stroke="#000000" strokeWidth="8" />
      <line x1="35" y1="165" x2="165" y2="35" stroke="#CC0000" strokeWidth="12" />
    </svg>
  )
}

export function NoHorn() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#CC0000" strokeWidth="12" />
      <path d="M 60 90 L 85 90 L 130 60 L 130 140 L 85 110 L 60 110 Z" fill="#000000" />
      <line x1="35" y1="165" x2="165" y2="35" stroke="#CC0000" strokeWidth="12" />
    </svg>
  )
}

export function GiveWay() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon
        points="100,180 15,30 185,30"
        fill="#FFFFFF"
        stroke="#CC0000"
        strokeWidth="10"
        transform="rotate(180, 100, 100)"
      />
    </svg>
  )
}

export function Roundabout() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill="#0066CC" stroke="#FFFFFF" strokeWidth="6" />
      <circle cx="100" cy="95" r="30" fill="none" stroke="#FFFFFF" strokeWidth="6" />
      <polygon points="125,80 140,70 130,95" fill="#FFFFFF" />
      <polygon points="100,150 90,130 110,130" fill="#FFFFFF" />
    </svg>
  )
}

export function PedestrianCrossing() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFFFFF" stroke="#CC0000" strokeWidth="6" />
      <circle cx="100" cy="65" r="10" fill="#000000" />
      <line x1="100" y1="75" x2="100" y2="120" stroke="#000000" strokeWidth="5" />
      <line x1="85" y1="95" x2="115" y2="90" stroke="#000000" strokeWidth="4" />
      <line x1="100" y1="120" x2="85" y2="155" stroke="#000000" strokeWidth="4" />
      <line x1="100" y1="120" x2="115" y2="155" stroke="#000000" strokeWidth="4" />
      <rect x="70" y="140" width="60" height="4" fill="#000000" />
      <rect x="70" y="148" width="60" height="4" fill="#000000" />
      <rect x="70" y="156" width="60" height="4" fill="#000000" />
    </svg>
  )
}

export function SchoolZone() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <circle cx="85" cy="80" r="8" fill="#000000" />
      <circle cx="115" cy="80" r="8" fill="#000000" />
      <line x1="85" y1="88" x2="85" y2="120" stroke="#000000" strokeWidth="4" />
      <line x1="115" y1="88" x2="115" y2="120" stroke="#000000" strokeWidth="4" />
      <line x1="85" y1="120" x2="75" y2="150" stroke="#000000" strokeWidth="3" />
      <line x1="85" y1="120" x2="95" y2="150" stroke="#000000" strokeWidth="3" />
      <line x1="115" y1="120" x2="105" y2="150" stroke="#000000" strokeWidth="3" />
      <line x1="115" y1="120" x2="125" y2="150" stroke="#000000" strokeWidth="3" />
    </svg>
  )
}

export function TrafficLight() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="65" y="15" width="70" height="170" rx="8" fill="#333333" stroke="#000000" strokeWidth="3" />
      <circle cx="100" cy="55" r="22" fill="#CC0000" />
      <circle cx="100" cy="105" r="22" fill="#FFC107" />
      <circle cx="100" cy="155" r="22" fill="#00AA00" />
    </svg>
  )
}

export function RoadNarrows() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 70 150 L 90 60 L 95 60 L 75 150 Z" fill="#000000" />
      <path d="M 130 150 L 110 60 L 105 60 L 125 150 Z" fill="#000000" />
    </svg>
  )
}

export function SharpCurveRight() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 80 150 L 80 90 Q 80 60 110 60 L 130 60" fill="none" stroke="#000000" strokeWidth="10" />
      <polygon points="125,45 145,60 125,75" fill="#000000" />
    </svg>
  )
}

export function SharpCurveLeft() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 120 150 L 120 90 Q 120 60 90 60 L 70 60" fill="none" stroke="#000000" strokeWidth="10" />
      <polygon points="75,45 55,60 75,75" fill="#000000" />
    </svg>
  )
}

export function SteepHill() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 55 145 L 145 65" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
      <text x="130" y="60" textAnchor="middle" fill="#000000" fontSize="24" fontWeight="bold" fontFamily="Arial">
        %
      </text>
    </svg>
  )
}

export function SlipperyRoad() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 70 140 Q 85 120 100 130 Q 115 140 130 120" fill="none" stroke="#000000" strokeWidth="6" />
      <rect x="85" y="75" width="30" height="15" rx="3" fill="#000000" />
      <line x1="85" y1="90" x2="75" y2="130" stroke="#000000" strokeWidth="4" />
      <line x1="115" y1="90" x2="125" y2="130" stroke="#000000" strokeWidth="4" />
    </svg>
  )
}

export function MergeLanes() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 80 150 L 100 60" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
      <path d="M 120 150 L 100 60" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

export function SpeedBump() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon points="100,10 190,180 10,180" fill="#FFC107" stroke="#000000" strokeWidth="4" />
      <path d="M 50 130 Q 100 70 150 130" fill="none" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
    </svg>
  )
}

export function OneWay() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="10" y="70" width="180" height="60" fill="#0066CC" stroke="#FFFFFF" strokeWidth="4" />
      <polygon points="150,75 185,100 150,125" fill="#FFFFFF" />
      <text x="85" y="108" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="bold" fontFamily="Arial">
        ONE WAY
      </text>
    </svg>
  )
}

export function ParkingSign() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="15" y="15" width="170" height="170" fill="#0066CC" stroke="#FFFFFF" strokeWidth="6" />
      <text x="100" y="130" textAnchor="middle" fill="#FFFFFF" fontSize="100" fontWeight="bold" fontFamily="Arial">
        P
      </text>
    </svg>
  )
}

export function HospitalSign() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="15" y="15" width="170" height="170" fill="#0066CC" stroke="#FFFFFF" strokeWidth="6" />
      <rect x="85" y="45" width="30" height="110" fill="#FFFFFF" />
      <rect x="45" y="85" width="110" height="30" fill="#FFFFFF" />
    </svg>
  )
}

export function FuelStation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="15" y="15" width="170" height="170" fill="#0066CC" stroke="#FFFFFF" strokeWidth="6" />
      <rect x="55" y="55" width="55" height="80" rx="4" fill="#FFFFFF" />
      <rect x="65" y="65" width="35" height="25" fill="#0066CC" />
      <path d="M 120 70 L 140 55 L 140 120 L 130 120 L 130 85 L 120 80 Z" fill="#FFFFFF" />
    </svg>
  )
}
