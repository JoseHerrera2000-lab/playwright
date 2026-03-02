const { test, expect } = require('@playwright/test');

test.describe('ejercicio 4 - interacciones avanzadas con tablas y dropdowns', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
  });

  test('validar y ordenar tabla dinámica', async ({ page }) => {
    await page.getByRole('link', { name: 'Sortable Data Tables' }).click();
    
    // verificamos que la tabla está visible
    const table = page.locator('#table1');
    // valida que el elemento tabla existe en el DOM
    await expect(table).toBeVisible();
    
    // obtenemos el primer apellido antes de ordenar
    const firstLastNameBefore = await page.locator('#table1 tbody tr:first-child td:nth-child(1)').textContent();
    
    // hacemos click en el header para ordenar por apellido
    await page.locator('#table1 thead th:nth-child(1)').click();
    
    // obtenemos el primer apellido después de ordenar
    const firstLastNameAfter = await page.locator('#table1 tbody tr:first-child td:nth-child(1)').textContent();
    
    // verificamos que el orden cambió
    // compara que los valores antes y después del ordenamiento sean diferentes
    expect(firstLastNameBefore).not.toBe(firstLastNameAfter);
    
    // validamos que hay exactamente 4 filas en la tabla
    const rows = page.locator('#table1 tbody tr');
    // cuenta el número total de filas en el tbody
    await expect(rows).toHaveCount(4);
  });

  test('interactuar con dropdown y validar selección', async ({ page }) => {
    await page.getByRole('link', { name: 'Dropdown' }).click();
    
    const dropdown = page.locator('#dropdown');
    
    // seleccionamos la opción 1
    await dropdown.selectOption('1');
    
    // verificamos que la opción 1 está seleccionada
    // valida que el valor del select sea exactamente '1'
    await expect(dropdown).toHaveValue('1');
    
    // cambiamos a la opción 2
    await dropdown.selectOption('2');
    
    // verificamos el cambio
    // confirma que el nuevo valor seleccionado sea 2
    await expect(dropdown).toHaveValue('2');
  });

  test('validar contenido dinámico que cambia', async ({ page }) => {
    await page.getByRole('link', { name: 'Dynamic Content' }).click();
    
    // guardamos el texto inicial del primer elemento
    const firstText = await page.locator('.row:nth-child(1) .large-10').textContent();
    
    // recargamos la página para obtener contenido nuevo
    await page.reload();
    
    // esperamos que el contenido esté cargado
    await page.waitForLoadState('networkidle');
    
    // obtenemos el nuevo texto
    const secondText = await page.locator('.row:nth-child(1) .large-10').textContent();
    
    // verificamos que el contenido cambió
    // asegura que el contenido dinámico es diferente después de recargar
    expect(firstText).not.toBe(secondText);
  });

  test('manejar múltiples ventanas y validar navegación', async ({ page, context }) => {
    await page.getByRole('link', { name: 'Multiple Windows' }).click();
    
    // verificamos el título de la página actual
    // valida que el h3 contenga el texto esperado
    await expect(page.locator('h3')).toContainText('Opening a New Window');
    
    // esperamos que se abra una nueva ventana al hacer click
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Click Here' }).click()
    ]);
    
    // esperamos que la nueva página cargue
    await newPage.waitForLoadState();
    
    // verificamos el contenido de la nueva ventana
    // confirma que el h3 en la nueva ventana tiene el texto correcto
    await expect(newPage.locator('h3')).toContainText('New Window');
    
    await newPage.close();
  });

});
