import { motion } from "framer-motion";
import { useQuizStore, ROUND_LIMIT } from "../store/useQuizStore";
import { Trophy, Target, XCircle, RotateCcw, Percent } from "lucide-react";
import parishLogo from "../assets/parish-logo.jpeg";

export default function GameOverScreen() {
  const { score, totalRevealed, prize, playAgain } = useQuizStore();

  // Percentage = correct ÷ ROUND_LIMIT (always out of 10, honest fixed denominator)
  const percentage = Math.round((score / ROUND_LIMIT) * 100);
  const wrong = totalRevealed - score;

  const getPerfMessage = () => {
    if (percentage === 100) return "Perfect score! 🏆";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 60) return "Good effort! 💪";
    if (percentage >= 40) return "Keep practicing! 📖";
    return "Better luck next time! 🙏";
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background watermark */}
      <img
        src={parishLogo}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-contain opacity-[0.04] pointer-events-none select-none"
      />

      <motion.div
        className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Logo */}
        <div className="w-24 h-24 overflow-hidden border-4 border-gold shadow-royal glow-pulse bg-white">
          <img
            src={parishLogo}
            alt="SS Peter & Paul emblem"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <p className="font-nunito text-royal/50 text-sm font-bold uppercase tracking-widest mb-1">
            Game Over
          </p>
          <h1 className="font-fredoka text-4xl text-royal">Round Summary</h1>
          <p className="font-nunito text-royal/60 text-sm mt-1">
            {getPerfMessage()}
          </p>
        </div>

        {/* Stats grid */}
        <div className="w-full grid grid-cols-2 gap-3">
          {/* Correct */}
          <motion.div
            className="bg-white rounded-2xl p-4 text-center shadow-card border border-royal/8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="font-fredoka text-3xl text-green-500">{score}</p>
            <p className="text-xs text-royal/50 font-bold uppercase tracking-wide">
              Correct
            </p>
            <p className="text-[10px] text-royal/30 mt-0.5">out of {ROUND_LIMIT}</p>
          </motion.div>

          {/* Wrong */}
          <motion.div
            className="bg-white rounded-2xl p-4 text-center shadow-card border border-royal/8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="font-fredoka text-3xl text-red-400">{wrong}</p>
            <p className="text-xs text-royal/50 font-bold uppercase tracking-wide">
              Wrong
            </p>
            <p className="text-[10px] text-royal/30 mt-0.5">answered {totalRevealed}</p>
          </motion.div>

          {/* Percentage — always score ÷ 10 */}
          <motion.div
            className="bg-white rounded-2xl p-4 text-center shadow-card border border-royal/8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Percent className="w-5 h-5 text-gold mx-auto mb-1" />
            <p className="font-fredoka text-3xl text-gold">{percentage}%</p>
            <p className="text-xs text-royal/50 font-bold uppercase tracking-wide">
              Score %
            </p>
            <p className="text-[10px] text-royal/30 mt-0.5">
              {score} ÷ {ROUND_LIMIT} × 100
            </p>
          </motion.div>

          {/* Prize */}
          <motion.div
            className="bg-royal rounded-2xl p-4 text-center shadow-royal glow-pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Trophy className="w-5 h-5 text-gold mx-auto mb-1" />
            <p className="font-fredoka text-2xl text-gold">
              ₦{prize.toLocaleString()}
            </p>
            <p className="text-xs text-gold/60 font-bold uppercase tracking-wide">
              Prize Won
            </p>
          </motion.div>
        </div>

        {/* Play Again */}
        <motion.button
          onClick={playAgain}
          className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-deep text-royal font-fredoka text-2xl py-4 rounded-2xl shadow-gold transition-colors ripple-btn relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}