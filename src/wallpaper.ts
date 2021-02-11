import path from "path";
import fs from "fs";
import chalk from "chalk";
import * as pimg from "pureimage";
import * as screenres from "screen-resolution";

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

  // export as png
  pimg.encodePNGToStream(img, fs.createWriteStream(path.join(process.cwd(), "walls", color + ".png"))).then(() => {
    console.log(`\nwrote out the png file to ${chalk.greenBright(`walls/${color}.png`)}\n`);
  }).catch((error: Error) => {
    console.log(`\nthere was an ${chalk.redBright("error")} creating png file: ${error}\n`);
  });
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