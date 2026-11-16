# Quiz SaquaPet – Conhecendo a Causa Animal! 🐾

Aplicação educativa interativa em formato de quiz (**Verdadeiro ou Falso**) desenvolvida para a **SMDA (Secretaria Municipal dos Direitos dos Animais)** da Prefeitura de Saquarema e o programa **SaquaPet**, projetada especialmente para operar em tela grande touchscreen **Samsung Flip 72"** (single-touch, modo quiosque e 100% offline).

---

## 🎯 Objetivo Pedagógico

O **Quiz SaquaPet** aproxima crianças de **até 13 anos**, famílias e visitantes de feiras escolares ou ações educativas da causa animal de forma lúdica, acolhedora e acessível:

- Ensinar cuidados essenciais de **saúde preventiva** (vacinação e castração);
- Orientar sobre **alimentação segura, água fresca e bem-estar** de cães e gatos;
- Conscientizar sobre **guarda responsável**, combate aos maus-tratos e prevenção ao abandono (com linguagem não violenta e orientação para pedir ajuda a um adulto de confiança);
- Apresentar o trabalho da **SMDA** e os serviços do programa municipal **SaquaPet**, reforçando que proteger os animais é um trabalho em equipe entre a Prefeitura e toda a população.

---

## 📚 As 5 Categorias & Gabarito Oficial (25 Perguntas)

O jogo conta com **25 afirmações** de **Verdadeiro (V)** ou **Falso (F)** divididas igualmente em **5 categorias** (5 perguntas por tema), com explicação educativa imediata após cada resposta:

| Faixa | Categoria Oficial | Ícone | Cor de Destaque |
|---|---|---|---|
| **Q1 – Q5** | Vacinação | 🩺 | Azul (`#2563EB`) |
| **Q6 – Q10** | Castração | 🐶 | Roxo (`#7C3AED`) |
| **Q11 – Q15** | Alimentação e cuidados | 🍎 | Âmbar (`#D97706`) |
| **Q16 – Q20** | Maus-tratos e abandono | ❤️ | Rosa (`#DB2777`) |
| **Q21 – Q25** | SMDA e SaquaPet | 🏛️ | Azul SaquaPet (`#0284C7`) |

### Gabarito Oficial do Organizador

Distribuição oficial: **19 Verdadeiras (V)** e **6 Falsas (F)** (questões **2, 4, 8, 11, 18 e 25**).

| Nº | Categoria | Afirmação | Gabarito |
|---:|---|---|---|
| **1** | Vacinação | Os animais precisam tomar vacinas para se proteger contra doenças. | **VERDADEIRO (V)** |
| **2** | Vacinação | Cachorros e gatos filhotes não precisam ser vacinados. | **FALSO (F)** |
| **3** | Vacinação | A vacinação ajuda a proteger os animais contra doenças graves. | **VERDADEIRO (V)** |
| **4** | Vacinação | Um animal que vive dentro de casa não precisa tomar vacinas. | **FALSO (F)** |
| **5** | Vacinação | É importante manter a vacinação em dia, seguindo a orientação do veterinário. | **VERDADEIRO (V)** |
| **6** | Castração | A castração ajuda a evitar o nascimento de filhotes que podem acabar abandonados. | **VERDADEIRO (V)** |
| **7** | Castração | A castração pode ajudar a prevenir algumas doenças. | **VERDADEIRO (V)** |
| **8** | Castração | Depois de castrado, o animal nunca mais precisa ir ao veterinário. | **FALSO (F)** |
| **9** | Castração | A castração ajuda a controlar a população de cães e gatos. | **VERDADEIRO (V)** |
| **10** | Castração | A castração é importante tanto para animais que vivem nas ruas quanto para os que têm família. | **VERDADEIRO (V)** |
| **11** | Alimentação e cuidados | Os animais podem comer qualquer alimento que nós comemos. | **FALSO (F)** |
| **12** | Alimentação e cuidados | Chocolate pode intoxicar cães e gatos. | **VERDADEIRO (V)** |
| **13** | Alimentação e cuidados | Os animais precisam de água limpa e fresca todos os dias. | **VERDADEIRO (V)** |
| **14** | Alimentação e cuidados | Os animais precisam de alimentação adequada para se manterem saudáveis. | **VERDADEIRO (V)** |
| **15** | Alimentação e cuidados | Deixar um animal sem comida e água é uma forma de maus-tratos. | **VERDADEIRO (V)** |
| **16** | Maus-tratos e abandono | Bater em um animal é considerado maus-tratos. | **VERDADEIRO (V)** |
| **17** | Maus-tratos e abandono | Deixar um cachorro preso no sol, sem água e abrigo, é uma forma de maus-tratos. | **VERDADEIRO (V)** |
| **18** | Maus-tratos e abandono | Abandonar um animal porque ele ficou velho é uma atitude correta. | **FALSO (F)** |
| **19** | Maus-tratos e abandono | Os animais sentem dor, medo e sofrem quando são maltratados. | **VERDADEIRO (V)** |
| **20** | Maus-tratos e abandono | Se uma criança presenciar maus-tratos, deve procurar um adulto de confiança para pedir ajuda. | **VERDADEIRO (V)** |
| **21** | SMDA e SaquaPet | A SMDA é a Secretaria Municipal dos Direitos dos Animais, que trabalha com políticas públicas de proteção e bem-estar animal. | **VERDADEIRO (V)** |
| **22** | SMDA e SaquaPet | O SaquaPet é um programa municipal que oferece ações e serviços voltados à saúde e à proteção dos animais. | **VERDADEIRO (V)** |
| **23** | SMDA e SaquaPet | A SMDA trabalha para incentivar a adoção responsável e combater o abandono de animais. | **VERDADEIRO (V)** |
| **24** | SMDA e SaquaPet | Os animais comunitários e os animais que vivem nas ruas também merecem respeito e proteção. | **VERDADEIRO (V)** |
| **25** | SMDA e SaquaPet | Cuidar dos animais é uma responsabilidade somente da Prefeitura, e a população não precisa participar. | **FALSO (F)** |

