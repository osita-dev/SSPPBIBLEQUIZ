import { motion } from "framer-motion";
import { useQuizStore } from "../store/useQuizStore";
import { Play } from "lucide-react";
import parishLogo from "../assets/parish-logo.jpeg";

export default function HomePage() {
  const { startGame } = useQuizStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 py-10 relative overflow-hidden">
      {/* Floating cross watermarks */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="float-cross absolute text-royal font-serif text-7xl select-none pointer-events-none"
          style={{
            left: `${10 + i * 20}%`,
            top: `${15 + (i % 3) * 25}%`,
            animationDelay: `${i * 1.2}s`,
          }}
        >✝</div>
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Parish 70th Anniversary emblem */}
        <div className="w-40 h-54 shadow-royal glow-pulse overflow-hidden border-4 border-gold bg-white">
          <img
            src={parishLogo}
            alt="SS Peter & Paul Catholic Church Shomolu — 70th Anniversary emblem"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <p className="font-nunito text-royal/60 text-sm font-bold uppercase tracking-widest">Welcome to</p>
          <h1 className="font-fredoka text-4xl text-royal leading-tight">
          SS Peter & Paul Catholic Church Shomolu
          </h1>
          <h2 className="font-fredoka text-2xl text-gold-deep">
            Quiz Challenge
          </h2>
          <p className="font-nunito text-royal/60 text-sm mt-3 leading-relaxed">
            Spin the wheel. Answer the question.<br />
            WIN PRIZES!
          </p>
        </div>

        {/* CTA */}
        <motion.button
          onClick={startGame}
          className="ripple-btn relative w-full bg-gold hover:bg-gold-deep text-royal font-fredoka text-2xl py-4 rounded-2xl shadow-gold flex items-center justify-center gap-3 transition-colors duration-200"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
        >
          <Play className="w-6 h-6 fill-current" />
          Start Playing!
        </motion.button>

        
      </motion.div>
    </div>
  );
}