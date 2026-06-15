import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fila-de-lista-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fila-de-lista.page.html',
  styleUrl: './fila-de-lista.page.scss',
})
export class FilaDeListaPage {}
