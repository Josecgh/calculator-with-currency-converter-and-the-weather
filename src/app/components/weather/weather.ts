import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.services';
import { CommonModule } from '@angular/common';

// Definimos una interfaz básica para evitar el uso de 'any'
interface WeatherResponse {
  stateSky?: { description: string };
  origen?: { produccion: string };
  [key: string]: any; // Permite propiedades dinámicas adicionales si las hay
}

@Component({
  selector: 'app-weather',
  standalone: true, // Asegúrate de tenerlo si es un componente standalone
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather implements OnInit {
  currentView: 'national' | 'asturias' = 'national';
  weatherData: WeatherResponse | null = null;
  skyText: string = '';
  skyImage: string = '';

  // URLs de iconos centralizadas para facilitar su mantenimiento
  private readonly DEFAULT_ICON = 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
  private readonly WEATHER_ICONS = {
    sun: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
    cloud: 'https://cdn-icons-png.flaticon.com/512/414/414825.png',
    rain: 'https://cdn-icons-png.flaticon.com/512/3351/3351118.png',
    storm: 'https://cdn-icons-png.flaticon.com/512/1779/1779944.png',
    snow: 'https://cdn-icons-png.flaticon.com/512/642/642000.png'
  };

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadWeather();
  }

  onViewChange(view: 'national' | 'asturias'): void {
    this.currentView = view;
    this.loadWeather();
  }

  loadWeather(): void {
    this.weatherService.getWeatherData(this.currentView).subscribe({
      next: (data: WeatherResponse) => {
        this.weatherData = data;
        
        // Extracción segura del estado del cielo
        this.skyText = data.stateSky?.description || data.origen?.produccion || 'Despejado';
        this.skyImage = this.getSkyImage(this.skyText);
      },
      error: (err) => console.error('Error al cargar datos de la API:', err)
    });
  }

  getSkyImage(description: string): string {
    if (!description) return this.DEFAULT_ICON;
    
    const desc = description.toLowerCase();
    
    // PRIORIDAD ALTA: Fenómenos activos (evita que "nubes con lluvia" se quede solo en nube)
    if (desc.includes('tormenta')) return this.WEATHER_ICONS.storm;
    if (desc.includes('nieve')) return this.WEATHER_ICONS.snow;
    if (desc.includes('lluvia') || desc.includes('llovizna') || desc.includes('chubasco')) return this.WEATHER_ICONS.rain;
    
    // PRIORIDAD BAJA: Estados generales del cielo
    if (desc.includes('nube') || desc.includes('nuboso') || desc.includes('cubierto')) return this.WEATHER_ICONS.cloud;
    if (desc.includes('despejado') || desc.includes('sol')) return this.WEATHER_ICONS.sun;
    
    return this.DEFAULT_ICON;
  }
}