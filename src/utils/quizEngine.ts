import type {
  AnswerRecord,
  CategoryId,
  CategoryStat,
  QuizOrderMode,
  QuizQuestion,
  QuizRank,
  ScoreStats,
} from '../types';
import {
  CATEGORIES_META,
  CATEGORIES_ORDER,
  QUIZ_QUESTIONS,
} from '../data/questionsData';

export interface CategoryProgress {
  categoryId: CategoryId;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  gradient: string;
  badgeBg: string;
  categoryNumber: number;
  totalCategories: number;
  indexInCategory: number;
  totalInCategory: number;
  overallCurrent: number;
  overallTotal: number;
  overallPercentage: number;
}

const GUARDIAN_RANKS: QuizRank[] = [
  {
    title: 'Guardião dos Animais de Saquarema',
    badge: '🏆',
    message:
      'Incrível! Você conhece super bem os direitos e cuidados com cães e gatos e já pode ensinar todo mundo a proteger os bichinhos!',
    minPercentage: 85,
    color: '#D97706',
  },
  {
    title: 'Amigo Fiel dos Pets',
    badge: '🌟',
    message:
      'Mandou muito bem! Você já sabe bastante sobre como cuidar, respeitar e dar carinho aos animais da nossa cidade!',
    minPercentage: 60,
    color: '#0284C7',
  },
  {
    title: 'Protetor Aprendiz SaquaPet',
    badge: '🐾',
    message:
      'Boa jornada! Cada pergunta ajudou você a descobrir novos jeitos de levar saúde, amor e proteção para cães e gatos!',
    minPercentage: 35,
    color: '#10B981',
  },
  {
    title: 'Explorador SaquaPet',
    badge: '💙',
    message:
      'Que legal você participar! Agora você já conhece várias dicas da SMDA para cuidar com muito carinho dos animais!',
    minPercentage: 0,
    color: '#7C3AED',
  },
];

/**
 * Retorna a lista de perguntas para uma sessão de quiz na ordem sequencial
 * oficial ou embaralhada via algoritmo Fisher-Yates.
 */
export const getQuestionsForSession = (
  mode: QuizOrderMode = 'sequential',
  randomFn: () => number = Math.random,
): QuizQuestion[] => {
  const sessionQuestions = [...QUIZ_QUESTIONS];

  if (mode === 'sequential') {
    return sessionQuestions;
  }

  for (let i = sessionQuestions.length - 1; i > 0; i -= 1) {
    const normalizedRandom = Math.min(0.999999999999, Math.max(0, randomFn()));
    const swapIndex = Math.floor(normalizedRandom * (i + 1));
    const current = sessionQuestions[i];
    sessionQuestions[i] = sessionQuestions[swapIndex];
    sessionQuestions[swapIndex] = current;
  }

  return sessionQuestions;
};

/**
 * Avalia se a resposta escolhida pela criança corresponde ao gabarito da pergunta.
 */
export const evaluateAnswer = (
  question: QuizQuestion,
  selectedAnswer: boolean,
): boolean => {
  return question.answer === selectedAnswer;
};

/**
 * Cria o registro completo de resposta para histórico e estatísticas do quiz.
 */
export const createAnswerRecord = (
  question: QuizQuestion,
  selectedAnswer: boolean,
): AnswerRecord => {
  return {
    questionId: question.id,
    categoryId: question.categoryId,
    selectedAnswer,
    correctAnswer: question.answer,
    isCorrect: evaluateAnswer(question, selectedAnswer),
  };
};

/**
 * Determina o título comemorativo do participante conforme o percentual de acertos.
 */
export const getGuardianRank = (
  correctCount: number,
  totalQuestions: number,
): QuizRank => {
  const safeTotal = Math.max(0, totalQuestions);
  const safeCorrect = Math.max(0, Math.min(correctCount, safeTotal));
  const percentage =
    safeTotal > 0 ? Math.round((safeCorrect / safeTotal) * 100) : 0;

  for (const rank of GUARDIAN_RANKS) {
    if (percentage >= rank.minPercentage) {
      return rank;
    }
  }

  return GUARDIAN_RANKS[GUARDIAN_RANKS.length - 1];
};

