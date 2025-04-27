import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

interface LegOptions {
  targetProfit: {
    enabled: boolean;
    type: string;
    value: number;
  };
  stopLoss: {
    enabled: boolean;
    type: string;
    value: number;
  };
  trailSL: {
    enabled: boolean;
    type: string;
    value1: number;
    value2: number;
  };
  reEntryOnTgt: {
    enabled: boolean;
    type: string;
    value: number;
  };
  reEntryOnSL: {
    enabled: boolean;
    type: string;
    value: number;
  };
  simpleMomentum: {
    enabled: boolean;
    type: string;
    value: number;
  };
  rangeBreakout: {
    enabled: boolean;
    time: string;
    high: boolean;
    low: boolean;
    instrument: string;
  };
}

interface Leg {
  id: number;
  segment: 'Futures' | 'Options';
  lots: number;
  position: 'Buy' | 'Sell';
  options: LegOptions;
}

@Component({
  selector: 'app-leg-manager',
  templateUrl: './leg-manager.component.html',
  styleUrl: './leg-manager.component.scss',
  standalone: true,
  imports: [NavbarComponent, RouterModule, FormsModule, CommonModule],
})
export class LegManagerComponent {
  legs: Leg[] = [];
  selectedSegment: 'Futures' | 'Options' = 'Futures';
  selectedPosition: 'Buy' | 'Sell' = 'Sell';
  lots: number = 1;
  isCollapsed = false;
  
  // Maximum number of legs allowed
  readonly MAX_LEGS = 4;

  // Check if max legs limit reached
  get canAddLeg(): boolean {
    return this.legs.length < this.MAX_LEGS;
  }

  getDefaultOptions(): LegOptions {
    return {
      targetProfit: {
        enabled: false,
        type: 'Points (Pts)',
        value: 0
      },
      stopLoss: {
        enabled: false,
        type: 'Points (Pts)',
        value: 0
      },
      trailSL: {
        enabled: false,
        type: 'Points',
        value1: 0,
        value2: 0
      },
      reEntryOnTgt: {
        enabled: false,
        type: 'RE ASAP',
        value: 1
      },
      reEntryOnSL: {
        enabled: false,
        type: 'RE ASAP',
        value: 1
      },
      simpleMomentum: {
        enabled: false,
        type: 'Points (Pts)',
        value: 0
      },
      rangeBreakout: {
        enabled: false,
        time: '09:45',
        high: false,
        low: false,
        instrument: 'Instrument'
      }
    };
  }

  // Add a new leg
  addLeg(): void {
    if (this.canAddLeg) {
      const newLeg: Leg = {
        id: Date.now(),
        segment: this.selectedSegment,
        lots: this.lots,
        position: this.selectedPosition,
        options: this.getDefaultOptions()
      };
      this.legs.push(newLeg);
    }
  }

  // Delete a leg
  deleteLeg(index: number): void {
    this.legs.splice(index, 1);
  }

  copyLeg(index: number): void {
    if (this.canAddLeg) {
      const legToCopy = this.legs[index];
      const newLeg: Leg = {
        ...legToCopy,
        id: Date.now()
      };
      this.legs.push(newLeg);
    }
  }

  // Toggle segment selection
  selectSegment(segment: 'Futures' | 'Options'): void {
    this.selectedSegment = segment;
  }

  // Toggle position selection
  selectPosition(position: 'Buy' | 'Sell'): void {
    this.selectedPosition = position;
  }

  // Update lots value
  updateLots(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.lots = Math.max(1, parseInt(input.value) || 1);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  updateLegLots(leg: Leg, event: Event): void {
    const input = event.target as HTMLInputElement;
    leg.lots = Math.max(1, parseInt(input.value) || 1);
  }

  updateLegPosition(leg: Leg, event: Event): void {
    const select = event.target as HTMLSelectElement;
    leg.position = select.value as 'Buy' | 'Sell';
  }

  toggleOption(leg: Leg, optionKey: keyof LegOptions): void {
    leg.options[optionKey].enabled = !leg.options[optionKey].enabled;
  }

  updateOptionValue(leg: Leg, optionKey: keyof LegOptions, event: Event, valueKey: string = 'value'): void {
    const input = event.target as HTMLInputElement;
    const option = leg.options[optionKey] as any;
    option[valueKey] = input.type === 'number' ? parseFloat(input.value) : input.value;
  }

  updateOptionType(leg: Leg, optionKey: keyof LegOptions, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const option = leg.options[optionKey] as any;
    option.type = select.value;
  }

  toggleRangeBreakout(leg: Leg, type: 'high' | 'low'): void {
    leg.options.rangeBreakout[type] = !leg.options.rangeBreakout[type];
  }
}
