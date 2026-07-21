import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City, WeatherService } from '../../services/weather.services';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather implements OnInit {
  private weatherService = inject(WeatherService);

  vistaActual: 'NACIONAL' | 'ASTURIAS' = 'NACIONAL';
  ciudades: City[] = [];
  ciudadesFiltradas: City[] = []; // Array que alimentará la vista filtrada
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarDatosNacional();
  }

  cargarDatosNacional(): void {
    this.vistaActual = 'NACIONAL';
    this.loading.set(true);

    this.weatherService.getCiudadesNacional().subscribe({
      next: (data) => {
        this.ciudades = data;
        this.ciudadesFiltradas = data; // Inicialmente mostramos todas
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos nacionales:', err);
        this.loading.set(false);
      }
    });
  }

  cargarDatosAsturias(): void {
    this.vistaActual = 'ASTURIAS';
    this.loading.set(true);

    this.weatherService.getCiudadesAsturias().subscribe({
      next: (data) => {
        this.ciudades = data;
        this.ciudadesFiltradas = data; // Inicialmente mostramos todas
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos de Asturias:', err);
        this.loading.set(false);
      }
    });
  }

  /**
   * Filtra las tarjetas según la opción seleccionada en el <select>
   */
  onCiudadSelect(event: Event): void {
    const selectedName = (event.target as HTMLSelectElement).value;

    if (!selectedName) {
      this.ciudadesFiltradas = this.ciudades; // Muestra todas si se elige la opción por defecto
    } else {
      this.ciudadesFiltradas = this.ciudades.filter(
        c => c.name.toLowerCase() === selectedName.toLowerCase()
      );
    }
  }

  getImageUrl(stateSkyId: string): string {
    return this.weatherService.getWeatherIconUrl(stateSkyId);
  }
}