import { For, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import type { ScoreStats } from '../types';
import { sounds } from '../utils/sound';
import { Confetti } from './Confetti';

export interface VictoryModalProps {
  stats: ScoreStats;
  timeSeconds: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

const AUTO_HOME_SECONDS = 25;

const formatTime = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Modal comemorativo de fim de partida com certificado SaquaPet, desempenho por
 * categoria, confetes e controles ergonômicos na metade inferior (Lower-Zone Reach).
 */
export const VictoryModal: Component<VictoryModalProps> = (props) => {
  const [countdown, setCountdown] = createSignal<number>(AUTO_HOME_SECONDS);
  let actionLocked = false;

  onMount(() => {
    const intervalId = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          if (!actionLocked) {
            actionLocked = true;
            props.onHome();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    onCleanup(() => {
      window.clearInterval(intervalId);
    });
  });

  const handlePlayAgainPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.isPrimary || actionLocked) {
      return;
    }

    actionLocked = true;
    sounds.playClick();
    props.onPlayAgain();
  };

  const handleHomePointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.isPrimary || actionLocked) {
      return;
    }

    actionLocked = true;
    sounds.playClick();
    props.onHome();
  };

  return (
    <div
      class="victory-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-rank-title"
    >
      <Confetti />

      <div class="victory-card">
        <div class="victory-upper-zone">
          <div
            class="victory-badge"
            style={{ 'border-color': props.stats.rank.color }}
            aria-hidden="true"
          >
            {props.stats.rank.badge}
          </div>

          <h2 id="victory-rank-title" class="victory-rank-title">
            {props.stats.rank.title}
          </h2>

          <div class="victory-score-hero">
            <div class="victory-score-number">
              {props.stats.correctCount} / {props.stats.totalQuestions}
            </div>
            <div class="victory-score-sub">
              {props.stats.percentage}% de acertos • ⏱️ Tempo: {formatTime(props.timeSeconds)}
            </div>
          </div>

          <div class="victory-stats-grid" aria-label="Acertos por categoria">
            <For each={props.stats.categoryStats}>
              {(cat) => (
                <div
                  class="victory-cat-chip"
                  style={{ color: cat.color }}
                >
                  <span class="victory-cat-icon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span class="victory-cat-label">{cat.label}</span>
                  <span class="victory-cat-score">
                    {cat.correct}/{cat.total}
                  </span>
                </div>
              )}
            </For>
          </div>

          <p class="victory-rank-message">{props.stats.rank.message}</p>
        </div>

        <div class="victory-lower-zone">
          <div class="victory-countdown" aria-live="polite">
            <span aria-hidden="true">⏳</span>
            <span>Retornando ao início em {countdown()}s</span>
          </div>

          <div class="victory-actions-row">
            <button
              type="button"
              class="btn-play-again"
              onPointerDown={handlePlayAgainPointerDown}
            >
              <span>JOGAR NOVAMENTE 🔄</span>
            </button>

            <button
              type="button"
              class="btn-victory-home"
              onPointerDown={handleHomePointerDown}
            >
              <span>INÍCIO 🏠</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
