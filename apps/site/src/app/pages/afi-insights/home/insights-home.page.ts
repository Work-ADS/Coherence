import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  InputComponent,
  ButtonComponent,
  TabsComponent,
  TabComponent,
  BadgeComponent,
  ModalComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import { InsightsHeaderComponent } from '../shared/insights-header.component';
import { InsightsFooterComponent } from '../shared/insights-footer.component';
import { ArticleCardComponent } from '../shared/article-card.component';
import {
  MOCK_ARTICLES,
  CATEGORIES,
  type InsightCategory,
  type NewsletterFrequency,
} from '../data/mock-articles';

interface TopicOption {
  readonly key: InsightCategory;
  readonly label: string;
  readonly popular: boolean;
}

const TOPICS: TopicOption[] = [
  { key: 'estudios', label: 'Estudios', popular: true },
  { key: 'informes', label: 'Informes y Notas', popular: false },
  { key: 'articulos', label: 'Articulos', popular: true },
  { key: 'eventos', label: 'Eventos', popular: false },
  { key: 'media', label: 'Media', popular: false },
];

@Component({
  selector: 'ai-insights-home',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    TabsComponent,
    TabComponent,
    BadgeComponent,
    ModalComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    InsightsHeaderComponent,
    InsightsFooterComponent,
    ArticleCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .ai-subscribe-band {
      background: radial-gradient(
        ellipse at 50% 0%,
        var(--color-action-50, rgba(59, 130, 246, 0.05)) 0%,
        transparent 70%
      );
    }
  `,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas">
      <ai-insights-header (subscribeClicked)="scrollToSubscribe()" />

      <main class="flex-1">
        <!-- Hero: typographic, no photo — Designit-inspired -->
        <section class="ai-subscribe-band pt-space-16 pb-space-12">
          <div class="max-w-[1200px] mx-auto px-space-6 text-center">
            <h1 class="text-display font-serif text-canvas-fg tracking-tight mb-space-4">
              AFI Insights
            </h1>
            <p class="text-body-lg text-neutral-500 max-w-[520px] mx-auto mb-space-8">
              Analisis, estudios e informes del sector financiero.
              Directamente en tu bandeja.
            </p>

            @if (!subscribed()) {
              <!-- Inline email subscribe — above the fold -->
              <div
                #subscribeSection
                class="flex items-center justify-center gap-space-3 max-w-[480px] mx-auto mb-space-2"
              >
                <div class="flex-1">
                  <afi-input
                    type="email"
                    placeholder="nombre@empresa.es"
                    ariaLabel="Email para suscripcion"
                    [value]="email()"
                    (valueChange)="email.set($event?.toString() ?? '')"
                  />
                </div>
                <afi-button
                  variant="primary"
                  (clicked)="onSubscribe()"
                >Suscribirme</afi-button>
              </div>
              @if (emailError()) {
                <p class="text-body-sm text-system-error font-medium mb-space-3">
                  {{ emailError() }}
                </p>
              }
              <p class="text-caption text-neutral-400 mt-space-3">
                Mas de 2.000 profesionales del sector financiero ya suscritos
              </p>
            } @else {
              <!-- Post-subscribe state — confirmation + preferences CTA -->
              <div class="max-w-[520px] mx-auto flex flex-col items-center gap-space-4">
                <div class="flex items-center justify-center gap-space-2 text-system-success">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <p class="text-body-md font-medium">Te has suscrito · {{ email() }}</p>
                </div>
                <p class="text-body-sm text-neutral-500">
                  Por defecto recibiras un resumen <strong class="text-canvas-fg">semanal</strong>
                  con <strong class="text-canvas-fg">Estudios</strong> y
                  <strong class="text-canvas-fg">Articulos</strong>.
                  Personaliza que temas y con que frecuencia quieres recibirlos.
                </p>
                <afi-button
                  variant="primary"
                  (clicked)="openPreferences()"
                >Personalizar mis preferencias</afi-button>
                <button
                  type="button"
                  class="text-caption text-neutral-400 underline hover:text-canvas-fg"
                  (click)="reset()"
                >Usar otro email</button>
              </div>
            }
          </div>
        </section>

        <!-- Category tabs + article grid -->
        <section class="max-w-[1200px] mx-auto px-space-6 py-space-10">
          <afi-tabs
            [activeIndex]="activeTab()"
            (activeChange)="activeTab.set($event)"
            ariaLabel="Categorias de contenido"
          >
            <afi-tab label="Todos" />
            @for (cat of categories; track cat.key) {
              <afi-tab [label]="cat.label" />
            }
          </afi-tabs>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-6 mt-space-8">
            @for (article of filteredArticles(); track article.id) {
              <ai-article-card [article]="article" />
            }
          </div>

          @if (filteredArticles().length === 0) {
            <p class="text-body-md text-neutral-400 text-center py-space-16">
              No hay contenido en esta categoria todavia.
            </p>
          }
        </section>
      </main>

      <ai-insights-footer />
    </div>

    <!-- Preferences modal — opens inline, no navigation -->
    <afi-modal
      [open]="preferencesOpen()"
      title="Personaliza tus preferencias"
      description="Elige los temas que te interesan y la frecuencia de envio. Puedes cambiarlas en cualquier momento."
      size="md"
      (openChange)="preferencesOpen.set($event)"
    >
      <div class="flex flex-col gap-space-6">
        <!-- Topics -->
        <div>
          <p class="text-body-sm font-medium text-canvas-fg mb-space-3">Temas de interes</p>
          <div class="flex flex-col gap-space-2">
            @for (topic of topics; track topic.key) {
              <div class="flex items-center justify-between gap-space-3 py-space-1">
                <afi-checkbox
                  [checked]="selectedTopics().has(topic.key)"
                  (checkedChange)="toggleTopic(topic.key, $event)"
                  [label]="topic.label"
                />
                @if (topic.popular) {
                  <afi-badge intent="info" size="sm">Popular</afi-badge>
                }
              </div>
            }
          </div>
        </div>

        <!-- Frequency -->
        <div>
          <p class="text-body-sm font-medium text-canvas-fg mb-space-3">Frecuencia</p>
          <afi-radio-group
            [value]="frequency()"
            (valueChange)="frequency.set($any($event))"
            ariaLabel="Frecuencia de envio"
          >
            <afi-radio-group-item
              value="semanal"
              label="Semanal"
              hint="Recibe un resumen cada lunes"
              [name]="'home-freq'"
              [selected]="frequency() === 'semanal'"
              (selectedChange)="frequency.set('semanal')"
            />
            <afi-radio-group-item
              value="mensual"
              label="Mensual"
              hint="Un digest a principio de cada mes"
              [name]="'home-freq'"
              [selected]="frequency() === 'mensual'"
              (selectedChange)="frequency.set('mensual')"
            />
          </afi-radio-group>
        </div>
      </div>

      <div slot="footer" class="flex items-center gap-space-3">
        <afi-button variant="ghost" (clicked)="preferencesOpen.set(false)">Cancelar</afi-button>
        <afi-button variant="primary" (clicked)="savePreferences()">Guardar preferencias</afi-button>
      </div>
    </afi-modal>

    <!-- Toast (very simple) -->
    @if (preferencesSaved()) {
      <div
        class="fixed bottom-space-6 left-1/2 -translate-x-1/2 z-50 px-space-4 py-space-3 rounded-md bg-canvas-fg text-canvas shadow-lg text-body-sm font-medium"
        role="status"
      >
        Preferencias guardadas
      </div>
    }
  `,
})
export class InsightsHomePage {
  readonly categories = CATEGORIES;
  readonly topics = TOPICS;

