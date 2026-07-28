# Cómo construimos la nueva identidad visual

> Borrador fuente en español para `/blog/identidad-visual` (tercera parte de la serie del rediseño).
> Traducido de `visual-identity-process.en.md` con la pasada afi-redaccion.
> El HTML de la página se sincroniza desde este archivo; las notas de visuales viven en el borrador inglés.

**Entradilla:** De un encargo difuso a un sistema funcionando en código. Este es nuestro proceso de diseño: qué hicimos y por qué, porque reconstruir el contexto es donde los equipos pierden más tiempo y acaban diseñando por preferencias.

---

## 1. Contexto y objetivos

### El diseño en Afi es joven

Antes de que Miguel entrara en Afi, el equipo de programación recibía PNG de los diseños de un diseñador gráfico.

Miguel se incorporó y trabajó al principio solo en Wealth Manager, un producto distinto. Introdujo flujos reales en Figma, pero la organización seguía sin sistemas de diseño. Diseño y desarrollo solo colaboraban cuando había una duda visual o una objeción; las pantallas se diseñaban a ojo y los programadores tomaban el relevo.

No había colaboración, ni definición, ni estrategia.

Mi primer proyecto al incorporarme fue Bankinter. Diseñamos un planificador financiero con la línea visual comercial, con muchas idas y venidas con el equipo de Bankinter.

Después de todo ese trabajo resultó que el producto era para banca privada, una línea visual completamente distinta, lo que subraya la importancia de estar alineados como equipo.

El Wealth Planner se topó con el mismo problema durante el proyecto de Renta 4. Proyectos nuevos con cero contexto.

Cuando arrancó el proyecto de Renta 4, mi encargo fue: cambia el nombre y ponlo en rojo. Sin materiales de marca, sin contexto sobre el tamaño del proyecto, **sin plan**. Y el producto se había construido sin componentes, así que cualquier iteración costaría un tiempo que no teníamos.

Cuando llegó la primera ronda de iteraciones, pasé el equipo a componentes, con la librería de Material porque era lo que ya usaba el código del equipo. Fue un avance real y la iteración se aceleró bastante.

Pero entonces aprendimos lo que se nos había escapado por no trabajar juntos y no dedicar tiempo al descubrimiento: Material tiene opiniones muy marcadas y tuvimos que forzarla para crear productos que encajaran con las marcas de nuestros clientes. Sistematizar el diseño fue la decisión correcta, pero hacerlo dentro de Material nos impuso más restricciones.

Después, en lugar de mejorar el producto, mi tarea fue crear versiones distintas del Wealth Planner para Afi y Unicaja, cambiando solo tipografías, colores y logos, con el objetivo de vendérselo a otros clientes.

El flujo de trabajo nunca dio a nadie tiempo para diseñar. Por eso acabamos con un producto estático y de aspecto anticuado.

### Nuestra oportunidad

La IA cambió lo que es posible: ya no estamos limitados a librerías de Angular con opiniones ajenas; podemos construir la nuestra. Por eso hice el curso de sistemas de diseño con IA de Memorisely. Nos da la flexibilidad para crear los productos que queremos.

Ese es el contexto de este rediseño. Queremos un efecto *wow*, algo que no tenemos desde hace tiempo.

Para conseguirlo, lo estamos haciendo de otra manera. Trabajamos *juntos* como equipo de diseño, aplicamos un proceso de diseño y documentamos el trabajo, porque todos los proyectos anteriores empezaron igual: sin alineación previa.

### Wealth Planner

El Wealth Planner de Afi es una herramienta con la que los asesores financieros construyen, simulan y presentan planes patrimoniales a sus clientes. Tenemos nuestra versión, que usamos sobre todo para demos. También lo ofrecemos en marca blanca a bancos españoles, conectando sus bases de datos de clientes.

El encargo fue una línea: que parezca más moderno.

El problema de fondo es que todo funciona sobre pantallas estáticas de Figma. Los clientes se pierden durante las presentaciones por culpa de esas pantallas estáticas y de experiencias que nunca se pensaron a fondo. Los desarrolladores trabajan pantalla a pantalla sin entender las interacciones. Por mucho color que le pusiéramos, la interfaz parecía anticuada.

