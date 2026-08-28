import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';

await build({
  entryPoints: ['src/main.ts', 'src/lambda.ts'],
  outdir: 'dist',
  platform: 'node',
  target: 'node22',
  bundle: true,
  sourcemap: true,
  minify: false,
  legalComments: 'none',
  external: [
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
    '@langchain/openai',
  ],
  plugins: [
    esbuildPluginDecorator({
      tsconfigPath: 'tsconfig.json',
    }),
    clean({
      patterns: ['./dist/*'],
    }),
  ],
});
