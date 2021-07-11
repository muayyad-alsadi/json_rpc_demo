import fs from "fs";

import {proj} from "./proj";
import {load_one} from "./utils/loader";

function usage(commands) {
    console.log("available commands are: "+JSON.stringify(commands));
}

export async function start(command) {
    console.log("starting ...");
    const ls0 = await fs.promises.readdir(proj.config.basedir+"/lib/commands");
    const commands = ls0.filter((i)=>i.endsWith(".js"))
        .filter((i)=>!i.startsWith("_"))
        .map((i)=>i.replace(/.js$/, ""));
    if (process.argv.length <= 2 || process.argv[2] == "help") {
        usage(commands);
        process.exit();
    }
    if (!command) {
        command = process.argv[2];
    }
    if (commands.indexOf(command)<0) {
        console.log("** ERROR: unknown command "+command);
        usage(commands);
        process.exit();
    }

    (await load_one(`commands/${command}`)).start();
}

