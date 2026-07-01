import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------------------------------------------
// Helper: SVG Tendrils Background
// -------------------------------------------------------------
const EnergyTendrils = ({ activeColor }) => (
  <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <motion.path
      d="M 200 400 Q 400 300 600 500 T 1000 400"
      fill="transparent"
      stroke={activeColor}
      strokeWidth="2"
      filter="url(#glow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
    <motion.path
      d="M 300 600 Q 500 700 700 400 T 1200 600"
      fill="transparent"
      stroke={activeColor}
      strokeWidth="1.5"
      filter="url(#glow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.2 }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1 }}
    />
  </svg>
);

// -------------------------------------------------------------
// Live Time Hook
// -------------------------------------------------------------
function useTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const rawHours = time.getHours();
  const hours = rawHours % 12 || 12;
  const strHours = hours.toString().padStart(2, "0");
  const strMins = time.getMinutes().toString().padStart(2, "0");
  const strSecs = time.getSeconds().toString().padStart(2, "0");
  const ampm = rawHours >= 12 ? "PM" : "AM";

  let greeting = "Good Morning";
  if (rawHours >= 12 && rawHours < 17) greeting = "Good Afternoon";
  else if (rawHours >= 17 && rawHours < 22) greeting = "Good Evening";
  else if (rawHours >= 22 || rawHours < 5) greeting = "Late Night";

  return {
    hours: strHours,
    minutes: strMins,
    seconds: strSecs,
    ampm,
    greeting,
    date: time.toLocaleDateString(undefined, { year: "numeric", month: "long" }),
  };
}

// -------------------------------------------------------------
// Particle System
// -------------------------------------------------------------
const Particles = ({ color }) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const arr = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "vw",
      size: Math.random() * 6 + 2 + "px",
      duration: Math.random() * 10 + 10 + "s",
      delay: Math.random() * 10 + "s",
    }));
    setParticles(arr);
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left,
          width: p.size,
          height: p.size,
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          animationDuration: p.duration,
          animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
};


