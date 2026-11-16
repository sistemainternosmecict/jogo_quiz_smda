import type { CategoryId, CategoryMeta, QuizQuestion } from '../types';

import dog1 from '../assets/smda/1.webp';
import dog2 from '../assets/smda/2.webp';
import dog3 from '../assets/smda/3.webp';
import dog4 from '../assets/smda/4.webp';
import cat5 from '../assets/smda/5.webp';
import cat6 from '../assets/smda/6.webp';
import cat7 from '../assets/smda/7.webp';
import cat8 from '../assets/smda/8.webp';

export const CATEGORIES_ORDER: CategoryId[] = [
  'vacinacao',
  'castracao',
  'alimentacao',
  'maus-tratos',
  'smda',
];

export const CATEGORIES_META: Record<CategoryId, CategoryMeta> = {
  vacinacao: {
    id: 'vacinacao',
    label: 'Vacinação',
    shortLabel: 'Vacinação',
    icon: '🩺',
    color: '#2563EB',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
    badgeBg: '#DBEAFE',
  },
  castracao: {
    id: 'castracao',
    label: 'Castração',
    shortLabel: 'Castração',
    icon: '🐶',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    badgeBg: '#EDE9FE',
  },
  alimentacao: {
    id: 'alimentacao',
    label: 'Alimentação e cuidados',
    shortLabel: 'Alimentação',
    icon: '🍎',
    color: '#D97706',
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    badgeBg: '#FEF3C7',
  },
  'maus-tratos': {
    id: 'maus-tratos',
    label: 'Maus-tratos e abandono',
    shortLabel: 'Proteção',
    icon: '❤️',
    color: '#DB2777',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)',
    badgeBg: '#FCE7F3',
  },
  smda: {
    id: 'smda',
    label: 'SMDA e SaquaPet',
    shortLabel: 'SMDA & SaquaPet',
    icon: '🏛️',
    color: '#0284C7',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    badgeBg: '#E0F2FE',
  },
};

interface QuestionSeed {
  number: number;
  categoryId: CategoryId;
  statement: string;
  answer: boolean;
  explanation: string;
  petImage: string;
  petAlt: string;
}

const createQuestion = (seed: QuestionSeed): QuizQuestion => {
  const category = CATEGORIES_META[seed.categoryId];

  return {
    id: seed.number,
    number: seed.number,
    categoryId: seed.categoryId,
    categoryLabel: category.label,
    categoryIcon: category.icon,
    statement: seed.statement,
    answer: seed.answer,
    explanation: seed.explanation,
    petImage: seed.petImage,
    petAlt: seed.petAlt,
  };
};

