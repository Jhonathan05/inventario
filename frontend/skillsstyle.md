# Design System Prompt — skills.sh Style

> Usa este prompt en tu agente de IA (Antigravity, Claude Code, Windsurf, etc.)
> para aplicar el estilo visual de skills.sh a cualquier stack web.

---

## PROMPT PRINCIPAL

```
Implementa el design system basado en la estética de skills.sh.
Es un diseño de terminal developer: oscuro, minimalista, tipografía monospace,
sin ornamentos. Aplica las siguientes reglas de forma estricta en todos los
componentes y páginas.
```

---

## 1. PALETA DE COLORES

### Modo oscuro (predeterminado)

```css
:root {
  /* Fondos */
  --bg-base:        #0a0a0a;   /* fondo de página */
  --bg-surface:     #111111;   /* tarjetas, nav, paneles */
  --bg-elevated:    #1a1a1a;   /* hover, dropdowns */
  --bg-muted:       #222222;   /* inputs, badges sutiles */

  /* Texto */
  --text-primary:   #f0f0f0;   /* títulos, texto principal */
  --text-secondary: #888888;   /* descripciones, metadata */
  --text-muted:     #444444;   /* placeholders, deshabilitados */
  --text-accent:    #ffffff;   /* énfasis máximo */

  /* Acentos */
  --accent-primary: #e5e5e5;   /* CTA primario, links activos */
  --accent-dim:     #555555;   /* bordes activos, separadores visibles */

  /* Bordes */
  --border-default: #1f1f1f;   /* borde sutil entre secciones */
  --border-strong:  #333333;   /* borde en hover o seleccionado */

  /* Estado */
  --color-rank:     #666666;   /* números de ranking */
  --color-count:    #aaaaaa;   /* contadores, installs */
  --color-new:      #3d3d3d;   /* badge "new" */
  --color-new-text: #cccccc;
}
```

### Modo claro (opcional)

```css
@media (prefers-color-scheme: light) {
  :root {
    --bg-base:        #ffffff;
    --bg-surface:     #f5f5f5;
    --bg-elevated:    #eeeeee;
    --bg-muted:       #e8e8e8;
    --text-primary:   #0a0a0a;
    --text-secondary: #555555;
    --text-muted:     #aaaaaa;
    --text-accent:    #000000;
    --accent-primary: #111111;
    --accent-dim:     #cccccc;
    --border-default: #e0e0e0;
    --border-strong:  #bbbbbb;
  }
}
```

---

## 2. TIPOGRAFÍA

```css
/* Fuente principal: monospace en toda la UI */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code',
               ui-monospace, 'SF Mono', monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  /* Usar --font-sans SOLO para contenido de usuario (inputs, bio, etc.) */
}

body {
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-base);
  -webkit-font-smoothing: antialiased;
}

/* Escala tipográfica */
h1 { font-size: 2rem;    font-weight: 600; letter-spacing: -0.02em; }
h2 { font-size: 1.25rem; font-weight: 500; letter-spacing: -0.01em; }
h3 { font-size: 1rem;    font-weight: 500; }
p  { font-size: 0.875rem; color: var(--text-secondary); }

/* Código inline */
code, kbd {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--bg-muted);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-primary);
}

/* Bloques de código */
pre {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.8125rem;
}
```

---

## 3. LAYOUT Y ESPACIADO

```css
/* Contenedor principal */
.container {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Grid system minimalista */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

/* Espaciado de secciones */
section { padding: 3rem 0; }
section + section {
  border-top: 1px solid var(--border-default);
}
```

---

## 4. COMPONENTES

### Navegación (navbar)

```css
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-base);
  position: sticky;
  top: 0;
  z-index: 100;
}

nav .logo {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--text-accent);
  text-decoration: none;
}

nav .nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav a {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}

nav a:hover { color: var(--text-primary); }
```

### Tabla / Leaderboard

```css
/* Patrón de leaderboard como el de skills.sh */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.leaderboard-table tr {
  border-bottom: 1px solid var(--border-default);
  transition: background 0.1s;
}

.leaderboard-table tr:hover {
  background: var(--bg-elevated);
}

.leaderboard-table td {
  padding: 0.75rem 0.5rem;
  color: var(--text-primary);
}

/* Columna de ranking */
.rank-number {
  color: var(--color-rank);
  font-size: 0.75rem;
  min-width: 32px;
  text-align: right;
  padding-right: 1rem;
}

/* Nombre del item */
.item-name {
  font-weight: 500;
  color: var(--text-primary);
}

.item-owner {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Contador / métrica */
.item-count {
  color: var(--color-count);
  font-size: 0.8125rem;
  text-align: right;
}
```