Así que antes de tocar nada fijamos tres objetivos: una interfaz ligera y densa en información, pensada para profesionales; demos interactivas en código en lugar de documentación solo en Figma, para que los desarrolladores inspeccionen el producto real; y un sistema que escale.

## 2. Definir «moderno»

Antes de abrir Figma quisimos definir qué significa «moderno». Si no, cada revisión se convierte en un debate sobre lo que gusta y lo que no; sin una definición compartida, el gusto discute con el gusto y no se decide nada.

Sintetizamos la investigación en la [primera parte de esta serie](/blog/ui-moderno-2026). La versión corta:

- **Intención en lo visual.** Tonos neutros, profundidad funcional, retículas bento para la jerarquía. El color y la animación transmiten información.
- **Dinámico en lugar de lineal.** Los flujos lineales crean experiencias aburridas; lo que necesitamos es entender de verdad el objetivo del usuario y construir el layout a su alrededor.
- **Sistemas, sistemas, sistemas.** Tokens semánticos como única fuente de verdad, para que las decisiones sean legibles también por máquinas.
- **Evidencia por encima de opinión.** Como los layouts pueden ser dinámicos, cobra más peso medir y hablar con los usuarios. Las opiniones basadas solo en gustos, sin métricas ni usuarios detrás, frenan la creatividad.
- **Atención a los pequeños detalles.** Ahora que construir es mucho más rápido, la interfaz moderna deja espacio para los detalles que el usuario no sabría nombrar pero sí nota. Una flecha que gira o un botón que se ajusta a su texto eran antes un extra; hoy son la forma de demostrar que, incluso con IA, alguien prestó atención.

## 3. Moodboards y una lista corta

Después de la investigación, cada uno construyó su moodboard en Mobbin, por separado y organizado por componente: botones, inputs, menús, tarjetas, diálogos, barra lateral, filtros. Tres o cuatro pantallas guardadas por componente.

Wise fue la única referencia de nuestro propio sector. Es la prueba de que una fintech puede funcionar casi entera en blanco y negro y poner color solo donde los datos lo necesitan.

Después recorrimos las dos colecciones, componente a componente.

Miguel detectó el patrón primero: «Elegíamos las mismas aplicaciones una y otra vez. Quizá esa es la dirección que buscamos». Los mismos nombres aparecían en ambos tableros, y esa fue la lista corta: Wise, Cursor, Shopify, Clerk, Notion y Granola, con Linear, OpenAI y Stack AI.

La sesión produjo direcciones, no diseños finales.
1. Botones compactos como los de Cursor, con la sombra casi invisible que usa Stack AI.
2. Inputs ajustados como los de OpenAI, en dos variantes de padding.
3. Menús como los de Clerk: solo opciones, sin iconos, sombra marcada.
4. Una barra de navegación con migas al estilo Clerk: espacio de trabajo, cliente, simulación.
5. Shopify como referencia de gráficas sobre tarjetas.
6. Wise como **punto de partida** en el uso del color.

De la propia sesión salió una idea: al pulsar, el botón se hunde y gana una respuesta más física. Parece pequeño, pero marcó el tono de cómo trataríamos las microinteracciones después.

## 4. Principios para el equipo

Después de la sesión de moodboards cogimos los patrones que elegíamos una y otra vez, los conectamos con la investigación y los escribimos como nueve principios de diseño.

1. **Densidad de información sin densidad visual.** Mostrar mucha información sin que la pantalla resulte recargada, para que los datos se lean con facilidad.
2. **Controles compactos.** Botones, inputs y menús ocupan solo el espacio que necesitan. Todos los productos de nuestra lista corta (Cursor, OpenAI, Linear, Notion) funcionan así.
3. **Minimalismo funcional.** Si un elemento no cumple una función, se va. La confianza nace de la ausencia de decoración y de destacar lo que de verdad importa.
4. **Revelado progresivo.** Mostrar primero lo esencial y revelar el detalle cuando el usuario lo pide. Todo lo demás queda a un clic, no en la primera pantalla.
5. **Consistencia por encima de novedad.** El usuario aprende un patrón una vez y lo reconoce en todas partes, así dedica menos esfuerzo a entender tareas nuevas.
6. **El movimiento explica estados, nunca decora.** La animación muestra que algo ha cambiado o dirige la atención. Todo lo demás se elimina.
7. **El color solo comunica significado.** Las superficies se mantienen neutras y el color siempre significa algo, así el usuario aprende a leerlo sin pensar. En las gráficas eso implica una serie destacada sobre gris, con el verde y el rojo reservados para subidas y bajadas.
8. **Construir el sistema y el flujo, no pantallas.** Cada pantalla se monta con bloques reutilizables. Diseñar pantalla a pantalla es exactamente como se acaba en productos estáticos y aburridos.
9. **Contexto por encima de páginas.** Mantener al usuario donde está: drawers, edición en línea y tarjetas expandibles en lugar de mandarlo a otra página.

