# Cómo construimos la nueva identidad visual

> Borrador fuente en español para `/blog/arquitectura-informacion` (tercera parte de la serie del rediseño).
> Generado desde `visual-identity-process.en.md` con la pasada afi-redaccion (julio 2026).
> El HTML de la página se sincroniza desde este archivo; las notas de visuales viven en el borrador inglés.

**Entradilla:** De un encargo difuso a un sistema funcionando en código: las decisiones, en orden, para que el equipo tenga todo el contexto.

**Lead:** *Tercera parte de la serie del rediseño. La primera definió qué significa UI moderna en 2026; la segunda fija la estrategia de marca. Esta cubre nuestro proceso: qué hicimos y por qué. Lo dejamos por escrito porque reconstruir el contexto es donde los equipos pierden más tiempo.*

---

## 1. Contexto y objetivos

### El diseño en Afi es joven

Al principio, Daniel, desde comunicación, enviaba PNG a los programadores.

Después llegó Figma con Miguel en Wealth Manager: flujos reales, pero la organización seguía sin sistemas ni componentes. Diseño y desarrollo apenas hablaban salvo para resolver una duda visual o una objeción; las pantallas se diseñaban a ojo y los programadores tomaban el relevo.

Mi primer proyecto al incorporarme fue Bankinter. Diseñamos un producto con la línea visual comercial, con muchas idas y venidas con el equipo de Bankinter. Después de todo ese trabajo resultó que el producto era para banca privada, una línea visual completamente distinta.

El Wealth Planner se topó con el mismo problema a escala de producto: trabajo que llega sin contexto. Cuando entró Renta 4, mi encargo fue una línea: cambia el nombre y, quizá, ponlo en rojo. Sin materiales de marca, sin contexto sobre el tamaño del proyecto. Y el propio producto se había construido a mano alzada, sin componentes, cuando nadie tenía todavía un sistema.

Cuando llegó la primera ronda de iteraciones de Renta 4, pasé el trabajo a componentes, en Material porque era lo que ya usaba el código del equipo. Fue un avance real y la iteración se aceleró.

Entonces aprendimos lo que se nos había escapado por adoptar la librería sin evaluarla juntos: Material tiene opiniones muy marcadas y tuvimos que forzarla para crear productos que encajaran con las marcas de nuestros clientes. Sistematizar el diseño fue la decisión correcta, pero hacerlo dentro de Material nos impuso más restricciones.

Después, la dirección fue crear versiones distintas cambiando solo fuentes, colores y logos. Hicimos una para Afi y otra para Unicaja. Por eso acabamos con un producto estático y de aspecto anticuado. El flujo de trabajo nunca dio a nadie tiempo para diseñar: era conectar, soltar, entregar.

Pero la IA cambió lo que es posible: ya no estamos limitados a librerías de Angular con opiniones ajenas; podemos construir la nuestra. Por eso hice el curso de sistemas de diseño con IA de Memorisely. Nos da la flexibilidad para crear los productos que queremos.

Ese es el contexto de este rediseño. Queremos un efecto *wow*, algo que no tenemos desde hace tiempo.

Para conseguirlo, necesitábamos un proceso de diseño, porque todos los proyectos anteriores empezaron igual: sin alineación previa.

### Wealth Planner

El Wealth Planner de Afi es una herramienta con la que los asesores financieros construyen, simulan y presentan planes patrimoniales a sus clientes. Tenemos nuestra versión, que usamos sobre todo para demos, y también la ofrecemos en marca blanca a bancos españoles, con sus bases de datos de clientes. El encargo fue una línea: que parezca más moderno.

El problema de fondo es que todo funciona sobre pantallas estáticas de Figma. Los desarrolladores trabajan pantalla a pantalla sin entender las interacciones. La UI parecía anticuada le pusiéramos el color que le pusiéramos.

Así que antes de tocar nada fijamos tres objetivos: una UI ligera y densa en información, pensada para profesionales; demos interactivas en código en lugar de documentación solo en Figma, para que los desarrolladores inspeccionen el producto real; y un sistema que escale entre marcas de clientes cambiando tokens, no redibujando pantallas.

## 2. Definir «moderno»

Antes de abrir Figma quisimos definir qué significa «moderno». Si no, cada revisión se convierte en un debate sobre lo que gusta y lo que no; sin una definición compartida, el gusto discute con el gusto y nada queda decidido.

Sintetizamos la investigación en la [primera parte de esta serie](/blog/ui-moderno-2026). La versión corta:

