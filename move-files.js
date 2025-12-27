// move-files.js
import fs from 'fs';
import path from 'path';

// Deriving the directory name from import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define the paths of the files you want to move
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

// List the files you want to move
const filesToMove = ['index.js', 'index.d.ts', 'index.js.map'];

// Move each file
filesToMove.forEach((file) => {
  const distFilePath = path.join(distDir, file);
  const rootFilePath = path.join(rootDir, file);

  if (fs.existsSync(distFilePath)) {
    fs.renameSync(distFilePath, rootFilePath);
    console.log(`Moved ${file} to root.`);
  } else {
    console.log(`${file} does not exist in dist.`);
  }
});
