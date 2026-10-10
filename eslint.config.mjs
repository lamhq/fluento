import storybook from 'eslint-plugin-storybook';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  // Global ignores
  {
    ignores: [
      '.turbo/**',
      '**/*.js',
      '**/dist',
      '**/build',
      '**/node_modules',
      'apps/web/src/shadcn',
    ],
  },

  // JavaScript
  {
    name: 'JavaScript files',
    files: ['**/*.{js,ts,jsx,tsx}'],
    extends: [eslint.configs.recommended],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // TypeScript
  {
    name: 'TypeScript files',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      // allow NestJS module classes
      '@typescript-eslint/no-extraneous-class': 'off',

      // fix react-hook-form onSubmit type error
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // TypeScript Node
  {
    name: 'TypeScript Node',
    files: ['apps/api/**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Vitest test files
  {
    ...vitest.configs.recommended,
    name: 'Vitest test files',
    files: ['apps/api/**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    rules: {
      // Relax strict typing in tests to reduce boilerplate when using mocks, spies, and test fixtures
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },

  // TypeScript React
  {
    name: 'TypeScript React',
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
    extends: [
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
  },

  ...storybook.configs['flat/recommended'],

  // Prettier - must be last
  {
    ...eslintConfigPrettier,
    name: 'Prettier',
  },
]);