/**
 * Calcula o placar geral e o desempenho por categoria a partir das respostas registradas.
 */
export const calculateScoreStats = (
  questions: QuizQuestion[],
  answers: Record<number, AnswerRecord>,
): ScoreStats => {
  const totalQuestions = questions.length;
  let answeredCount = 0;
  let correctCount = 0;

  const categoryTotals: Record<CategoryId, { total: number; correct: number }> = {
    vacinacao: { total: 0, correct: 0 },
    castracao: { total: 0, correct: 0 },
    alimentacao: { total: 0, correct: 0 },
    'maus-tratos': { total: 0, correct: 0 },
    smda: { total: 0, correct: 0 },
  };

  for (const question of questions) {
    categoryTotals[question.categoryId].total += 1;
    const record = answers[question.id];

    if (record) {
      answeredCount += 1;
      if (record.isCorrect) {
        correctCount += 1;
        categoryTotals[question.categoryId].correct += 1;
      }
    }
  }

  const wrongCount = answeredCount - correctCount;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const categoryStats: CategoryStat[] = CATEGORIES_ORDER.map((categoryId) => {
    const meta = CATEGORIES_META[categoryId];
    const counts = categoryTotals[categoryId];
    const categoryPercentage =
      counts.total > 0 ? Math.round((counts.correct / counts.total) * 100) : 0;

    return {
      categoryId,
      label: meta.label,
      icon: meta.icon,
      color: meta.color,
      total: counts.total,
      correct: counts.correct,
      percentage: categoryPercentage,
    };
  });

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    wrongCount,
    percentage,
    rank: getGuardianRank(correctCount, totalQuestions),
    categoryStats,
  };
};

/**
 * Retorna o progresso atual dentro da categoria e do quiz completo para exibição no totem.
 */
export const getCategoryProgress = (
  questions: QuizQuestion[],
  currentIndex: number,
): CategoryProgress => {
  if (questions.length === 0) {
    const fallbackCategory = CATEGORIES_META[CATEGORIES_ORDER[0]];
    return {
      categoryId: fallbackCategory.id,
      label: fallbackCategory.label,
      shortLabel: fallbackCategory.shortLabel,
      icon: fallbackCategory.icon,
      color: fallbackCategory.color,
      gradient: fallbackCategory.gradient,
      badgeBg: fallbackCategory.badgeBg,
      categoryNumber: 1,
      totalCategories: CATEGORIES_ORDER.length,
      indexInCategory: 0,
      totalInCategory: 0,
      overallCurrent: 0,
      overallTotal: 0,
      overallPercentage: 0,
    };
  }

  const safeIndex = Math.max(0, Math.min(currentIndex, questions.length - 1));
  const currentQuestion = questions[safeIndex];
  const categoryId = currentQuestion.categoryId;
  const meta = CATEGORIES_META[categoryId];

  let indexInCategory = 0;
  let totalInCategory = 0;

  for (let i = 0; i < questions.length; i += 1) {
    if (questions[i].categoryId === categoryId) {
      totalInCategory += 1;
      if (i <= safeIndex) {
        indexInCategory += 1;
      }
    }
  }

  const overallCurrent = safeIndex + 1;
  const overallTotal = questions.length;
  const overallPercentage = Math.round((overallCurrent / overallTotal) * 100);
  const categoryOrderIndex = CATEGORIES_ORDER.indexOf(categoryId);

  return {
    categoryId,
    label: meta.label,
    shortLabel: meta.shortLabel,
    icon: meta.icon,
    color: meta.color,
    gradient: meta.gradient,
    badgeBg: meta.badgeBg,
    categoryNumber: categoryOrderIndex >= 0 ? categoryOrderIndex + 1 : 1,
    totalCategories: CATEGORIES_ORDER.length,
    indexInCategory,
    totalInCategory,
    overallCurrent,
    overallTotal,
    overallPercentage,
  };
};
