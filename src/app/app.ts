import { Component, signal } from '@angular/core';
import { Calculator } from './components/calculator/calculator';
import { Converter } from './components/converter/converter';
import { Weather } from './components/weather/weather';

@Component({
  selector: 'app-root',
  imports: [Calculator, Converter, Weather],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-calculator');
}