const PET_ALTS = {
  dog1: 'Filhote de cachorro labrador caramelo sentado na grama ao sol',
  dog2: 'Cachorrinho bege e branco de orelhas em pé descansando em almofadas',
  dog3: 'Cachorro de pelagem marrom e preta com orelhas longas descansando atento',
  dog4: 'Cachorro buldogue inglês caramelo e branco de coleira entre folhas amarelas',
  cat5: 'Gato rajado marrom e cinza olhando atento ao ar livre',
  cat6: 'Gato laranja e branco de olhos verdes sentado com expressão simpática',
  cat7: 'Gato siamês de olhos azuis brilhantes sobre fundo amarelo',
  cat8: 'Gato rajado de olhos âmbar bem abertos e expressão curiosa',
} as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Categoria 1: Vacinação (1 a 5)
  createQuestion({
    number: 1,
    categoryId: 'vacinacao',
    statement: 'Os animais precisam tomar vacinas para se proteger contra doenças.',
    answer: true,
    explanation:
      'As vacinas fortalecem o corpinho dos cães e gatos e ajudam a proteger nossos amigos contra várias doenças perigosas.',
    petImage: dog3,
    petAlt: PET_ALTS.dog3,
  }),
  createQuestion({
    number: 2,
    categoryId: 'vacinacao',
    statement: 'Cachorros e gatos filhotes não precisam ser vacinados.',
    answer: false,
    explanation:
      'Isso é falso! Assim como as crianças, os filhotes de cães e gatos precisam das vacinas desde cedo para crescerem fortes e protegidos.',
    petImage: dog1,
    petAlt: PET_ALTS.dog1,
  }),
  createQuestion({
    number: 3,
    categoryId: 'vacinacao',
    statement: 'A vacinação ajuda a proteger os animais contra doenças graves.',
    answer: true,
    explanation:
      'As vacinas funcionam como um escudo protetor! Elas evitam doenças graves que podem deixar o bichinho muito doente.',
    petImage: cat6,
    petAlt: PET_ALTS.cat6,
  }),
  createQuestion({
    number: 4,
    categoryId: 'vacinacao',
    statement: 'Um animal que vive dentro de casa não precisa tomar vacinas.',
    answer: false,
    explanation:
      'Isso é falso! Mesmo dentro de casa, vírus e bactérias podem entrar pelos sapatos ou janelas, por isso todo pet precisa de vacinação.',
    petImage: cat5,
    petAlt: PET_ALTS.cat5,
  }),
  createQuestion({
    number: 5,
    categoryId: 'vacinacao',
    statement: 'É importante manter a vacinação em dia, seguindo a orientação do veterinário.',
    answer: true,
    explanation:
      'O médico veterinário sabe direitinho quais vacinas cada pet precisa e quando aplicar os reforços para manter a proteção sempre em dia!',
    petImage: cat8,
    petAlt: PET_ALTS.cat8,
  }),

  // Categoria 2: Castração (6 a 10)
  createQuestion({
    number: 6,
    categoryId: 'castracao',
    statement: 'A castração ajuda a evitar o nascimento de filhotes que podem acabar abandonados.',
    answer: true,
    explanation:
      'Quando castramos cães e gatos, evitamos crias sem planejamento e diminuímos a chance de mais filhotinhos ficarem sem lar.',
    petImage: dog1,
    petAlt: PET_ALTS.dog1,
  }),
  createQuestion({
    number: 7,
    categoryId: 'castracao',
    statement: 'A castração pode ajudar a prevenir algumas doenças.',
    answer: true,
    explanation:
      'Além de evitar filhotes sem lar, a castração protege a saúde do pet, ajudando a prevenir várias doenças importantes.',
    petImage: dog2,
    petAlt: PET_ALTS.dog2,
  }),
  createQuestion({
    number: 8,
    categoryId: 'castracao',
    statement: 'Depois de castrado, o animal nunca mais precisa ir ao veterinário.',
    answer: false,
    explanation:
      'Isso é falso! Todo animal castrado continua precisando de consultas de rotina, vacinas em dia e muitos cuidados ao longo da vida.',
    petImage: cat7,
    petAlt: PET_ALTS.cat7,
  }),
  createQuestion({
    number: 9,
    categoryId: 'castracao',
    statement: 'A castração ajuda a controlar a população de cães e gatos.',
    answer: true,
    explanation:
      'Com a castração responsável, nascem menos animais sem família, ajudando a cuidar melhor de todos os cães e gatos da cidade.',
    petImage: cat5,
    petAlt: PET_ALTS.cat5,
  }),
  createQuestion({
    number: 10,
    categoryId: 'castracao',
    statement:
      'A castração é importante tanto para animais que vivem nas ruas quanto para os que têm família.',
    answer: true,
    explanation:
      'Castrar é um ato de cuidado com toda a cidade! Protege os pets que têm um lar e também ajuda os animais comunitários e de rua.',
    petImage: dog2,
    petAlt: PET_ALTS.dog2,
  }),

  // Categoria 3: Alimentação e cuidados (11 a 15)
  createQuestion({
    number: 11,
    categoryId: 'alimentacao',
    statement: 'Os animais podem comer qualquer alimento que nós comemos.',
    answer: false,
    explanation:
      'Isso é falso! Muitas comidas de humanos, como temperos, doces, cebola e uva, fazem muito mal e podem deixar o bichinho doente.',
    petImage: cat6,
    petAlt: PET_ALTS.cat6,
  }),
  createQuestion({
    number: 12,
    categoryId: 'alimentacao',
    statement: 'Chocolate pode intoxicar cães e gatos.',
    answer: true,
    explanation:
      'O chocolate tem substâncias que o corpinho dos cães e gatos não consegue digerir bem. Mesmo um pedacinho pode fazer muito mal!',
    petImage: cat8,
    petAlt: PET_ALTS.cat8,
  }),
  createQuestion({
    number: 13,
    categoryId: 'alimentacao',
    statement: 'Os animais precisam de água limpa e fresca todos os dias.',
    answer: true,
    explanation:
      'Assim como nós, os animais sentem sede todos os dias! Trocar a água e lavar o potinho mantém o pet hidratado e saudável.',
    petImage: dog4,
    petAlt: PET_ALTS.dog4,
  }),
  createQuestion({
    number: 14,
    categoryId: 'alimentacao',
    statement: 'Os animais precisam de alimentação adequada para se manterem saudáveis.',
    answer: true,
    explanation:
      'Uma ração adequada ou comida orientada pelo veterinário dá energia e todos os nutrientes para o bichinho crescer forte e feliz.',
    petImage: dog2,
    petAlt: PET_ALTS.dog2,
  }),
  createQuestion({
    number: 15,
    categoryId: 'alimentacao',
    statement: 'Deixar um animal sem comida e água é uma forma de maus-tratos.',
    answer: true,
    explanation:
      'Quem cuida de um animal precisa oferecer comida e água limpa todos os dias. Negar esses cuidados básicos faz o bichinho sofrer.',
    petImage: cat6,
    petAlt: PET_ALTS.cat6,
  }),

  // Categoria 4: Maus-tratos e abandono (16 a 20)
  createQuestion({
    number: 16,
    categoryId: 'maus-tratos',
    statement: 'Bater em um animal é considerado maus-tratos.',
    answer: true,
    explanation:
      'Os animais merecem carinho, paciência e respeito! Bater ou machucar qualquer animal é maus-tratos e é proibido por lei.',
    petImage: cat7,
    petAlt: PET_ALTS.cat7,
  }),
  createQuestion({
    number: 17,
    categoryId: 'maus-tratos',
    statement:
      'Deixar um cachorro preso no sol, sem água e abrigo, é uma forma de maus-tratos.',
    answer: true,
    explanation:
      'Todo bichinho precisa de sombra, abrigo da chuva e água fresca. Deixar um animal sofrendo no sol forte sem proteção é maus-tratos!',
    petImage: dog4,
    petAlt: PET_ALTS.dog4,
  }),
  createQuestion({
    number: 18,
    categoryId: 'maus-tratos',
    statement: 'Abandonar um animal porque ele ficou velho é uma atitude correta.',
    answer: false,
    explanation:
      'Isso é falso! Quando o pet fica velhinho, ele precisa ainda mais do nosso amor e cuidado. Abandonar um animal é errado e é crime.',
    petImage: dog3,
    petAlt: PET_ALTS.dog3,
  }),
  createQuestion({
    number: 19,
    categoryId: 'maus-tratos',
    statement: 'Os animais sentem dor, medo e sofrem quando são maltratados.',
    answer: true,
    explanation:
      'Os animais têm sentimentos! Eles sentem dor e medo quando são maltratados, mas também sentem muita alegria quando recebem amor e respeito.',
    petImage: cat5,
    petAlt: PET_ALTS.cat5,
  }),
  createQuestion({
    number: 20,
    categoryId: 'maus-tratos',
    statement:
      'Se uma criança presenciar maus-tratos, deve procurar um adulto de confiança para pedir ajuda.',
    answer: true,
    explanation:
      'Crianças também protegem os animais! Ao ver algum bichinho sofrendo, conte logo para seus pais, professores ou outro adulto de confiança.',
    petImage: cat7,
    petAlt: PET_ALTS.cat7,
  }),

  // Categoria 5: SMDA e SaquaPet (21 a 25)
  createQuestion({
    number: 21,
    categoryId: 'smda',
    statement:
      'A SMDA é a Secretaria Municipal dos Direitos dos Animais, que trabalha com políticas públicas de proteção e bem-estar animal.',
    answer: true,
    explanation:
      'A SMDA é a secretaria de Saquarema dedicada a defender os direitos dos animais, promovendo ações de saúde, proteção e bem-estar.',
    petImage: cat8,
    petAlt: PET_ALTS.cat8,
  }),
  createQuestion({
    number: 22,
    categoryId: 'smda',
    statement:
      'O SaquaPet é um programa municipal que oferece ações e serviços voltados à saúde e à proteção dos animais.',
    answer: true,
    explanation:
      'O SaquaPet leva cuidado e saúde para perto dos pets de Saquarema, com serviços e atividades educativas que ajudam animais e famílias.',
    petImage: dog3,
    petAlt: PET_ALTS.dog3,
  }),
  createQuestion({
    number: 23,
    categoryId: 'smda',
    statement:
      'A SMDA trabalha para incentivar a adoção responsável e combater o abandono de animais.',
    answer: true,
    explanation:
      'A adoção responsável dá uma nova família cheia de carinho para os pets resgatados, e a SMDA trabalha para incentivar esse gesto bonito!',
    petImage: dog1,
    petAlt: PET_ALTS.dog1,
  }),
  createQuestion({
    number: 24,
    categoryId: 'smda',
    statement:
      'Os animais comunitários e os animais que vivem nas ruas também merecem respeito e proteção.',
    answer: true,
    explanation:
      'Mesmo sem uma casa só deles, os animais comunitários e de rua são seres vivos que merecem respeito, carinho e proteção de todos nós.',
    petImage: dog4,
    petAlt: PET_ALTS.dog4,
  }),
  createQuestion({
    number: 25,
    categoryId: 'smda',
    statement:
      'Cuidar dos animais é uma responsabilidade somente da Prefeitura, e a população não precisa participar.',
    answer: false,
    explanation:
      'Isso é falso! Cuidar dos animais é um trabalho em equipe: a Prefeitura faz a sua parte e cada cidadão ajuda dando amor e respeito aos pets.',
    petImage: dog4,
    petAlt: PET_ALTS.dog4,
  }),
];
