import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // Abilita le variabili globali di test
    environment: 'jsdom',  // Imposta l'ambiente per i test
    coverage: {
      reporter: ['text', 'lcov'], // Generate 'text' and 'lcov' reports
    },
  },
});