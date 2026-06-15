import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-de-indicadores-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-de-indicadores.page.html',
  styleUrl: './lista-de-indicadores.page.scss',
})
export class ListaDeIndicadoresPage {}
