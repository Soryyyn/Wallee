import path from "path";
import fs from "fs";
import * as pimg from "pureimage";
import * as screenres from "screen-resolution";

// generate random rgb color
function generateRandomColor(): String {
  let r: Number = Math.floor(Math.random() * 255 + 1);
  let g: Number = Math.floor(Math.random() * 255 + 1);
  let b: Number = Math.floor(Math.random() * 255 + 1);

  return `rgb(${r}, ${g}, ${b})`;
}

// create img from given arg color or random color
export function createImg(custom: Boolean, color?: String) {
  // get monitor resolution
  screenres.get(false).then((res: any) => {

    // create img & 2d context
    const img = pimg.make(res.width, res.height)
    const ctx = img.getContext("2d");

    // fill img with random color or wanted from args
    if (!custom) {

      let color = generateRandomColor();
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, res.width, res.height);

      // export as png
      pimg.encodePNGToStream(img, fs.createWriteStream(path.join(process.cwd(), "walls", color + ".png"))).then(() => {
        console.log("wrote out the png file to out.png");
      }).catch((error: Error) => {
        console.log("there was an creating png file: " + error);
      });

    } else {

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, res.width, res.height);

      // export as png
      pimg.encodePNGToStream(img, fs.createWriteStream(path.join(process.cwd(), "walls", color + ".png"))).then(() => {
        console.log("wrote out the png file to out.png");
      }).catch((error: Error) => {
        console.log("there was an creating png file: " + error);
      });

    }
  });
}