- **Intención en lo visual.** Tonos neutros, profundidad funcional, retículas bento para la jerarquía. El color y la animación transmiten información, rápido.
- **Dinámico en lugar de lineal.** Los flujos lineales crean experiencias aburridas; lo que necesitamos es entender de verdad el objetivo del usuario y construir el layout a su alrededor.
- **Sistemas por encima de preferencias.** Tokens semánticos como única fuente de verdad, para que las decisiones sean consistentes e incluso legibles por máquinas.
- **Evidencia por encima de opinión.** Como los layouts pueden ser dinámicos, cobra más peso medir y hablar con los usuarios. Las opiniones basadas solo en gustos, sin métricas ni usuarios detrás, frenan la creatividad.
- **Atención a los pequeños detalles.** Ahora que construir es mucho más rápido, la UI moderna deja espacio para los detalles que el usuario no sabría nombrar pero sí nota. Una flecha que gira o un botón que se ajusta a su texto eran antes un extra; hoy son la forma de demostrar que, incluso con IA, alguien prestó atención.

## 3. Moodboards y una lista corta

Con la investigación hecha, cada uno construyó su moodboard en Mobbin, por separado y organizado por componente: botones, inputs, menús, tarjetas, diálogos, barra lateral, filtros. Tres o cuatro pantallas guardadas por componente. Trabajar primero por separado importaba: dos selecciones independientes que coinciden son evidencia, no gusto.

Después recorrimos juntos las dos colecciones, componente a componente. Miguel detectó el patrón primero: «Elegíamos las mismas aplicaciones una y otra vez. Quizá esa es la dirección que buscamos». Los mismos nombres aparecían en ambos tableros, y esa fue la lista corta: Cursor, Shopify, Clerk, Notion y Granola, con Linear, OpenAI y Stack AI como referencias recurrentes.

La sesión produjo direcciones, no diseños finales. Botones compactos como los de Cursor, con la sombra casi invisible que usa Stack AI. Inputs ajustados como los de OpenAI, en dos variantes de padding. Menús como los de Clerk: solo opciones, sin iconos, sombra marcada. Una barra de navegación con migas al estilo Clerk: espacio de trabajo, cliente, simulación. Shopify como referencia de gráficas sobre tarjetas. Y una regla que zanjó un debate recurrente: botones segmentados para opciones, pestañas de línea para vistas.

De la propia sesión salió una idea: al pulsar, el botón se hunde. Pequeña, pero marcó el tono de cómo trataríamos las microinteracciones después.

## 4. Principios para el equipo

Después de la sesión de moodboards escribimos los principios de diseño. Nueve, cada uno trazable a la investigación o a una decisión que ya habíamos tomado juntos:

1. **Densidad de información sin densidad visual.** Datos, no decoración. La investigación fintech fue clara: para quien mueve cifras serias, una relación señal-ruido alta es lo que comunica competencia.
2. **Controles compactos.** Cada control ocupa solo el espacio que necesita. Salió directamente de los moodboards: los productos que elegíamos una y otra vez (Cursor, OpenAI, Linear) usan botones e inputs ajustados.
3. **Minimalismo funcional.** Cada elemento tiene que justificar su existencia. Del hallazgo del minimalismo expresivo de la primera parte: la confianza nace de la ausencia de decoración, no de añadir más.
4. **Revelado progresivo.** Mostrar primero lo relevante; exponer la complejidad bajo demanda. De la investigación sobre intención de la primera parte: la pantalla sirve a lo que el usuario vino a hacer, y el detalle queda a un clic, no en el primer vistazo.
5. **Consistencia por encima de novedad.** Un patrón se aprende una vez y se encuentra en todas partes. Es la madurez de diseño aplicada: los patrones compartidos permiten decidir en equipo. La regla de botones segmentados frente a pestañas es este principio en miniatura.
6. **El movimiento explica estados, nunca decora.** De la investigación sobre fricción: el compás de procesamiento de 150-250 ms genera confianza, y cualquier animación que no explique un cambio de estado o dirija la atención se elimina.
7. **El color solo comunica significado.** Superficies neutras, color reservado para acción y estado. Cuando el color se reserva para comunicar, el usuario aprende a leerlo sin pensar.
8. **Construir el sistema, no pantallas a medida.** Cada pantalla se monta con bloques reutilizables. Este es nuestra propia historia: diseñar pantalla a pantalla es exactamente cómo acabamos donde describe la sección 1.
9. **Contexto por encima de páginas.** Preferir drawers, edición en línea y tarjetas expandibles a transiciones de página. El usuario no pierde el hilo; las referencias del moodboard (los dashboards de Shopify, los drawers complejos) funcionan así.

También escribimos qué evitar, porque saber qué somos está incompleto sin saber qué no somos:

1. **Material Design.** Vivimos dentro de sus opiniones y dedicamos el tiempo a sortearlas. No es un estilo que nos disguste; es una restricción que ya hemos pagado.
2. **Glassmorphism pesado.** El veredicto de la investigación: el desenfoque como señal espacial vale; la distorsión refractiva sobre datos densos, no. Cristal en la estructura, fondos sólidos en los datos.
3. **Dashboards corporativos llenos de color.** Cuando todo es colorido, nada destaca.
4. **Estética de consumo lúdica.** Nuestros usuarios son profesionales que toman decisiones financieras. El deleite vive en la precisión y las microinteracciones, no en mascotas redondeadas.

