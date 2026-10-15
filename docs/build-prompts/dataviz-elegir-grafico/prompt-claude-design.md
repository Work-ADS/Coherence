Scope: 2 items, guidelines only. No component changes, no test runs.

I uploaded `uploads/dataviz-elegir-grafico.card.html`. It's a new guideline card that decides WHICH chart to use (a mandatory brief, a question → chart table, a review checklist). The existing cards (`Chart`, `chart-colour-rule`, `colors-dataviz`, `pattern-section-chart`) keep deciding HOW to draw it.

1. Move the card to `guidelines/dataviz-elegir-grafico.card.html` unchanged. Open it once to check it renders (Roboto, tables readable, no horizontal scroll). Don't edit its content; if something is wrong, report it.

2. Add this bullet to the "Fast facts" list in `SKILL.md`, after the "Actions" bullet, and add the same rule in one line to the guidelines index in `readme.md`, where the other data-viz cards are listed:

- **Charts:** before proposing or drawing any chart, KPI or data visualization, follow `guidelines/dataviz-elegir-grafico.card.html`: ask the five brief questions in one message (audiencia, pregunta clave, decisión, medio, datos); if the user wants to proceed without answering, draw it and add a visible «Supuestos» note. Pick the chart from its question → chart table, preferring DS components. A chart that isn't a DS component gets the visible note «Este gráfico aún no es un componente del DS». When finished, or when asked to review a chart, go through its checklist with Cumple / Corregir per item.

When you finish: say DONE, then report per item: done / failed / not started. If a step fails twice (a test, a render, a fix attempt), stop, don't try a third time, and report what failed, what you tried and the likely cause; finish the other items first if they don't depend on it. Delete any temporary or comparison files you created.
