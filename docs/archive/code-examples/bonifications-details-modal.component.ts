import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { BaseModalComponent } from "../../common/base-modal/base-modal.component";
import { BonificationsDropdownComponent } from "../bonifications-dropdown/bonifications-dropdown.component";
import { WSBonification } from '../../../classes/ws-bonifications';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bonifications-details-modal',
  standalone: true,
  imports: [BaseModalComponent, TranslateModule, CommonModule],
  templateUrl: './bonifications-details-modal.component.html',
  styleUrl: './bonifications-details-modal.component.scss'
})
export class BonificationsDetailsModalComponent implements OnInit {
getBonifName(bonif: WSBonification) {
  return `${bonif.name}\u00A0${bonif.subIndex ? `${this.getNumberForSubIndex(bonif.subIndex)}` : ''}`;
}

  @Input() mortgageName: string = '';
  @Input() maxBonification: number = 0;
  @Input() bonifications: Array<WSBonification> = [];
  @Input() isModal: boolean = false;

  @Output() bonificationsUpdate = new EventEmitter<Array<WSBonification>>();

  isChanged: boolean = false;
  
  public subIndexMap: Map<string, number> = new Map();

  ngOnInit(): void {
    if (this.bonifications) {
      this.updateBonifs();
    }
  }

  private updateBonifs(): void {
    const filtered = this.bonifications.filter(bonification => bonification.value > 0);
    this.bonifications = this.mergeBonifications(filtered);

    this.subIndexMap.clear();
    const seen = new Set<string>();
    let counter = 2;

    for (const bonif of this.bonifications) {
      if (bonif.subIndex && !seen.has(bonif.subIndex)) {
        this.subIndexMap.set(bonif.subIndex, counter);
        seen.add(bonif.subIndex);
        counter++;
      }
    }
  }

  private mergeBonifications(bonifications: Array<WSBonification>): Array<WSBonification> {
    if (bonifications.length === 0) return [];
    
    const merged: Array<WSBonification> = [];
    let i = 0;

    while (i < bonifications.length) {
      const current = bonifications[i];
      let mergedName = current.name;
      let j = i + 1;

      while (j < bonifications.length && 
             bonifications[j].value === current.value && 
             bonifications[j].subIndex === current.subIndex) {
        mergedName += ' o ' + bonifications[j].name;
        j++;
      }

      const mergedBonif = { ...current, name: mergedName };
      merged.push(mergedBonif);

      i = j;
    }

    return merged;
  }
  
  onBonifChange() {
    this.isChanged = true;
  }

  getNumberForSubIndex(subIndex: string): string | null {
    const num = this.subIndexMap.get(subIndex);
    if (num === undefined) return null;
    const superscriptMap: Record<string, string> = {
      '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
      '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '0': '&#x2070;' // ⁰
    };
    return String(num).split('').map(d => superscriptMap[d] ?? d).join('');
  }

  getMaxSubIndex(): number {
    return this.subIndexMap.size;
  }

  get sortedSubIndexMap() {
    return Array.from(this.subIndexMap.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([key, value]) => ({ key, value }));
  }
}
