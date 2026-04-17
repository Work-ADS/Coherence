// TODO(brand-manifest): selector prefix may change once DS package naming is finalized.
import { Component, input } from '@angular/core';

/**
 * Download-MD button — plan.md item 17.
 *
 * Lets a visitor download the raw .md skill / reference file so they
 * can drop it into their own AI-agent context and inherit the same
 * rules our agents follow.
 *
 * Fetches on click only — no construction-time network activity.
 *
 * @example
 * ```html
 * <coherence-download-md
 *   filePath="/assets/docs/token-skill.md"
 *   label="Download token-skill.md"
 * />
 * ```
 */
@Component({
  selector: 'coherence-download-md',
  standalone: true,
  templateUrl: './download-md-button.component.html',
  styleUrl: './download-md-button.component.scss',
})
export class DownloadMdButtonComponent {
  /** Path to the .md file served from public/assets (e.g. '/assets/docs/token-skill.md'). */
  readonly filePath = input.required<string>();

  /** Visible button label. */
  readonly label = input<string>('Download reference (.md)');

  /** Click handler — fetch then trigger browser download. */
  async download(): Promise<void> {
    const path = this.filePath();
    try {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`GET ${path} responded ${res.status}`);
      }
      const blob = await res.blob();
      const filename = path.split('/').pop() ?? 'reference.md';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn(`[coherence-download-md] Failed to download "${path}":`, err);
    }
  }
}
