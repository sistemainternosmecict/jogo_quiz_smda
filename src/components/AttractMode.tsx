import type { Component } from 'solid-js';
import type { QuizOrderMode } from '../types';
import { CATEGORIES_META, CATEGORIES_ORDER } from '../data/questionsData';
import { sounds } from '../utils/sound';

import dog1 from '../assets/smda/1.webp';
import dog3 from '../assets/smda/3.webp';
import cat8 from '../assets/smda/8.webp';

export interface AttractModeProps {
  orderMode: QuizOrderMode;
  onChangeOrderMode: (mode: QuizOrderMode) => void;
  onStart: () => void;
}

interface PreviewMascot {
  image: string;
  alt: string;
  title: string;
}

const PREVIEW_MASCOTS: PreviewMascot[] = [
  {
    image: dog1,
    alt: 'Filhote de cachorro labrador caramelo sorridente sentado na grama',
    title: 'Adoção & Cuidados',
  },
  {
    image: cat8,
    alt: 'Gato rajado curioso mascote da SMDA e do programa SaquaPet',
    title: 'SMDA & SaquaPet',
  },
  {
    image: dog3,
    alt: 'Cachorro de orelhas longas atento representando saúde e vacinação',
    title: 'Vacinação & Saúde',
  },
];

/**
 * Tela inicial (Attract Mode) do Quiz SaquaPet com estética acolhedora e
 * controles interativos posicionados na zona inferior (Lower-Zone Reach).
 */
export const AttractMode: Component<AttractModeProps> = (props) => {
  let startLocked = false;

  const handleModePointerDown = (mode: QuizOrderMode, e: PointerEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.isPrimary || startLocked) {
      return;
    }

    sounds.playClick();
    props.onChangeOrderMode(mode);
  };

  const handleStartPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.isPrimary || startLocked) {
      return;
    }

    startLocked = true;
    sounds.playClick();
    props.onStart();

    window.setTimeout(() => {
      startLocked = false;
    }, 450);
  };

  return (
    <section class="attract-screen" aria-label="Tela inicial do Quiz SaquaPet">
      <div class="attract-bg-decorations" aria-hidden="true">
        <span class="attract-deco-orb attract-deco-orb--left">🐾</span>
        <span class="attract-deco-orb attract-deco-orb--right">💙</span>
      </div>

      <header class="attract-header">
        <div class="header-left">
          <img
            src="/logo_edu.png"
            alt="Logo Educação SMDA Saquarema"
            class="header-logo attract-logo"
            draggable={false}
          />
          <div class="header-branding">
            <span class="header-tag">SMDA • SAQUAREMA</span>
            <h1 class="header-title attract-main-title">Quiz SaquaPet</h1>
            <p class="attract-subtitle">Conhecendo a Causa Animal! 🐾</p>
          </div>
        </div>

        <div class="header-hud attract-hud" aria-label="Resumo do desafio">
          <div class="hud-item">
            <span class="hud-icon" aria-hidden="true">🐾</span>
            <div class="hud-meta">
              <span class="hud-label">Desafios</span>
              <span class="hud-value">25 Perguntas</span>
            </div>
          </div>

          <div class="hud-item">
            <span class="hud-icon" aria-hidden="true">📚</span>
            <div class="hud-meta">
              <span class="hud-label">Temas</span>
              <span class="hud-value">5 Categorias</span>
            </div>
          </div>

          <div class="hud-item">
            <span class="hud-icon" aria-hidden="true">🎯</span>
            <div class="hud-meta">
              <span class="hud-label">Formato</span>
              <span class="hud-value">V ou F</span>
            </div>
          </div>
        </div>
      </header>

      <div class="attract-center">
        <div class="mascot-card-display">
          {PREVIEW_MASCOTS.map((item) => (
            <article class="preview-card">
              <img
                src={item.image}
                alt={item.alt}
                class="preview-img"
                draggable={false}
              />
              <span class="preview-name">{item.title}</span>
            </article>
          ))}
        </div>

        <div class="category-pills-row" aria-label="Temas do quiz">
          {CATEGORIES_ORDER.map((categoryId) => {
            const meta = CATEGORIES_META[categoryId];
            return (
              <span
                class="category-pill"
                style={{
                  color: meta.color,
                  'background-color': meta.badgeBg,
                }}
              >
                <span aria-hidden="true">{meta.icon}</span>
                <span>{meta.label}</span>
              </span>
            );
          })}
        </div>

        <p class="attract-invite-banner">
          🐶 25 desafios de Verdadeiro ou Falso para aprender a cuidar e proteger cães e gatos! 🐱
        </p>
      </div>

      <div class="attract-lower-zone">
        <div
          class="order-mode-selector"
          role="group"
          aria-label="Modo de ordem das perguntas"
        >
          <button
            type="button"
            class={`order-mode-btn ${props.orderMode === 'sequential' ? 'active' : ''}`}
            aria-pressed={props.orderMode === 'sequential'}
            onPointerDown={(e) => handleModePointerDown('sequential', e)}
          >
            <span aria-hidden="true">🔢</span>
            <span>Sequencial (1 a 25)</span>
          </button>

          <button
            type="button"
            class={`order-mode-btn ${props.orderMode === 'shuffled' ? 'active' : ''}`}
            aria-pressed={props.orderMode === 'shuffled'}
            onPointerDown={(e) => handleModePointerDown('shuffled', e)}
          >
            <span aria-hidden="true">🔀</span>
            <span>Embaralhado</span>
          </button>
        </div>

        <button
          type="button"
          class="giant-play-button"
          onPointerDown={handleStartPointerDown}
        >
          <span>TOQUE PARA JOGAR 🐾</span>
        </button>

        <p class="attract-footer-info">
          Secretaria Municipal dos Direitos dos Animais • Prefeitura de Saquarema
        </p>
      </div>
    </section>
  );
};
