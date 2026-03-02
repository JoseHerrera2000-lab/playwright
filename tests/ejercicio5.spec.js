const { test, expect } = require('@playwright/test');

test.describe('ejercicio 5 - manejo de alerts, iframes y drag & drop', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
  });

  test('manejar diferentes tipos de alerts', async ({ page }) => {
    await page.getByRole('link', { name: 'JavaScript Alerts' }).click();
    
    // test de alert simple
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    
    // verificamos el resultado
    const result = page.locator('#result');
    // valida que el texto del resultado contenga la confirmación esperada
    await expect(result).toContainText('You successfully clicked an alert');
    
    // test de confirm (aceptar)
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    // confirma que al aceptar el confirm aparece el mensaje correcto
    await expect(result).toContainText('You clicked: Ok');
    
    // test de prompt con texto
    page.on('dialog', dialog => dialog.accept('Playwright Test'));
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    // verifica que el texto ingresado en el prompt se muestra en el resultado
    await expect(result).toContainText('You entered: Playwright Test');
  });

  test('interactuar con elementos dentro de un iframe', async ({ page }) => {
    await page.getByRole('link', { name: 'WYSIWYG Editor' }).click();
    
    // accedemos al iframe
    const frame = page.frameLocator('#mce_0_ifr');
    const editor = frame.locator('#tinymce');
    
    // limpiamos el contenido existente
    await editor.clear();
    
    // escribimos nuevo contenido
    await editor.fill('Este es un test de Playwright en un iframe');
    
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
    await page.getByRole('link', { name: 'Example 1' }).click();
    
    const hiddenElement = page.locator('#finish h4');
    
    // verificamos que el elemento está oculto inicialmente
    // valida que el elemento existe pero no es visible en la página
    await expect(hiddenElement).toBeHidden();
    
    // hacemos click en start
    await page.getByRole('button', { name: 'Start' }).click();
    
    // esperamos y verificamos que el elemento ahora es visible
    // confirma que después de la carga el elemento se vuelve visible
    await expect(hiddenElement).toBeVisible();
    // valida que el texto del elemento sea el esperado
    await expect(hiddenElement).toHaveText('Hello World!');
  });

  test('validar entrada de texto con teclas especiales', async ({ page }) => {
    await page.getByRole('link', { name: 'Key Presses' }).click();
    
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // escribimos y presionamos Enter
    await input.fill('test');
    await input.press('Enter');
    
    // verificamos que se detectó la tecla Enter
    // valida que el resultado muestre la última tecla presionada
    await expect(result).toContainText('You entered: ENTER');
    
    // probamos con otras teclas especiales
    await input.press('Backspace');
    // confirma que se detectó la tecla Backspace
    await expect(result).toContainText('You entered: BACK_SPACE');
    
    await input.press('Tab');
    // verifica que se detectó la tecla Tab
    await expect(result).toContainText('You entered: TAB');
  });

});
