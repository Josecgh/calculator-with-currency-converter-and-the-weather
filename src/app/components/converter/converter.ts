import { Component, inject, OnInit, signal } from '@angular/core';
import { ConverterServices, CurrencyRates } from '../../services/converter.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-converter',
  imports: [CommonModule, FormsModule],
  templateUrl: './converter.html',
  styleUrl: './converter.css',
})
export class Converter implements OnInit {
  private converterService = inject(ConverterServices);

  amount: number = 100;
  fromCurrency: string = 'EUR';

  rates!: CurrencyRates;

  convertedEUR: number = 0;
  convertedUSD: number = 0;
  convertedJPY: number = 0;

  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.converterService.getRates().subscribe({
      next: (data: CurrencyRates) => {
        this.rates = data;
        this.updateCalculations();
        this.isLoading.set(false); // Apaga el loading al terminar con éxito
      },
      error: (err) => {
        console.error('Error al recibir las tasas en el componente', err);
        this.hasError.set(true);   // Activa el error
        this.isLoading.set(false); // Apaga el loading al fallar
      }
    });
  }

  updateCalculations(): void {
    if (!this.rates) return;

    this.convertedEUR = this.converterService.convert(this.amount, this.fromCurrency, 'EUR', this.rates);
    this.convertedUSD = this.converterService.convert(this.amount, this.fromCurrency, 'USD', this.rates);
    this.convertedJPY = this.converterService.convert(this.amount, this.fromCurrency, 'JPY', this.rates);
  }

  onInputChanged(): void {
    this.updateCalculations();
  }
}