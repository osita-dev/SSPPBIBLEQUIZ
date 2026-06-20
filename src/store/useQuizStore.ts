import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  timeExpired: () => void;
  skipQuestion: () => void;
  resetGame: () => void;
}

const PRIZE_PER_CORRECT = 500;
const JACKPOT = 8000;

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
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
        set({ phase: "idle" });
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
        const updatedRecent = [...recentIds, q.id];
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

        setTimeout(() => {
          set({ phase: "idle", currentQuestion: null });
        }, 2000);
      },

      // Timer hit zero — auto-select correct answer and reward it
      timeExpired: () => {
        const { currentQuestion, score, totalAnswered, prize } = get();
        if (!currentQuestion || get().answerState !== "idle") return;

        const newPrize = Math.min(prize + PRIZE_PER_CORRECT, JACKPOT);

        set({
          selectedOption: currentQuestion.correct,
          answerState: "correct",
          score: score + 1,
          totalAnswered: totalAnswered + 1,
          prize: newPrize,
          phase: "feedback",
        });

        setTimeout(() => {
          set({ phase: "idle", currentQuestion: null });
        }, 2000);
      },

      skipQuestion: () => {
        const { totalSkipped, currentQuestion, recentIds } = get();
        // add skipped question to blacklist so it doesn't repeat this session
        const updatedRecent = currentQuestion
          ? [...recentIds, currentQuestion.id]
          : recentIds;
        set({
          totalSkipped: totalSkipped + 1,
          phase: "idle",
          currentQuestion: null,
          recentIds: updatedRecent,
        });
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
          recentIds: [],   // ✅ clears blacklist — all 50 questions available again
          spinDegrees: 1800,
        });
      },
    }),
    {
      name: "sspeterpaul-quiz-session", // localStorage key
      // Only persist state values, not actions
      partialize: (state) => ({
        phase: state.phase,
        currentQuestion: state.currentQuestion,
        selectedOption: state.selectedOption,
        answerState: state.answerState,
        score: state.score,
        totalAnswered: state.totalAnswered,
        totalSkipped: state.totalSkipped,
        prize: state.prize,
        recentIds: state.recentIds,
        spinDegrees: state.spinDegrees,
      }),
    }
  )
);