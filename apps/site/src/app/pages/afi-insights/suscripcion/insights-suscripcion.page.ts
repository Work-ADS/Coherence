import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  InputComponent,
  ButtonComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  BadgeComponent,
  CardComponent,
} from '@coherence/ui';
import { InsightsHeaderComponent } from '../shared/insights-header.component';
import { InsightsFooterComponent } from '../shared/insights-footer.component';
import { ArticleCardComponent } from '../shared/article-card.component';
import {
  CATEGORIES,
  MOCK_ARTICLES,
  type SubscriptionStep,
  type InsightCategory,
  type NewsletterFrequency,
} from '../data/mock-articles';

@Component({
  selector: 'ai-insights-suscripcion',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    BadgeComponent,
    CardComponent,
    InsightsHeaderComponent,
    InsightsFooterComponent,
    ArticleCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas">
      <ai-insights-header />

      <main class="flex-1 max-w-[560px] mx-auto px-space-6 py-space-16 w-full">

        <!-- Progress bar -->
        <div class="flex items-center gap-space-2 mb-space-10">
          @for (s of steps; track s; let i = $index) {
            <div
              class="flex-1 h-1.5 rounded-full transition-colors duration-base"
              [class.bg-action]="stepIndex() >= i"
              [class.bg-neutral-200]="stepIndex() < i"
            ></div>
          }
          <span class="text-caption text-neutral-400 ml-space-2 shrink-0">
            Paso {{ stepIndex() + 1 }} de {{ steps.length }}
          </span>
        </div>

        <!-- ==================== STEP 1: Email ==================== -->
        @if (currentStep() === 'email') {
          <div class="text-center">
            <h1 class="text-title font-serif text-canvas-fg mb-space-3">
              Suscribete a AFI Insights
            </h1>
            <p class="text-body-md text-neutral-500 mb-space-8 max-w-[420px] mx-auto">
              Recibe analisis de calidad directamente en tu bandeja.
              Sin spam, solo contenido que mueve el sector.
            </p>

            <div class="flex items-start gap-space-3 max-w-[400px] mx-auto mb-space-4">
              <div class="flex-1">
                <afi-input
                  type="email"
                  placeholder="tu email corporativo"
                  ariaLabel="Email corporativo"
                  [value]="email()"
                  [error]="emailError()"
                  (valueChange)="email.set($event?.toString() ?? '')"
                />
              </div>
              <afi-button
                variant="primary"
                (clicked)="submitEmail()"
              >Suscribirme</afi-button>
            </div>

            <p class="text-caption text-neutral-400">
              Mas de 2.000 profesionales del sector financiero ya suscritos
            </p>
          </div>
        }

        <!-- ==================== STEP 2: Confirmation ==================== -->
        @if (currentStep() === 'confirmation') {
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-system-success/10 flex items-center justify-center mx-auto mb-space-6">
              <span class="text-system-success text-title">&#10003;</span>
            </div>

            <h1 class="text-title font-serif text-canvas-fg mb-space-3">
              Ya estas suscrito
            </h1>
            <p class="text-body-md text-neutral-500 mb-space-2">
              Te enviaremos contenido semanalmente a
            </p>
            <p class="text-body-md font-medium text-canvas-fg mb-space-8">
              {{ email() }}
            </p>

            @if (extractedCompany()) {
              <p class="text-body-sm text-neutral-400 mb-space-6">
                Empresa detectada: <strong class="text-canvas-fg">{{ extractedCompany() }}</strong>
              </p>
            }

            <afi-button
              variant="secondary"
              (clicked)="currentStep.set('preferences')"
            >Personaliza tus preferencias</afi-button>

            <div class="mt-space-12">
              <p class="text-body-sm font-medium text-neutral-500 mb-space-4">Mientras tanto</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-4">
                @for (article of featuredArticles; track article.id) {
                  <ai-article-card [article]="article" />
                }
              </div>
            </div>
          </div>
        }

        <!-- ==================== STEP 3: Preferences ==================== -->
        @if (currentStep() === 'preferences') {
          <div>
            <h1 class="text-title font-serif text-canvas-fg mb-space-2 text-center">
              Personaliza tu experiencia
            </h1>
            <p class="text-body-md text-neutral-500 mb-space-10 text-center">
              Estos campos son opcionales. Puedes actualizarlos en cualquier momento
              desde el enlace en la newsletter.
            </p>

            <div class="flex flex-col gap-space-6">
              <!-- Name fields -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-4">
                <afi-input
                  label="Nombre"
                  placeholder="Tu nombre"
                  [value]="name()"
                  (valueChange)="name.set($event?.toString() ?? '')"
                />
                <afi-input
                  label="Apellido"
                  placeholder="Tu apellido"
                  [value]="surname()"
                  (valueChange)="surname.set($event?.toString() ?? '')"
                />
              </div>

              <!-- Topic preferences -->
              <div>
                <p class="text-body-md font-medium text-canvas-fg mb-space-3">Temas de interes</p>
                <div class="flex flex-col gap-space-2">
                  @for (cat of allCategories; track cat.key) {
                    <div class="flex items-center gap-space-2">
                      <afi-checkbox
                        [label]="cat.label"
                        [checked]="isTopicSelected(cat.key)"
                        (checkedChange)="toggleTopic(cat.key)"
                      />
                      @if (cat.key === 'estudios' || cat.key === 'articulos') {
                        <afi-badge intent="info" size="sm">Popular</afi-badge>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Frequency -->
              <div>
                <p class="text-body-md font-medium text-canvas-fg mb-space-3">Frecuencia</p>
                <afi-radio-group
                  ariaLabel="Frecuencia de envio"
                  [value]="frequency()"
                  (valueChange)="frequency.set($event === 'semanal' ? 'semanal' : 'mensual')"
                >
                  <afi-radio-group-item
                    value="semanal"
                    label="Semanal"
                    hint="Recibe un resumen cada lunes"
                    [name]="'freq'"
                    [selected]="frequency() === 'semanal'"
                    (selectedChange)="frequency.set('semanal')"
                  />
                  <afi-radio-group-item
                    value="mensual"
                    label="Mensual"
                    hint="Un digest a principio de cada mes"
                    [name]="'freq'"
                    [selected]="frequency() === 'mensual'"
                    (selectedChange)="frequency.set('mensual')"
                  />
                </afi-radio-group>
              </div>

              <!-- Save -->
              <div class="pt-space-4">
                <afi-button
                  variant="primary"
                  [fullWidth]="true"
                  (clicked)="savePreferences()"
                >Guardar preferencias</afi-button>
              </div>

              @if (saved()) {
                <div class="text-center">
                  <p class="text-body-sm text-system-success font-medium">
                    Preferencias guardadas correctamente.
                  </p>
                </div>
              }
            </div>
          </div>
        }
      </main>

      <ai-insights-footer />
    </div>
  `,
})
export class InsightsSuscripcionPage {
  readonly steps: SubscriptionStep[] = ['email', 'confirmation', 'preferences'];
  readonly allCategories = CATEGORIES;
  readonly featuredArticles = MOCK_ARTICLES.filter((a) => a.featured).slice(0, 2);

  readonly currentStep = signal<SubscriptionStep>('email');
  readonly email = signal('');
  readonly emailError = signal<string | null>(null);
  readonly name = signal('');
  readonly surname = signal('');
  readonly selectedTopics = signal<Set<InsightCategory>>(new Set(['estudios', 'articulos']));
  readonly frequency = signal<NewsletterFrequency>('semanal');
  readonly saved = signal(false);

  readonly stepIndex = computed(() => this.steps.indexOf(this.currentStep()));

  readonly extractedCompany = computed(() => {
    const val = this.email();
    if (!val.includes('@')) return null;
    const domain = val.split('@')[1];
    if (!domain) return null;
    const freeProviders = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    if (freeProviders.includes(domain.toLowerCase())) return null;
    const company = domain.split('.')[0];
    return company ? company.charAt(0).toUpperCase() + company.slice(1) : null;
  });

  isTopicSelected(key: InsightCategory): boolean {
    return this.selectedTopics().has(key);
  }

  toggleTopic(key: InsightCategory): void {
    const current = new Set(this.selectedTopics());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.selectedTopics.set(current);
  }

  submitEmail(): void {
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
    this.currentStep.set('confirmation');
  }

  savePreferences(): void {
    this.saved.set(true);
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
