const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // directorio donde se encuentran los tests
  testDir: './tests',
  
  // tiempo máximo de ejecución por test (30 segundos)
  timeout: 30000,
  
  // tiempo máximo de espera para las aserciones
  expect: {
    timeout: 5000
  },
  
  // ejecuta todos los tests en paralelo
  fullyParallel: true,
  
  // numero de reintentos si un test falla
  retries: 0,
  
  workers: undefined,
  
  // 'html': genera reporte HTML en ./playwright-report/ y abre localhost:9323
  // 'list': muestra resultados en consola
  reporter: [['html'], ['list']],
  
  use: {
    // URL base para las pruebas
    baseURL: 'https://the-internet.herokuapp.com',    
    screenshot: 'only-on-failure',    
    video: 'retain-on-failure',    
    trace: 'on-first-retry',
  },
  
  // Navegadores en los que se ejecutarán los tests
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
