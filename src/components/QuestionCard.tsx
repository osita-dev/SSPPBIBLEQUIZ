import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "../store/useQuizStore";
import AnswerOption from "./AnswerOption";
import { BookOpen, SkipForward } from "lucide-react";

export default function QuestionCard() {
  const { currentQuestion, phase, skipQuestion, answerState } = useQuizStore();

  if (!currentQuestion) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, scale: 0.7, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -40 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="w-full max-w-lg mx-auto"
      >
        {/* Category badge */}
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1.5 bg-royal/10 text-royal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            {currentQuestion.category}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-card border border-royal/8 p-6 mb-4">
          <p className="font-nunito font-extrabold text-xl text-royal leading-snug text-center">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-4">
          {currentQuestion.options.map((opt, i) => (
            <AnswerOption
              key={i}
              index={i}
              text={opt}
              correctIndex={currentQuestion.correct}
            />
          ))}
        </div>

        {/* Skip button — only when in question phase, not feedback */}
        {phase === "question" && answerState === "idle" && (
          <motion.button
            onClick={skipQuestion}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold text-royal/50 hover:text-royal/80 py-2 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <SkipForward className="w-4 h-4" />
            Skip this question
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