  readonly activeTab = signal(0);
  readonly email = signal('');
  readonly emailError = signal<string | null>(null);
  readonly subscribed = signal(false);

  readonly preferencesOpen = signal(false);
  readonly preferencesSaved = signal(false);

  readonly selectedTopics = signal(new Set<InsightCategory>(['estudios', 'articulos']));
  readonly frequency = signal<NewsletterFrequency>('semanal');

  readonly filteredArticles = computed(() => {
    const idx = this.activeTab();
    if (idx === 0) return MOCK_ARTICLES;
    const cat = CATEGORIES[idx - 1];
    if (!cat) return MOCK_ARTICLES;
    return MOCK_ARTICLES.filter((a) => a.category === cat.key);
  });

  scrollToSubscribe(): void {
    document.querySelector('[aria-label="Email para suscripcion"]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  onSubscribe(): void {
    const val = this.email().trim();
    if (!val) {
      this.emailError.set('Introduce tu email corporativo');
      return;
    }
    if (!val.includes('@') || !val.includes('.')) {
      this.emailError.set('Formato no valido');
      return;
    }
    if (isFreeEmailDomain(val)) {
      this.emailError.set('Solo aceptamos emails corporativos. Usa el de tu empresa.');
      return;
    }
    this.emailError.set(null);
    this.subscribed.set(true);
  }

  openPreferences(): void {
    this.preferencesOpen.set(true);
  }

  toggleTopic(key: InsightCategory, checked: boolean): void {
    const next = new Set(this.selectedTopics());
    if (checked) next.add(key);
    else next.delete(key);
    this.selectedTopics.set(next);
  }

  savePreferences(): void {
    this.preferencesOpen.set(false);
    this.preferencesSaved.set(true);
    setTimeout(() => this.preferencesSaved.set(false), 2200);
  }

  reset(): void {
    this.subscribed.set(false);
    this.email.set('');
    this.emailError.set(null);
  }
}

const FREE_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.es',
  'hotmail.com',
  'hotmail.es',
  'outlook.com',
  'outlook.es',
  'live.com',
  'icloud.com',
  'me.com',
  'protonmail.com',
  'aol.com',
];

function isFreeEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;
  return FREE_DOMAINS.includes(domain);
}