---

## 🖥️ Engenharia & UX para Samsung Flip 72" (Single-Touch Kiosk)

A interface em **SolidJS + TypeScript** foi desenhada especificamente para as características físicas de uma lousa digital de **72 polegadas sem multitouch confiável**:

- **Ergonomia *Lower-Zone Reach* (Alcance Infantil):** Todos os botões principais de ação (`TOQUE PARA JOGAR`, seletor `Sequencial / Embaralhado`, `VERDADEIRO`, `FALSO`, `PRÓXIMA PERGUNTA`, `JOGAR NOVAMENTE` e `INÍCIO`) ficam posicionados na **zona inferior da tela**, ao alcance confortável de crianças de 6 a 13 anos. A metade superior/central exibe logo, progresso, fotos e textos com `pointer-events: none`.
- **Protocolo Single-Touch (`onPointerDown` + `isPrimary` + `isLocked`):**
  - Todos os botões reagem imediatamente no evento `onPointerDown` (eliminando o atraso do `onClick` na lousa);
  - Toques secundários ou apoio acidental de palma (`!e.isPrimary`) são ignorados;
  - Uma **trava dupla** (flag síncrona `transitionLock` + signal reativo `isLocked` de `350ms` no `App.tsx`, além de travas locais em `AttractMode`, `GameHeader` e `VictoryModal`) impede duplo toque ou saltos acidentais de pergunta.
- **CSS Touch Shield Global:** `src/index.css` trava o viewport em `100vw` × `100dvh` com `overflow: hidden !important`, `position: fixed`, `touch-action: none`, `user-select: none`, `-webkit-touch-callout: none` e barras de rolagem ocultas. O `App.tsx` também bloqueia `contextmenu`, `dragstart` e `selectstart`.
- **Áudio 100% Offline via Web Audio API:** `src/utils/sound.ts` sintetiza cliques, acordes alegres de acerto, tons suaves de incentivo no erro, transição de categoria e fanfarra de vitória em tempo real usando `AudioContext` (sem arquivos `.mp3`/`.wav` externos e com controle de mudo `🔊/🔇` no cabeçalho).
- **Inatividade (45s) & Auto-Reset na Vitória (25s):**
  - Durante a partida (`playing`), um timer global de **45 segundos** (`45_000 ms`) monitora `pointerdown` e `touchstart` em fase de captura e retorna automaticamente ao *Attract Mode* caso o totem seja abandonado;
  - Na tela final de certificado (`VictoryModal`), um contador regressivo de **25 segundos** exibe confetes em Canvas (`Confetti.tsx`), o título conquistado (ex.: *Guardião dos Animais de Saquarema*) e o desempenho nas 5 categorias antes de retornar ao início.
- **Paleta Divertida & Estampas SVG Offline:** Fundo claro creme (`#FFFBF0` / `#FEF3C7`) com estampa SVG inline repetida de patinhas, ossinhos e corações (`--saqua-pattern-svg`), alto contraste (`#0F172A`), botões táteis 3D e fotos reais locais da SMDA (`src/assets/smda/1.webp` a `8.webp`).

---

## 🤖 Fluxo Multiagêntico e Skills do Projeto

O projeto conta com diretrizes técnicas e de identidade visual documentadas em `.agents/skills/`:

