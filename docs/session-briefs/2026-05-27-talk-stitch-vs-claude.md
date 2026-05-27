# Reunión de área · Brief: Stitch vs Claude para conceptos de cliente

**Status:** drafted 2026-05-27, executes 2026-05-28
**Branch:** `docs/talk-stitch-vs-claude`
**Created:** 2026-05-27
**Activates:** reunión de área, 2026-05-28
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-um-i-guess-binary-kitten.md`](../../.claude/plans/okay-um-i-guess-binary-kitten.md)

---

## Why this exists

Mañana (2026-05-28) hay una charla de 15-20 min en la reunión de área. El público es **dev leads que construyen conceptos para clientes y para diseñadores**. El objetivo no es informar sino **proponer un cambio de flujo**: adoptar Claude (web + Claude Code) para conceptos de cliente, con un `design.md` por cliente como fuente de verdad de marca.

El material de partida es un tutorial de referencia de 25 minutos que compara las dos herramientas sobre un dashboard de trading. Conclusión: Claude saca clara ventaja en detalle, interactividad y handoff; Stitch es bueno para explorar rápido pero pierde fidelidad.

El artefacto que entregamos es a la vez **guía del orador en escena** y **borrador del blog** posterior. Se publica como slide-show interno en `/talks/stitch-vs-claude` (formato growth.design case-study: flecha izquierda y derecha, una idea por diapositiva). El blog público se pulirá después; mañana solo se usa internamente.

## What this session ships

Cinco artefactos:

1. **Skill `afi-redaccion`** — `~/.claude/skills/afi-redaccion/SKILL.md` + `principles.md`. Skill general de redacción Afi, consume [`docs/rules/copy-skill.md`](../rules/copy-skill.md) como base RAE y destila el curso interno de Arturo Rojas e Irene Peña (PDF [`Afi brand/Principios_Comunc_Escrita_3.pdf`](../../Afi%20brand/Principios_Comunc_Escrita_3.pdf), 37 pp.). Sirve para esta charla y para futura redacción Afi.
2. **Slide-show** — `apps/site/src/app/pages/talks/stitch-vs-claude/` (regla de 3 archivos) + ruta `/talks/stitch-vs-claude` en `app.routes.ts` (via `talks.routes.ts`). 14 diapositivas en español, navegación con teclas ← →, contador, barra de progreso.
3. **Carpeta de activos** — [`talks/stitch-vs-claude/`](../../talks/stitch-vs-claude) con prompt cerrado, README, carpetas `reference/` y `outputs/`, y `outputs/links.md` para guardar las URLs vivas de Stitch y Claude.
4. **Prompt cerrado** — [`talks/stitch-vs-claude/prompt.md`](../../talks/stitch-vs-claude/prompt.md). Texto idéntico en los cinco escenarios; solo cambian los adjuntos.
5. **Este brief** — guía de orador integrada en la sección "Speaker outline" más abajo.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md`
2. [`docs/rules/copy-skill.md`](../rules/copy-skill.md) — baseline RAE que la skill consume
3. [Plan](../../.claude/plans/okay-um-i-guess-binary-kitten.md) — locked decisions y open decisions

## Sources of truth

- **Figma Mutualidad** — referencia estructural interna.
- **Mastercard design.md** — https://getdesign.md/mastercard/design-md (renderizado client-side; sin endpoint de markdown crudo — se usa la URL viva al promptear).
- **Mastercard URL** — https://www.mastercard.com/es/es.html
- **Prompt cerrado** — [`talks/stitch-vs-claude/prompt.md`](../../talks/stitch-vs-claude/prompt.md).

## The 5 runs

| Run | Tool | Brand context | Output file |
|---|---|---|---|
| 1 | Stitch | URL `mastercard.com/es/es.html` | `outputs/01-stitch-mastercard-url.png` |
| 2 | Claude (hi-fi) | URL `mastercard.com/es/es.html` | `outputs/02-claude-mastercard-url.png` |
| 3 | Stitch | design.md de Mastercard (getdesign.md) | `outputs/03-stitch-mastercard-designmd.png` |
| 4 | Claude (hi-fi) | design.md de Mastercard (getdesign.md) | `outputs/04-claude-mastercard-designmd.png` |
| 5 | Claude Code | Repositorio Coherence (marca Afi) | `outputs/05-claude-code-coherence-repo.png` |

Mismo prompt y misma imagen de referencia (Mutualidad) en los cinco. Time-box 8 min por run.

## Speaker outline (18-20 min, refleja el slide-show)

Estructura: primero presentar las plataformas y sus opciones de inicio, después el prompt en directo, después los hallazgos.

