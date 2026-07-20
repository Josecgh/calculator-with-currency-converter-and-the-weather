import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environmentConverter } from '../environments/environmentConverter';
import { Observable, map, catchError, of } from 'rxjs';

export interface CurrencyRates {
  EUR: number;
  USD: number;
  JPY: number;
  [key: string]: number; // Permite indexación dinámica por string
}

interface CurrencyFreaksResponse {
  date: string;
  base: string;
  rates: {
    EUR: string;
    USD: string;
    JPY: string;
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ConverterServices {
  private http = inject(HttpClient);
  private baseUrl = environmentConverter.converterApiUrl;
  private apikey = environmentConverter.converterApiKey;

  // Tasas de respaldo (fallback) por seguridad si la API falla o supera el límite
  private fallbackRates: CurrencyRates = {
    EUR: 0.92,
    USD: 1.0,
    JPY: 154.0
  };

  /**
   * Obtiene las tasas de CurrencyFreaks y las transforma a formato numérico
   */
  getRates(): Observable<CurrencyRates> {
    const url = `${this.baseUrl}?apikey=${this.apikey}`;
    
    return this.http.get<CurrencyFreaksResponse>(url).pipe(
      map(response => ({
        EUR: parseFloat(response.rates['EUR']),
        USD: parseFloat(response.rates['USD']),
        JPY: parseFloat(response.rates['JPY'])
      })),
      catchError(error => {
        console.error('Error al conectar con CurrencyFreaks. Usando tasas por defecto:', error);
        // Retorna las tasas seguras de respaldo sin romper el flujo de la app
        return of(this.fallbackRates);
      })
    );
  }

  /**
   * Calcula la tasa cruzada usando USD como puente (necesario en el plan gratuito)
   */
  convert(amount: number, fromCurrency: string, targetCurrency: string, rates: CurrencyRates): number {
    if (!amount || amount <= 0) return 0;
    
    // 1. Pasar de la divisa de origen a Dólar base (USD)
    const amountInUSD = amount / rates[fromCurrency];
    
    // 2. Pasar de Dólar base a la divisa de destino
    return amountInUSD * rates[targetCurrency];
  }
}