# Prompt cerrado — idéntico en los cinco escenarios

Solo cambian los **adjuntos**. El texto del prompt se mantiene exactamente igual.

---

El prompt comparte una base (audiencia + dos pantallas + estilo) y cambia solo el bloque **MARCA** según la fuente que adjuntemos. El slide-show expone tres píldoras para copiar cada variante de un clic.

## Base común

```
Diseña un planificador de jubilación de dos pantallas para clientes españoles de una firma de asesoramiento patrimonial.

AUDIENCIA
- Adultos entre 35 y 60 años con conocimiento financiero medio.
- Prioridad: entender en menos de 30 segundos si su plan actual les permitirá alcanzar el ingreso deseado en la jubilación.

PANTALLA 1 — Captura de datos
- Edad actual.
- Edad objetivo de jubilación.
- Ahorro acumulado en euros.
- Aportación mensual en euros.
- Ingreso mensual deseado en la jubilación, en euros.
- Botón primario: "Calcular proyección".
- Cifras en formato europeo (1.250,50 €) y unidades visibles.

PANTALLA 2 — Resultados
- Cifra titular: ingreso mensual estimado al jubilarse, comparado con el objetivo.
- Gráfica de proyección de la evolución del ahorro desde hoy hasta la edad de jubilación.
- Estado de viabilidad: alcanzable, ajustado o no alcanzable.
- Si no es alcanzable, una recomendación concreta (aumentar la aportación, retrasar la jubilación o ajustar el objetivo) con el delta cuantificado.
- Botón secundario: "Editar datos".

ESTILO
- Tono profesional, claro, sin tecnicismos financieros innecesarios.
- Mensajes positivos cuando el plan funciona; mensajes orientativos cuando no.
- Densidad informativa similar a la imagen adjunta como referencia.
```

## Variante 1 · URL (escenarios 1 y 2)

Añadir al final de la base:

```
MARCA — fuente: URL adjunta
- Extrae color, tipografía, radios y densidad visibles en la URL adjunta.
- Refleja la marca con fidelidad: jerarquía de botones, contraste, microcopy.
- Si la URL no expone algún token, mantén una paleta sobria coherente con la marca.
```

## Variante 2 · design.md (escenarios 3 y 4)

Añadir al final de la base:

```
MARCA — fuente: design.md adjunto
- Aplica todos los tokens y reglas descritos en el design.md adjunto.
- Respeta la paleta, tipografía, radios, espaciado y voz de microcopy que define.
- No introduzcas estilos fuera del design.md, ni inventes tokens.
```

## Variante 3 · Repositorio (escenario 5)

Añadir al final de la base:

```
MARCA — fuente: repositorio de diseño disponible
- Consume los tokens, primitivas y convenciones del repositorio de diseño cargado.
- Usa los componentes existentes en lugar de redibujar (botones, inputs, cards, charts).
- Respeta la regla de marca del repositorio (en Afi, el color secundario es la acción).
```

> Para copiar cada variante de un clic, abre `/talks/stitch-vs-claude`, ve a la diapositiva del prompt y pulsa la píldora **URL**, **design.md** o **Repositorio**.

---

## Adjuntos por escenario

| Run | Herramienta | Imagen de referencia | Contexto de marca | Notas |
|---|---|---|---|---|
| 1 | Stitch | `reference/mutualidad-jubilacion.png` | `mastercard.com/es/es.html` (URL) | Solo URL |
| 2 | Claude (hi-fi) | `reference/mutualidad-jubilacion.png` | `mastercard.com/es/es.html` (URL) | Solo URL |
| 3 | Stitch | `reference/mutualidad-jubilacion.png` | `https://getdesign.md/mastercard/design-md` (design.md) | design.md de Mastercard |
| 4 | Claude (hi-fi) | `reference/mutualidad-jubilacion.png` | `https://getdesign.md/mastercard/design-md` (design.md) | design.md de Mastercard |
| 5 | Claude Code | `reference/mutualidad-jubilacion.png` | Repositorio Coherence (marca Afi) | DS interno cargado |

---

## Reglas de la demo

- **Mismo prompt** en los cinco runs. Leerlo en voz alta entre escenarios forma parte del relato: la variable es el contexto de marca, no el prompt.
- **Misma imagen de referencia** en los cinco runs (la captura de Mutualidad).
- **Sin iteración ni re-prompting durante un run.** La primera salida es la única salida. Estamos midiendo calidad out-of-the-box.
- **Time-box de 8 minutos por run.** Si una herramienta se atasca más allá, capturamos lo que haya y pasamos al siguiente.

## Qué observar (anotar mientras se ejecuta cada run)

- Nivel de detalle al primer intento
- Interactividad de fábrica (Claude clicable; Stitch requiere "instant prototype")
- Fidelidad de marca:
  - Run 1 vs Run 3 (Stitch con URL vs Stitch con design.md)
  - Run 2 vs Run 4 (Claude con URL vs Claude con design.md)
  - Run 5 en solitario (repositorio completo sobre marca Afi)
- Panel de ajustes / flujo de anotaciones en Claude
- Fidelidad del handoff si exportamos (queda fuera del alcance estricto de los runs, pero conviene capturarlo si aparece)
