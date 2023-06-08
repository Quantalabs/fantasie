import chalk from "chalk";
import clear from "clear";
import minimist from "minimist";
import cliui from "cliui";
import size from "window-size";
import fs from "fs";

import server from "../server.js";
import utils from "../utils/index.js";

const avaliableWidth = size.width || 75;

const ui = cliui({ width: avaliableWidth });
const argv = minimist(process.argv.slice(2));

const commands = [
  {
    name: "start",
    description: "Starts the server",
    args: [
      { name: "port", type: "number", description: "Port to listen on", required: true },
      { name: "host", type: "string", description: "Host to listen on", required: true },
      { name: "dir", type: "string", description: "Directory to serve \n  [default: ./]", required: false },
    ],
  },
  {
    name: "gen",
    description: "Generates static files in _public/",
    args: [{ name: "dir", type: "string", description: "Project directory \n  [default: ./]", required: false }],
  },
  {
    name: "static",
    description: "Generates static files in _public/ and hosts server",
    args: [
      { name: "port", type: "number", description: "Port to listen on", required: true },
      { name: "host", type: "string", description: "Host to listen on", required: true },
      { name: "dir", type: "string", description: "Directory to serve \n  [default: ./]", required: false },
    ],
  },
];

function start(dir) {
  console.log(chalk.cyan("Finding config and template files..."));

  // Find config JSON file, and find all templates in _templates folder
  let config = fs.readFileSync(`${dir}/config.json`);
  config = JSON.parse(config);

  const templates = {};
  fs.readdirSync(`${dir}/_templates`).forEach((file) => {
    const filenoext = file.split(".")[0];
    const ext = file.split(".")[1];
    if (ext === "html") {
      templates[filenoext] = fs.readFileSync(`${dir}/_templates/${file}`, "utf8");
    }
  });

  console.log(chalk.bgCyan("Finished! Starting server..."));

  clear();

  server.createServer(templates, config, argv.host, argv.port);
}

function genStatic(dir) {
  console.log(chalk.cyan("Finding config and template files..."));

  // Find config JSON file, and find all templates in _templates folder
  let config = fs.readFileSync(`${dir}/config.json`);
  config = JSON.parse(config);

  const templates = {};
  fs.readdirSync(`${dir}/_templates`).forEach((file) => {
    const filenoext = file.split(".")[0];
    const ext = file.split(".")[1];
    if (ext === "html") {
      templates[filenoext] = fs.readFileSync(`${dir}/_templates/${file}`, "utf8");
    }
  });

  console.log(chalk.bgCyan("Finished! Generating static site..."));

  utils.createStatic(config, templates);
}

function startStaticServer(dir) {
  console.log(chalk.cyan("Finding config and template files..."));

  // Find config JSON file, and find all templates in _templates folder
  let config = fs.readFileSync(`${dir}/config.json`);
  config = JSON.parse(config);

  const templates = {};
  fs.readdirSync(`${dir}/_templates`).forEach((file) => {
    const filenoext = file.split(".")[0];
    const ext = file.split(".")[1];
    if (ext === "html") {
      templates[filenoext] = fs.readFileSync(`${dir}/_templates/${file}`, "utf8");
    }
  });

  console.log(chalk.bgCyan("Finished! Generating static site and starting server..."));

  server.createStatic(templates, config, argv.host, argv.port);
}

function help(commandarg) {
  ui.div("Usage: fantasie [command] [options]");

  if (commandarg) {
    commands.forEach((command) => {
      if (command.name === commandarg) {
        ui.div(
          {
            text: command.name,
            width: 30,
            padding: [0, 2, 0, 2],
          },
          {
            text: command.description,
            padding: [0, 2, 0, 0],
          }
        );

        ui.div({
          text: "Options:",
          padding: [2, 0, 1, 0],
        });

        command.args.forEach((arg) => {
          ui.div(
            {
              text: arg.name,
              width: 30,
              padding: [0, 2, 0, 2],
            },
            {
              text: arg.description,
              padding: [0, 2, 0, 0],
            },
            {
              text: arg.type,
              padding: [0, 2, 0, 0],
            },
            {
              text: arg.required ? chalk.red("[required]") : chalk.greenBright("[optional]"),
              padding: [0, 2, 0, 0],
            }
          );
        });

        console.log(ui.toString());
      }
    });
  } else {
    ui.div({
      text: "Commands:",
      padding: [2, 0, 1, 0],
    });

    commands.forEach((command) => {
      ui.div(
        {
          text: command.name,
          width: 30,
          padding: [0, 2, 0, 2],
        },
        {
          text: command.description,
          padding: [0, 2, 0, 0],
        }
      );
    });

    console.log(ui.toString());
  }
}

if (argv.help) {
  help(argv._[0]);
  process.exit(0);
} else if (argv._[0] === "start") {
  start(argv.dir || ".");
} else if (argv._[0] === "static") {
  startStaticServer(argv.dir || ".");
} else if (argv._[0] === "gen") {
  genStatic(argv.dir || ".");
} else {
  console.log(chalk.red("Invalid command"));

  help();
}
