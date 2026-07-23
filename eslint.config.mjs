// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jest from "eslint-plugin-jest";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(
  // Global ignores
  {
    ignores: [
      ".turbo/**",
      "**/*.js",
      "**/dist",
      "**/build",
      "**/node_modules",
      "eslint.config.mjs",
    ],
  },

  // JavaScript
  {
    name: "JavaScript files",
    files: ["**/*.{js,ts,jsx,tsx}"],
    extends: [eslint.configs.recommended],
  },

  // TypeScript
  {
    name: "TypeScript files",
    files: ["**/*.{ts,tsx}"],
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
      "@typescript-eslint/no-extraneous-class": "off",

      // fix react-hook-form onSubmit type error
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // TypeScript Node
  {
    name: "TypeScript Node",
    files: ["apps/api/**/*.{ts,js}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Jest test files
  {
    name: "Jest test files",
    files: ["apps/api/**/*.(test|spec).ts(x)?"],
    plugins: { jest },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/valid-expect": "error",
    },
  },

  // TypeScript React
  {
    name: "TypeScript React",
    files: ["apps/web/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: { version: "detect" },
    },
    extends: [
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
  },

  // Prettier - must be last
  {
    ...eslintConfigPrettier,
    name: "Prettier",
  },
);