// -------------------------------------------------------------
// Main Application Component
// -------------------------------------------------------------
export default function App() {
  const time = useTime();

  const themes = [
    { id: "neon", label: "Neon Digital", color: "#06b6d4", shape: "30% 70% 50% 50% / 50% 40% 60% 50%" },
    { id: "purple", label: "Purple", color: "#d946ef", shape: "60% 40% 70% 30% / 40% 60% 40% 60%" },
    { id: "cyan", label: "Cyan", color: "#0ea5e9", shape: "40% 60% 30% 70% / 60% 30% 70% 40%" },
    { id: "blue", label: "Blue", color: "#3b82f6", shape: "50% 50% 40% 60% / 30% 70% 50% 50%" },
    { id: "light", label: "Light", color: "#f59e0b", shape: "70% 30% 50% 50% / 50% 50% 50% 50%" },
  ];

  const colors = [
    { name: "Emerald", value: "#10b981", shape: "40% 60% 60% 40% / 70% 50% 50% 30%" },
    { name: "Fartny", value: "#e11d48", shape: "60% 40% 50% 50% / 30% 60% 40% 70%" },
    { name: "Cyan", value: "#06b6d4", shape: "50% 50% 40% 60% / 50% 40% 60% 50%" },
    { name: "Dink", value: "#d97706", shape: "30% 70% 70% 30% / 60% 30% 70% 40%" },
    { name: "Purple", value: "#7e22ce", shape: "70% 30% 40% 60% / 40% 70% 30% 60%" },
  ];

  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [activeColor, setActiveColor] = useState(colors[2]); // Default Cyan

  // Continuous floating animation
  const floatAnim = {
    y: ["-15px", "15px"],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }} className="text-white">
      
      {/* Background Ambience */}
      <Particles color={activeColor.value} />
      <EnergyTendrils activeColor={activeColor.value} />

      {/* LEFT SIDE: Themes */}
      <div style={{ position: "absolute", left: "5%", top: "15%", display: "flex", flexDirection: "column", gap: "40px", zIndex: 10 }}>
        {themes.map((t, i) => (
          <motion.div 
            key={t.id} 
            animate={{ y: [-(10 + i*2), 10 + i*2] }} 
            transition={{ duration: 3 + i*0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <div 
              onClick={() => setActiveTheme(t)}
              className="resin-pod"
              style={{
                width: "80px", 
                height: "80px", 
                borderRadius: t.shape,
                cursor: "pointer",
                '--pod-glow': activeTheme.id === t.id ? t.color : 'transparent',
                border: activeTheme.id === t.id ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Internal Filament Simulation */}
              <div style={{ width: "100%", height: "100%", borderRadius: "inherit", background: `radial-gradient(circle at 30% 30%, ${t.color}88 0%, transparent 60%)`, mixBlendMode: "screen" }} />
            </div>
            <span style={{ fontFamily: "sans-serif", fontSize: "1.1rem", fontWeight: "300", letterSpacing: "1px", textShadow: activeTheme.id === t.id ? `0 0 10px ${t.color}` : 'none' }}>
              {t.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CENTER: Quartz Clock Panel */}
      <div style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
        <motion.div animate={floatAnim}>
          <div 
            className="quartz-panel" 
            style={{
              width: "700px", 
              height: "400px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              padding: "40px",
              '--glow-color': `${activeColor.value}44`
            }}
          >
            {/* Top Metadata */}
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 40px", marginBottom: "20px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "500", letterSpacing: "2px" }}>{time.greeting}</span>
              <div style={{ textAlign: "right", fontFamily: "'Roboto Mono', monospace", color: "#cbd5e1" }}>
                <div>{time.date}</div>
                <div>12H {time.ampm}</div>
              </div>
            </div>

            {/* Glowing Etched Digital Numbers */}
            <div 
              className="etched-text"
              style={{
                fontSize: "8rem",
                fontWeight: "700",
                fontFamily: "'Orbitron', 'Roboto Mono', sans-serif",
                letterSpacing: "4px",
                '--glow-color': `${activeColor.value}88`
              }}
            >
              {time.hours}:{time.minutes}:{time.seconds}
            </div>
          </div>

          {/* Curved Metal Bracket Footer */}
          <div 
            className="metal-bracket"
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "500px",
              height: "60px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "10px",
              zIndex: -1
            }}
          >
            <span style={{ fontSize: "0.8rem", letterSpacing: "4px", fontWeight: "600", color: "#a3a3a3", textShadow: "0 2px 4px rgba(0,0,0,1)" }}>
              DEVELOPED BY VEDRAJ SINGH
            </span>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Cascading Color Pods */}
      <div style={{ position: "absolute", right: "5%", top: "10%", display: "flex", flexDirection: "column", gap: "30px", zIndex: 10 }}>
        {colors.map((c, i) => (
          <motion.div 
            key={c.name} 
            animate={{ y: [15 + i*3, -(15 + i*3)] }} 
            transition={{ duration: 4 + i*0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: i * 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: "20px", flexDirection: "row-reverse" }}
          >
            <div 
              onClick={() => setActiveColor(c)}
              className="resin-pod"
              style={{
                width: "90px", 
                height: "110px", 
                borderRadius: c.shape,
                cursor: "pointer",
                '--pod-glow': activeColor.name === c.name ? `${c.value}AA` : 'transparent',
                border: activeColor.name === c.name ? `1px solid ${c.value}` : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Internal Bloom Light */}
              <div style={{ width: "100%", height: "100%", borderRadius: "inherit", background: `radial-gradient(circle at 50% 50%, ${c.value}99 0%, transparent 70%)` }} />
            </div>
            <span style={{ fontFamily: "sans-serif", fontSize: "1rem", fontWeight: "400", letterSpacing: "1px", color: activeColor.name === c.name ? "#fff" : "#94a3b8" }}>
              {c.name}
            </span>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
