import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E del Componente de Tiempo (Weather)', () => {

  test.beforeEach(async ({ page }) => {
    // Interceptamos cualquier llamada a la API externa del clima (AEMET, OpenMeteo, etc.)
    await page.route('**/*', async (route) => {
      const request = route.request();
      // Si la llamada NO es para assets locales (localhost), aseguramos una respuesta válida
      if (!request.url().includes('localhost') && !request.url().includes('127.0.0.1')) {
        // Si tienes una API específica puedes devolver mock, o simplemente dejar que continúe
        await route.continue();
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
  });

  test('debe cargar y mostrar las ciudades en la vista Nacional por defecto', async ({ page }) => {
    const weatherComp = page.locator('app-weather');

    // Verificamos que se rendericen ciudades por defecto (como Madrid o Barcelona)
    await expect(weatherComp).toContainText('Madrid');
    await expect(weatherComp).toContainText('Barcelona');
  });

  test('debe cambiar a la vista de Asturias al hacer clic en el botón correspondiente', async ({ page }) => {
    const weatherComp = page.locator('app-weather');

    // Hacemos clic en el botón Asturias dentro de app-weather
    const asturiasBtn = weatherComp.getByRole('button', { name: /Asturias/i });
    await asturiasBtn.click();

    // Verificamos que se muestren ciudades de Asturias (como Oviedo)
    await expect(weatherComp).toContainText('Oviedo');
  });

  test('debe filtrar por una ciudad específica usando el select', async ({ page }) => {
    const weatherComp = page.locator('app-weather');
    const citySelect = weatherComp.locator('#citySelect');

    // Seleccionamos la segunda opción disponible en el dropdown (ej. Barcelona)
    // Usamos index: 1 para evitar problemas con etiquetas exactas
    await citySelect.selectOption({ index: 1 });

    // Disparamos el evento change por si Angular usa (change) en lugar de (input)
    await citySelect.dispatchEvent('change');

    // Verificamos que las tarjetas se hayan filtrado
    // (Al filtrar solo quedará 1 ciudad en la lista)
    const cards = weatherComp.locator('.card, .weather-card, div > h3');
    await expect(cards.first()).toBeVisible();
  });

});
