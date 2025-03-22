const esbuild = require('esbuild');
const fs = require('fs');

esbuild.build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/server.js',
  external: ['mock-aws-s3', 'aws-sdk', 'nock', 'bcrypt'], // Add bcrypt to external
  loader: { '.html': 'text' }
}).then(() => {
  // Copy package.json to dist directory
  fs.copyFileSync('package.json', 'dist/package.json');
  console.log('Build completed successfully!');
}).catch(() => process.exit(1));