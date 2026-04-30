import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-copy-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Copy</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Todo el texto visible en Coherence es español RAE formal (registro <em>usted</em>). El
        equipo habla al agente en cualquier idioma; la salida es siempre español correcto.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Dual mode -->
      <section class="mb-space-12">
        <h2 id="modo-dual" class="text-section text-canvas-fg mb-space-6">Modo dual</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6 max-w-[720px]">
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-2">Entrada (equipo → agente)</p>
            <p class="text-body-sm text-neutral-600">
              Cualquier idioma. Spanglish incluido. El agente entiende la intención.
            </p>
          </div>
          <div class="p-space-6 border border-action-500 rounded-md bg-surface-quiet">
            <p class="text-body-sm-600 text-canvas-fg mb-space-2">Salida (agente → UI)</p>
            <p class="text-body-sm text-neutral-600">
              Español RAE. Acentos correctos, puntuación invertida, formato numérico español.
            </p>
          </div>
        </div>
      </section>

      <!-- Orthography rules -->
      <section class="mb-space-12">
        <h2 id="ortografia" class="text-section text-canvas-fg mb-space-6">Ortografía RAE</h2>
        <div class="flex flex-col gap-space-3 max-w-[720px]">
          @for (rule of orthoRules; track rule.title) {
            <div class="flex gap-space-4 p-space-3 border border-border-hairline rounded-md">
              <span class="text-body-sm-600 text-canvas-fg shrink-0 w-[140px]">{{
                rule.title
              }}</span>
              <p class="text-body-sm text-neutral-600">{{ rule.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- UI copy register -->
      <section class="mb-space-12">
        <h2 id="registro-ui" class="text-section text-canvas-fg mb-space-6">
          Registro de interfaz
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Voz de operador a operador. La frase más corta no ambigua. Patrones específicos:
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Contexto</th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Patrón</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Ejemplo</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Errores</td>
                <td class="py-space-3 pr-space-4">Qué falló + qué hacer</td>
                <td class="py-space-3">
                  «No se pudo guardar. Revise la conexión e intente de nuevo.»
                </td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Éxito</td>
                <td class="py-space-3 pr-space-4">Confirmación breve</td>
                <td class="py-space-3">«Guardado correctamente.»</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Estado vacío</td>
                <td class="py-space-3 pr-space-4">Qué se espera + cómo empezar</td>
                <td class="py-space-3">«Todavía no hay escenarios. Cree uno para comenzar.»</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Botones</td>
                <td class="py-space-3 pr-space-4">Verbo infinitivo</td>
                <td class="py-space-3">«Guardar», «Eliminar», «Exportar»</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4">Advertencias</td>
                <td class="py-space-3 pr-space-4">Consecuencia + opción</td>
                <td class="py-space-3">«Se eliminarán 3 filas. ¿Desea continuar?»</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Glossary -->
      <section class="mb-space-12">
        <h2 id="glosario" class="text-section text-canvas-fg mb-space-6">Glosario AFI</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Términos estandarizados inglés → español. Si el término no está aquí, use la traducción
          RAE más directa.
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Inglés</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Español AFI</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              @for (term of glossary; track term.en) {
                <tr class="border-b border-border-hairline">
                  <td class="py-space-3 pr-space-4 font-mono">{{ term.en }}</td>
                  <td class="py-space-3">{{ term.es }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Pre-flight -->
      <section class="mb-space-12">
        <h2 id="pre-flight" class="text-section text-canvas-fg mb-space-6">Pre-flight de copy</h2>
        <ul
          class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2"
        >
          <li>Acentos correctos en todas las palabras (incluidas mayúsculas)</li>
          <li>Puntuación invertida: ¿…? y ¡…!</li>
          <li>Formato numérico español: 1.234,56 €</li>
          <li>Register formal (<em>usted</em>), nunca tuteo</li>
          <li>Sin anglicismos evitables (consultar glosario)</li>
          <li>Mensajes de error con acción clara</li>
          <li>Botones en infinitivo</li>
          <li>Sin emojis en la interfaz (salvo que el usuario lo pida)</li>
        </ul>
      </section>

      <!-- Related -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-6">
          Temas relacionados
        </h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li>
            <a routerLink="/fundamentos/accesibilidad" class="underline hover:text-action-800"
              >Accesibilidad</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/principios" class="underline hover:text-action-800"
              >Principios</a
            >
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/copy-skill.md</code>
        </p>
      </section>
    </div>
  `,
})
export class CopyPage {
  readonly orthoRules = [
    { title: 'Acentos', desc: 'Obligatorios incluso en mayúsculas: INFORMACIÓN, no INFORMACION.' },
    { title: 'Puntuación', desc: 'Signos invertidos al inicio: ¿Desea continuar? ¡Atención!' },
    { title: 'Ñ', desc: 'Siempre presente. Año, señal, diseño — nunca sustituir por "n".' },
    {
      title: 'Comillas',
      desc: 'Comillas angulares «…» para citas en interfaz. "…" solo dentro de «…».',
    },
    {
      title: 'Números',
      desc: 'Punto para miles (1.234), coma para decimales (0,56). Símbolo de moneda después: 1.234,56 €.',
    },
  ];

  readonly glossary = [
    { en: 'Dashboard', es: 'Panel' },
    { en: 'Sign in', es: 'Iniciar sesión' },
    { en: 'Sign up', es: 'Crear cuenta' },
    { en: 'Log out', es: 'Cerrar sesión' },
    { en: 'Settings', es: 'Configuración' },
    { en: 'Provider', es: 'Proveedor' },
    { en: 'Override', es: 'Sobrescribir' },
    { en: 'Deploy', es: 'Desplegar' },
    { en: 'Workflow', es: 'Flujo de trabajo' },
    { en: 'Template', es: 'Plantilla' },
    { en: 'Dropdown', es: 'Desplegable' },
    { en: 'Toggle', es: 'Alternar' },
    { en: 'Breadcrumb', es: 'Ruta de navegación' },
    { en: 'Tooltip', es: 'Tooltip (no traducir)' },
    { en: 'Changelog', es: 'Changelog (no traducir)' },
  ];
}
