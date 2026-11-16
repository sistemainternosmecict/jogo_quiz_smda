import type { Component } from 'solid-js';
import type { AnswerRecord, QuizQuestion } from '../types';

export interface FeedbackOverlayProps {
  question: QuizQuestion;
  record: AnswerRecord;
  isLastQuestion: boolean;
  isLocked: boolean;
  onNext: () => void;
}

/**
 * Overlay educativo exibido após cada resposta com reforço positivo gentil,
 * gabarito oficial e botão gigante de avanço na metade inferior (Lower-Zone Reach).
 */
export const FeedbackOverlay: Component<FeedbackOverlayProps> = (props) => {
  const handleNextPointerDown = (e: PointerEvent): void => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();

    if (props.isLocked) {
      return;
    }

    props.onNext();
  };

  return (
    <div
      class="feedback-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-status-title"
    >
      <div
        class={`feedback-card ${props.record.isCorrect ? 'is-correct' : 'is-wrong'}`}
      >
        <div class="feedback-upper-zone">
          <span class="feedback-status-badge">
            {props.record.isCorrect ? '🐾 Resposta Certa!' : '🐾 Dica SaquaPet'}
          </span>

          <h2 id="feedback-status-title" class="feedback-title">
            {props.record.isCorrect
              ? '🎉 MUITO BEM! VOCÊ ACERTOU!'
              : '💡 QUASE LÁ! VAMOS APRENDER!'}
          </h2>

          <div class="feedback-pet-row">
            <img
              src={props.question.petImage}
              alt={props.question.petAlt}
              draggable={false}
            />

            <span class="feedback-correct-pill">
              <span aria-hidden="true">{props.question.answer ? '✅' : '❌'}</span>
              <span>
                Resposta Oficial:{' '}
                {props.question.answer ? 'VERDADEIRO (V)' : 'FALSO (F)'}
              </span>
            </span>
          </div>

          <p class="feedback-explanation-box">{props.question.explanation}</p>
        </div>

        <div class="feedback-lower-zone">
          <button
            type="button"
            class="btn-next-question"
            disabled={props.isLocked}
            aria-disabled={props.isLocked}
            onPointerDown={handleNextPointerDown}
          >
            <span>
              {props.isLastQuestion
                ? 'VER MEU RESULTADO! 🏆'
                : 'PRÓXIMA PERGUNTA ➡️'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