| Min | Slide | Qué mostrar / decir |
|---|---|---|
| 0:00–1:00 | 1 (Cover) | Encuadre: presentamos dos herramientas, lanzamos un prompt, comparamos cinco escenarios. |
| 1:00–2:00 | 2 (Stitch) | Qué es Stitch + opciones al iniciar. **Cambiar a la pestaña de Stitch en directo** para mostrar la pantalla de inicio. |
| 2:00–3:00 | 3 (Claude) | Qué es Claude + modos al iniciar (prototipo, slide deck, plantilla). **Cambiar a la pestaña de Claude en directo** para mostrar las opciones. |
| 3:00–3:45 | 4 (Wireframe vs hi-fi) | Cuándo usar cada modo. Observación: hacer las dos a la vez diluye el flujo en decisiones de marca prematuras. |
| 3:45–4:30 | 5 (Caso) | Mostrar la captura de Mutualidad. Es la referencia estructural en los cinco escenarios. |
| 4:30–5:30 | 6 (Matriz) | La tabla de cinco escenarios. Explicar el porqué: URL → design.md → repositorio. |
| 5:30–6:30 | 7 (Prompt) | Leer el prompt en voz alta. Mostrar las tres píldoras (URL / design.md / Repositorio). |
| 6:30–7:30 | 8 (Design.md) | Enseñar el design.md de Mastercard. Pulsar Copiar o Descargar; explicar que es el adjunto que las herramientas reciben en los escenarios 3 y 4. |
| **7:30–14:30** | — | **PAUSA EN VIVO.** Cambiar a Stitch, pegar el prompt, ejecutarlo. Mientras genera, hablar de cómo construimos las cinco instancias y qué probaríamos en cada una en el flujo futuro. Repetir en Claude. Abrir el escenario 5 en Claude Code. Mostrar los cinco resultados en pestañas guardadas. |
| 14:30–16:00 | 9 (Aprendizajes) | Resumen condensado de los cinco aprendizajes en una sola página. |
| 16:00–17:30 | 10 (Export y handoff) | El punto donde el concepto pasa a producción. Claude → Claude Code sin pérdida; Stitch reescribe. |
| 17:30–18:30 | 11 (Propuesta) | Adoptar Claude + design.md por cliente. Los tres próximos pasos. |
| 18:30–19:30 | 12 (Cierre) | Pros/contras en una línea, abrir Q&A. |
| 19:30–20:00 | — | Q&A buffer. |

Si vamos largos, recortar slide 4 (la elección de modo se puede mencionar al vuelo) o reducir la pausa en vivo.

## Decisiones cerradas

- **Una sola ejemplo, cinco runs en capas, pre-ejecutados.**
- **Marca en runs 1-4: Mastercard.** El design.md de getdesign.md y la URL `https://www.mastercard.com/es/es.html` sirven como contexto externo. Run 5 usa la marca Afi a través del repositorio. El contraste de marca es parte del mensaje.
- **Conclusión: adoptar Claude + design.md por cliente.**
- **Idioma: español.** La skill `afi-redaccion` impone RAE; el público trabaja en castellano.
- **Tipo de documento (PDF Afi p. 28): semiabierto** — apartados ineludibles (premisa, caso, matriz, runs, hallazgos, propuesta, cierre) con flexibilidad de orden.
- **Voz Afi: 1ª persona del plural.**

## Decisiones aún abiertas

- **Backup si Stitch/Claude está caído mañana** — las screenshots locales (`outputs/0N-*.png`) son el plan B. Las URLs vivas en `outputs/links.md` son el plan A. Por defecto, abrir las screenshots en el slide-show.
- **¿Recortar la diapositiva 11?** Si la rehearsal queda > 18 min, se elimina. Decidir al rehearsing.

## Non-goals

- **No** construir la biblioteca `design.md` por cliente esta noche. Es la propuesta, no el entregable.
- **No** publicar el blog mañana. La rama queda sin push externo; la publicación pública es una sesión posterior.
- **No** tocar las páginas demo existentes (`wealth-planner-2026`, `sarevi`, `patrimonial`, etc.).
- **No** producir diseños Afi "de producción" a partir de los outputs. Sirven para comparar, no para entregar.
- **No** introducir un `SlideShell` primitivo en `libs/ui`. Es un one-off; si se reutiliza, se primitiviza en otra sesión.
- **No** ampliar `docs/rules/copy-skill.md`. La nueva skill consume copy-skill, no lo modifica.

## Exit criteria

- [ ] La rama `docs/talk-stitch-vs-claude` existe con commit limpio
- [ ] `~/.claude/skills/afi-redaccion/SKILL.md` y `principles.md` están en sitio, con YAML front-matter válido
- [ ] La skill se ofrece como `/afi-redaccion` en este Claude Code (verificable con un smoke test corto)
- [ ] `talks/stitch-vs-claude/` contiene `README.md`, `prompt.md`, `reference/`, `outputs/` y `outputs/links.md`
- [ ] `apps/site` sirve `/talks/stitch-vs-claude` sin errores en consola
- [ ] ← y → navegan entre las 14 diapositivas; el contador avanza
- [ ] Las 5 screenshots (que el usuario añade esta noche) se ven en sus diapositivas correspondientes
- [ ] Rehearsal completa en ≤ 18 min cronometrados
- [ ] El portátil tiene la URL marcada y la batería revisada

## Tareas a cargo del usuario esta noche

Estos pasos solo los puede hacer el usuario:

1. **Capturas Figma de Mutualidad** → `talks/stitch-vs-claude/reference/mutualidad-jubilacion.png`. Una imagen con las dos pantallas (entradas + resultados), o solo la pantalla de entradas si es más limpia.
2. **Ejecutar los 5 runs** según [`prompt.md`](../../talks/stitch-vs-claude/prompt.md), 8 min cada uno. Guardar screenshot + URL viva en `outputs/`.
3. **Rellenar `outputs/links.md`** con las URLs vivas (Stitch project, Claude artifact).
4. **Rehearsal cronometrada** una vez. Si > 18 min, recortar slide 11.
5. **Marcar la URL `/talks/stitch-vs-claude` en el navegador** del portátil de presentación.
