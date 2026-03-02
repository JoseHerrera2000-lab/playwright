const { test, expect } = require('@playwright/test');

test.describe('Ejercicio 3 - flujo E2E completo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
  });

  test('flujo completo: login exitoso', async ({ page }) => {
    // navegamos al login
    await page.getByRole('link', { name: 'Form Authentication' }).click();
    
    // llenamos el formulario
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // enviamos el formulario
    await page.getByRole('button', { name: 'Login' }).click();
    
    // validamos que aparece el mensaje de éxito
    const flash = page.locator('#flash');
    await expect(flash).toContainText('You logged into a secure area!');
    
    // validamos que el botón de logout está visible
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });

  test('flujo completo: login fallido', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // llenamos credenciales incorrectas
    await page.locator('#username').fill('usuario_incorrecto');
    await page.locator('#password').fill('password_incorrecto');
    
    // hacemos click en submit
    await page.getByRole('button', { name: 'Login' }).click();
    
    // verificamos que aparece mensaje de error
    const flash = page.locator('#flash');
    await expect(flash).toContainText('Your username is invalid!');
  });

  test('flujo completo: agregar y remover elementos', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
    
    // agregamos 3 elementos
    const addButton = page.getByRole('button', { name: 'Add Element' });
    await addButton.click();
    await addButton.click();
    await addButton.click();
    
    // verificamos que hay 3 botones de delete
    const deleteButtons = page.locator('.added-manually');
    await expect(deleteButtons).toHaveCount(3);
    
    // eliminamos uno
    await deleteButtons.first().click();
    
    // verificamos que ahora hay 2
    await expect(deleteButtons).toHaveCount(2);
  });

  test('flujo completo: validar múltiples pasos con checkboxes', async ({ page }) => {
    // paso 1: navegar a checkboxes
    await page.getByRole('link', { name: 'Checkboxes' }).click();
    await expect(page).toHaveURL(/.*checkboxes/);
    
    // paso 2: obtener los checkboxes
    const checkbox1 = page.locator('input[type="checkbox"]').first();
    const checkbox2 = page.locator('input[type="checkbox"]').last();
    
    // paso 3: marcar el primero
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    
    // paso 4:desmarcar el segundo
    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();
  });

  // Ejemplo de test con .only para ejecutar solo este
  // test.only('este test se ejecuta solo', async ({ page }) => {
  //   await page.goto('https://the-internet.herokuapp.com/status_codes');
  //   await expect(page.getByRole('link', { name: '200' })).toBeVisible();
  // });

});
