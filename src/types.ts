export type SecretCode = [number, number, number, number];

export interface AnswerOption {
  text: string;
  memeImg: string;
  memeTitle: string;
  memeDesc: string;
}

export interface QuizStep {
  type: 'quiz';
  questionImage?: string;
  question: string;
  answers: AnswerOption[]; // Должно быть ровно 4 варианта под сетку
  correctIndex: number;
}

export interface VideoStep {
  type: 'video';
  url: string;
}

export type FlowStep = QuizStep | VideoStep;
