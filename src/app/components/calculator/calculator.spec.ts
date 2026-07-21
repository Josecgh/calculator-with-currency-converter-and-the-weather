import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';

describe('Calculator Component', () => {
  let component: Calculator;
  let fixture: ComponentFixture<Calculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculator]
    }).compileComponents();

    fixture = TestBed.createComponent(Calculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Entrada de números y operadores', () => {
    it('debería reemplazar el "0" inicial con el primer número ingresado', () => {
      component.handleKeyPress('5');
      expect(component.currentExpression).toBe('5');
    });

    it('debería concatenar múltiples entradas numéricas y operadores', () => {
      component.handleKeyPress('1');
      component.handleKeyPress('0');
      component.handleKeyPress('+');
      component.handleKeyPress('5');
      expect(component.currentExpression).toBe('10+5');
    });

    it('debería limpiar la pantalla al presionar "CE"', () => {
      component.handleKeyPress('9');
      component.handleKeyPress('+');
      component.handleKeyPress('CE');
      expect(component.currentExpression).toBe('0');
    });
  });

  describe('Cálculos Matemáticos (=)', () => {
    it('debería sumar dos números correctamente', () => {
      component.currentExpression = '12+8';
      component.handleKeyPress('=');
      expect(component.currentExpression).toBe('20');
    });

    it('debería restar dos números correctamente', () => {
      component.currentExpression = '15-7';
      component.handleKeyPress('=');
      expect(component.currentExpression).toBe('8');
    });

    it('debería multiplicar dos números correctamente', () => {
      component.currentExpression = '4*3';
      component.handleKeyPress('=');
      expect(component.currentExpression).toBe('12');
    });

    it('debería dividir dos números correctamente', () => {
      component.currentExpression = '20/4';
      component.handleKeyPress('=');
      expect(component.currentExpression).toBe('5');
    });

    it('debería limitar el resultado a 4 decimales máximo', () => {
      component.currentExpression = '10/3';
      component.handleKeyPress('=');
      expect(component.currentExpression).toBe('3.3333');
    });

    it('debería mostrar "Error" al intentar dividir entre cero', () => {
      component.currentExpression = '10/0';
      component.handleKeyPress('=');
      expect(component.currentExpression).toBe('Error');
    });

    it('debería reemplazar el estado "Error" cuando el usuario pulse una nueva tecla', () => {
      component.currentExpression = 'Error';
      component.handleKeyPress('7');
      expect(component.currentExpression).toBe('7');
    });
  });

  describe('Operaciones de Memoria (M+, MR, MC)', () => {
    it('debería calcular el resultado actual y sumarlo a la memoria con M+', () => {
      component.currentExpression = '5+5';
      component.handleKeyPress('M+');
      
      expect(component.currentExpression).toBe('10');
      expect(component.memory).toBe(10);
    });

    it('debería acumular valores en la memoria con múltiples llamadas a M+', () => {
      component.currentExpression = '10';
      component.handleKeyPress('M+'); // memoria = 10
      
      component.currentExpression = '20';
      component.handleKeyPress('M+'); // memoria = 30
      
      expect(component.memory).toBe(30);
    });

    it('no debería alterar la memoria si el resultado de M+ da "Error"', () => {
      component.currentExpression = '5/0';
      component.handleKeyPress('M+'); // Intenta calcular 5/0 -> Error
      
      expect(component.currentExpression).toBe('Error');
      expect(component.memory).toBe(0);
    });

    it('debería recuperar el valor de la memoria con MR sustituyendo el "0"', () => {
      component.memory = 42;
      component.handleKeyPress('MR');
      expect(component.currentExpression).toBe('42');
    });

    it('debería anexar la memoria con MR si ya hay una expresión activa', () => {
      component.memory = 5;
      component.currentExpression = '10+';
      component.handleKeyPress('MR');
      expect(component.currentExpression).toBe('10+5');
    });

    it('debería borrar la memoria al presionar MC', () => {
      component.memory = 100;
      component.handleKeyPress('MC');
      expect(component.memory).toBe(0);
    });
  });
});