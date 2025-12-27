// move-files.js
const fs = require("fs");
const path = require("path");

// Define the paths of the files you want to move
const distDir = path.join(__dirname, "dist");
const rootDir = __dirname;

// List the files you want to move
const filesToMove = ["index.js", "index.d.ts", "index.js.map"];

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
