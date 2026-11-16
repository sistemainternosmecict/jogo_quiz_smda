---
name: smda-saquapet-branding
description: Identidade visual, paleta divertida da causa animal, estampas SVG, mapeamento oficial de assets (logo_edu.png e 1.webp..8.webp), as 5 categorias oficiais do Quiz SaquaPet com cores distintas e diretrizes de tom educativo para crianças até 13 anos e público geral da SMDA Saquarema.
---

# Identidade Visual & Conteúdo Educativo — Quiz SaquaPet (SMDA Saquarema)

Use esta skill ao criar estilos, badges de categoria, cards de perguntas, telas de atração/vitória, estampas decorativas e redação de textos educativos do **Quiz SaquaPet**.

---

## 1. Paleta Divertida da Causa Animal (Alto Contraste)

A interface do Quiz SaquaPet deve ser **luminosa, alegre, acolhedora e infantil/familiar**, contrastando com fundos escuros genéricos e mantendo legibilidade impecável em telas 4K de 72" sob iluminação de feiras e escolas.

| Token / Uso | Cor Hex | Aplicação Recomendada |
|---|---|---|
| **Amarelo Sol** | `#FFB703` | Destaques principais, troféus, botões de chamariz (`TOQUE PARA JOGAR`), detalhes solares e estrelas |
| **Azul SaquaPet** | `#0284C7` | Identidade institucional de Saquarema, cabeçalhos, bordas de destaque e botão `PRÓXIMA PERGUNTA` / `JOGAR NOVAMENTE` |
| **Turquesa Pet** | `#06D6A0` | Acentos divertidos, barras de progresso, selos e elementos lúdicos de bem-estar animal |
| **Verde Verdadeiro** | `#10B981` | Botão gigante **VERDADEIRO** e feedback visual de resposta correta |
| **Coral Falso** | `#EF4444` | Botão gigante **FALSO** e indicador visual da opção Falso (no feedback educativo, manter tom gentil e explicativo) |
| **Fundo Creme Alegre** | `#FFFBF0` / `#FEF3C7` | Gradiente suave do fundo principal e superfície dos cards (`#FFFFFF` sobre `#FFFBF0` / `#FEF3C7`) |
| **Texto Alto Contraste** | `#0F172A` | Cor padrão para enunciados, títulos e explicações sobre fundos claros (contraste > 12:1 sobre `#FFFBF0`) |
| **Texto Secundário** | `#334155` | Subtítulos e legendas de apoio sobre fundo creme/branco |

### Regras de Contraste e Legibilidade
- Textos sobre **Amarelo Sol (`#FFB703`)** devem usar **`#0F172A`** (nunca texto branco sobre amarelo).
- Textos sobre **Verde Verdadeiro (`#10B981`)**, **Coral Falso (`#EF4444`)** e **Azul SaquaPet (`#0284C7`)** devem ser **`#FFFFFF`** com `font-weight: 800` e sombra/contorno suave para leitura à distância.
- Os botões `VERDADEIRO` (`#10B981`) e `FALSO` (`#EF4444`) devem ter aparência tátil 3D (borda inferior mais escura simulando botão físico divertido, ex.: `#059669` e `#DC2626`) com depressão no `:active`.

---

## 2. Estampas Padronizadas em SVG (Offline)

Para dar textura lúdica sem poluir a leitura e sem depender de imagens externas:
- Criar **padrão SVG inline ou Data URI em CSS** repetível em baixa opacidade (`opacity: 0.06` a `0.12`) sobre o fundo `#FFFBF0` / `#FEF3C7` contendo:
  - **Patinhas (`🐾`)** desenhadas em SVG vetorial limpo;
  - **Ossinhos** estilizados;
  - **Corações** simbólicos do cuidado animal.
- Manter os cards de pergunta (`#FFFFFF`) com bordas bem arredondadas (`border-radius: 28px–36px`), borda colorida visível (`3px–4px`) e sombra macia para destacar o texto sobre a estampa de fundo.

---

## 3. Mapeamento Oficial dos Assets da SMDA

Todos os assets oficiais estão copiados localmente no projeto (100% disponíveis offline):

### Logo Institucional
- **`public/logo_edu.png`** (acessível em runtime via `/logo_edu.png`) — cópia de referência também mantida na raiz em `logo_edu.png`.
- Deve aparecer com destaque proporcional no cabeçalho da tela inicial (`AttractMode`), no topo das perguntas e/ou na tela de vitória, sempre com `object-fit: contain` e fundo claro ou moldura branca que preserve as cores da marca oficial.

### Fotos Oficiais dos Pets (`src/assets/smda/1.webp` a `8.webp`)
Importe sempre via módulos ES para que o Vite empacote diretamente no bundle de produção:

