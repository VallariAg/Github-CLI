// const { exec } = require("child_process");
const minimist = require("minimist");
const fs = require("fs")
require('dotenv').config();

module.exports = async function () {
    const clientID = "366955dcc17d7f5135fd";

    const args = minimist(process.argv.slice(2));
    let cmd = args._[0] || "help";

    if (args.help || args.h) { cmd = "help" }

    switch (cmd) {
        case "help": { require('./cmds/help')(args); break; }
        case "pr": { require("./cmds/pr")(args); break; }
        case "login": {
            let device_code = await require("./cmds/login")(clientID);
            fs.appendFileSync('.env', `github_cli_deviceCode=${device_code}\n`);
            break;
        }
        case "verify": {
            let device_code = process.env.github_cli_deviceCode;
            let token = await require("./cmds/verify")(clientID, device_code);
            fs.appendFileSync('.env', `github_cli_token=${token}\n`);
            break;
        }
    }
}