### Comando de terminal (CLI snippet)

```css
.cli-command {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 0.625rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-primary);
}

.cli-command .prompt {
  color: var(--text-muted);
  user-select: none;
}

/* Cursor parpadeante opcional */
.cli-cursor::after {
  content: '█';
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
```

### ASCII art hero

```css
.ascii-hero {
  font-family: var(--font-mono);
  font-size: clamp(0.35rem, 1vw, 0.65rem);
  line-height: 1.2;
  color: var(--text-primary);
  white-space: pre;
  overflow: hidden;
  letter-spacing: 0;
}

/* En móvil escalar o reemplazar con texto normal */
@media (max-width: 640px) {
  .ascii-hero { display: none; }
  .ascii-hero-fallback { display: block; }
}
```

### Badge / Pill

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.badge-new {
  background: var(--color-new);
  color: var(--color-new-text);
}

.badge-official {
  border: 1px solid var(--border-strong);
  color: var(--text-secondary);
  background: transparent;
}
```

### Input de búsqueda

```css
.search-input {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--border-strong);
}
```

### Tabs / Filtros

```css
.tab-list {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border-default);
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
}

.tab:hover { color: var(--text-primary); }

.tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--accent-primary);
}
```

---

## 5. REGLAS DE DISEÑO (para el agente)

```
REGLAS OBLIGATORIAS:
1. Fondo siempre oscuro (#0a0a0a). Sin gradientes, sin sombras.
2. Tipografía monospace en TODA la UI: JetBrains Mono o equivalente.
3. Sin bordes redondeados mayores a 8px. Preferir 4-6px.
4. Sin colores de acento brillantes (verde neón, azul eléctrico). Solo grises.
5. Links sin subrayado. Color: var(--text-secondary) → hover: var(--text-primary).
6. Tablas sin zebra-striping. Solo hover sutil en row.
7. Espaciado generoso: 1.5rem entre secciones, 0.75rem entre items de lista.
8. Sin iconos decorativos. Preferir texto/símbolo ASCII: →, $, #, *, /.
9. Animaciones máximo 150ms, solo opacity o color. Sin transforms elaborados.
10. Mobile-first: el layout debe funcionar en 375px de ancho sin scroll horizontal.
```

---

## 6. CONFIGURACIÓN TAILWIND (si usas Tailwind CSS)

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#0a0a0a',
          surface:  '#111111',
          elevated: '#1a1a1a',
          muted:    '#222222',
        },
        text: {
          primary:   '#f0f0f0',
          secondary: '#888888',
          muted:     '#444444',
          accent:    '#ffffff',
        },
        border: {
          default: '#1f1f1f',
          strong:  '#333333',
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SF Mono',
          'monospace',
        ],
      },
      fontSize: {
        'xs':   ['0.6875rem', { lineHeight: '1rem' }],
        'sm':   ['0.8125rem', { lineHeight: '1.25rem' }],
        'base': ['0.875rem',  { lineHeight: '1.5rem' }],
        'lg':   ['1rem',      { lineHeight: '1.6rem' }],
        'xl':   ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl':  ['2rem',      { lineHeight: '2.25rem' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
}
```

---

## 7. TOKENS PARA VARIABLES CSS (SCSS / CSS custom props)

```scss
// _tokens.scss — importar en el entry point
$tokens: (
  'bg-base':        #0a0a0a,
  'bg-surface':     #111111,
  'bg-elevated':    #1a1a1a,
  'text-primary':   #f0f0f0,
  'text-secondary': #888888,
  'text-muted':     #444444,
  'border-default': #1f1f1f,
  'border-strong':  #333333,
  'font-mono':      "'JetBrains Mono', 'Fira Code', monospace",
);

:root {
  @each $name, $value in $tokens {
    --#{$name}: #{$value};
  }
}
```

---

## 8. SNIPPET DE REFERENCIA — hero section completo

```html
<section class="hero">
  <pre class="ascii-hero">
███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
  </pre>

  <p class="tagline">The Open [X] Ecosystem</p>

  <div class="cli-command">
    <span class="prompt">$</span>
    <span>npx <strong>yourapp</strong> add &lt;owner/repo&gt;</span>
  </div>
</section>

<style>
.hero {
  padding: 4rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tagline {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}
</style>
```

---

*Generado con base en el análisis visual de https://skills.sh/*
*Stack compatible: HTML/CSS, React, Vue, Svelte, Next.js, Astro*
