// src/components/Roating-icon.tsx
"use client"

import { useEffect, useState } from "react"

const innerIcons = [
  { name: "Facebook", color: "bg-blue-600", icon: "/facebook.png" },
  { name: "TikTok", color: "bg-black", icon: "/tiktok.png" },
  { name: "Instagram", color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400", icon: "/instagram.png" },
  { name: "WhatsApp", color: "bg-green-500", icon: "/whatsapp.png" },
]

const outerIcons = [
  { name: "Shopee", color: "bg-orange-500", icon: "/shopee.png" },
  { name: "Line", color: "bg-green-500", icon: "/line.png" },
  { name: "Telegram", color: "bg-blue-400", icon: "/telegram.png" },
  { name: "Google", color: "bg-white", icon: "/google.png" },
]

// --- BÁN KÍNH VÀ KÍCH THƯỚC (GIỮ NGUYÊN) ---
const MOBILE_CONTAINER_SIZE = 360 
const MOBILE_OUTER_RADIUS = 150 
const MOBILE_INNER_RADIUS = 105 

const SM_OUTER_RADIUS = 180 
const MD_OUTER_RADIUS = 250 

const SM_INNER_RADIUS = 90
const MD_INNER_RADIUS = 150
// ---------------------------------------------

const getRadius = (isOuter: boolean) => {
  if (typeof window === 'undefined') {
    return isOuter ? MOBILE_OUTER_RADIUS : MOBILE_INNER_RADIUS;
  }
  
  const width = window.innerWidth;
  
  if (isOuter) {
    if (width >= 768) return MD_OUTER_RADIUS;
    if (width >= 640) return SM_OUTER_RADIUS;
    return MOBILE_OUTER_RADIUS;
  } else {
    if (width >= 768) return MD_INNER_RADIUS;
    if (width >= 640) return SM_INNER_RADIUS;
    return MOBILE_INNER_RADIUS;
  }
};


export default function RotatingIcons() {
  const [rotation, setRotation] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])
  
  if (!isClient) {
      return (
        <div className={`relative w-[${MOBILE_CONTAINER_SIZE}px] h-[${MOBILE_CONTAINER_SIZE}px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] flex items-center justify-center`}>
            {/* Giữ chỗ cho component */}
        </div>
      )
  }

  const outerRadius = getRadius(true);
  const innerRadius = getRadius(false);


  return (
    <div className={`relative w-[${MOBILE_CONTAINER_SIZE}px] h-[${MOBILE_CONTAINER_SIZE}px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] flex items-center justify-center`}>
      
      {/* Outer circle ring (Đảm bảo căn giữa) */}
      <div className="absolute w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full border-4 border-purple-200/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Inner circle ring (Đảm bảo căn giữa) */}
      <div className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] rounded-full border-2 border-purple-200/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />


      {/* Outer icons container */}
      <div
        className="absolute w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] **top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2**"
        style={{
          transform: `rotate(-${rotation}deg)`,
          transition: "transform 0.03s linear",
        }}
      >
        {outerIcons.map((social, index) => {
          const angle = (index * 360) / outerIcons.length + 45
          const radian = (angle * Math.PI) / 180
          
          const x = Math.cos(radian) * outerRadius
          const y = Math.sin(radian) * outerRadius

          return (
            <div
              key={social.name}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-3xl bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <img src={social.icon} alt={social.name} className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Inner icons container */}
      <div
        className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] **top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2**"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.03s linear",
        }}
      >
        {innerIcons.map((social, index) => {
          const angle = (index * 360) / innerIcons.length
          const radian = (angle * Math.PI) / 180
          
          const x = Math.cos(radian) * innerRadius
          const y = Math.sin(radian) * innerRadius

          return (
            <div
              key={social.name}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(-${rotation}deg)`,
              }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-3xl bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <img src={social.icon} alt={social.name} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Center logo (Giữ nguyên) */}
      <div className="relative z-10 w-36 h-36 sm:w-32 sm:h-32 rounded-full bg-white shadow-2xl flex items-center justify-center">
        <div className="w-20 h-20 sm:w-16 sm:h-16 flex items-center justify-center">
          <img src="/logomi.svg" className="w-16 h-16 sm:w-14 sm:h-14 object-contain" />
        </div>
      </div>
    </div>
  )
}