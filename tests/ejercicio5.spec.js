const { test, expect } = require('@playwright/test');

test.describe('ejercicio 5 - manejo de alerts, iframes y drag & drop', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
  });

  test('manejar diferentes tipos de alerts', async ({ page }) => {
    await page.getByRole('link', { name: 'JavaScript Alerts' }).click();

    const result = page.locator('#result');

    // test de alert simple
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    // valida que el texto del resultado contenga la confirmación esperada
    await expect(result).toContainText('You successfully clicked an alert');

    // test de confirm (aceptar)
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    // confirma que al aceptar el confirm aparece el mensaje correcto
    await expect(result).toContainText('You clicked: Ok');

    // test de prompt con texto
    page.once('dialog', dialog => dialog.accept('Playwright Test'));
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    // verifica que el texto ingresado en el prompt se muestra en el resultado
    await expect(result).toContainText('You entered: Playwright Test');
  });

  test('interactuar con elementos dentro de un iframe', async ({ page }) => {
    await page.getByRole('link', { name: 'WYSIWYG Editor' }).click();

    // cerramos el modal de advertencia si aparece
    await page.locator('button.tox-button[aria-label="Close"]').click({ timeout: 5000 }).catch(() => {});

    // accedemos al iframe
    const frame = page.frameLocator('#mce_0_ifr');
    const editor = frame.locator('body#tinymce');

    // usamos JavaScript para habilitar la edición y cambiar el contenido
    await page.evaluate(() => {
      const iframe = document.querySelector('#mce_0_ifr');
      const body = iframe.contentDocument.body;
      body.contentEditable = 'true';
      body.innerHTML = 'Este es un test de Playwright en un iframe';
    });

    // verificamos el contenido
    // valida que el texto dentro del iframe sea exactamente el que escribimos
    await expect(editor).toHaveText('Este es un test de Playwright en un iframe');
  });

  test('validar entrada de archivos', async ({ page }) => {
    await page.getByRole('link', { name: 'File Upload' }).click();
    
    // simulamos la selección de un archivo
    const fileInput = page.locator('#file-upload');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('contenido de prueba')
    });
    
    // hacemos click en upload
    await page.getByRole('button', { name: 'Upload' }).click();
    
    // verificamos que el archivo se subió
    const uploadedFile = page.locator('#uploaded-files');
    // confirma que el nombre del archivo aparece en la lista de archivos subidos
    await expect(uploadedFile).toContainText('test.txt');
  });

  test('validar desaparición y aparición de elementos', async ({ page }) => {
    await page.getByRole('link', { name: 'Dynamic Loading' }).click();
    await page.getByRole('link', { name: 'Example 2' }).click();

    // el elemento se crea después de hacer click, usamos un selector más general
    const hiddenElement = page.locator('#finish h4');

    // verificamos que el elemento NO existe inicialmente (no está en el DOM)
    // valida que el elemento no existe antes de hacer click
    await expect(hiddenElement).toBeHidden();

    // hacemos click en start
    await page.getByRole('button', { name: 'Start' }).click();

    // esperamos y verificamos que el elemento ahora es visible (con timeout mayor)
    // confirma que después de la carga el elemento se vuelve visible
    await expect(hiddenElement).toBeVisible({ timeout: 10000 });
    // valida que el texto del elemento sea el esperado
    await expect(hiddenElement).toHaveText('Hello World!');
  });

  test('validar entrada de texto con teclas especiales', async ({ page }) => {
    await page.getByRole('link', { name: 'Key Presses' }).click();

    const input = page.locator('#target');
    const result = page.locator('#result');

    // hacemos click en el input para darle foco
    await input.click();

    // presionamos Escape (no recarga la página)
    await page.keyboard.press('Escape');

    // verificamos que se detectó la tecla Escape
    // valida que el resultado muestre la última tecla presionada
    await expect(result).toContainText('You entered: ESCAPE');

    // probamos con otras teclas especiales
    await page.keyboard.press('Backspace');
    // confirma que se detectó la tecla Backspace
    await expect(result).toContainText('You entered: BACK_SPACE');

    await page.keyboard.press('Space');
    // verifica que se detectó la tecla Space
    await expect(result).toContainText('You entered: SPACE');
  });

});
