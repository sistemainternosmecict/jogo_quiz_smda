import type { Component } from 'solid-js';
import type { QuizQuestion } from '../types';
import type { CategoryProgress } from '../utils/quizEngine';

export interface QuestionCardProps {
  question: QuizQuestion;
  progress: CategoryProgress;
  isLocked: boolean;
  onAnswer: (answer: boolean) => void;
}

/**
 * Cartão principal de pergunta do Quiz SaquaPet com leitura na zona superior
 * e botões gigantes VERDADEIRO / FALSO na zona inferior (Lower-Zone Reach).
 */
export const QuestionCard: Component<QuestionCardProps> = (props) => {
  const handleAnswerPointerDown = (answer: boolean, e: PointerEvent): void => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();

    if (props.isLocked) {
      return;
    }

    props.onAnswer(answer);
  };

  return (
    <div class="question-layout">
      <div class="question-upper-zone">
        <div class="question-meta-row">
          <span
            class="question-category-badge"
            style={{
              color: props.progress.color,
              'background-color': props.progress.badgeBg,
            }}
          >
            <span aria-hidden="true">{props.question.categoryIcon}</span>
            <span>{props.question.categoryLabel}</span>
          </span>

          <span class="question-counter-badge">
            Pergunta {props.progress.overallCurrent} de {props.progress.overallTotal} •{' '}
            {props.progress.indexInCategory} de {props.progress.totalInCategory} na categoria
          </span>
        </div>

        <div class="question-card-row">
          <div class="question-pet-frame">
            <img
              src={props.question.petImage}
              alt={props.question.petAlt}
              class="question-pet-img"
              draggable={false}
            />
          </div>

          <div class="question-statement-card">
            <h2 class="question-statement-text">{props.question.statement}</h2>
          </div>
        </div>
      </div>

      <div class="question-lower-zone">
        <div
          class="answer-buttons-grid"
          role="group"
          aria-label="Escolha se a afirmação é verdadeira ou falsa"
        >
          <button
            type="button"
            class="btn-answer btn-answer-true"
            disabled={props.isLocked}
            aria-disabled={props.isLocked}
            onPointerDown={(e) => handleAnswerPointerDown(true, e)}
          >
            <span class="answer-icon" aria-hidden="true">✅</span>
            <span class="answer-label">VERDADEIRO</span>
            <span class="answer-hint">Toque se a frase estiver certa</span>
          </button>

          <button
            type="button"
            class="btn-answer btn-answer-false"
            disabled={props.isLocked}
            aria-disabled={props.isLocked}
            onPointerDown={(e) => handleAnswerPointerDown(false, e)}
          >
            <span class="answer-icon" aria-hidden="true">❌</span>
            <span class="answer-label">FALSO</span>
            <span class="answer-hint">Toque se a frase estiver errada</span>
          </button>
        </div>
      </div>
    </div>
  );
};
