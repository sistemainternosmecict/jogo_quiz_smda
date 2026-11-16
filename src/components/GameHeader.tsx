import { For, onCleanup, type Component } from 'solid-js';
import { CATEGORIES_META, CATEGORIES_ORDER } from '../data/questionsData';
import type { CategoryProgress } from '../utils/quizEngine';

export interface GameHeaderProps {
  progress: CategoryProgress;
  correctCount: number;
  timeSeconds: number;
  isMuted: boolean;
  isLocked?: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onHome: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Cabeçalho fixo da partida contendo identidade institucional da SMDA,
 * trilha das 5 categorias, placar/cronômetro e controles administrativos rápidos.
 */
export const GameHeader: Component<GameHeaderProps> = (props) => {
  let actionLock = false;
  let unlockTimerId: number | undefined;

  const lockHeaderAction = (durationMs = 250): void => {
    if (unlockTimerId !== undefined) {
      window.clearTimeout(unlockTimerId);
    }
    actionLock = true;
    unlockTimerId = window.setTimeout(() => {
      unlockTimerId = undefined;
      actionLock = false;
    }, durationMs);
  };

  onCleanup(() => {
    if (unlockTimerId !== undefined) {
      window.clearTimeout(unlockTimerId);
    }
  });

  const activeCategoryIndex = (): number =>
    CATEGORIES_ORDER.indexOf(props.progress.categoryId);

  const handleToggleMutePointerDown = (e: PointerEvent): void => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();

    if (actionLock || props.isLocked) {
      return;
    }

    lockHeaderAction(180);
    props.onToggleMute();
  };

  const handleRestartPointerDown = (e: PointerEvent): void => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();

    if (actionLock || props.isLocked) {
      return;
    }

    lockHeaderAction(350);
    props.onRestart();
  };

  const handleHomePointerDown = (e: PointerEvent): void => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();

    if (actionLock || props.isLocked) {
      return;
    }

    lockHeaderAction(350);
    props.onHome();
  };

  return (
    <header class="game-header">
      <div class="header-left">
        <img
          src="/logo_edu.png"
          alt="Logo Educação SMDA Saquarema"
          class="header-logo"
          draggable={false}
        />
        <div class="header-branding">
          <span class="header-tag">SMDA • SAQUAREMA</span>
          <h1 class="header-title">Quiz SaquaPet</h1>
        </div>
      </div>

      <nav class="category-track" aria-label="Trilha de categorias do quiz">
        <For each={CATEGORIES_ORDER}>
          {(categoryId, index) => {
            const meta = CATEGORIES_META[categoryId];
            const stepStateClass = (): string => {
              const currentOrderIndex = activeCategoryIndex();
              if (index() < currentOrderIndex) return 'done';
              if (index() === currentOrderIndex) return 'active';
              return '';
            };

            return (
              <div
                class={`track-step ${stepStateClass()}`}
                aria-current={index() === activeCategoryIndex() ? 'step' : undefined}
              >
                <span aria-hidden="true">{meta.icon}</span>
                <span>{meta.shortLabel}</span>
              </div>
            );
          }}
        </For>
      </nav>

      <div class="header-hud" aria-label="Indicadores da partida">
        <div class="hud-item">
          <span class="hud-icon" aria-hidden="true">⭐</span>
          <div class="hud-meta">
            <span class="hud-label">Acertos</span>
            <span class="hud-value">{props.correctCount}</span>
          </div>
        </div>

        <div class="hud-item">
          <span class="hud-icon" aria-hidden="true">🐾</span>
          <div class="hud-meta">
            <span class="hud-label">Pergunta</span>
            <span class="hud-value">
              {props.progress.overallCurrent}/{props.progress.overallTotal}
            </span>
          </div>
        </div>

        <div class="hud-item">
          <span class="hud-icon" aria-hidden="true">⏱️</span>
          <div class="hud-meta">
            <span class="hud-label">Tempo</span>
            <span class="hud-value">{formatTime(props.timeSeconds)}</span>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="header-btn btn-mute"
          aria-label={props.isMuted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
          aria-pressed={props.isMuted}
          onPointerDown={handleToggleMutePointerDown}
        >
          <span aria-hidden="true">{props.isMuted ? '🔇' : '🔊'}</span>
          <span>Som</span>
        </button>

        <button
          type="button"
          class="header-btn btn-restart"
          aria-label="Reiniciar partida"
          onPointerDown={handleRestartPointerDown}
        >
          <span aria-hidden="true">🔄</span>
          <span>REINICIAR</span>
        </button>

        <button
          type="button"
          class="header-btn btn-home"
          aria-label="Voltar para a tela inicial"
          onPointerDown={handleHomePointerDown}
        >
          <span aria-hidden="true">🏠</span>
          <span>INÍCIO</span>
        </button>
      </div>
    </header>
  );
};
