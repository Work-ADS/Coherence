import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';

import {
  PROPOSALS,
  PROPOSAL_TYPE_LABEL,
  Proposal,
  ProposalType,
} from '../../data/propuestas.data';
import { StatusTagComponent } from '../../components/status-tag/status-tag.component';
import { CrearPropuestaDialogComponent } from '../../components/crear-propuesta-dialog/crear-propuesta-dialog.component';

@Component({
  selector: 'awmp-propuestas',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    StatusTagComponent,
    CrearPropuestaDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './propuestas.page.html',
  styleUrl: './propuestas.page.scss',
})
export class PropuestasPage {
  readonly proposals = signal<Proposal[]>(PROPOSALS);
  readonly globalSearch = signal('');
  readonly tableSearch = signal('');
  readonly dialogOpen = signal(false);

  typeLabelFor(row: Proposal): string {
    return PROPOSAL_TYPE_LABEL[row.type];
  }

  openCreateDialog(): void {
    this.dialogOpen.set(true);
  }

  onTypeSelected(type: ProposalType): void {
    // eslint-disable-next-line no-console
    console.log('Crear propuesta type:', type);
    // Real flow would route to /propuesta/new?type=...
  }

  trackById = (_: number, item: Proposal) => item.id;
}