Los principios existen para que una revisión pueda discutir contra un principio y no contra una preferencia. Ahora viven junto a la [estrategia de marca](/estrategia-marca), para que cualquier diseñador futuro herede el razonamiento junto con los componentes.

## 5. Fundamentos en blanco y negro

Montamos nuestros tokens primitivos y semánticos sin ningún color. Un token es solo una decisión con nombre, «fondo lienzo», «fondo elevado», que hace el mismo trabajo allá donde aparece. Definir ese vocabulario antes que la paleta hace que elegir colores después sea un cambio rápido: se actualiza el primitivo y todas las pantallas cambian con él. Igual con decisiones de espaciado como la distancia de la navegación al contenido: se fija una base ahora, se ajusta cuando la marca madure y se propaga a todas partes.

La tipografía recibió el mismo tratamiento. Probamos Space Grotesk y Fira Sans, y ambas variaban de ancho según el patrón de cifras (0000 frente a 4444). IBM Plex Sans se mantuvo consistente, así que se convirtió en la familia tipográfica de la identidad moderna.

## 6. Componentes en código, documentación en Figma

Con los fundamentos listos, hicimos la lista de componentes primitivos y nos la repartimos. Yo tomé chip, badge, tarjeta y tabla; Miguel, tag, diálogo, barra de navegación y pestañas. Botones, inputs, checkboxes y toggles ya estaban hechos. Drawer y barra lateral los reservamos para construirlos juntos: demasiadas variaciones para decidir en solitario. Empezamos por los componentes primitivos porque son los bloques con los que se monta todo lo demás; los patrones más complejos solo se construyen cuando de verdad hacen falta.

Construimos primero en código, con nuestras referencias, y después generamos prompts para que el agente de Figma creara cada componente y su documentación. Eso nos ahorró la mayor parte del tiempo de documentación, y como todo apunta a las mismas variables, ajustar una refleja el cambio allá donde hace falta.

Desde ahí empezamos una página de trabajo de componentes para enseñar al equipo las interacciones en un entorno aislado durante las revisiones. Para mantener la disciplina de ese circuito construimos dos skills. Nuestra skill /ds-cleanup audita un componente o una página, señala dónde se desvía del sistema y, con una segunda orden, lo corrige. Nuestra skill /ship hace commit y push; yo hago el merge; y devuelve un prompt de Figma con todo lo que cambió en las variables, para que Figma y el código nunca se separen.

Para la reunión de revisión, enviamos el enlace de la documentación con la convocatoria, para que el equipo llegue con contexto.

## 7. El desvío hacia la estructura

Antes de añadir movimiento a los componentes quisimos mirar el producto completo, porque en la investigación vimos que la mayoría de los productos financieros no tienen una sola gráfica o tabla flotando en blanco. La mayoría van directos a la conclusión: una lectura rápida de un vistazo, con espacio para profundizar bajo demanda.

Así que tomamos una decisión de diseño: organizar el producto en torno al valor que entrega cada página, no al orden en que se construye un plan. Menos pantallas y más orientadas a la conclusión. Para llegar ahí, mapeamos las ~15 pantallas a una declaración de valor: ¿a qué conclusión debería llegar el usuario en los cinco segundos siguientes a mirar esta página?

Conclusiones es el caso más claro: hoy Diagnóstico y Plan de acción son dos páginas separadas, pero la declaración de valor es una sola pregunta, «¿cuál es mi situación y qué hago al respecto?», así que se convierte en un solo dashboard.

## 8. Microinteracciones

Con los componentes en verde, el movimiento pasó a ser la siguiente capa. El principio ya estaba fijado: el movimiento explica estados, nunca decora.

No inventamos la mayoría de las animaciones; las coleccionamos. La pulsación de botón de Shopify, en la que el icono baja un píxel como una tecla, la replicamos en Figma hasta las sombras. Wireframe.co marcó el listón de los estados hover. De Magic UI tomamos dos patrones que merecía la pena robar: un borde degradado que se anima cuando un input recibe el foco, y un botón que se transforma al completarse una tarea. Este último encaja directamente en fintech: un botón de envío que permanece deshabilitado hasta completar el formulario, se activa con movimiento y recorre enviar, enviando, enviado. El compás de procesamiento de 150-250 ms de la primera parte vive en esta misma capa.

## 9. Dónde estamos ahora: las gráficas

Todos los componentes de la lista están construidos. El hueco es lo único que nunca estuvo en la lista: las gráficas. En un producto fintech, las gráficas son la identidad visual. Son lo que el cliente mira de verdad.

El terreno ya está preparado en los fundamentos: los roles de color de gráfica (`chart/primary`, `chart/forecast`, `chart/positive`, `chart/negative`) quedaron reservados cuando tokenizamos en blanco y negro. Los primeros ejemplos de tarjeta con gráfica ya están en Figma y estamos construyendo versiones para compararlas.

Este es el capítulo actual. El siguiente artículo empieza con una gráfica.
