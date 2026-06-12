import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsSun, BsMoon, BsClock } from "react-icons/bs";

/** Hook to provide live time parts */
function useTime(is24h) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = is24h
    ? time.getHours().toString().padStart(2, "0")
    : ((time.getHours() + 11) % 12 + 1).toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  return {
    hours,
    minutes,
    seconds,
    ampm,
    day: time.toLocaleDateString(undefined, { weekday: "long" }),
    date: time.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

/** Ambient blurred circles background */
function AmbientBackground() {
  const circles = [
    {
      className: "bg-emerald-400/30 w-72 h-72 rounded-full filter blur-3xl absolute",
      style: { top: "-10%", left: "-20%" },
      animate: {
        x: [0, 30, 0],
        y: [0, 20, 0],
        rotate: [0, 360],
        transition: { repeat: Infinity, duration: 30, ease: "linear" },
      },
    },
    {
      className: "bg-cyan-400/30 w-96 h-96 rounded-full filter blur-3xl absolute",
      style: { bottom: "-15%", right: "-25%" },
      animate: {
        x: [0, -40, 0],
        y: [0, -30, 0],
        rotate: [0, -360],
        transition: { repeat: Infinity, duration: 35, ease: "linear" },
      },
    },
    {
      className: "bg-fuchsia-400/30 w-80 h-80 rounded-full filter blur-3xl absolute",
      style: { top: "30%", right: "-15%" },
      animate: {
        x: [0, 20, 0],
        y: [0, 25, 0],
        rotate: [0, 360],
        transition: { repeat: Infinity, duration: 40, ease: "linear" },
      },
    },
  ];

  return (
    <>
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className={c.className}
          style={c.style}
          animate={c.animate}
        />
      ))}
    </>
  );
}

/** Toggle for 12h/24h format */
function FormatToggle({ is24h, setIs24h }) {
  return (
    <button
      onClick={() => setIs24h((p) => !p)}
      className="flex items-center space-x-2 rounded-full px-3 py-1.5 bg-white/20 backdrop-blur-sm text-sm font-medium text-white transition-colors hover:bg-white/30"
    >
      <BsClock className="text-xl" />
      <span>{is24h ? "24‑Hour" : "12‑Hour"}</span>
    </button>
  );
}

/** Light/Dark theme switcher */
function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark") ?? true
  );
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  };
  return (
    <button
      onClick={toggle}
      className="rounded-full p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
    >
      {isDark ? <BsMoon className="text-2xl" /> : <BsSun className="text-2xl" />}
    </button>
  );
}

/** Glassmorphic card wrapper */
function DashboardCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center gap-6 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-md w-full"
    >
      {children}
    </motion.div>
  );
}

/** Clock component with animated digit transitions */
function Clock({ time, is24h }) {
  const digitVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };
  const AnimatedDigits = ({ value }) => (
    <AnimatePresence mode="popLayout" key={value}>
      {value.split("").map((c, i) => (
        <motion.span
          key={i}
          variants={digitVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="inline-block"
        >
          {c}
        </motion.span>
      ))}
    </AnimatePresence>
  );
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-2 text-emerald-400 font-mono text-6xl md:text-7xl">
        <AnimatedDigits value={time.hours} />
        <span>:</span>
        <AnimatedDigits value={time.minutes} />
        <span>:</span>
        <AnimatedDigits value={time.seconds} />
      </div>
      {!is24h && (
        <motion.span
          className="text-emerald-300 text-sm"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          {time.ampm}
        </motion.span>
      )}
    </div>
  );
}

/** Date display component */
function DateDisplay({ day, date }) {
  return (
    <div className="text-white/80 text-sm md:text-base text-center space-y-1">
      <div className="font-medium">{day}</div>
      <div>{date}</div>
    </div>
  );
}

/** Main app */
export default function App() {
  const [is24h, setIs24h] = useState(false);
  const time = useTime(is24h);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900 dark:bg-black font-sans">
      <AmbientBackground />
      <DashboardCard>
        <div className="flex w-full justify-between">
          <ThemeToggle />
          <FormatToggle is24h={is24h} setIs24h={setIs24h} />
        </div>
        <DateDisplay day={time.day} date={time.date} />
        <Clock time={time} is24h={is24h} />
      </DashboardCard>
    </div>
  );
}