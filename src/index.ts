#!/usr/bin/env node

import yargs from "yargs";
import chalk from "chalk";

import { createImg, setPictureWallpaper } from "./wallpaper";
import { loadConfigFile, changeConfig, getConfig } from "./settings";

// load config at start of wallee
loadConfigFile();

let args = yargs
  .usage(`\nIt looks like you need help with ${chalk.blueBright("Wallee")}!\nEach command also has a help page, so don't hesitate to use the \"--help\" flag alongside a command!\n\nUsage: $0 <command>`)
  .scriptName("wallee")
  .command(["new"], "Generate new wallpaper", (yargs) => {
    yargs
      .usage("Usage: wallee new [options]")
      .option("color", {
        alias: "c",
        type: "string",
        description: "Set color of wallpaper (ex. -c \"#000FFF\")"
      })
      .help()
      .wrap(null)
      .argv;
  })
  .command(["config", "settings"], "Change configuration of Wallee")
  .wrap(null)
  .argv

// args validation & parsing
// if there are no commands given
if (args._.length == 0) {
  console.log(`\nWelcome to ${chalk.blueBright("Wallee")}!`);
  console.log(`Please use ${chalk.greenBright("\"wallee --help\"")} to see, what commands there are.`);
  console.log(`To get your randomly-single-colored wallpaper type: ${chalk.yellowBright("\"wallee new\"")} !\n`);

  // if new wallpaper command is given
} else if (args._[0] == "new") {

  // if picture mode is enabled switch to it
  if (getConfig("pictureWallpaper")) {
    setPictureWallpaper();
  } else {
    if (args.c == undefined || args.c.toString().length == 0) {
      createImg(false);
    } else {
      if (args.c.toString().length == 7) createImg(true, args.c.toString());
      else console.log(chalk.redBright("\nColor option wasn't correctly formed. Don't forget to use \"\" around the option like \"#FFFFFF\". (see --help)!\n"));
    }
  }

  // if config change is wanted
} else if (args._[0] == "config") {
  changeConfig();

  // if the command is not available
} else {
  console.log(`\nLooks like you tried to use a command which doesnt exist...`);
  console.log(`Type ${chalk.greenBright("\"wallee --help\"")} to see, what commands there are.\n`);
}
