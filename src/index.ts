import yargs from "yargs";
import chalk from "chalk";

// import { } from "./wallpaper";

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
  .command("config", "Change configuration of Wallee", (yargs) => {
    // TODO: add config checking and changing here
  })
  .wrap(null)
  .argv

console.log(args);

// args validation
// if there are no commands given
if (args._.length == 0) {
  console.log(`\nWelcome to ${chalk.blueBright("Wallee")}!`);
  console.log(`Please use ${chalk.greenBright("\"wallee --help\"")} to see, what commands there are.`);
  console.log(`To get your randomly-single-colored wallpaper type: ${chalk.yellowBright("\"wallee new\"")} !\n`);

  // if new wallpaper command is given
} else if (args._[0] == "new") {

  // if the command is not available
} else {
  console.log(`\nLooks like you tried to use a command which doesnt exist...`);
  console.log(`Type ${chalk.greenBright("\"wallee --help\"")} to see, what commands there are.\n`);
}
