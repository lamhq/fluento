import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// replace namespace import of `@nestjs/mongoose` with default import
const fixMongooseImportPlugin = {
  name: 'normalize-nestjs-mongoose-import',
  setup(build) {
    build.onLoad(
      { filter: /@nestjs\/mongoose\/dist\/mongoose-core\.module\.js$/ },
      async ({ path }) => {
        const contents = await readFile(path, 'utf8');
        const namespaceImport = "import * as mongoose from 'mongoose';";
        if (!contents.includes(namespaceImport)) {
          throw new Error(`Expected Mongoose namespace import in ${path}`);
        }

        return {
          contents: contents.replace(
            namespaceImport,
            "import mongoose from 'mongoose';",
          ),
          loader: 'js',
        };
      },
    );
  },
};

await build({
  entryPoints: ['src/main.ts', 'src/lambda.ts'],
  outdir: 'dist',
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  sourcemap: true,
  minify: false,
  legalComments: 'none',
  external: [
    '@nestjs/microservices',
    '@nestjs/microservices/*',
    '@nestjs/websockets/*',
    'class-transformer',
    'class-validator',
  ],
  plugins: [
    fixMongooseImportPlugin,
    esbuildPluginDecorator({
      tsconfigPath: 'tsconfig.json',
      tscCompilerOptions: {
        // Preserve imports for esbuild's ESM bundling.
        module: ts.ModuleKind.ESNext,
      },
    }),
    clean({
      patterns: ['./dist/*'],
    }),
  ],
  banner: {
    // Provide require function for code that use CommonJS
    js: 'import { createRequire as __esbuildCreateRequire } from "node:module"; const require = __esbuildCreateRequire(import.meta.url);',
  },
});
