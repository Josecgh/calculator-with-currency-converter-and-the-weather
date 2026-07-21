import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environmentsWeather } from '../environments/environmentsWeather';

export interface CityStateSky {
  description: string;
  id: string;
}

export interface CityTemperatures {
  max: string;
  min: string;
}

export interface City {
  id: { [key: string]: string };
  idProvince: string;
  name: string;
  nameProvince: string;
  stateSky: CityStateSky;
  temperatures: CityTemperatures;
}

interface WeatherApiResponse {
  ciudades: City[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrlNac = environmentsWeather.weatherApiUrlNac;
  private apiUrlAst = environmentsWeather.weatherApiUrlAst;

  /** Obtiene las principales ciudades a nivel nacional */
  getCiudadesNacional(): Observable<City[]> {
    return this.http.get<WeatherApiResponse>(this.apiUrlNac).pipe(
      map(response => response.ciudades)
    );
  }

  /** Obtiene todos los municipios de Asturias */
  getCiudadesAsturias(): Observable<City[]> {
    return this.http.get<WeatherApiResponse>(this.apiUrlAst).pipe(
      map(response => response.ciudades)
    );
  }

  getWeatherIconUrl(stateSkyId: string | number): string {
    if (!stateSkyId) {
      return 'https://www.el-tiempo.net/themes/eltiempo-theme/assets/img/weather-static/clear-day.svg';
    }

    const id = String(stateSkyId).trim();

    // Mapeo de códigos de la API de el-tiempo.net a sus iconos SVG correspondientes
    const iconMap: { [key: string]: string } = {
      '1': 'clear-day',             // Despejado / Sol
      '1n': 'clear-night',          // Despejado noche
      '2': 'partly-cloudy-day',     // Poco nuboso
      '2n': 'partly-cloudy-night',  // Poco nuboso noche
      '3': 'cloudy',                // Nuboso
      '4': 'overcast',              // Muy nuboso / Cubierto
      '5': 'fog',                   // Niebla
      '6': 'rain',                  // Lluvia
      '7': 'snow',                  // Nieve
      '11': 'clear-day',            // Despejado
      '11n': 'clear-night',
      '12': 'partly-cloudy-day',    // Poco nuboso
      '12n': 'partly-cloudy-night',
      '13': 'partly-cloudy-day',    // Intervalos nubosos
      '14': 'cloudy',               // Nuboso
      '15': 'overcast',             // Muy nuboso
      '16': 'overcast',             // Cubierto
      '17': 'rain',                 // Nubes altas / Lluvia débil
      '18': 'rain',                 // Lluvia
      '19': 'thunderstorms-rain',   // Tormenta
      '20': 'snow',                 // Nieve
      '21': 'fog',                  // Niebla
      '22': 'wind',                 // Viento
      '23': 'rain',                 // Lluvia escasa
      '24': 'rain',                 // Chubascos
      '25': 'thunderstorms-rain',   // Chubascos con tormenta
      '26': 'snow'                  // Chubascos de nieve
    };

    // Obtenemos el nombre del archivo, si no coincide usamos 'clear-day' por defecto
    const iconName = iconMap[id] || 'clear-day';

    return `https://www.el-tiempo.net/themes/eltiempo-theme/assets/img/weather-static/${iconName}.svg`;
  }
  /**
   * Busca una ciudad por nombre.
   * @param name Nombre de la ciudad a buscar (ej: "Oviedo" o "Barcelona").
   * @param esAsturias Opcional. Si es true, busca en la lista de Asturias; si es false (por defecto), en la Nacional.
   */
  getCiudadByName(name: string, idProvince:string = '33'): Observable<City | undefined> {
    const fuente$ = (idProvince === '33')
      ? this.getCiudadesAsturias()
      : this.getCiudadesNacional()
    ;
    
    return fuente$.pipe(
      map(ciudades => ciudades.find(
        c => c.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  /** Filtra las ciudades nacionales por el ID de la provincia (ej: '08' para Barcelona) */
  getCiudadesByProvinceId(idProvince: string): Observable<City[]> {
    return this.getCiudadesNacional().pipe(
      map(ciudades => ciudades.filter(c => c.idProvince === idProvince))
    );
  }
}