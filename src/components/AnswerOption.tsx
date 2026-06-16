import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useQuizStore } from "../store/useQuizStore";

const LABELS = ["A", "B", "C", "D"];
const LABEL_COLORS = [
  "bg-royal text-gold",
  "bg-gold-deep text-white",
  "bg-royal-mid text-gold-light",
  "bg-gold text-royal",
];

interface Props {
  index: number;
  text: string;
  correctIndex: number;
}

export default function AnswerOption({ index, text, correctIndex }: Props) {
  const { selectedOption, selectAnswer, phase } = useQuizStore();

  const isSelected = selectedOption === index;
  const isCorrect = index === correctIndex;
  const revealed = phase === "feedback";

  const getBg = () => {
    if (!revealed) return "bg-white hover:bg-gold-light/40 border-2 border-royal/10";
    if (isCorrect) return "bg-green-50 border-2 border-green-500";
    if (isSelected && !isCorrect) return "bg-red-50 border-2 border-red-400";
    return "bg-white border-2 border-royal/10 opacity-50";
  };

  const disabled = phase !== "question";

  return (
    <motion.button
      onClick={() => !disabled && selectAnswer(index)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ${getBg()} ${!disabled ? "cursor-pointer active:scale-95" : "cursor-default"}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {/* Letter badge */}
      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-fredoka text-base font-bold shrink-0 ${LABEL_COLORS[index]}`}>
        {LABELS[index]}
      </span>

      <span className="flex-1 font-nunito font-700 text-[15px] text-royal leading-snug">{text}</span>

      {/* Feedback icon */}
      {revealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
      {revealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
    </motion.button>
  );
}
