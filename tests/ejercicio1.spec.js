const { test, expect } = require('@playwright/test');

test.describe('Ejercicio 1 - Validaciones Básicas', () => {

  test('debe validar el título de la página', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    // Con esto validamos que el título contenga el texto esperado
    await expect(page).toHaveTitle(/The Internet/);
  });

  test('debe validar que el heading sea visible', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    // Aquí buscamos el heading principal
    const heading = page.locator('h1');
    
    // Esta aserción confirma que el elemento es visible
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Welcome');
  });

  test('debe validar que existe texto específico en la página', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    // Validamos que existe el subtitulo
    const subtitle = page.locator('h2');
    await expect(subtitle).toContainText('Available Examples');
  });

  test('debe validar que un enlace específico existe', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    // Buscamos el enlace por su texto
    const link = page.getByRole('link', { name: 'Form Authentication' });
    
    // Verificamos que el enlace sea visible
    await expect(link).toBeVisible();
  });

  test('debe validar múltiples elementos en la página', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Validamos que existan varios campos del formulario
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

});
