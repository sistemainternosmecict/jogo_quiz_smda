import { describe, expect, it } from 'vitest';
import {
  CATEGORIES_META,
  CATEGORIES_ORDER,
  QUIZ_QUESTIONS,
} from '../data/questionsData';
import type { CategoryId } from '../types';

interface OfficialKeyEntry {
  number: number;
  categoryId: CategoryId;
  answer: boolean;
  statement: string;
}

const EXPECTED_CATEGORIES: CategoryId[] = [
  'vacinacao',
  'castracao',
  'alimentacao',
  'maus-tratos',
  'smda',
];

const OFFICIAL_KEY: OfficialKeyEntry[] = [
  // Categoria 1: Vacinação (1 a 5)
  {
    number: 1,
    categoryId: 'vacinacao',
    answer: true,
    statement: 'Os animais precisam tomar vacinas para se proteger contra doenças.',
  },
  {
    number: 2,
    categoryId: 'vacinacao',
    answer: false,
    statement: 'Cachorros e gatos filhotes não precisam ser vacinados.',
  },
  {
    number: 3,
    categoryId: 'vacinacao',
    answer: true,
    statement: 'A vacinação ajuda a proteger os animais contra doenças graves.',
  },
  {
    number: 4,
    categoryId: 'vacinacao',
    answer: false,
    statement: 'Um animal que vive dentro de casa não precisa tomar vacinas.',
  },
  {
    number: 5,
    categoryId: 'vacinacao',
    answer: true,
    statement:
      'É importante manter a vacinação em dia, seguindo a orientação do veterinário.',
  },

  // Categoria 2: Castração (6 a 10)
  {
    number: 6,
    categoryId: 'castracao',
    answer: true,
    statement:
      'A castração ajuda a evitar o nascimento de filhotes que podem acabar abandonados.',
  },
  {
    number: 7,
    categoryId: 'castracao',
    answer: true,
    statement: 'A castração pode ajudar a prevenir algumas doenças.',
  },
  {
    number: 8,
    categoryId: 'castracao',
    answer: false,
    statement:
      'Depois de castrado, o animal nunca mais precisa ir ao veterinário.',
  },
  {
    number: 9,
    categoryId: 'castracao',
    answer: true,
    statement: 'A castração ajuda a controlar a população de cães e gatos.',
  },
  {
    number: 10,
    categoryId: 'castracao',
    answer: true,
    statement:
      'A castração é importante tanto para animais que vivem nas ruas quanto para os que têm família.',
  },

  // Categoria 3: Alimentação e cuidados (11 a 15)
  {
    number: 11,
    categoryId: 'alimentacao',
    answer: false,
    statement: 'Os animais podem comer qualquer alimento que nós comemos.',
  },
  {
    number: 12,
    categoryId: 'alimentacao',
    answer: true,
    statement: 'Chocolate pode intoxicar cães e gatos.',
  },
  {
    number: 13,
    categoryId: 'alimentacao',
    answer: true,
    statement: 'Os animais precisam de água limpa e fresca todos os dias.',
  },
  {
    number: 14,
    categoryId: 'alimentacao',
    answer: true,
    statement:
      'Os animais precisam de alimentação adequada para se manterem saudáveis.',
  },
  {
    number: 15,
    categoryId: 'alimentacao',
    answer: true,
    statement:
      'Deixar um animal sem comida e água é uma forma de maus-tratos.',
  },

  // Categoria 4: Maus-tratos e abandono (16 a 20)
  {
    number: 16,
    categoryId: 'maus-tratos',
    answer: true,
    statement: 'Bater em um animal é considerado maus-tratos.',
  },
  {
    number: 17,
    categoryId: 'maus-tratos',
    answer: true,
    statement:
      'Deixar um cachorro preso no sol, sem água e abrigo, é uma forma de maus-tratos.',
  },
  {
    number: 18,
    categoryId: 'maus-tratos',
    answer: false,
    statement:
      'Abandonar um animal porque ele ficou velho é uma atitude correta.',
  },
  {
    number: 19,
    categoryId: 'maus-tratos',
    answer: true,
    statement:
      'Os animais sentem dor, medo e sofrem quando são maltratados.',
  },
  {
    number: 20,
    categoryId: 'maus-tratos',
    answer: true,
    statement:
      'Se uma criança presenciar maus-tratos, deve procurar um adulto de confiança para pedir ajuda.',
  },

  // Categoria 5: SMDA e SaquaPet (21 a 25)
  {
    number: 21,
    categoryId: 'smda',
    answer: true,
    statement:
      'A SMDA é a Secretaria Municipal dos Direitos dos Animais, que trabalha com políticas públicas de proteção e bem-estar animal.',
  },
  {
    number: 22,
    categoryId: 'smda',
    answer: true,
    statement:
      'O SaquaPet é um programa municipal que oferece ações e serviços voltados à saúde e à proteção dos animais.',
  },
  {
    number: 23,
    categoryId: 'smda',
    answer: true,
    statement:
      'A SMDA trabalha para incentivar a adoção responsável e combater o abandono de animais.',
  },
  {
    number: 24,
    categoryId: 'smda',
    answer: true,
    statement:
      'Os animais comunitários e os animais que vivem nas ruas também merecem respeito e proteção.',
  },
  {
    number: 25,
    categoryId: 'smda',
    answer: false,
    statement:
      'Cuidar dos animais é uma responsabilidade somente da Prefeitura, e a população não precisa participar.',
  },
];

