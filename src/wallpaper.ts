import path from "path";
import fs from "fs";
import chalk from "chalk";
import * as pimg from "pureimage";
import * as screenres from "screen-resolution";
import wallpaper from "wallpaper";

import { getConfig } from "./settings";

// generate random rgb color
function generateRandomColor(): String {
  // generate random hex value from 00 to FF
  // double tilde / ~~ is same as Math.floor
  const r: String = (~~(Math.random() * 255 + 1)).toString(16).toUpperCase();
  const g: String = (~~(Math.random() * 255 + 1)).toString(16).toUpperCase();
  const b: String = (~~(Math.random() * 255 + 1)).toString(16).toUpperCase();

  return `#${r.length == 1 ? "0" + r : r}${g.length == 1 ? "0" + g : g}${b.length == 1 ? "0" + b : b}`;
}

// create file and save it to walls dir
function generateFile(img: any, ctx: any, res: { width: any, height: any }, color: String) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, res.width, res.height);

  // export as png, set wallpaper, and remove oldest if necessary
  pimg.encodePNGToStream(img, fs.createWriteStream(path.resolve(getConfig("colorWallpaperDirectory"), color + ".png"))).then(() => {
    console.log(`\nWrote out the png file to ${chalk.greenBright(`${getConfig("colorWallpaperDirectory")}/${color}.png`)}\n`);
  })
    .then(() => {
      wallpaper.set(path.resolve(getConfig("colorWallpaperDirectory"), color + ".png"));
    })
    .then(() => {
      removeOldestWallpaper(getConfig("colorWallpaperDirectory"), getConfig("maxWallpapers"));
    })
    .catch((error: Error) => {
      console.log(`\nThere was an ${chalk.redBright("error")} creating png file: ${error}\n`);
    });
}

// remove the oldest wallpaper in directory
function removeOldestWallpaper(wallDir: string, maxFiles: Number) {
  const files = fs.readdirSync(wallDir);
  let current;
  let oldest;
  let length = 0;

  files.forEach((file) => {
    length++;
    current = { fileName: file, birthtime: new Date(fs.statSync(path.resolve(wallDir, file)).birthtime) };
    if (oldest == undefined || current.birthtime < oldest.birthtime) oldest = { fileName: current.fileName, birthtime: current.birthtime };
  });

  if (length > maxFiles) {
    fs.unlinkSync(path.resolve(wallDir, oldest.fileName));
  }
}

// create img from given arg color or random color
export function createImg(custom: Boolean, color?: String) {
  // get monitor resolution and create img with 2d context
  screenres.get(false).then((res: any) => {
    const img = pimg.make(res.width, res.height)
    const ctx = img.getContext("2d");

    // fill img with random color or wanted from args
    if (!custom) generateFile(img, ctx, res, generateRandomColor());
    else generateFile(img, ctx, res, color);
  });
}

// set a wallpaper from the picture directory given
export function setPictureWallpaper() {
  const files = fs.readdirSync(getConfig("pictureWallpaperDirectory"));

  // only allow files with jpg or png
  const filtered = files.filter(file => file.includes(".png") || file.includes(".jpg"));

  // set wallpaper to random picture in dir
  wallpaper.set(path.resolve(getConfig("pictureWallpaperDirectory"), filtered[Math.floor(Math.random() * filtered.length)]));
}