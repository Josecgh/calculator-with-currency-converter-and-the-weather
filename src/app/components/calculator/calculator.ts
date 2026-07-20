import { Component } from '@angular/core';
import { Screen } from './screen/screen';
import { Buttons } from './buttons/buttons';

@Component({
  selector: 'app-calculator',
  imports: [Screen, Buttons],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  currentExpression: string = '0';

  memory: number = 0; 

  handleKeyPress(value: string): void {
    if (value === 'M+') {
      this.calculateResult(); // Primero calculamos lo que haya en pantalla
      if (this.currentExpression !== 'Error') {
        this.memory += parseFloat(this.currentExpression);
      }
      return;
    }

    if (value === 'MR') {
      if (this.currentExpression === '0' || this.currentExpression === 'Error') {
        this.currentExpression = this.memory.toString();
      } else {
        this.currentExpression += this.memory.toString();
      }
      return;
    }

    if (value === 'MC') {
      this.memory = 0;
      return;
    }

    if (value === 'CE') {
      this.currentExpression = '0';
      return;
    }

    if (value === '=') {
      this.calculateResult();
      return;
    }

    if (this.currentExpression === '0' || this.currentExpression === 'Error') {
      this.currentExpression = value;
    } else {
      this.currentExpression += value;
    }
  }

  private calculateResult(): void {
    try {
      const match = this.currentExpression.match(/([0-9.]+)\s*([+\-*/])\s*([0-9.]+)/);
      
      if (!match) return; 

      const num1 = parseFloat(match[1]);
      const operator = match[2];
      const num2 = parseFloat(match[3]);

      let result = 0;

      switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': 
          if (num2 === 0) {
            this.currentExpression = 'Error';
            return;
          }
          result = num1 / num2; 
          break;
        default: return;
      }

      this.currentExpression = Number(result.toFixed(4)).toString();

    } catch (error) {
      this.currentExpression = 'Error';
    }
  }
}
