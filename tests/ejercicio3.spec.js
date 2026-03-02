const { test, expect } = require('@playwright/test');

/**
 * EJERCICIO 3: Flujo Completo E2E
 * 
 * Objetivo: Crear un flujo completo estilo prueba de integración
 * - Simulación de flujo de usuario
 * - Validar estado después de acciones
 * - Validar múltiples elementos
 * - Uso de hooks
 */

test.describe('Ejercicio 3 - Flujo E2E Completo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
  });

  test('flujo completo: login exitoso', async ({ page }) => {
    // Navegamos al login
    await page.getByRole('link', { name: 'Form Authentication' }).click();
    
    // Llenamos el formulario
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // Enviamos el formulario
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Validamos que aparece el mensaje de éxito
    const flash = page.locator('#flash');
    await expect(flash).toContainText('You logged into a secure area!');
    
    // Validamos que el botón de logout está visible
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });

  test('flujo completo: login fallido', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Llenamos credenciales incorrectas
    await page.locator('#username').fill('usuario_incorrecto');
    await page.locator('#password').fill('password_incorrecto');
    
    // Hacemos click en submit
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verificamos que aparece mensaje de error
    const flash = page.locator('#flash');
    await expect(flash).toContainText('Your username is invalid!');
  });

  test('flujo completo: agregar y remover elementos', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
    
    // Agregamos 3 elementos
    const addButton = page.getByRole('button', { name: 'Add Element' });
    await addButton.click();
    await addButton.click();
    await addButton.click();
    
    // Verificamos que hay 3 botones de delete
    const deleteButtons = page.locator('.added-manually');
    await expect(deleteButtons).toHaveCount(3);
    
    // Eliminamos uno
    await deleteButtons.first().click();
    
    // Verificamos que ahora hay 2
    await expect(deleteButtons).toHaveCount(2);
  });

  test('flujo completo: validar múltiples pasos con checkboxes', async ({ page }) => {
    // Paso 1: Navegar a checkboxes
    await page.getByRole('link', { name: 'Checkboxes' }).click();
    await expect(page).toHaveURL(/.*checkboxes/);
    
    // Paso 2: Obtener los checkboxes
    const checkbox1 = page.locator('input[type="checkbox"]').first();
    const checkbox2 = page.locator('input[type="checkbox"]').last();
    
    // Paso 3: Marcar el primero
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    
    // Paso 4: Desmarcar el segundo
    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();
  });

  // Ejemplo de test con .only para ejecutar solo este
  // test.only('este test se ejecuta solo', async ({ page }) => {
  //   await page.goto('https://the-internet.herokuapp.com/status_codes');
  //   await expect(page.getByRole('link', { name: '200' })).toBeVisible();
  // });

});
