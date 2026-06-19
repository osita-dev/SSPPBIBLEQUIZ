import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "../store/useQuizStore";
import { useSpinLogic, QUESTION_TIME_LIMIT } from "../hooks/useSpinLogic";
import { Trophy, Zap, SkipForward, Timer } from "lucide-react";

const JACKPOT = 8000;

export default function ScoreBoard() {
  const { score, totalAnswered, totalSkipped, prize, phase } = useQuizStore();
  const { timeLeft } = useSpinLogic();

  const jackpotPct = Math.min((prize / JACKPOT) * 100, 100);
  const isQuestion = phase === "question";
  const timePct = (timeLeft / QUESTION_TIME_LIMIT) * 100;

  // Color shifts as time gets low
  const timerColor =
    timeLeft > 6 ? "text-green-500" :
    timeLeft > 3 ? "text-amber-500" :
    "text-red-500";

  const timerRingColor =
    timeLeft > 6 ? "bg-green-500" :
    timeLeft > 3 ? "bg-amber-500" :
    "bg-red-500";

  const timerBg =
    timeLeft > 6 ? "bg-green-50 border-green-200" :
    timeLeft > 3 ? "bg-amber-50 border-amber-200" :
    "bg-red-50 border-red-200";

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

      {/* CENTER — timer when question active, prize tracker otherwise */}
      <motion.div
        className={`rounded-2xl p-3 text-center col-span-1 border transition-all duration-300 ${
          isQuestion
            ? `${timerBg} shadow-card`
            : "bg-royal shadow-royal glow-pulse"
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AnimatePresence mode="wait">
          {isQuestion ? (
            // COUNTDOWN TIMER
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              <Timer className={`w-4 h-4 mx-auto mb-1 ${timerColor}`} />
              <motion.p
                className={`font-fredoka text-3xl font-bold ${timerColor}`}
                key={timeLeft}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {timeLeft}
              </motion.p>
              {/* Progress bar draining left to right */}
              <div className="w-full bg-royal/10 rounded-full h-1.5 mt-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${timerRingColor}`}
                  animate={{ width: `${timePct}%` }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>
              <p className="text-[10px] text-royal/40 font-bold mt-1">seconds left</p>
            </motion.div>
          ) : (
            // PRIZE TRACKER
            <motion.div
              key="prize"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
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
          )}
        </AnimatePresence>
      </motion.div>

      {/* Played */}
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