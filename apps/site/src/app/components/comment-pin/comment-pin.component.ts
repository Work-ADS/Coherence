import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'site-comment-pin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comment-pin.component.html',
  styleUrl: './comment-pin.component.scss',
})
export class CommentPinComponent {
  readonly x = input.required<number>();
  readonly y = input.required<number>();
  readonly count = input<number>(1);
  readonly id = input.required<string>();
  readonly text = input<string>('');
  readonly active = input<boolean>(false);

  readonly activated = output<string>();

  readonly title = computed(() => {
    const c = this.count();
    if (c > 1) return `${c} comentarios`;
    return this.text();
  });

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.activated.emit(this.id());
  }
}
