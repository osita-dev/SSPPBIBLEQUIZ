import { motion } from "framer-motion";
import { useQuizStore } from "../store/useQuizStore";
import { Trophy, Zap, SkipForward } from "lucide-react";

const JACKPOT = 8000;

export default function ScoreBoard() {
  const { score, totalAnswered, totalSkipped, prize } = useQuizStore();
  const jackpotPct = Math.min((prize / JACKPOT) * 100, 100);

  return (
    <div className="w-full max-w-lg mx-auto grid grid-cols-3 gap-3 mb-6">
      {/* Score */}
      <motion.div
        className="bg-white rounded-2xl p-3 text-center shadow-card border border-royal/8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Zap className="w-4 h-4 text-gold mx-auto mb-1" />
        <p className="font-fredoka text-2xl text-royal">{score}</p>
        <p className="text-[11px] text-royal/50 font-bold uppercase tracking-wide">Correct</p>
      </motion.div>

      {/* Prize — center, bigger */}
      <motion.div
        className="bg-royal rounded-2xl p-3 text-center shadow-royal glow-pulse col-span-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Trophy className="w-4 h-4 text-gold mx-auto mb-1" />
        <p className="font-fredoka text-xl text-gold">₦{prize.toLocaleString()}</p>
        <div className="w-full bg-royal-light/40 rounded-full h-1.5 mt-1.5">
          <motion.div
            className="bg-gold h-1.5 rounded-full"
            animate={{ width: `${jackpotPct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <p className="text-[10px] text-gold/60 font-bold mt-1">of ₦8,000 jackpot</p>
      </motion.div>

      {/* Answered */}
      <motion.div
        className="bg-white rounded-2xl p-3 text-center shadow-card border border-royal/8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SkipForward className="w-4 h-4 text-royal/40 mx-auto mb-1" />
        <p className="font-fredoka text-2xl text-royal">{totalAnswered + totalSkipped}</p>
        <p className="text-[11px] text-royal/50 font-bold uppercase tracking-wide">Played</p>
      </motion.div>
    </div>
  );
}
