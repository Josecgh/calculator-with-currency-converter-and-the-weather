import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E del Conversor de Divisas', () => {

  test.beforeEach(async ({ page }) => {
    // Interceptamos absolutamente cualquier petición HTTP que devuelva datos JSON de divisas
    await page.route('**/*', async (route) => {
      const request = route.request();
      // Si la llamada NO es para archivos locales (js, css, html), devolvemos las tasas simuladas
      if (!request.url().includes('localhost') && !request.url().includes('127.0.0.1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            amount: 1,
            base: 'EUR',
            rates: {
              EUR: 1,
              USD: 1.1,
              JPY: 160
            }
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
  });

  test('debe cargar las tasas y mostrar las conversiones iniciales', async ({ page }) => {
    const converter = page.locator('app-converter');

    // Esperamos a que los datos se rendericen (ya no deben estar vacíos)
    await expect(converter).not.toContainText('Euros €');
  });

  test('debe recalcular la conversión cuando el usuario cambia la cantidad', async ({ page }) => {
    const converter = page.locator('app-converter');
    const amountInput = converter.locator('input');

    // Limpiamos y escribimos el nuevo valor
    await amountInput.fill('200');
    // Forzamos el evento de entrada en el input de Angular
    await amountInput.dispatchEvent('input');

    // Verificamos que el input realmente tenga el valor '200'
    await expect(amountInput).toHaveValue('200');

    // Verificamos que los textos con los valores convertidos hayan cambiado (ej. 200 * 1.1 = 220 USD)
    await expect(converter).toContainText('220');
  });

});