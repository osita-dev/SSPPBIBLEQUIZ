import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question, GamePhase, AnswerState } from "../types/quiz";
import { getRandomQuestion } from "../data/questions";

const PRIZE_PER_CORRECT = 500;
const JACKPOT = 8000;
export const ROUND_LIMIT = 10;

interface QuizState {
  phase: GamePhase;
  currentQuestion: Question | null;
  selectedOption: number | null;
  answerState: AnswerState;
  score: number;
  totalAnswered: number;
  totalRevealed: number;
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
  playAgain: () => void;
  resetGame: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      phase: "home",
      currentQuestion: null,
      selectedOption: null,
      answerState: "idle",
      score: 0,
      totalAnswered: 0,
      totalRevealed: 0,
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
        const { recentIds, totalRevealed } = get();

        // 10 questions done — round complete, game over
        if (totalRevealed >= ROUND_LIMIT) {
          set({ phase: "gameover" });
          return;
        }

        const q = getRandomQuestion(recentIds);
        const updatedRecent = [...recentIds, q.id];
        set({
          currentQuestion: q,
          phase: "question",
          recentIds: updatedRecent,
          totalRevealed: totalRevealed + 1,
        });
      },

      selectAnswer: (index: number) => {
        const { currentQuestion, score, totalAnswered, prize, totalRevealed } = get();
        if (!currentQuestion || get().answerState !== "idle") return;

        const isCorrect = index === currentQuestion.correct;
        const newPrize = isCorrect
          ? Math.min(prize + PRIZE_PER_CORRECT, JACKPOT)
          : prize;
        const newTotalAnswered = totalAnswered + 1;

        set({
          selectedOption: index,
          answerState: isCorrect ? "correct" : "wrong",
          score: isCorrect ? score + 1 : score,
          totalAnswered: newTotalAnswered,
          prize: newPrize,
          phase: "feedback",
        });

        setTimeout(() => {
          if (isCorrect) {
            // Correct — check if round is complete
            if (totalRevealed >= ROUND_LIMIT) {
              set({ phase: "gameover" });
            } else {
              set({ phase: "idle", currentQuestion: null });
            }
          } else {
            // Wrong — game over
            set({ phase: "gameover" });
          }
        }, 2000);
      },

      // Timer ran out — game over immediately, reveal correct answer
      timeExpired: () => {
        const { currentQuestion } = get();
        if (!currentQuestion || get().answerState !== "idle") return;

        set({
          selectedOption: currentQuestion.correct,
          phase: "gameover",
        });
      },

      skipQuestion: () => {
        const { totalSkipped, currentQuestion, recentIds } = get();
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

      playAgain: () => {
        set({
          phase: "home",
          currentQuestion: null,
          selectedOption: null,
          answerState: "idle",
          score: 0,
          totalAnswered: 0,
          totalRevealed: 0,
          totalSkipped: 0,
          prize: 0,
          recentIds: [],
          spinDegrees: 1800,
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
          totalRevealed: 0,
          totalSkipped: 0,
          prize: 0,
          recentIds: [],
          spinDegrees: 1800,
        });
      },
    }),
    {
      name: "sspeterpaul-quiz-session",
      partialize: (state) => ({
        phase: state.phase,
        currentQuestion: state.currentQuestion,
        selectedOption: state.selectedOption,
        answerState: state.answerState,
        score: state.score,
        totalAnswered: state.totalAnswered,
        totalRevealed: state.totalRevealed,
        totalSkipped: state.totalSkipped,
        prize: state.prize,
        recentIds: state.recentIds,
        spinDegrees: state.spinDegrees,
      }),
    }
  )
);