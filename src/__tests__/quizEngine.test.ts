// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CATEGORIES_ORDER, QUIZ_QUESTIONS } from '../data/questionsData';
import type { AnswerRecord, CategoryId, QuizQuestion } from '../types';
import {
  calculateScoreStats,
  createAnswerRecord,
  evaluateAnswer,
  getCategoryProgress,
  getGuardianRank,
  getQuestionsForSession,
} from '../utils/quizEngine';
import { SoundEffects, sounds } from '../utils/sound';

const createDeterministicRandom = (seed = 42): (() => number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const buildAnswersMap = (
  questions: QuizQuestion[],
  predicate: (question: QuizQuestion) => boolean,
): Record<number, AnswerRecord> => {
  const answers: Record<number, AnswerRecord> = {};
  for (const question of questions) {
    const selectedAnswer = predicate(question)
      ? question.answer
      : !question.answer;
    answers[question.id] = createAnswerRecord(question, selectedAnswer);
  }
  return answers;
};

describe('quizEngine - getQuestionsForSession', () => {
  it('deve retornar as 25 perguntas na ordem sequencial oficial (1..25) sem mutar QUIZ_QUESTIONS', () => {
    const originalIds = QUIZ_QUESTIONS.map((q) => q.id);
    const session = getQuestionsForSession('sequential');

    expect(session).toHaveLength(25);
    expect(session).not.toBe(QUIZ_QUESTIONS);
    expect(session.map((q) => q.id)).toEqual(originalIds);

    session.reverse();
    session.pop();

    expect(QUIZ_QUESTIONS).toHaveLength(25);
    expect(QUIZ_QUESTIONS.map((q) => q.id)).toEqual(originalIds);
  });

  it('deve usar modo sequential como padrão quando nenhum argumento for passado', () => {
    const session = getQuestionsForSession();
    expect(session.map((q) => q.id)).toEqual(QUIZ_QUESTIONS.map((q) => q.id));
  });

  it('deve embaralhar de forma determinística preservando todas as 25 perguntas sem repetições e sem mutar QUIZ_QUESTIONS', () => {
    const originalIds = QUIZ_QUESTIONS.map((q) => q.id);

    const shuffledA = getQuestionsForSession(
      'shuffled',
      createDeterministicRandom(12345),
    );
    const shuffledB = getQuestionsForSession(
      'shuffled',
      createDeterministicRandom(12345),
    );

    expect(shuffledA).toHaveLength(25);
    expect(shuffledA.map((q) => q.id)).toEqual(shuffledB.map((q) => q.id));
    expect(shuffledA.map((q) => q.id)).not.toEqual(originalIds);

    const sortedShuffledIds = shuffledA.map((q) => q.id).sort((a, b) => a - b);
    expect(new Set(sortedShuffledIds).size).toBe(25);
    expect(sortedShuffledIds).toEqual(originalIds);
    expect(QUIZ_QUESTIONS.map((q) => q.id)).toEqual(originalIds);
  });

  it('deve normalizar valores extremos de randomFn no embaralhamento sem gerar posições indefinidas', () => {
    let toggle = false;
    const extremeRandom = () => {
      toggle = !toggle;
      return toggle ? -0.5 : 1.8;
    };

    const session = getQuestionsForSession('shuffled', extremeRandom);
    expect(session).toHaveLength(25);
    expect(session.every((q) => q !== undefined)).toBe(true);
    expect(new Set(session.map((q) => q.id)).size).toBe(25);
  });
});

describe('quizEngine - evaluateAnswer e createAnswerRecord', () => {
  it('deve avaliar corretamente acertos e erros para perguntas com gabarito true', () => {
    const trueQuestions = QUIZ_QUESTIONS.filter((q) => q.answer === true);
    expect(trueQuestions.length).toBe(19);

    const q1 = QUIZ_QUESTIONS[0];
    expect(evaluateAnswer(q1, true)).toBe(true);
    expect(evaluateAnswer(q1, false)).toBe(false);

    expect(createAnswerRecord(q1, true)).toEqual({
      questionId: 1,
      categoryId: 'vacinacao',
      selectedAnswer: true,
      correctAnswer: true,
      isCorrect: true,
    });

    expect(createAnswerRecord(q1, false)).toEqual({
      questionId: 1,
      categoryId: 'vacinacao',
      selectedAnswer: false,
      correctAnswer: true,
      isCorrect: false,
    });
  });

  it('deve avaliar corretamente acertos e erros para todas as perguntas com gabarito false (Q2, Q4, Q8, Q11, Q18, Q25)', () => {
    const falseIds = [2, 4, 8, 11, 18, 25];

    for (const id of falseIds) {
      const question = QUIZ_QUESTIONS.find((q) => q.id === id);
      expect(question).toBeDefined();
      if (!question) continue;

      expect(evaluateAnswer(question, false)).toBe(true);
      expect(evaluateAnswer(question, true)).toBe(false);

      expect(createAnswerRecord(question, false)).toEqual({
        questionId: question.id,
        categoryId: question.categoryId,
        selectedAnswer: false,
        correctAnswer: false,
        isCorrect: true,
      });

      expect(createAnswerRecord(question, true)).toEqual({
        questionId: question.id,
        categoryId: question.categoryId,
        selectedAnswer: true,
        correctAnswer: false,
        isCorrect: false,
      });
    }
  });
});

describe('quizEngine - getGuardianRank', () => {
  it('deve retornar os ranks corretos para todas as faixas de pontuação (0%, 35%, 60%, 85%, 100%)', () => {
    expect(getGuardianRank(0, 25)).toMatchObject({
      title: 'Explorador SaquaPet',
      badge: '💙',
      minPercentage: 0,
    });

    expect(getGuardianRank(34, 100).title).toBe('Explorador SaquaPet');

    expect(getGuardianRank(35, 100)).toMatchObject({
      title: 'Protetor Aprendiz SaquaPet',
      badge: '🐾',
      minPercentage: 35,
    });

    expect(getGuardianRank(59, 100).title).toBe('Protetor Aprendiz SaquaPet');

    expect(getGuardianRank(60, 100)).toMatchObject({
      title: 'Amigo Fiel dos Pets',
      badge: '🌟',
      minPercentage: 60,
    });

    expect(getGuardianRank(15, 25).title).toBe('Amigo Fiel dos Pets');
    expect(getGuardianRank(84, 100).title).toBe('Amigo Fiel dos Pets');

    expect(getGuardianRank(85, 100)).toMatchObject({
      title: 'Guardião dos Animais de Saquarema',
      badge: '🏆',
      minPercentage: 85,
    });

    expect(getGuardianRank(25, 25)).toMatchObject({
      title: 'Guardião dos Animais de Saquarema',
      badge: '🏆',
      minPercentage: 85,
    });
  });

  it('deve tratar casos de borda como total 0, total negativo, acertos negativos e acertos maiores que o total', () => {
    expect(getGuardianRank(0, 0).title).toBe('Explorador SaquaPet');
    expect(getGuardianRank(10, 0).title).toBe('Explorador SaquaPet');
    expect(getGuardianRank(10, -5).title).toBe('Explorador SaquaPet');
    expect(getGuardianRank(-4, 25).title).toBe('Explorador SaquaPet');
    expect(getGuardianRank(40, 25).title).toBe(
      'Guardião dos Animais de Saquarema',
    );
  });
});

describe('quizEngine - calculateScoreStats', () => {
  it('deve calcular corretamente uma sessão perfeita (25/25 acertos -> 100%)', () => {
    const answers = buildAnswersMap(QUIZ_QUESTIONS, () => true);
    const stats = calculateScoreStats(QUIZ_QUESTIONS, answers);

    expect(stats.totalQuestions).toBe(25);
    expect(stats.answeredCount).toBe(25);
    expect(stats.correctCount).toBe(25);
    expect(stats.wrongCount).toBe(0);
    expect(stats.percentage).toBe(100);
    expect(stats.rank.title).toBe('Guardião dos Animais de Saquarema');
    expect(stats.categoryStats).toHaveLength(5);

    expect(stats.categoryStats.map((c) => c.categoryId)).toEqual(
      CATEGORIES_ORDER,
    );
    for (const catStat of stats.categoryStats) {
      expect(catStat.total).toBe(5);
      expect(catStat.correct).toBe(5);
      expect(catStat.percentage).toBe(100);
    }
  });

  it('deve calcular corretamente uma sessão zerada (0/25 acertos -> 0%)', () => {
    const answers = buildAnswersMap(QUIZ_QUESTIONS, () => false);
    const stats = calculateScoreStats(QUIZ_QUESTIONS, answers);

    expect(stats.totalQuestions).toBe(25);
    expect(stats.answeredCount).toBe(25);
    expect(stats.correctCount).toBe(0);
    expect(stats.wrongCount).toBe(25);
    expect(stats.percentage).toBe(0);
    expect(stats.rank.title).toBe('Explorador SaquaPet');

    for (const catStat of stats.categoryStats) {
      expect(catStat.total).toBe(5);
      expect(catStat.correct).toBe(0);
      expect(catStat.percentage).toBe(0);
    }
  });

  it('deve calcular corretamente uma sessão mista com acertos variados entre categorias', () => {
    const correctIds = new Set([
      1, 2, 3, 4, 5, // vacinacao: 5/5 (100%)
      6, 7, 8, 9, // castracao: 4/5 (80%)
      11, 12, 13, // alimentacao: 3/5 (60%)
      16, 17, // maus-tratos: 2/5 (40%)
      21, // smda: 1/5 (20%)
    ]);

    const answers = buildAnswersMap(QUIZ_QUESTIONS, (q) =>
      correctIds.has(q.id),
    );
    const stats = calculateScoreStats(QUIZ_QUESTIONS, answers);

    expect(stats.totalQuestions).toBe(25);
    expect(stats.answeredCount).toBe(25);
    expect(stats.correctCount).toBe(15);
    expect(stats.wrongCount).toBe(10);
    expect(stats.percentage).toBe(60);
    expect(stats.rank.title).toBe('Amigo Fiel dos Pets');

    const expectedByCategory: Record<
      CategoryId,
      { correct: number; percentage: number }
    > = {
      vacinacao: { correct: 5, percentage: 100 },
      castracao: { correct: 4, percentage: 80 },
      alimentacao: { correct: 3, percentage: 60 },
      'maus-tratos': { correct: 2, percentage: 40 },
      smda: { correct: 1, percentage: 20 },
    };

    for (const catStat of stats.categoryStats) {
      expect(catStat.total).toBe(5);
      expect(catStat.correct).toBe(
        expectedByCategory[catStat.categoryId].correct,
      );
      expect(catStat.percentage).toBe(
        expectedByCategory[catStat.categoryId].percentage,
      );
    }
  });

  it('deve calcular corretamente uma sessão parcial (nem todas as perguntas respondidas) e lista vazia', () => {
    const partialAnswers: Record<number, AnswerRecord> = {};
    for (let i = 0; i < 10; i += 1) {
      const q = QUIZ_QUESTIONS[i];
      const isCorrect = i < 7;
      partialAnswers[q.id] = createAnswerRecord(
        q,
        isCorrect ? q.answer : !q.answer,
      );
    }

    const partialStats = calculateScoreStats(QUIZ_QUESTIONS, partialAnswers);
    expect(partialStats.totalQuestions).toBe(25);
    expect(partialStats.answeredCount).toBe(10);
    expect(partialStats.correctCount).toBe(7);
    expect(partialStats.wrongCount).toBe(3);
    expect(partialStats.percentage).toBe(28);
    expect(partialStats.rank.title).toBe('Explorador SaquaPet');

    const vacinacaoStat = partialStats.categoryStats.find(
      (c) => c.categoryId === 'vacinacao',
    );
    const castracaoStat = partialStats.categoryStats.find(
      (c) => c.categoryId === 'castracao',
    );
    const smdaStat = partialStats.categoryStats.find(
      (c) => c.categoryId === 'smda',
    );
    expect(vacinacaoStat).toMatchObject({
      total: 5,
      correct: 5,
      percentage: 100,
    });
    expect(castracaoStat).toMatchObject({
      total: 5,
      correct: 2,
      percentage: 40,
    });
    expect(smdaStat).toMatchObject({ total: 5, correct: 0, percentage: 0 });

    const emptyStats = calculateScoreStats([], {});
    expect(emptyStats.totalQuestions).toBe(0);
    expect(emptyStats.answeredCount).toBe(0);
    expect(emptyStats.correctCount).toBe(0);
    expect(emptyStats.wrongCount).toBe(0);
    expect(emptyStats.percentage).toBe(0);
    expect(emptyStats.rank.title).toBe('Explorador SaquaPet');
  });
});

describe('quizEngine - getCategoryProgress', () => {
  it('deve calcular progresso no início, meio, transição de categoria e última pergunta', () => {
    const start = getCategoryProgress(QUIZ_QUESTIONS, 0);
    expect(start).toMatchObject({
      categoryId: 'vacinacao',
      categoryNumber: 1,
      totalCategories: 5,
      indexInCategory: 1,
      totalInCategory: 5,
      overallCurrent: 1,
      overallTotal: 25,
      overallPercentage: 4,
    });

    const endOfCat1 = getCategoryProgress(QUIZ_QUESTIONS, 4);
    expect(endOfCat1).toMatchObject({
      categoryId: 'vacinacao',
      categoryNumber: 1,
      indexInCategory: 5,
      totalInCategory: 5,
      overallCurrent: 5,
      overallTotal: 25,
      overallPercentage: 20,
    });

    const startOfCat2 = getCategoryProgress(QUIZ_QUESTIONS, 5);
    expect(startOfCat2).toMatchObject({
      categoryId: 'castracao',
      categoryNumber: 2,
      indexInCategory: 1,
      totalInCategory: 5,
      overallCurrent: 6,
      overallTotal: 25,
      overallPercentage: 24,
    });

    const middle = getCategoryProgress(QUIZ_QUESTIONS, 12);
    expect(middle).toMatchObject({
      categoryId: 'alimentacao',
      categoryNumber: 3,
      indexInCategory: 3,
      totalInCategory: 5,
      overallCurrent: 13,
      overallTotal: 25,
      overallPercentage: 52,
    });

    const last = getCategoryProgress(QUIZ_QUESTIONS, 24);
    expect(last).toMatchObject({
      categoryId: 'smda',
      categoryNumber: 5,
      totalCategories: 5,
      indexInCategory: 5,
      totalInCategory: 5,
      overallCurrent: 25,
      overallTotal: 25,
      overallPercentage: 100,
    });
  });

  it('deve limitar índices fora dos limites e retornar fallback seguro para lista vazia', () => {
    const negativeIndex = getCategoryProgress(QUIZ_QUESTIONS, -10);
    expect(negativeIndex.overallCurrent).toBe(1);
    expect(negativeIndex.categoryId).toBe('vacinacao');

    const overflowIndex = getCategoryProgress(QUIZ_QUESTIONS, 999);
    expect(overflowIndex.overallCurrent).toBe(25);
    expect(overflowIndex.categoryId).toBe('smda');

    const emptyProgress = getCategoryProgress([], 0);
    expect(emptyProgress).toMatchObject({
      categoryId: 'vacinacao',
      categoryNumber: 1,
      totalCategories: 5,
      indexInCategory: 0,
      totalInCategory: 0,
      overallCurrent: 0,
      overallTotal: 0,
      overallPercentage: 0,
    });
  });
});

describe('sound - SoundEffects em ambiente jsdom', () => {
  afterEach(() => {
    sounds.setMuted(false);
    vi.unstubAllGlobals();
  });

  it('deve executar todos os métodos públicos de sounds sem lançar exceções em jsdom', () => {
    expect(sounds.getMuted()).toBe(false);

    sounds.setMuted(true);
    expect(sounds.getMuted()).toBe(true);

    expect(() => {
      sounds.playClick();
      sounds.playCorrect();
      sounds.playWrong();
      sounds.playCategoryChange();
      sounds.playVictory();
    }).not.toThrow();

    sounds.setMuted(false);
    expect(sounds.getMuted()).toBe(false);

    expect(() => {
      sounds.playClick();
      sounds.playCorrect();
      sounds.playWrong();
      sounds.playCategoryChange();
      sounds.playVictory();
    }).not.toThrow();
  });

  it('deve sintetizar tons sem erros quando AudioContext está disponível e silenciar quando muted=true', () => {
    const startSpy = vi.fn();
    const stopSpy = vi.fn();
    const createOscillatorSpy = vi.fn(() => ({
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: startSpy,
      stop: stopSpy,
    }));
    const createGainSpy = vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }));
    const resumeSpy = vi.fn().mockResolvedValue(undefined);

    class MockAudioContext {
      currentTime = 1.0;
      state = 'suspended';
      destination = {};
      createOscillator = createOscillatorSpy;
      createGain = createGainSpy;
      resume = resumeSpy;
    }

    vi.stubGlobal('AudioContext', MockAudioContext);

    const localSounds = new SoundEffects();
    expect(localSounds.getMuted()).toBe(false);

    expect(() => {
      localSounds.playClick();
      localSounds.playCorrect();
      localSounds.playWrong();
      localSounds.playCategoryChange();
      localSounds.playVictory();
    }).not.toThrow();

    expect(resumeSpy).toHaveBeenCalled();
    expect(createOscillatorSpy).toHaveBeenCalledTimes(16); // 1 + 4 + 2 + 3 + 6
    expect(startSpy).toHaveBeenCalledTimes(16);
    expect(stopSpy).toHaveBeenCalledTimes(16);

    localSounds.setMuted(true);
    localSounds.playClick();
    localSounds.playVictory();
    expect(createOscillatorSpy).toHaveBeenCalledTimes(16);
  });
});