También escribimos qué evitar, porque saber qué somos está incompleto sin saber qué no somos:

1. **Material Design.** Vivimos dentro de sus opiniones y dedicamos el tiempo a sortearlas.
2. **Glassmorphism pesado.** El desenfoque que crea profundidad vale; el cristal sobre datos densos perjudica la legibilidad. Cristal en las superficies, fondos sólidos detrás de los datos.
3. **Dashboards corporativos llenos de color.** Cuando todo es colorido, nada destaca.
4. **Estética de consumo lúdica.** No somos un producto B2C. Nuestros usuarios son profesionales que toman decisiones financieras. El efecto *wow* viene de los micromomentos de deleite, esos pequeños lugares donde podemos añadir estilo.

Los principios existen para que una revisión pueda discutir contra un principio y no contra una preferencia. Ahora viven junto a la [estrategia de marca](/estrategia-marca), para que cualquier diseñador futuro herede el razonamiento junto con los componentes.

## 5. Fundamentos en blanco y negro

Montamos nuestros tokens primitivos y semánticos en blanco y negro. Un token es un rol, como «fondo lienzo» o «fondo elevado», que hace el mismo trabajo allá donde aparece. Definir ese vocabulario antes que la paleta hace que elegir colores después sea un cambio rápido: se actualiza el primitivo y todas las pantallas cambian con él. Igual con decisiones de espaciado como la distancia de la navegación al contenido: se fija una base ahora, se ajusta cuando la marca madure y se propaga a todas partes.

En tipografía probamos Space Grotesk, Fira Sans y Geist, y ninguna superó la prueba de ancho entre patrones de cifras (0000 frente a 4444). IBM Plex Sans se mantuvo consistente, así que se convirtió en la familia tipográfica de la identidad moderna.

## 6. Componentes en código, documentación en Figma

Con los fundamentos listos, hicimos la lista de componentes primitivos y nos la repartimos. Yo tomé chip, badge, tarjeta y tabla; Miguel, tag, diálogo, barra de navegación y pestañas.

Botones, inputs, checkboxes y toggles los construimos juntos, para definir un flujo de trabajo eficiente y conseguir resultados parecidos.

Empezamos por los componentes primitivos porque son los bloques con los que se monta todo lo demás; los patrones más complejos solo se construyen cuando de verdad hacen falta.

Nuestro flujo de trabajo:
1. Área de trabajo en baja fidelidad: construimos el componente primitivo en código a partir del moodboard y escribimos un prompt para el agente de Figma.
2. La IA construye el componente en Figma con las variables correctas, crea las que falten y redacta la documentación.
3. Hacemos los ajustes pequeños.
4. Cuando estamos satisfechos, usamos el MCP de Figma para construir el componente en nuestra librería de Afi.

Empezamos a construir una página de trabajo de componentes para enseñar al equipo las interacciones en un entorno aislado durante las revisiones.

Para mantener la consistencia construimos dos skills:
1. La skill /ds-cleanup audita un componente o una página, señala dónde se desvía del sistema y, con un segundo prompt, lo corrige.
2. La skill /ship hace commit y push; yo hago el merge; y devuelve un prompt de Figma con todo lo que cambió en las variables, para que Figma y el código nunca se separen.

Este flujo nos ahorró mucho tiempo. Todo está conectado a las variables base y tenemos salvaguardas para actualizar la documentación sobre la marcha. Eso hace que la IA siga produciendo resultados consistentes y da al equipo el contexto detrás de cada decisión de diseño.

## 7. Microinteracciones

