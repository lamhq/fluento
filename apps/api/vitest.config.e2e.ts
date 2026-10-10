import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.spec.ts'],
    globalSetup: ['./test/vitest.global-setup.ts'],
    testTimeout: 120_000,
    fileParallelism: false,
  },
});
