import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsClock, BsPalette, BsGrid1X2 } from "react-icons/bs";

// -------------------------------------------------------------
// Global CSS Injection
// -------------------------------------------------------------
const GLOBAL_STYLES = `
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #e2e8f0;
  }
  
  *, *::before, *::after {
    box-sizing: inherit;
  }

  .ambient-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    z-index: 0;
    animation: drift 20s infinite alternate ease-in-out;
    transition: background 1.5s ease;
  }

  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(60px, 60px) scale(1.15); }
  }

  .floating-footer {
    animation: float-breathe 4s infinite ease-in-out alternate;
  }

  @keyframes float-breathe {
    0% { transform: translateY(0px); opacity: 0.7; }
    100% { transform: translateY(-8px); opacity: 1; }
  }
    
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

// -------------------------------------------------------------
// Helper: Number to Words (for Text Clock Theme)
// -------------------------------------------------------------
const numWords = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const tensWords = ["", "", "Twenty", "Thirty", "Forty", "Fifty"];

function convertToWords(num) {
  if (num < 20) return numWords[num];
  const digit = num % 10;
  return tensWords[Math.floor(num / 10)] + (digit ? " " + numWords[digit] : "");
}

// -------------------------------------------------------------
// Live Time Hook
// -------------------------------------------------------------
function useTime(is24h) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const rawHours = time.getHours();
  const hours = is24h ? rawHours : (rawHours % 12 || 12);
  const strHours = hours.toString().padStart(2, "0");
  const strMins = time.getMinutes().toString().padStart(2, "0");
  const strSecs = time.getSeconds().toString().padStart(2, "0");
  const ampm = rawHours >= 12 ? "PM" : "AM";

  let greeting = "Good Morning";
  if (rawHours >= 12 && rawHours < 17) greeting = "Good Afternoon";
  else if (rawHours >= 17 && rawHours < 22) greeting = "Good Evening";
  else if (rawHours >= 22 || rawHours < 5) greeting = "Late Night, Keep Grinding ✨";

  return {
    raw: time,
    hours: strHours,
    minutes: strMins,
    seconds: strSecs,
    numHours: hours,
    numMinutes: time.getMinutes(),
    numSeconds: time.getSeconds(),
    ampm,
    greeting,
    day: time.toLocaleDateString(undefined, { weekday: "long" }),
    date: time.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
  };
}

// -------------------------------------------------------------
// Sub-Components: Time Renderers
// -------------------------------------------------------------

// 1. Digital Clock (Default)
const DigitalClock = ({ time, accentColor }) => {
  // Ultra Soft Cinematic Cross-Fade (No clipping wrappers!)
  const digitVariants = {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.04, filter: "blur(4px)", position: "absolute" },
  };

  const AnimatedDigit = ({ char }) => (
    // Ghost element technique: invisible character dictates layout space, absolute character animates perfectly over it.
    // Zero overflow hidden! Text shadows glow beautifully!
    <div style={{ position: "relative", display: "inline-block", width: "1ch", textAlign: "center" }}>
      <AnimatePresence>
        <motion.span
          key={char}
          variants={digitVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          style={{ position: "absolute", left: 0, top: 0, width: "100%" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
      <span style={{ visibility: "hidden" }}>{char}</span>
    </div>
  );

  const Section = ({ val }) => (
    <div style={{ display: "flex" }}>
      {val.split("").map((c, i) => <AnimatedDigit key={i} char={c} />)}
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", fontSize: "7rem", fontWeight: "700", fontFamily: "'Roboto Mono', monospace", color: accentColor, textShadow: `0 0 30px ${accentColor}55, 0 0 60px ${accentColor}22` }}>
      <Section val={time.hours} />
      <span style={{ margin: "0 10px", opacity: 0.5, textShadow: "none" }}>:</span>
      <Section val={time.minutes} />
      <span style={{ margin: "0 10px", opacity: 0.5, textShadow: "none" }}>:</span>
      <Section val={time.seconds} />
    </div>
  );
};

// 2. Analog Clock
const AnalogClock = ({ time, accentColor }) => {
  const sRot = (time.numSeconds / 60) * 360;
  const mRot = (time.numMinutes / 60) * 360 + (time.numSeconds / 60) * 6;
  const hRot = ((time.numHours % 12) / 12) * 360 + (time.numMinutes / 60) * 30;

  return (
    <div style={{ position: "relative", width: "250px", height: "250px", borderRadius: "50%", border: `4px solid ${accentColor}44`, background: "rgba(255,255,255,0.02)", boxShadow: `0 0 50px ${accentColor}22, inset 0 0 20px ${accentColor}11`, transition: "all 1s ease" }}>
      <motion.div style={{ position: "absolute", top: "25%", left: "48%", width: "4%", height: "25%", background: "#fff", borderRadius: "4px", transformOrigin: "bottom center", rotate: hRot }} transition={{ type: "spring", stiffness: 50 }} />
      <motion.div style={{ position: "absolute", top: "10%", left: "49%", width: "2%", height: "40%", background: "#cbd5e1", borderRadius: "4px", transformOrigin: "bottom center", rotate: mRot }} transition={{ type: "spring", stiffness: 50 }} />
      <motion.div style={{ position: "absolute", top: "5%", left: "49.5%", width: "1%", height: "45%", background: accentColor, borderRadius: "2px", transformOrigin: "bottom center", rotate: sRot }} transition={{ type: "spring", stiffness: 100 }} />
      <div style={{ position: "absolute", top: "47%", left: "47%", width: "6%", height: "6%", background: accentColor, borderRadius: "50%", boxShadow: `0 0 10px ${accentColor}` }} />
    </div>
  );
};

// 3. Text Clock
const TextClock = ({ time, accentColor }) => {
  const hText = convertToWords(time.numHours);
  const mText = convertToWords(time.numMinutes);
  const sText = convertToWords(time.numSeconds);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "2.5rem", fontWeight: "300", letterSpacing: "2px", textAlign: "center" }}>
      <motion.div key={hText} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: "#fff" }}>{hText} <span style={{ opacity: 0.4, fontSize: "1rem" }}>HOURS</span></motion.div>
      <motion.div key={mText} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}66` }}>{mText} <span style={{ opacity: 0.4, fontSize: "1rem" }}>MINUTES</span></motion.div>
      <motion.div key={sText} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: "#94a3b8" }}>{sText} <span style={{ opacity: 0.4, fontSize: "1rem" }}>SECONDS</span></motion.div>
    </div>
  );
};

