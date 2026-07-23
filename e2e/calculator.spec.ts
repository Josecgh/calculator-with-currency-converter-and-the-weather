import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E de la Calculadora', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Navega a la app antes de cada test
    await page.goto('/');
  });

  test('debe realizar una suma correctamente', async ({ page }) => {
    // Simula clics en los botones 5 + 3 =
    await page.getByRole('button', { name: '5' }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '=' }).click();

    // Verifica que la pantalla muestre '8'
    const screen = page.locator('app-screen'); // Ajusta el selector según el HTML de tu pantalla
    await expect(screen).toContainText('8');
  });

  test('debe mostrar Error al dividir entre cero', async ({ page }) => {
    await page.getByRole('button', { name: '9' }).click();
    await page.getByRole('button', { name: '/' }).click();
    await page.getByRole('button', { name: '0' }).click();
    await page.getByRole('button', { name: '=' }).click();

    const screen = page.locator('app-screen');
    await expect(screen).toContainText('Error');
  });

  test('debe limpiar la pantalla al presionar CE', async ({ page }) => {
    await page.getByRole('button', { name: '7' }).click();
    await page.getByRole('button', { name: 'CE' }).click();

    const screen = page.locator('app-screen');
    await expect(screen).toContainText('0');
  });

});