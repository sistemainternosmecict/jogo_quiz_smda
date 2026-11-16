---
name: samsung-flip-totem-ux
description: Diretrizes técnicas e ergonômicas obrigatórias para o Quiz SaquaPet em SolidJS + TypeScript rodando na lousa digital Samsung Flip 72" single-touch (modo quiosque offline), incluindo CSS Touch Shield, eventos onPointerDown com trava síncrona isLocked, regra Lower-Zone Reach para crianças até 13 anos, timer de inatividade de 45s, Web Audio API offline e conformidade estrita com tsconfig.app.json.
---

# Samsung Flip 72" Totem UX & Engenharia SolidJS + TypeScript

Use esta skill sempre que implementar ou revisar componentes de UI, estilos globais, manipulação de eventos de toque, timers de sessão, áudio ou código TypeScript no projeto **Quiz SaquaPet**.

---

## 1. Hardware Alvo: Samsung Flip 72" (Single-Touch / Modo Quiosque)

A aplicação roda em tela grande de **72 polegadas** (Samsung Flip 4K, frequentemente utilizada em eventos públicos como feiras escolares e ações da SMDA), caracterizada por:
- **Tela single-touch (sem multitouch confiável)**: toques simultâneos, apoio de palma da mão ou múltiplos dedos podem gerar eventos erráticos, coordenadas saltadas ou disparo duplicado.
- **Uso por crianças de até 13 anos e famílias**: crianças pequenas não alcançam a metade superior da tela de 72".
- **Operação contínua em modo quiosque (Chromium `--kiosk`)**: sem mouse, sem teclado, sem barra de rolagem e potencialmente **100% offline**.

---

## 2. CSS Global Touch Shield (Blindagem de Tela)

Todo o viewport deve ser travado em `src/index.css` e respeitado por `src/App.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
}

html,
body,
#root {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden !important;
  position: fixed;
  inset: 0;
}

::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
```

### Regras obrigatórias de CSS e DOM
1. **Zero scroll**: nenhuma tela (`attract`, `playing`, `feedback`, `victory`) pode gerar barra de rolagem ou overflow vertical/horizontal. Use `clamp()`, `dvh` e flexbox/grid responsivos.
2. **Sem dependência de `:hover`**: nunca esconda conteúdo, dicas ou affordances atrás de `:hover`. Use feedback imediato no toque (`:active` ou classe de estado ativo) com transição rápida (`100ms–150ms`).
3. **Camadas decorativas não bloqueantes**: partículas de confete, toasts, ilustrações de fundo, badges e imagens devem ter `pointer-events: none` para não interceptar toques.
4. **Bloqueio de gestos do navegador**: registrar no `App.tsx` (com limpeza em `onCleanup`) prevenção de `contextmenu`, `dragstart` e `selectstart`.

---

## 3. Protocolo de Toque Seguro: `onPointerDown` + Trava Síncrona (`isLocked`)

Em totens touchscreen, eventos `onClick` sofrem com atraso (~300ms) ou falham se o dedo arrastar alguns pixels na lousa. **Todos os botões interativos devem usar `onPointerDown`**.

### Regras obrigatórias nos handlers de toque
1. **Sempre usar `onPointerDown`** (nunca depender de `onClick` para ações principais).
2. **Chamar `e.preventDefault()` e `e.stopPropagation()`** imediatamente no início do handler válido.
3. **Filtrar ponteiros secundários / palma da mão**: ignorar eventos quando `e.isPrimary === false` (proteção contra toque simultâneo ou palma apoiada).
4. **Trava síncrona dupla (`syncLock` + sinal `isLocked`)**:
   - Sinais reativos (`createSignal`) servem para atualizar a UI (desabilitar visualmente botões), mas **uma flag booleana síncrona no escopo do módulo/componente** (ou verificada antes de qualquer atualização assíncrona) garante que dois eventos disparados no mesmo frame ou em sequência imediata jamais causem duplo clique, dupla resposta ou salto acidental de pergunta.
   - A trava deve permanecer ativa durante transições críticas:
     - Ao clicar em `TOQUE PARA JOGAR` (evita clicar acidentalmente em `VERDADEIRO`/`FALSO` logo após a transição);
     - Ao responder `VERDADEIRO` ou `FALSO` (bloqueia novo voto até abrir o estado de feedback/próxima pergunta com curto debounce de segurança, ex.: `300ms–450ms`);
     - Ao avançar em `PRÓXIMA PERGUNTA` ou `JOGAR NOVAMENTE` (debounce de segurança para evitar saltar a pergunta seguinte).

### Padrão de referência
```tsx
// Guard síncrono + reativo contra duplo toque / palma
const [isLocked, setIsLocked] = createSignal<boolean>(false);
let transitionLock = false;

const lockTemporarily = (durationMs: number): void => {
  transitionLock = true;
  setIsLocked(true);
  window.setTimeout(() => {
    transitionLock = false;
    setIsLocked(false);
  }, durationMs);
};

const handleAnswerPointerDown = (answer: boolean, e: PointerEvent): void => {
  e.preventDefault();
  e.stopPropagation();

  if (!e.isPrimary || transitionLock || isLocked()) {
    return;
  }

  lockTemporarily(350);
  // Processar resposta com segurança...
};
```

---

## 4. Ergonomia: Regra Lower-Zone Reach (Crianças até 13 anos)

