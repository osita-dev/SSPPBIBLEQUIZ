import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useQuizStore } from "../store/useQuizStore";
import { SPIN_DURATION_MS } from "../hooks/useSpinLogic";

const SEGMENTS = 8;
const COLORS = [
  "#F5A623", "#3B1F6E", "#D97706", "#5B3FA6",
  "#F5A623", "#3B1F6E", "#D97706", "#7C5CBF",
];
const LABELS = ["✝", "?", "★", "✝", "?", "★", "✝", "?"];

export default function SpinWheel() {
  const { phase, spinDegrees, triggerSpin } = useQuizStore();
  const controls = useAnimation();

  const isIdle = phase === "idle";
  const isSpinning = phase === "spinning";
  const canTap = isIdle; // only tappable while waiting, not mid-spin

  useEffect(() => {
    if (phase === "spinning") {
      controls.set({ rotate: 0 });
      controls.start({
        rotate: spinDegrees,
        transition: {
          duration: SPIN_DURATION_MS / 1000,
          ease: [0.17, 0.67, 0.21, 1],
        },
      });
    }
  }, [phase, spinDegrees, controls]);

  const handleTap = () => {
    if (canTap) triggerSpin();
  };

  const r = 120;
  const cx = 140;
  const cy = 140;
  const segAngle = 360 / SEGMENTS;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeSlice = (startAngle: number, endAngle: number) => {
    const s = polarToCartesian(startAngle, r);
    const e = polarToCartesian(endAngle, r);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pointer */}
      <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-gold-deep drop-shadow-lg z-10" />

      {/* Wheel — tappable when idle */}
      <motion.div
        className="relative"
        onClick={handleTap}
        role="button"
        tabIndex={canTap ? 0 : -1}
        aria-label="Tap to spin the wheel"
        aria-disabled={!canTap}
        onKeyDown={(e) => {
          if (canTap && (e.key === "Enter" || e.key === " ")) handleTap();
        }}
        style={{ cursor: canTap ? "pointer" : "default" }}
        whileTap={canTap ? { scale: 0.94 } : {}}
        animate={canTap ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={canTap ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <motion.svg
          width={280}
          height={280}
          viewBox="0 0 280 280"
          animate={controls}
          style={{ originX: "50%", originY: "50%" }}
          className="drop-shadow-[0_8px_32px_rgba(59,31,110,0.35)]"
        >
          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={r + 10} fill="#3B1F6E" />

          {/* Segments */}
          {COLORS.map((color, i) => {
            const start = i * segAngle;
            const end = start + segAngle;
            const mid = start + segAngle / 2;
            const lp = polarToCartesian(mid, r * 0.65);
            return (
              <g key={i}>
                <path d={describeSlice(start, end)} fill={color} stroke="#FDF8EE" strokeWidth={2} />
                <text
                  x={lp.x} y={lp.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={22}
                  fill="#FDF8EE"
                  fontFamily="serif"
                  style={{ userSelect: "none" }}
                >
                  {LABELS[i]}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={22} fill="#F5A623" stroke="#FDF8EE" strokeWidth={4} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#3B1F6E" fontWeight="bold">✝</text>
        </motion.svg>

        {/* Glow ring when spinning */}
        {isSpinning && (
          <div className="absolute inset-0 rounded-full pointer-events-none animate-ping opacity-20 bg-gold" />
        )}

        {/* Soft tap-hint glow when idle */}
        {canTap && (
          <div className="absolute inset-0 rounded-full pointer-events-none opacity-25 bg-gold blur-xl -z-10" />
        )}
      </motion.div>
    </div>
  );
}