- [`.agents/skills/samsung-flip-totem-ux/SKILL.md`](.agents/skills/samsung-flip-totem-ux/SKILL.md) — Padrões de CSS Touch Shield, `onPointerDown` + `isPrimary` + trava `isLocked`, regra *Lower-Zone Reach*, timer de inatividade de 45s, Web Audio API offline e regras estritas de TypeScript (`tsconfig.app.json`).
- [`.agents/skills/smda-saquapet-branding/SKILL.md`](.agents/skills/smda-saquapet-branding/SKILL.md) — Paleta divertida da causa animal, estampa SVG offline, mapeamento dos assets oficiais (`logo_edu.png` e `1.webp` a `8.webp`), as 5 categorias e o tom pedagógico infantil.

---

## 🚀 Comandos Disponíveis

Os comandos abaixo utilizam **Bun** (gerenciador configurado com `bun.lock`):

```bash
# Instalar dependências
bun install

# Subir servidor de desenvolvimento Vite (http://127.0.0.1:5173)
bun run dev

# Executar suíte completa de testes unitários (Vitest + jsdom)
bun run test

# Checagem estrita TypeScript (tsc -b) + build de produção em dist/
bun run build

# Visualizar build de produção localmente
bun run preview
```

---

## 📺 Modo Kiosk Recomendado (Samsung Flip 72")

Para executar a aplicação em tela cheia na lousa digital **Samsung Flip 72"** (conectada a um PC/mini-PC Windows ou Linux rodando Chromium ou Google Chrome):

1. Gere a build de produção (`bun run build`) e sirva a pasta `dist/` localmente (ou execute `bun run preview -- --host 127.0.0.1 --port 4173`).
2. Inicie o navegador em modo quiosque desativando gestos de navegação por arrasto e menus contextuais:

```bash
# Linux (Chromium / Google Chrome)
google-chrome \
  --kiosk \
  --incognito \
  --noerrdialogs \
  --disable-infobars \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --autoplay-policy=no-user-gesture-required \
  http://127.0.0.1:4173
```

```powershell
# Windows (Google Chrome)
chrome.exe --kiosk --incognito --noerrdialogs --disable-infobars --disable-pinch --overscroll-history-navigation=0 --autoplay-policy=no-user-gesture-required http://127.0.0.1:4173
```

> **Dica:** Ao tocar em `TOQUE PARA JOGAR 🐾`, o próprio toque do usuário também desbloqueia o `AudioContext` da Web Audio API caso o navegador exija interação prévia.

---

## 📁 Estrutura de Diretórios

```text
quiz_saqua_pet/
├── .agents/
│   └── skills/
│       ├── samsung-flip-totem-ux/
│       │   └── SKILL.md               # Diretrizes de UX single-touch e TS estrito
│       └── smda-saquapet-branding/
│           └── SKILL.md               # Paleta, branding SMDA e mapeamento de assets
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo_edu.png                   # Logo oficial servida em /logo_edu.png
├── src/
│   ├── __tests__/
│   │   ├── questionsData.test.ts      # Validação das 25 perguntas e gabarito oficial
│   │   └── quizEngine.test.ts         # Testes do motor do quiz e sintetizador de áudio
│   ├── assets/
│   │   └── smda/
│   │       └── 1.webp .. 8.webp       # Fotos oficiais de cães e gatos da SMDA
│   ├── components/
│   │   ├── AttractMode.tsx            # Tela inicial + seleção Sequencial/Embaralhado
│   │   ├── Confetti.tsx               # Animação de confetes 60fps em Canvas
│   │   ├── FeedbackOverlay.tsx        # Explicação educativa após cada resposta
│   │   ├── GameHeader.tsx             # Logo, trilha das 5 categorias, HUD e Som/Reiniciar/Início
│   │   ├── QuestionCard.tsx           # Cartão da pergunta e botões VERDADEIRO / FALSO
│   │   └── VictoryModal.tsx           # Certificado final, placar por tema e auto-reset 25s
│   ├── data/
│   │   └── questionsData.ts           # Banco oficial das 25 questões e 5 categorias
│   ├── utils/
│   │   ├── quizEngine.ts              # Sessão, embaralhamento Fisher-Yates, pontuação e ranks
│   │   └── sound.ts                   # Efeitos sonoros offline via Web Audio API
│   ├── App.css                        # Layout responsivo (1080p até 4K 72") e Lower-Zone Reach
│   ├── App.tsx                        # Máquina de estados, trava isLocked e timer de 45s
│   ├── index.css                      # Paleta, estampa SVG inline e CSS Touch Shield
│   ├── index.tsx                      # Entry point SolidJS
│   └── types.ts                       # Tipos e interfaces TypeScript
├── .gitignore
├── bun.lock
├── index.html
├── logo_edu.png                       # Cópia de referência da logo institucional
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
