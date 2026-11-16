import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from 'solid-js';
import type {
  AnswerRecord,
  GamePhase,
  QuizOrderMode,
  QuizQuestion,
} from './types';
import {
  calculateScoreStats,
  createAnswerRecord,
  getCategoryProgress,
  getQuestionsForSession,
} from './utils/quizEngine';
import { sounds } from './utils/sound';
import { AttractMode } from './components/AttractMode';
import { GameHeader } from './components/GameHeader';
import { QuestionCard } from './components/QuestionCard';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { VictoryModal } from './components/VictoryModal';
import './App.css';

const TRANSITION_LOCK_MS = 350;
const INACTIVITY_TIMEOUT_MS = 45_000;

/**
 * Componente raiz do Quiz SaquaPet (Samsung Flip 72" Single-Touch Kiosk).
 * Gerencia máquina de estados, trava síncrona contra duplo toque, áudio offline,
 * cronômetro da partida, timer de inatividade (45s) e blindagem de gestos do navegador.
 */
export const App: Component = () => {
  const [phase, setPhase] = createSignal<GamePhase>('attract');
  const [orderMode, setOrderMode] = createSignal<QuizOrderMode>('sequential');
  const [questions, setQuestions] = createSignal<QuizQuestion[]>(
    getQuestionsForSession('sequential'),
  );
  const [currentIndex, setCurrentIndex] = createSignal<number>(0);
  const [answers, setAnswers] = createSignal<Record<number, AnswerRecord>>({});
  const [currentFeedback, setCurrentFeedback] = createSignal<AnswerRecord | null>(
    null,
  );
  const [timeSeconds, setTimeSeconds] = createSignal<number>(0);
  const [isMuted, setIsMuted] = createSignal<boolean>(sounds.getMuted());
  const [isLocked, setIsLocked] = createSignal<boolean>(false);

  // Trava síncrona complementar ao signal reativo contra toques duplos no mesmo frame
  let transitionLock = false;
  let lockTimeoutId: number | undefined;
  let gameTimerId: number | undefined;
  let inactivityTimerId: number | undefined;

  const clearLockTimer = (): void => {
    if (lockTimeoutId !== undefined) {
      window.clearTimeout(lockTimeoutId);
      lockTimeoutId = undefined;
    }
  };

  const releaseLock = (): void => {
    clearLockTimer();
    transitionLock = false;
    setIsLocked(false);
  };

  const lockTemporarily = (durationMs: number = TRANSITION_LOCK_MS): void => {
    clearLockTimer();
    transitionLock = true;
    setIsLocked(true);
    lockTimeoutId = window.setTimeout(() => {
      lockTimeoutId = undefined;
      transitionLock = false;
      setIsLocked(false);
    }, durationMs);
  };

  const clearGameTimer = (): void => {
    if (gameTimerId !== undefined) {
      window.clearInterval(gameTimerId);
      gameTimerId = undefined;
    }
  };

  const clearInactivityTimer = (): void => {
    if (inactivityTimerId !== undefined) {
      window.clearTimeout(inactivityTimerId);
      inactivityTimerId = undefined;
    }
  };

  const currentQuestion = createMemo<QuizQuestion | undefined>(
    () => questions()[currentIndex()],
  );

  const progress = createMemo(() =>
    getCategoryProgress(questions(), currentIndex()),
  );

  const scoreStats = createMemo(() =>
    calculateScoreStats(questions(), answers()),
  );

  const correctCount = createMemo(() => scoreStats().correctCount);

  const isLastQuestion = createMemo(
    () => currentIndex() >= questions().length - 1,
  );

  const startNewSession = (): void => {
    lockTemporarily(TRANSITION_LOCK_MS);
    const sessionQuestions = getQuestionsForSession(orderMode());
    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setCurrentFeedback(null);
    setTimeSeconds(0);
    setPhase('playing');
  };

  const resetToAttract = (): void => {
    clearGameTimer();
    clearInactivityTimer();
    releaseLock();
    setCurrentFeedback(null);
    setAnswers({});
    setCurrentIndex(0);
    setTimeSeconds(0);
    setPhase('attract');
  };

  const handleStartFromAttract = (): void => {
    if (transitionLock || isLocked()) {
      return;
    }
    startNewSession();
  };

  const handlePlayAgainFromVictory = (): void => {
    if (transitionLock || isLocked()) {
      return;
    }
    startNewSession();
  };

  const handleRestartFromHeader = (): void => {
    if (transitionLock || isLocked()) {
      return;
    }
    sounds.playClick();
    startNewSession();
  };

  const handleHomeFromHeader = (): void => {
    if (transitionLock || isLocked()) {
      return;
    }
    sounds.playClick();
    resetToAttract();
  };

  const handleToggleMute = (): void => {
    const nextMuted = !isMuted();
    sounds.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  const handleAnswer = (selectedAnswer: boolean): void => {
    if (
      transitionLock ||
      isLocked() ||
      phase() !== 'playing' ||
      currentFeedback() !== null
    ) {
      return;
    }

    const question = currentQuestion();
    if (!question) {
      return;
    }

    lockTemporarily(TRANSITION_LOCK_MS);

    const record = createAnswerRecord(question, selectedAnswer);
    setAnswers((prev) => ({
      ...prev,
      [question.id]: record,
    }));
    setCurrentFeedback(record);

    if (record.isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuestion = (): void => {
    if (
      transitionLock ||
      isLocked() ||
      phase() !== 'playing' ||
      currentFeedback() === null
    ) {
      return;
    }

    const list = questions();
    const index = currentIndex();
    const previousCategoryId = list[index]?.categoryId;

    lockTemporarily(TRANSITION_LOCK_MS);
    setCurrentFeedback(null);

    if (index >= list.length - 1) {
      clearGameTimer();
      clearInactivityTimer();
      setPhase('victory');
      sounds.playVictory();
      return;
    }

    const nextIndex = index + 1;
    const nextCategoryId = list[nextIndex]?.categoryId;
    setCurrentIndex(nextIndex);

    if (
      nextCategoryId !== undefined &&
      previousCategoryId !== undefined &&
      nextCategoryId !== previousCategoryId
    ) {
      sounds.playCategoryChange();
    } else {
      sounds.playClick();
    }
  };

  // Cronômetro da partida (ativo apenas enquanto estiver jogando)
  createEffect(() => {
    if (phase() !== 'playing') {
      clearGameTimer();
      return;
    }

    clearGameTimer();
    gameTimerId = window.setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);

    onCleanup(() => {
      clearGameTimer();
    });
  });

  // Temporizador de inatividade de 45s durante a partida (capture: true garante reset mesmo com stopPropagation nos botões)
  createEffect(() => {
    if (phase() !== 'playing') {
      clearInactivityTimer();
      return;
    }

    const scheduleInactivityTimeout = (): void => {
      clearInactivityTimer();
      inactivityTimerId = window.setTimeout(() => {
        inactivityTimerId = undefined;
        resetToAttract();
      }, INACTIVITY_TIMEOUT_MS);
    };

    const handleUserActivity = (): void => {
      scheduleInactivityTimeout();
    };

    scheduleInactivityTimeout();
    window.addEventListener('pointerdown', handleUserActivity, {
      capture: true,
      passive: true,
    });
    window.addEventListener('touchstart', handleUserActivity, {
      capture: true,
      passive: true,
    });

    onCleanup(() => {
      clearInactivityTimer();
      window.removeEventListener('pointerdown', handleUserActivity, {
        capture: true,
      });
      window.removeEventListener('touchstart', handleUserActivity, {
        capture: true,
      });
    });
  });

  // Bloqueio global de gestos de navegador em modo quiosque
  onMount(() => {
    const preventBrowserGesture = (e: Event): void => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', preventBrowserGesture);
    document.addEventListener('dragstart', preventBrowserGesture);
    document.addEventListener('selectstart', preventBrowserGesture);

    onCleanup(() => {
      document.removeEventListener('contextmenu', preventBrowserGesture);
      document.removeEventListener('dragstart', preventBrowserGesture);
      document.removeEventListener('selectstart', preventBrowserGesture);
    });
  });

  onCleanup(() => {
    clearLockTimer();
    clearGameTimer();
    clearInactivityTimer();
  });

  return (
    <main class="app-shell">
      <Show when={phase() === 'attract'}>
        <AttractMode
          orderMode={orderMode()}
          onChangeOrderMode={setOrderMode}
          onStart={handleStartFromAttract}
        />
      </Show>

      <Show when={phase() === 'playing'}>
        <GameHeader
          progress={progress()}
          correctCount={correctCount()}
          timeSeconds={timeSeconds()}
          isMuted={isMuted()}
          isLocked={isLocked()}
          onToggleMute={handleToggleMute}
          onRestart={handleRestartFromHeader}
          onHome={handleHomeFromHeader}
        />

        <section class="quiz-stage" aria-label="Palco de perguntas do quiz">
          <div class="progress-bar-container">
            <span>Progresso</span>
            <div
              class="progress-bar-track"
              role="progressbar"
              aria-label="Progresso geral no quiz"
              aria-valuenow={progress().overallPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                class="progress-bar-fill"
                style={{ width: `${progress().overallPercentage}%` }}
              />
            </div>
            <span>{progress().overallPercentage}%</span>
          </div>

          <Show when={currentQuestion()}>
            {(question) => (
              <QuestionCard
                question={question()}
                progress={progress()}
                isLocked={isLocked() || currentFeedback() !== null}
                onAnswer={handleAnswer}
              />
            )}
          </Show>
        </section>

        <Show when={currentFeedback()}>
          {(record) => (
            <Show when={currentQuestion()}>
              {(question) => (
                <FeedbackOverlay
                  question={question()}
                  record={record()}
                  isLastQuestion={isLastQuestion()}
                  isLocked={isLocked()}
                  onNext={handleNextQuestion}
                />
              )}
            </Show>
          )}
        </Show>
      </Show>

      <Show when={phase() === 'victory'}>
        <VictoryModal
          stats={scoreStats()}
          timeSeconds={timeSeconds()}
          onPlayAgain={handlePlayAgainFromVictory}
          onHome={resetToAttract}
        />
      </Show>
    </main>
  );
};

export default App;
