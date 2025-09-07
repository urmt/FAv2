#!/usr/bin/env node

import { build } from 'esbuild';
import { stylePlugin } from 'esbuild-style-plugin';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const isProduction = process.argv.includes('--production');
const isDev = !isProduction;

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// Build Tailwind CSS first
console.log('🎨 Building Tailwind CSS...');
await new Promise((resolve, reject) => {
  const tailwindProcess = spawn('npx', [
    'tailwindcss',
    '-i', './src/shadcn.css',
    '-o', './dist/styles.css',
    isProduction ? '--minify' : ''
  ].filter(Boolean), { stdio: 'inherit' });

  tailwindProcess.on('close', (code) => {
    if (code === 0) resolve();
    else reject(new Error(`Tailwind build failed with code ${code}`));
  });
});

// Create HTML file
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fedora Assistant</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <div id="app"></div>
  <script src="./bundle.js"></script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', htmlContent);

// esbuild configuration
const buildOptions = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'iife',
  target: 'es2017',
  minify: isProduction,
  sourcemap: isDev,
  jsx: 'automatic',
  jsxImportSource: 'react',
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
  },
  plugins: [
    stylePlugin({
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    }),
  ],
  alias: {
    '@': path.resolve('./src'),
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
    '.css': 'css',
  },
  external: [],
  platform: 'browser',
};

try {
  console.log(`🔨 Building ${isProduction ? 'production' : 'development'} bundle...`);
  
  if (isDev) {
    // Development mode with watch
    const ctx = await build({
      ...buildOptions,
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error('❌ Build failed:', error);
          } else {
            console.log('✅ Build succeeded');
          }
        },
      },
    });

    // Start a simple HTTP server for development
    console.log('🚀 Starting development server...');
    const server = spawn('python3', ['-m', 'http.server', '8000'], {
      cwd: 'dist',
      stdio: 'inherit'
    });

    console.log('✅ Development server started at http://localhost:8000');
    console.log('👀 Watching for file changes...');

    // Handle cleanup on exit
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping development server...');
      server.kill();
      ctx.dispose();
      process.exit(0);
    });

  } else {
    // Production build
    await build(buildOptions);
    console.log('✅ Production build completed!');
    console.log('📁 Output directory: dist/');
  }

} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