Na Samsung Flip 72", uma criança de 6 a 13 anos alcança com conforto apenas a **metade inferior da tela**.

```
+---------------------------------------------------+  0%
|  Logo SMDA (/logo_edu.png) + Progresso + Placar   |
|  Categoria Badge + Foto do Pet (1.webp..8.webp)   |  ZONA SUPERIOR / CENTRAL
|  Enunciado da Pergunta / Explicação Educativa     |  (0% a 55% — Somente leitura)
+---------------------------------------------------+  ~55%
|                                                   |
|  [ BOTÕES INTERATIVOS PRINCIPAIS AQUI ]           |  ZONA INFERIOR (45% inferiores)
|  - TOQUE PARA JOGAR                               |  Alcance infantil confortável
|  - VERDADEIRO   |   FALSO                         |
|  - PRÓXIMA PERGUNTA                               |
|  - JOGAR NOVAMENTE                                |
+---------------------------------------------------+ 100%
```

### Regras de layout Lower-Zone Reach
1. **Todos os botões interativos principais** (`TOQUE PARA JOGAR`, `VERDADEIRO`, `FALSO`, `PRÓXIMA PERGUNTA`, `JOGAR NOVAMENTE`) devem ficar posicionados nos **45% inferiores da tela** (`height` dedicada na parte de baixo do flex container principal, ex.: `margin-top: auto` ou área inferior `flex: 0 0 42%`..`45%`).
2. **A metade superior/central (~55% superiores)** contém exclusivamente leitura e exibição visual: logo institucional, barra de progresso, badge da categoria, foto do pet, enunciado e card de feedback educativo/certificado final.
3. **Alvos táteis grandes**:
   - Altura generosa (`min-height: clamp(76px, 11dvh, 148px)`).
   - Largura confortável com `gap: clamp(16px, 2.5vw, 36px)` entre `VERDADEIRO` e `FALSO` para evitar toques acidentais na opção vizinha.
   - Tipografia grande e de alto contraste nos botões.

---

## 5. Temporizador de Inatividade (45s) & Attract Mode

Para que o totem nunca fique travado em uma partida abandonada:
- Manter um timer global de inatividade de **45 segundos (`45_000` ms)** ativo sempre que o jogo não estiver no estado `'attract'`.
- Todo `pointerdown` ou `touchstart` global na janela deve reiniciar a contagem regressiva de 45s.
- Ao atingir 45s sem interação:
  1. Cancelar todos os `setTimeout` / `setInterval` de transição ou feedback ativos;
  2. Resetar estado de jogo, pontuação, índice de pergunta e travas (`isLocked = false`);
  3. Retornar automaticamente para o **Attract Mode** (`'attract'`).
- Sempre limpar todos os timers e event listeners em `onCleanup`.

---

## 6. Áudio 100% Offline via Web Audio API

- **Proibido depender de arquivos de áudio externos** (`.mp3`, `.wav`) que possam falhar em ambientes offline ou causar latência no toque.
- Sintetizar efeitos sonoros diretamente via **Web Audio API** (`AudioContext` / `OscillatorNode` / `GainNode`):
  - Clique / início de jogo;
  - Acerto (acorde alegre ascendente);
  - Erro (tom suave e amigável — nunca som agressivo ou assustador para crianças);
  - Fanfarra de vitória ao concluir o quiz.
- **Desbloqueio seguro de áudio**: chamar `audioContext.resume()` dentro de `pointerdown` do usuário.
- **Resiliência**: envolver criação e uso de `AudioContext` em `try/catch` para não quebrar em navegadores restritivos ou testes unitários em `jsdom`/Vitest.

---

## 7. Conformidade Estrita com TypeScript (`tsconfig.app.json`)

O arquivo `tsconfig.app.json` deste projeto impõe regras rigorosas verificadas pelo script `bun run build` (`tsc -b && vite build`):

1. **`"verbatimModuleSyntax": true`**:
   - **SEMPRE** usar `import type` para importar tipos, interfaces e type aliases:
     ```ts
     import type { QuizQuestion, QuizCategory } from '../types';
     import { createSignal, type Component } from 'solid-js';
     ```
2. **`"erasableSyntaxOnly": true`**:
   - **PROIBIDO** usar `enum` (nem `const enum`). Use objetos `as const` + `type` derivado ou uniões literais (`type GameScreen = 'attract' | 'playing' | 'feedback' | 'victory'`).
   - **PROIBIDO** usar *parameter properties* em classes (ex.: `constructor(private id: string)` falha na compilação).
   - **PROIBIDO** usar `namespace` com conteúdo de runtime.
3. **`"noUnusedLocals": true` e `"noUnusedParameters": true`**:
   - Nenhuma variável, import ou parâmetro não utilizado pode permanecer no código. Use prefixo `_` somente se um parâmetro de callback for estritamente necessário e aceito pela assinatura, ou remova-o.
4. **`"noFallthroughCasesInSwitch": true`**:
   - Todo `case` em `switch` com código deve encerrar com `break` ou `return`.
5. **Testes com Vitest**:
   - `vite-plugin-solid` configura `environment: 'jsdom'` automaticamente no `vitest`.
   - Mantenha a lógica pura (embaralhamento, seleção de perguntas, cálculo de pontuação, formatação, máquina de estados) isolada em módulos `.ts` sem acoplamento ao DOM para facilitar testes unitários rápidos via `bun run test`.
