import { useEffect, useRef } from "react";
import { useQuizStore } from "../store/useQuizStore";

export const SPIN_DURATION_MS = 3000;

export function useSpinLogic() {
  const { phase, revealQuestion } = useQuizStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase === "spinning") {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        revealQuestion();
      }, SPIN_DURATION_MS);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, revealQuestion]);
}
