import path from "path";
import yargs from "yargs";
import chalk from "chalk";

let args = yargs
  .usage(`\nIt looks like you need help with ${chalk.blueBright("Wallee")}!\nEach command also has a help page, so don't hesitate to use the \"--help\" flag alongside a command!\n\nUsage: $0 <command>`)
  .command("new", "Generate new wallpaper", (yargs) => {
    yargs
      .usage("Usage: $0 new [options]")
      .option("color", {
        alias: "c",
        type: "string",
        description: "Set color of wallpaper (ex. -c \"#000FFF\")"
      })
      .help()
      .wrap(null)
      .argv;
  })
  .command('config', 'Change configuration of Wallee', (yargs) => {
    // TODO: add config checking and changing here
  })
  .wrap(null)
  .argv


console.log(args);