// 4. Cyber Clock
const CyberClock = ({ time, accentColor }) => {
  const Block = ({ val }) => (
    <div style={{ background: `${accentColor}11`, border: `2px solid ${accentColor}`, padding: "10px 20px", borderRadius: "8px", margin: "0 10px", color: accentColor, fontFamily: "'Courier New', monospace", fontSize: "5rem", fontWeight: "bold", textShadow: `2px 2px 0px rgba(0,0,0,0.5)`, position: "relative", transition: "all 1s ease" }}>
      {val}
      <div style={{ position: "absolute", top: 0, left: 0, width: "10px", height: "10px", background: accentColor, transition: "background 1s ease" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "10px", height: "10px", background: accentColor, transition: "background 1s ease" }} />
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Block val={time.hours} />
      <span style={{ fontSize: "2rem", color: accentColor, transition: "color 1s ease" }}>//</span>
      <Block val={time.minutes} />
      <span style={{ fontSize: "2rem", color: accentColor, transition: "color 1s ease" }}>//</span>
      <Block val={time.seconds} />
    </div>
  );
};

// 5. Vertical Clock
const VerticalClock = ({ time, accentColor }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "5rem", fontWeight: "800", lineHeight: "1.1", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ color: "#fff" }}>{time.hours}</div>
      <div style={{ color: accentColor, textShadow: `0 0 30px ${accentColor}88`, transition: "all 1s ease" }}>{time.minutes}</div>
      <div style={{ color: "#475569", fontSize: "4rem" }}>{time.seconds}</div>
    </div>
  );
};

