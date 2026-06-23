import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      all: true,
      provider: 'v8', // Use 'v8' for built-in coverage
      reporter: ['text', 'json', 'html'], // Formats for the coverage report
      include: ['code/public/scripts/**/*', 'code/controllers/**/*', 'code/routes/**/*'], // Include files for coverage
      exclude: ['node_modules', 'code/public/scripts/index.js'], // Exclude specific files
    },
  },
});