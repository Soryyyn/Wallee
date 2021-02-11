import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

const configPath: any = path.resolve(process.cwd(), "config.json");
let config: any;

// load config to object if file exists else create default
export function loadConfigFile(): any {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(JSON.stringify(fs.readFileSync(configPath)));
  } else {
    console.log("\nUser configuration not found, creating default right now...");

    try {
      fs.writeFileSync(configPath, JSON.stringify({
        "wallpaperDirectory": "",
        "startup": false
      }, null, 2), { flag: "a+" });

      console.log(`Created default user configuration ${chalk.greenBright("successfully")}`);
    } catch (err: any) {
      console.log(chalk.redBright(`Couldn't create user configuration file, error: `) + chalk.white(err));
    }
  }
}