// -------------------------------------------------------------
// Main Application Component
// -------------------------------------------------------------
export default function App() {
  const [is24h, setIs24h] = useState(false);
  const [clockTheme, setClockTheme] = useState("digital");
  
  // Master Accent Palette
  const colors = [
    { name: "Cyan", value: "#22d3ee", base: "#083344" },
    { name: "Emerald", value: "#10b981", base: "#064e3b" },
    { name: "Pink", value: "#ec4899", base: "#500724" },
    { name: "Gold", value: "#f59e0b", base: "#451a03" },
    { name: "Purple", value: "#a855f7", base: "#3b0764" },
  ];
  
  const [activeColorObj, setActiveColorObj] = useState(colors[0]);
  const accentColor = activeColorObj.value;

  const time = useTime(is24h);

  const themes = [
    { id: "digital", label: "Neon Digital" },
    { id: "analog", label: "Classic Analog" },
    { id: "text", label: "Fluid Text" },
    { id: "cyber", label: "Cyberpunk Block" },
    { id: "vertical", label: "Vertical Stack" },
  ];

  // Dynamic Background Container (Shifts with theme)
  const appBgStyle = {
    display: "flex",
    width: "100vw",
    height: "100vh",
    position: "relative",
    background: `linear-gradient(135deg, ${activeColorObj.base} 0%, #0f172a 100%)`,
    transition: "background 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  };

  const sidePanelStyle = {
    width: "280px",
    height: "100%",
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    zIndex: 20,
  };

  const rightPanelStyle = {
    ...sidePanelStyle,
    borderRight: "none",
    borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
  };

  const centerAreaStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "650px",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "40px",
    border: `1px solid ${accentColor}33`,
    boxShadow: `0 40px 100px -20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)`,
    transition: "border 1s ease, box-shadow 1s ease",
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      
      <div style={appBgStyle}>
        {/* Dynamic Ambient Background Blobs matching Accent */}
        <div className="ambient-blob" style={{ width: "600px", height: "600px", background: `radial-gradient(circle, ${accentColor}44 0%, transparent 70%)`, top: "-10%", left: "-10%" }} />
        <div className="ambient-blob" style={{ width: "800px", height: "800px", background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`, bottom: "-20%", right: "-10%", animationDelay: "-5s" }} />

        {/* LEFT PANEL: Themes */}
        <div style={sidePanelStyle}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#94a3b8", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>
              <BsGrid1X2 /> Layout Themes
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setClockTheme(t.id)}
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    background: clockTheme === t.id ? `${accentColor}22` : "transparent",
                    border: `1px solid ${clockTheme === t.id ? accentColor : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    color: clockTheme === t.id ? accentColor : "#cbd5e1",
                    cursor: "pointer",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontWeight: clockTheme === t.id ? "600" : "400",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CENTER PANEL: Main Dashboard */}
        <div style={centerAreaStyle}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            style={cardStyle}
          >
            {/* Header: Greeting & Date */}
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <AnimatePresence mode="wait">
                  <motion.div key={time.greeting} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 10 }} style={{ fontSize: "1.2rem", fontWeight: "600", color: "#f8fafc", textShadow: `0 0 15px ${accentColor}66`, transition: "text-shadow 1s" }}>
                    {time.greeting}
                  </motion.div>
                </AnimatePresence>
                <div style={{ fontSize: "0.9rem", color: "#94a3b8", letterSpacing: "1px" }}>{time.day}, {time.date}</div>
              </div>
              
              <button
                onClick={() => setIs24h(!is24h)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: `${accentColor}11`, border: `1px solid ${accentColor}55`, borderRadius: "20px", color: accentColor, fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", transition: "all 0.5s ease" }}
              >
                <BsClock /> {is24h ? "24H" : "12H"}
              </button>
            </div>

            {/* Dynamic Clock Theme Container */}
            <div style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <AnimatePresence mode="wait">
                <motion.div key={clockTheme} initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }} transition={{ duration: 0.4 }}>
                  {clockTheme === "digital" && <DigitalClock time={time} accentColor={accentColor} />}
                  {clockTheme === "analog" && <AnalogClock time={time} accentColor={accentColor} />}
                  {clockTheme === "text" && <TextClock time={time} accentColor={accentColor} />}
                  {clockTheme === "cyber" && <CyberClock time={time} accentColor={accentColor} />}
                  {clockTheme === "vertical" && <VerticalClock time={time} accentColor={accentColor} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* AM/PM Pill */}
            <AnimatePresence>
              {!is24h && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: "30px", padding: "6px 20px", background: `${accentColor}22`, border: `1px solid ${accentColor}`, borderRadius: "20px", color: accentColor, fontWeight: "700", letterSpacing: "2px", transition: "all 0.5s ease" }}>
                  {time.ampm}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Premium Breathing Footer */}
          <div className="floating-footer" style={{ position: "absolute", bottom: "30px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#cbd5e1" }}>
            <span style={{ textShadow: `0 0 15px ${accentColor}`, transition: "text-shadow 1.5s ease" }}>Developed by Vedraj Singh</span>
          </div>
        </div>

        {/* RIGHT PANEL: Accents */}
        <div style={rightPanelStyle}>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", fontWeight: "700", color: "#94a3b8", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>
              <BsPalette /> Accent Colors
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {colors.map((c) => (
                <div key={c.value} onClick={() => setActiveColorObj(c)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", background: accentColor === c.value ? "rgba(255,255,255,0.05)" : "transparent", transition: "background 0.3s" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: c.value, boxShadow: accentColor === c.value ? `0 0 20px ${c.value}` : "none", border: accentColor === c.value ? "2px solid #fff" : "2px solid transparent", transition: "all 0.3s" }} />
                  <span style={{ color: accentColor === c.value ? "#fff" : "#94a3b8", fontWeight: "500", fontSize: "0.9rem", transition: "color 0.3s" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}
