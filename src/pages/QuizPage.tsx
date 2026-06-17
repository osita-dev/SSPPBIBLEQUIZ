import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "../store/useQuizStore";
import { useSpinLogic } from "../hooks/useSpinLogic";
import SpinWheel from "../components/SpinWheel";
import QuestionCard from "../components/QuestionCard";
import ScoreBoard from "../components/ScoreBoard";
import FeedbackOverlay from "../components/FeedbackOverlay";
import { RotateCcw, RefreshCw } from "lucide-react";

export default function QuizPage() {
  const { phase, triggerSpin, resetGame } = useQuizStore();
  useSpinLogic();

  const isIdle = phase === "idle";
  const isSpinning = phase === "spinning";
  const showWheel = isIdle || isSpinning;
  const showQuestion = phase === "question" || phase === "feedback";
  const showSpinButton = isIdle || isSpinning; // hidden during question/feedback

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-royal rounded-full w-9 h-9 flex items-center justify-center">
            <span className="text-gold text-lg">✝</span>
          </div>
          <div>
            <p className="font-fredoka text-royal text-base leading-none">SS Peter & Paul Catholic Church Shomolu</p>
            <p className="text-[10px] text-royal/50 font-bold uppercase tracking-wide">Bible Quiz</p>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1 text-xs text-royal/40 hover:text-royal/70 font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Score bar */}
      <div className="px-4 pt-2">
        <ScoreBoard />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pb-8">
        <AnimatePresence mode="wait">
          {/* WHEEL — shown when idle (waiting for tap) or actively spinning */}
          {showWheel && (
            <motion.div
              key="wheel"
              className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35 }}
            >
              <SpinWheel />
              <p className="font-fredoka text-royal/60 text-lg animate-pulse">
                {isSpinning ? "Spinning..." : "Tap below to spin!"}
              </p>
            </motion.div>
          )}

          {/* QUESTION + FEEDBACK */}
          {showQuestion && (
            <motion.div
              key="question"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuestionCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom spin trigger — only when idle (not while spinning, answering, or in feedback) */}
      {showSpinButton && (
        <div className="px-4 pb-6">
          <motion.button
            onClick={triggerSpin}
            disabled={isSpinning}
            className={`w-full max-w-lg mx-auto flex items-center justify-center gap-2 rounded-2xl py-4 font-fredoka text-xl shadow-gold transition-all
              ${isSpinning ? "bg-royal/10 text-royal/30 cursor-not-allowed" : "bg-gold hover:bg-gold-deep text-royal ripple-btn relative"}
            `}
            whileTap={!isSpinning ? { scale: 0.96 } : {}}
            style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
              {isSpinning ? "Spinning..." : "Spin the Wheel!"}
            </span>
          </motion.button>
        </div>
      )}

      <FeedbackOverlay />
    </div>
  );
}