import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-principios-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Principios</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Las convicciones que guían cada decisión de diseño en Coherence — por qué existe este
        sistema, para quién trabaja y cómo se alinea con la forma de construir de AFI.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Estrella norte -->
      <section class="mb-space-12">
        <h2 id="estrella-norte" class="text-section text-canvas-fg mb-space-6">Estrella norte</h2>
        <blockquote
          class="border-l-2 border-action-500 pl-space-6 py-space-2 text-body-md italic text-canvas-fg max-w-[640px] mb-space-6"
        >
          Un sistema de diseño que los desarrolladores realmente usan — porque está construido para
          cómo
          <em>ellos</em> consumen información, no para cómo los diseñadores desearían que lo
          hicieran.
        </blockquote>
        <p class="text-body-md text-neutral-600 max-w-[640px]">
          Coherence no compite con Figma ni duplica un handoff que nadie lee. Entrega componentes,
          tokens y documentación directamente donde el equipo de desarrollo ya trabaja: en el
          código, en la terminal, en el IDE.
        </p>
      </section>

      <!-- El cambio -->
      <section class="mb-space-12">
        <h2 id="el-cambio" class="text-section text-canvas-fg mb-space-6">El cambio</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          La IA no reemplaza criterio — lo amplifica. Coherence nace de una premisa operativa:
          eficiencia sobre esfuerzo, velocidad sin sacrificar calidad, y herramientas que devuelven
          tiempo a las personas en lugar de quitárselo.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6 max-w-[720px]">
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-2">Antes</p>
            <p class="text-body-sm text-neutral-500">
              Variables se pierden en el handoff. El diseñador absorbe la prisa y la culpa. Los
              desarrolladores no consultan Figma, ni DevMode, ni documentación.
            </p>
          </div>
          <div class="p-space-6 border border-action-500 rounded-md bg-surface-quiet">
            <p class="text-body-sm-600 text-canvas-fg mb-space-2">Ahora</p>
            <p class="text-body-sm text-neutral-500">
              Un archivo MD es la fuente de verdad. Los agentes de IA lo leen, el sitio lo
              renderiza, el equipo lo descarga. Un cambio actualiza todo.
            </p>
          </div>
        </div>
      </section>

      <!-- División de trabajo -->
      <section class="mb-space-12">
        <h2 id="division-de-trabajo" class="text-section text-canvas-fg mb-space-6">
          División de trabajo
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Coherence separa responsabilidades entre el diseñador y el equipo de desarrollo.
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Diseñador</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Equipo de desarrollo</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Diseño visual y gusto estético</td>
                <td class="py-space-3">Backend y arquitectura</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Animación y motion</td>
                <td class="py-space-3">Accesibilidad (WCAG)</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Coherencia entre superficies</td>
                <td class="py-space-3">Calidad de código</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Tokens y lenguaje visual</td>
                <td class="py-space-3">Testing y pre-flight</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- IA como guía socrática -->
      <section class="mb-space-12">
        <h2 id="ia-como-guia" class="text-section text-canvas-fg mb-space-6">
          IA como guía socrática
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          La IA en Coherence no es autocompletar. Es un guía socrático: hace preguntas, preserva
          decisiones, y construye andamiaje — nunca sustituye el criterio humano.
        </p>
        <ul
          class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2"
        >
          <li>Los agentes leen los mismos archivos MD que usted descarga en este sitio.</li>
          <li>El plan vive en un archivo — no en una conversación efímera.</li>
          <li>Cada brief pasa por cuatro fases con checkpoint entre ellas.</li>
          <li>El Builder no escribe código sin antes consultar los skills.</li>
        </ul>
      </section>

      <!-- Identidad visual -->
      <section class="mb-space-12">
        <h2 id="identidad-visual" class="text-section text-canvas-fg mb-space-6">
          Identidad visual
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Innovador pero con clase. Moderno pero culto. El registro editorial de Coherence se
          inspira en revistas como The New Yorker y Monocle aplicadas al software: tipografía
          primero, color con moderación, líneas horizontales sobre cajas, peso y tracking sobre
          tamaño.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-4 max-w-[720px]">
          <div class="p-space-4 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-1">Estructura</p>
            <p class="text-body-sm text-neutral-500">
              Compacta, disciplinada, organizada. Ref: Figma.
            </p>
          </div>
          <div class="p-space-4 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-1">Tipografía</p>
            <p class="text-body-sm text-neutral-500">
              Roboto Serif en toda la jerarquía. Ref: Granola.
            </p>
          </div>
          <div class="p-space-4 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-1">Color</p>
            <p class="text-body-sm text-neutral-500">
              Base monocromática neutra + acentos estratégicos. Ref: Wise.
            </p>
          </div>
        </div>
      </section>

      <!-- Criterios de éxito -->
      <section class="mb-space-12">
        <h2 id="criterios-de-exito" class="text-section text-canvas-fg mb-space-6">
          Criterios de éxito
        </h2>
        <ul
          class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2"
        >
          <li>V1 gana la adopción del dev lead de AFI (cabeza de playa).</li>
          <li>V1 se usa para construir el Wealth Planner — prueba «200&#37; productividad».</li>
          <li>V1 sobrevive un stress test de white-label (multi-marca).</li>
          <li>El tiempo de entrega baja sin que la calidad baje con él.</li>
        </ul>
      </section>

      <!-- Temas relacionados -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-6">
          Temas relacionados
        </h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li>
            <a routerLink="/fundamentos/color" class="underline hover:text-action-800">Color</a>
          </li>
          <li>
            <a routerLink="/fundamentos/tipografia" class="underline hover:text-action-800"
              >Tipografía</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/accesibilidad" class="underline hover:text-action-800"
              >Accesibilidad</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/tokens" class="underline hover:text-action-800">Tokens</a>
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/strategy/manifesto.md</code>
        </p>
      </section>
    </div>
  `,
})
export class PrincipiosPage {}
