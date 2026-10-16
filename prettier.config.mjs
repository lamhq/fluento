/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions}
 */
const config = {
  useTabs: false,
  tabWidth: 2,
  printWidth: 85,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './apps/web/src/global.css',
  tailwindFunctions: ['cn', 'clsx'],
};

export default config;