Con los componentes primitivos terminados, el movimiento pasó a ser la siguiente capa. El principio ya estaba fijado: el movimiento explica estados, nunca decora. Eso no significaba que no pudiéramos ser creativos.

No inventamos la mayoría de las animaciones. Recreamos, aplicando ingeniería inversa, las que nos inspiraban, o cogimos una librería de animación de React, portamos el código a Angular e iteramos desde ahí. Algunas librerías que usamos:
1. Magic UI
2. Animate UI
3. shadcn

## 8. La estructura

Durante el descubrimiento vimos que la mayoría de los productos financieros no tienen una sola gráfica o tabla flotando en blanco, como nos pasa a nosotros. La mayoría van directos a la conclusión: una lectura rápida de un vistazo, con espacio para profundizar bajo demanda.

Así que tomamos una decisión de diseño: organizar el producto en torno al valor que entrega cada página, no al orden en que se construye un plan. Menos pantallas y más orientadas a la conclusión. Para llegar ahí, mapeamos las ~15 pantallas a una declaración de valor: ¿a qué conclusión debería llegar el usuario en los cinco segundos siguientes a mirar esta página?

Conclusiones es el caso más claro: hoy Diagnóstico y Plan de acción son dos páginas separadas, pero la declaración de valor es una sola pregunta, «¿cuál es mi situación y qué hago al respecto?», así que se convierte en un solo dashboard.

## 9. Dónde estamos ahora: layout y gráficas

En un producto fintech, la visualización de datos *es* la identidad visual. Las gráficas y las tarjetas son lo que el cliente mira de verdad.

Así que repetimos el ejercicio del moodboard, y esta vez recogimos layouts en lugar de componentes: cómo se organiza la página, cómo se compone un dashboard, cómo se comporta una gráfica y cómo se usa el color.

Lo que nos quedamos:

1. **Un dashboard bento** como dirección de layout. Huecos ajustados, cajas de esquinas suaves, etiquetas sobre las cifras grandes.
2. **Google Finance** para el comportamiento de las gráficas. Extremadamente simple, lo mínimo en pantalla y aun así suficiente. El control de comparación va sobre la gráfica y el tooltip actualiza una fila de valores en lugar de flotar sobre la línea, lo que resuelve un problema que tenemos hoy: mostramos tantos datos al pasar el cursor que el tooltip tapa justo lo que se quiere leer.
3. **La línea sombreada de shadcn** como única variación sobre esa base, para tener dos opciones que comparar en lugar de una que defender.
4. **Shopify** otra vez, por disciplina. Cajas dentro de cajas dentro de cajas, y un estilo de gráfica tan sencillo que resulta accesible por defecto.

Las decisiones que salieron de ahí:

- **Un sistema de layout, varios layouts.** Las páginas pueden verse distintas siempre que se monten con los mismos módulos y contenedores. Una plantilla quita partes; no inventa estructura nueva. Como lo dijo Miguel: «no parecen dos productos distintos».
- **Las secciones se apoyan sobre un fondo gris**, cada una con un borde de un píxel y su padding. Ese borde hace más por la textura que cualquier decoración.
- **Las gráficas parten de la forma más básica y accesible y crecen desde ahí.** Mi instinto era elegir tres estilos visuales del moodboard. Miguel defendió empezar conservador y añadir solo lo que se gane su sitio, y tenía razón. Así que la gráfica de Google Finance es la base, la línea de shadcn es la primera incorporación que se ganó su sitio, y cualquier cosa más allá de esas dos tiene que justificarse.
- **El color deja de codificar categorías.** Las series van en gris con un color destacado, y el verde y el rojo quedan reservados para subidas y bajadas. La frase de Miguel: «deberíamos usar cosas completamente distintas del color para diferenciar».
- **Jerarquía por página:** la conclusión grande arriba, una fila de cifras pequeñas debajo y la tabla detallada al final.
- **Las tarjetas de conclusión se expanden a pantalla completa.** Los filtros y la interacción pesada viven en la vista expandida, no en la tarjeta.
- **Nada más pesado que semibold**, y menos diferenciación en general: la misma tipografía y el mismo tamaño siempre que podamos.

El siguiente paso es que cada uno reconstruya la misma página de tres formas con los componentes reales, compararlas y elegir. Este es el capítulo actual. El siguiente artículo empieza con una gráfica.
