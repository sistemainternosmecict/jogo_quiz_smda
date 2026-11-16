export type CategoryId =
  | 'vacinacao'
  | 'castracao'
  | 'alimentacao'
  | 'maus-tratos'
  | 'smda';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  gradient: string;
  badgeBg: string;
}

export interface QuizQuestion {
  id: number;
  number: number;
  categoryId: CategoryId;
  categoryLabel: string;
  categoryIcon: string;
  statement: string;
  answer: boolean;
  explanation: string;
  petImage: string;
  petAlt: string;
}

export interface AnswerRecord {
  questionId: number;
  categoryId: CategoryId;
  selectedAnswer: boolean;
  correctAnswer: boolean;
  isCorrect: boolean;
}

export interface CategoryStat {
  categoryId: CategoryId;
  label: string;
  icon: string;
  color: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface QuizRank {
  title: string;
  badge: string;
  message: string;
  minPercentage: number;
  color: string;
}

export interface ScoreStats {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  rank: QuizRank;
  categoryStats: CategoryStat[];
}

export type QuizOrderMode = 'sequential' | 'shuffled';

export type GamePhase = 'attract' | 'playing' | 'victory';
