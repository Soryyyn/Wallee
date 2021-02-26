import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import os from "os";

const configPath: any = path.resolve(process.cwd(), "config.json").toString();
let config: any; // gets loaded on runtime
const startupFolderPath = path.join(os.homedir(), "\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup");

// load config to object if file exists else create default
export function loadConfigFile(): any {
  if (fs.existsSync(configPath)) {
    let raw = fs.readFileSync(configPath, "utf8");
    config = JSON.parse(raw);
  } else {
    console.log("\nUser configuration not found, creating default right now...");

    try {
      fs.writeFileSync(configPath, JSON.stringify({
        "wallpaperDirectory": path.resolve(process.cwd(), "walls"),
        "startup": false,
        "maxWallpapers": 10
      }, null, 2));

      console.log(`Created default user configuration ${chalk.greenBright("successfully")}`);
    } catch (err: any) {
      console.log(chalk.redBright(`Couldn't create user configuration file, error: `) + chalk.white(err));
    }
  }

  // check if wallee needs to be added to startup or removed
  if (getConfig("startup")) addToStartup();
  else removeFromStartup();
}

// returns value from specified key in loaded user config
export function getConfig(setting: any): any {
  return config[setting];
}

// add batch file to startup folder
function addToStartup() {
  if (!fs.existsSync(path.join(startupFolderPath, "wallee-newWallpaper.bat"))) {
    try {
      fs.writeFileSync(path.join(startupFolderPath, "wallee-newWallpaper.bat"), "@echo off\nwallee new\nexit");

      console.log(`\n${chalk.greenBright("Successfully")} added Wallee to system startup`);
    } catch (err: any) {
      console.log(chalk.redBright(`\nCouldn't add Wallee to startup, error: `) + chalk.white(err));
    }
  }
}

// remove batch file from startup folder
function removeFromStartup() {
  if (fs.existsSync(path.join(startupFolderPath, "wallee-newWallpaper.bat"))) {
    fs.unlinkSync(path.join(startupFolderPath, "wallee-newWallpaper.bat"));
  }
}

// change config
export function changeConfig() {
  const questions = [
    {
      type: "input",
      name: "wallpaperDirectory",
      message: "Directory where newly generated wallpapers will be stored",
      default: path.resolve(process.cwd(), "walls"),
      validate(input: any) {
        if (fs.existsSync(input)) {
          return true;
        } else {
          return "Directory not valid/available."
        }
      },
      filter(input: any) {
        return input.replace("/", "\\");
      }
    },
    {
      type: "list",
      name: "startup",
      message: "Generate new wallpaper at system startup",
      choices: ["yes", "no"],
      default: "no",
      filter(input: any) {
        return input == "yes" ? true : false;
      }
    },
    {
      type: "number",
      name: "maxWallpapers",
      message: "Max number of wallpapers beeing saved in wallpaper directory",
      default: 10
    }
  ];

  console.log("\nHere you can change your Wallee configuration:");

  inquirer.prompt(questions)

    // save settings in file
    .then((answers) => {
      try {
        fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));
        console.log(`\n${chalk.greenBright("Successfully")} wrote changes to user configuration file\n`);
      } catch (err: any) {
        console.log(chalk.redBright(`\nCouldn't write changes to user configuration file, error: `) + chalk.white(err) + "\n");
      }
    })
    .catch((error: any) => {
      console.log(`\nThere was an ${chalk.redBright("error")} while asking for configuration change: ${error}\n`);
    })
}