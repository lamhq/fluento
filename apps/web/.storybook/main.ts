import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Resolve the absolute path of a package for monorepo-compatible Storybook config.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  framework: getAbsolutePath('@storybook/react-vite'),
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
};

export default config;
