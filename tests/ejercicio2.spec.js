const { test, expect } = require('@playwright/test');

/**
 * EJERCICIO 2: Interacción Básica
 * 
 * Objetivo: Entender flujo simple de usuario
 * - Click en elementos
 * - Verificar cambio de URL
 * - Verificar contenido nuevo
 * - Uso de beforeEach
 */

test.describe('Ejercicio 2 - Interacción y Navegación', () => {

  // Este hook se ejecuta antes de cada test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
  });

  test('debe navegar a una sección al hacer click', async ({ page }) => {
    // Click en el enlace de Form Authentication
    await page.getByRole('link', { name: 'Form Authentication' }).click();
    
    // Verificamos que la URL cambió
    await expect(page).toHaveURL(/.*login/);
    
    // Verificamos que aparece contenido nuevo
    await expect(page.locator('h2')).toContainText('Login Page');
  });

  test('debe navegar entre diferentes secciones', async ({ page }) => {
    // Navegamos a Checkboxes
    await page.getByRole('link', { name: 'Checkboxes' }).click();
    await expect(page).toHaveURL(/.*checkboxes/);
    
    // Verificamos el contenido
    const heading = page.locator('h3');
    await expect(heading).toContainText('Checkboxes');
  });

  test('debe hacer click en un checkbox y verificar resultado', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');
    
    // Click en el primer checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    
    // Verificamos que está marcado
    await expect(checkbox).toBeChecked();
  });

  test('debe interactuar con dropdown', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    
    // Seleccionamos una opción
    await page.locator('#dropdown').selectOption('1');
    
    // Verificamos que se seleccionó
    await expect(page.locator('#dropdown')).toHaveValue('1');
  });

  test('debe validar texto dinámico', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_content');
    
    // Verificamos que hay contenido dinámico
    const content = page.locator('.large-10').first();
    await expect(content).toBeVisible();
  });

});
