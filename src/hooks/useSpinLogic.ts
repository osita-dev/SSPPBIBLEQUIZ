import { useEffect, useRef, useState } from "react";
import { useQuizStore } from "../store/useQuizStore";

export const SPIN_DURATION_MS = 3000;
export const QUESTION_TIME_LIMIT = 10; // seconds

export function useSpinLogic() {
  const { phase, revealQuestion, timeExpired } = useQuizStore();
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);

  // Spin → reveal question after wheel animation ends
  useEffect(() => {
    if (phase === "spinning") {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      spinTimerRef.current = setTimeout(() => {
        revealQuestion();
      }, SPIN_DURATION_MS);
    }
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    };
  }, [phase, revealQuestion]);

  // 10s countdown when question is active
  useEffect(() => {
    // Clear any existing countdown first
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (phase === "question") {
      // Reset and start fresh countdown
      setTimeLeft(QUESTION_TIME_LIMIT);

      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up — clear interval and fire timeExpired
            if (countdownRef.current) clearInterval(countdownRef.current);
            timeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Not in question phase — reset the display
      setTimeLeft(QUESTION_TIME_LIMIT);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [phase, timeExpired]);

  return { timeLeft };
}