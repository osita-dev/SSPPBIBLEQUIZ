import { create } from "zustand";
import type { Question, GamePhase, AnswerState } from "../types/quiz";
import { getRandomQuestion } from "../data/questions";

interface QuizState {
  phase: GamePhase;
  currentQuestion: Question | null;
  selectedOption: number | null;
  answerState: AnswerState;
  score: number;
  totalAnswered: number;
  totalSkipped: number;
  prize: number;
  recentIds: number[];
  spinDegrees: number;

  // actions
  startGame: () => void;
  triggerSpin: () => void;
  revealQuestion: () => void;
  selectAnswer: (index: number) => void;
  skipQuestion: () => void;
  resetGame: () => void;
}

const PRIZE_PER_CORRECT = 500;
const JACKPOT = 8000;

export const useQuizStore = create<QuizState>((set, get) => ({
  phase: "home",
  currentQuestion: null,
  selectedOption: null,
  answerState: "idle",
  score: 0,
  totalAnswered: 0,
  totalSkipped: 0,
  prize: 0,
  recentIds: [],
  spinDegrees: 1800,

  startGame: () => {
    set({ phase: "spinning", spinDegrees: 1800 + Math.floor(Math.random() * 1440) });
  },

  triggerSpin: () => {
    set({
      phase: "spinning",
      selectedOption: null,
      answerState: "idle",
      spinDegrees: 1800 + Math.floor(Math.random() * 1440),
    });
  },

  revealQuestion: () => {
    const { recentIds } = get();
    const q = getRandomQuestion(recentIds);
    const updatedRecent = [...recentIds, q.id].slice(-10);
    set({ currentQuestion: q, phase: "question", recentIds: updatedRecent });
  },

  selectAnswer: (index: number) => {
    const { currentQuestion, score, totalAnswered, prize } = get();
    if (!currentQuestion || get().answerState !== "idle") return;

    const isCorrect = index === currentQuestion.correct;
    const newPrize = isCorrect ? Math.min(prize + PRIZE_PER_CORRECT, JACKPOT) : prize;

    set({
      selectedOption: index,
      answerState: isCorrect ? "correct" : "wrong",
      score: isCorrect ? score + 1 : score,
      totalAnswered: totalAnswered + 1,
      prize: newPrize,
      phase: "feedback",
    });

    // auto-advance to next spin after feedback
    setTimeout(() => {
      get().triggerSpin();
    }, 2000);
  },

  skipQuestion: () => {
    const { totalSkipped } = get();
    set({ totalSkipped: totalSkipped + 1 });
    get().triggerSpin();
  },

  resetGame: () => {
    set({
      phase: "home",
      currentQuestion: null,
      selectedOption: null,
      answerState: "idle",
      score: 0,
      totalAnswered: 0,
      totalSkipped: 0,
      prize: 0,
      recentIds: [],
      spinDegrees: 1800,
    });
  },
}));