```ts
import dog1 from '../assets/smda/1.webp';
import dog2 from '../assets/smda/2.webp';
import dog3 from '../assets/smda/3.webp';
import dog4 from '../assets/smda/4.webp';
import cat5 from '../assets/smda/5.webp';
import cat6 from '../assets/smda/6.webp';
import cat7 from '../assets/smda/7.webp';
import cat8 from '../assets/smda/8.webp';
```

| Arquivo | Espécie | Tema Original SMDA / Sugestão de Uso no Quiz |
|---|---|---|
| `1.webp` | Cão (`dog1`) | Adoção Responsável / Cãozinho Amigo |
| `2.webp` | Cão (`dog2`) | Castração Gratuita / Saúde Canina |
| `3.webp` | Cão (`dog3`) | Vacinação em Dia / Proteção Garantida |
| `4.webp` | Cão (`dog4`) | Identificação do Pet / Coleira com Plaquinha |
| `5.webp` | Gato (`cat5`) | Passeio Seguro & Telas / Gatinho Protegido |
| `6.webp` | Gato (`cat6`) | Água e Ração / Nutrição Felina |
| `7.webp` | Gato (`cat7`) | Não ao Abandono / Guarda para Sempre |
| `8.webp` | Gato (`cat8`) | Mascote Literário / SMDA & SaquaPet |

- Sempre renderizar as imagens com `object-fit: cover` (ou `contain` conforme moldura circular/arredondada), `alt` descritivo e `draggable={false}` + `pointer-events: none`.

---

## 4. As 5 Categorias Oficiais do Quiz SaquaPet

Cada pergunta pertence a exatamente uma das **5 categorias oficiais**, exibida em um badge colorido e amigável no topo do card (acima do enunciado, na zona superior/central). Cada categoria possui cor distinta que **não conflita** com o verde/coral dos botões de resposta:

| Categoria Oficial | Emoji | Cor Principal (Badge/Borda) | Cor de Fundo Suave | Texto do Badge |
|---|---|---|---|---|
| `Vacinação` | `🩺` | `#0284C7` (Azul SaquaPet) | `#E0F2FE` | `#0369A1` |
| `Castração` | `🐶` | `#0D9488` (Turquesa Profundo / `#06D6A0` acento) | `#CCFBF1` | `#0F766E` |
| `Alimentação e cuidados` | `🍎` | `#D97706` (Âmbar / `#FFB703` Sol) | `#FEF3C7` | `#92400E` |
| `Maus-tratos e abandono` | `❤️` | `#DB2777` (Rosa Carinho — distinto do Coral Falso `#EF4444`) | `#FCE7F3` | `#9D174D` |
| `SMDA e SaquaPet` | `🏛️` | `#6366F1` (Índigo Amigável) | `#E0E7FF` | `#4338CA` |

### Dica de Uso
- Use o tipo literal exato em TypeScript:
  ```ts
  export type QuizCategory =
    | 'Vacinação'
    | 'Castração'
    | 'Alimentação e cuidados'
    | 'Maus-tratos e abandono'
    | 'SMDA e SaquaPet';
  ```

---

## 5. Tom de Comunicação (Crianças até 13 anos e Público Geral)

1. **Alegre, acolhedor e didático**:
   - Fale em português do Brasil claro, direto e positivo.
   - Evite jargões veterinários complexos sem explicação simples (ex.: ao citar vacinas ou zoonoses, explique de forma acessível como "protege o pet e toda a família").
2. **Enunciados curtos para leitura rápida em pé no totem**:
   - Afirmações de **1 a 2 frases curtas** (idealmente até ~140 caracteres), fáceis de julgar como **VERDADEIRO** ou **FALSO**.
   - Evite pegadinhas confusas ou duplas negações ("não é verdade que não se deve...").
3. **Feedback educativo gentil e construtivo**:
   - **No acerto**: celebre com entusiasmo ("Isso mesmo! 🎉", "Mandou muito bem! 🐾") e reforce o aprendizado em 1 ou 2 frases curtas.
   - **No erro**: nunca use tom punitivo ou assustador. Acolha e ensine ("Quase lá! 💡", "Boa tentativa! Vamos aprender juntos:") explicando claramente o certo.
   - **Em temas sensíveis (`Maus-tratos e abandono`, `Castração`)**: trate com seriedade acessível à faixa etária — ensinando respeito, amor, proteção pela lei (sem descrições gráficas ou violentas) e cuidado responsável em Saquarema.
4. **Celebração Final**:
   - Independentemente da pontuação obtida, valorize a participação do visitante com título lúdico (ex.: *"Guardião dos Animais de Saquarema"*, *"Amigo Fiel dos Pets"*, *"Explorador SaquaPet"*) incentivando respeito aos cães e gatos e o cuidado junto à SMDA.
