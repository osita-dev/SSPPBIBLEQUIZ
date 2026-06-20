export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  category: string;
}

export type AnswerState = "idle" | "correct" | "wrong";

export type GamePhase =
  | "home"
  | "idle"
  | "spinning"
  | "question"
  | "feedback"
  | "gameover";