describe('questionsData - Estrutura e Integridade do Banco de Perguntas', () => {
  it('deve conter exatamente 25 perguntas com id e number sequenciais de 1 a 25 sem duplicatas ou lacunas', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(25);

    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    const numbers = QUIZ_QUESTIONS.map((q) => q.number);
    const expectedSequence = Array.from({ length: 25 }, (_, idx) => idx + 1);

    expect(new Set(ids).size).toBe(25);
    expect(new Set(numbers).size).toBe(25);
    expect(ids).toEqual(expectedSequence);
    expect(numbers).toEqual(expectedSequence);
  });

  it('deve possuir exatamente as 5 categorias esperadas em CATEGORIES_ORDER e CATEGORIES_META', () => {
    expect(CATEGORIES_ORDER).toHaveLength(5);
    expect(CATEGORIES_ORDER).toEqual(EXPECTED_CATEGORIES);
    expect(Object.keys(CATEGORIES_META).sort()).toEqual(
      [...EXPECTED_CATEGORIES].sort(),
    );

    const expectedLabels: Record<CategoryId, string> = {
      vacinacao: 'Vacinação',
      castracao: 'Castração',
      alimentacao: 'Alimentação e cuidados',
      'maus-tratos': 'Maus-tratos e abandono',
      smda: 'SMDA e SaquaPet',
    };

    for (const categoryId of EXPECTED_CATEGORIES) {
      const meta = CATEGORIES_META[categoryId];
      expect(meta).toBeDefined();
      expect(meta.id).toBe(categoryId);
      expect(meta.label).toBe(expectedLabels[categoryId]);
      expect(meta.shortLabel.trim().length).toBeGreaterThan(0);
      expect(meta.icon.trim().length).toBeGreaterThan(0);
      expect(meta.color.trim().length).toBeGreaterThan(0);
      expect(meta.gradient.trim().length).toBeGreaterThan(0);
      expect(meta.badgeBg.trim().length).toBeGreaterThan(0);
    }
  });

  it('deve agrupar exatamente 5 perguntas por categoria nas faixas oficiais de 1 a 25', () => {
    const expectedRanges: Array<{
      categoryId: CategoryId;
      numbers: number[];
    }> = [
      { categoryId: 'vacinacao', numbers: [1, 2, 3, 4, 5] },
      { categoryId: 'castracao', numbers: [6, 7, 8, 9, 10] },
      { categoryId: 'alimentacao', numbers: [11, 12, 13, 14, 15] },
      { categoryId: 'maus-tratos', numbers: [16, 17, 18, 19, 20] },
      { categoryId: 'smda', numbers: [21, 22, 23, 24, 25] },
    ];

    for (const range of expectedRanges) {
      const questionsInCategory = QUIZ_QUESTIONS.filter(
        (q) => q.categoryId === range.categoryId,
      );
      expect(questionsInCategory).toHaveLength(5);
      expect(questionsInCategory.map((q) => q.number)).toEqual(range.numbers);
    }
  });

  it('deve garantir que nenhuma pergunta tenha campos de texto ou imagem vazios e que os metadados da categoria coincidam', () => {
    for (const question of QUIZ_QUESTIONS) {
      const meta = CATEGORIES_META[question.categoryId];

      expect(question.statement.trim().length).toBeGreaterThan(0);
      expect(question.explanation.trim().length).toBeGreaterThan(0);
      expect(question.petImage.trim().length).toBeGreaterThan(0);
      expect(question.petAlt.trim().length).toBeGreaterThan(0);
      expect(question.categoryLabel).toBe(meta.label);
      expect(question.categoryIcon).toBe(meta.icon);
    }
  });

  it('deve ter distribuição total de 19 respostas Verdadeiras e 6 Falsas', () => {
    const trueAnswers = QUIZ_QUESTIONS.filter((q) => q.answer === true);
    const falseAnswers = QUIZ_QUESTIONS.filter((q) => q.answer === false);

    expect(trueAnswers).toHaveLength(19);
    expect(falseAnswers).toHaveLength(6);
    expect(falseAnswers.map((q) => q.number)).toEqual([2, 4, 8, 11, 18, 25]);
  });
});

describe('questionsData - Gabarito Oficial do Organizador (Q1 a Q25)', () => {
  it.each(OFFICIAL_KEY)(
    'Questão $number ($categoryId) deve corresponder ao gabarito oficial ($answer) e enunciado exato',
    (expected) => {
      const question = QUIZ_QUESTIONS.find((q) => q.number === expected.number);

      expect(question).toBeDefined();
      expect(question?.id).toBe(expected.number);
      expect(question?.categoryId).toBe(expected.categoryId);
      expect(question?.answer).toBe(expected.answer);
      expect(question?.statement).toBe(expected.statement);
    },
  );
});
