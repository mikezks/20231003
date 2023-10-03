import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Flight,
  FlightFilter,
  FlightService,
} from '../../data';
import { CityValidator, addMinutes } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { FlightFilterComponent } from '../../ui-common';
import { signalState } from '@ngrx/signal-store';
import { state } from '@angular/animations';

// import { HiddenService } from "../../../checkin/data/hidden.service";
// import { CheckinService } from "@demo/checkin/data";

export type ViewModel = {
  filter: {
    from: string,
    to: string,
    urgent: boolean
  },
  flights: Flight[],
  basket: Record<number, boolean>
};

@Component({
  standalone: true,
  imports: [
    // CommonModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,

    FormsModule,
    FlightCardComponent,
    FlightFilterComponent,
    CityValidator,
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  vm = signalState<ViewModel>({
    filter: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false
    },
    flights: [],
    basket: {
      3: true,
      5: true,
    }
  });

  constructor() {
    this.vm.$update(state => ({
      ...state,
      flight: [
        ...state.flights,
        {
          id: 999,
          from: 'Madrid',
          to: 'Barcelona',
          date: new Date().toISOString(),
          delayed: true
        }
      ]
    }));
  }

  search(filter: FlightFilter): void {
    this.vm.$update({ filter });

    if (!this.vm.filter.from() || !this.vm.filter.to()) return;

    this.flightService
      .find(this.vm.filter.from(), this.vm.filter.to(), this.vm.filter.urgent())
      .subscribe((flights) => {

        this.vm.$update({ flights });

      });
  }

  updateBasket(id: number, selected: boolean): void {
    this.vm.$update({
      basket: {
        ...this.vm.basket(),
        [id]: selected
      }
    });
  }

  delay(): void {
    /* const flight = this.flights[0];
    flight.date = addMinutes(flight.date, 15); */
  }
}
