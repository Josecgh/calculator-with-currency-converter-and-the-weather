import { Component, input } from '@angular/core';

@Component({
  selector: 'app-screen',
  imports: [],
  templateUrl: './screen.html',
  styleUrl: './screen.css',
})
export class Screen {
  displayValue = input<string>('0');
}
