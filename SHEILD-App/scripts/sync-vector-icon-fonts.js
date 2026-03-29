const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(
  projectRoot,
  "node_modules",
  "react-native-vector-icons",
  "Fonts"
);
const targetDir = path.join(
  projectRoot,
  "android",
  "app",
  "src",
  "main",
  "assets",
  "fonts"
);

if (!fs.existsSync(sourceDir)) {
  console.error(`Source font directory not found: ${sourceDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const entry of fs.readdirSync(sourceDir)) {
  if (!entry.endsWith(".ttf")) {
    continue;
  }

  fs.copyFileSync(path.join(sourceDir, entry), path.join(targetDir, entry));
}

console.log(`Synced vector icon fonts to ${targetDir}`);
