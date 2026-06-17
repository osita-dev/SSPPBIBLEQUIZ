export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  category: string;
}

export type AnswerState = "idle" | "correct" | "wrong";

export type GamePhase =
  | "home"       // landing screen
  | "idle"       // wheel visible, waiting for user to tap spin
  | "spinning"   // wheel is spinning
  | "question"   // question visible, awaiting answer
  | "feedback";  // showing correct/wrong briefly before returning to idle