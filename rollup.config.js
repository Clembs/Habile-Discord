import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolve } from 'path';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    esbuild({
      target: 'esnext',
    }),
    alias({
      entries: {
        $lib: resolve('./src/lib'),
      },
    }),
    commonjs(),
    nodeResolve({
      browser: true,
      extensions: ['.mjs', '.js', '.ts', '.json'],
    }),
  ],
};
