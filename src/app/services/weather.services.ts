import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentsWeather } from '../environments/environmentsWeather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  // El método ahora acepta el parámetro que tu componente le envía
  getWeatherData(type: 'national' | 'asturias'): Observable<any> {
    
    // Si es Asturias, usamos la URL exacta de tu environment
    if (type === 'asturias') {
      return this.http.get<any>(environmentsWeather.weatherApiUrl);
    }
    
    // Si es Nacional, limpiamos la ruta reemplazando 'provincias/33' por 'general'
    const nationalUrl = environmentsWeather.weatherApiUrl.replace('provincias/33', 'general');
    return this.http.get<any>(nationalUrl);
  }
}