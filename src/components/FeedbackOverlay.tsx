import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "../store/useQuizStore";

export default function FeedbackOverlay() {
  const { phase, answerState } = useQuizStore();
  const show = phase === "feedback";
  const correct = answerState === "correct";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`rounded-3xl px-10 py-6 text-center shadow-2xl ${
              correct ? "bg-green-500" : "bg-red-500"
            }`}
            initial={{ scale: 0.4, rotate: correct ? -10 : 10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <p className="text-5xl mb-2">{correct ? "🎉" : "😔"}</p>
            <p className="font-fredoka text-3xl text-white font-bold">
              {correct ? "Correct!" : "Wrong!"}
            </p>
            {correct && (
              <p className="font-nunito text-white/90 text-base mt-1 font-semibold">
                +₦500 earned!
              </p>
            )}
            {!correct && (
              <p className="font-nunito text-white/90 text-base mt-1 font-semibold">
                Game Over incoming...
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}