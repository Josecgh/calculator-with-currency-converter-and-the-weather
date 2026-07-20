import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buttons',
  imports: [],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {
  @Output() buttonsPressed = new EventEmitter<string>();
  
  buttons: string[] = [
    'CE', 'M+', 'MR', 'MC',
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  onButtonClick(value: string): void {
    console.log('Botón pulsado:', value);
    this.buttonsPressed.emit(value);
  }

  getButtonClass(btn: string): string {
    if (['/', '*', '-', '+'].includes(btn)) return 'operator';
    if (btn === '=') return 'equals';
    return 'number';
  }
}
