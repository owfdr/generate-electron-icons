#!/usr/bin/env node

// TODO: Make it Typescript
// TODO: Add ESlint and Prettier
// TODO: Add tests
// TODO: Colorful logs
// TODO: Better CLI

const Jimp = require("jimp");
const args = require("args");
const icongen = require("icon-gen");

const fs = require("fs");
const path = require("path");

const pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

args
  .option("input", "Which PNG file to use. Should be 1024x1024", "./icon.png")
  .option("output", "Where to put generated icons", "./gene-icons")
  .option("flatten", "Put all icons in the same folder", false);

const flags = args.parse(process.argv);
const { input, output, flatten } = flags;

const inputFile = path.resolve(process.cwd(), input);
const outputFolder = path.resolve(process.cwd(), output);

if (!fs.existsSync(inputFile)) {
  console.error(
    `Error: png file not found. make sure you have provided a valid path.`
  );
  console.error(`Example: gene-icons --input ./icon.png`);
  process.exit(1);
}

const pngFolder = flatten ? outputFolder : path.join(outputFolder, "png");
const macFolder = flatten ? outputFolder : path.join(outputFolder, "mac");
const winFolder = flatten ? outputFolder : path.join(outputFolder, "win");

fs.mkdirSync(pngFolder, { recursive: true });
fs.mkdirSync(macFolder, { recursive: true });
fs.mkdirSync(winFolder, { recursive: true });

// Generate png, icns and ico
(async () => {
  await Promise.all(
    pngSizes.map(async (size) => {
      const fileName = `${size}.png`;
      const image = await Jimp.read(inputFile);

      image.resize(size, size);
      await image.writeAsync(path.join(pngFolder, fileName));
    })
  );

  await icongen(pngFolder, macFolder, {
    icns: { name: "icon" },
  });

  await icongen(pngFolder, winFolder, {
    ico: { name: "icon" },
  });

  console.log("Generated: 11 files");
})();
