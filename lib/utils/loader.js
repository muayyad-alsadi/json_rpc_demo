import {promisify} from "util";
import {readdir} from "fs";
import {proj} from "../proj";
const asyncReadDir = promisify(readdir);

export async function load_all(kind) {
    console.log("** load_all");
    console.log("path: ", proj.config.basedir+"/lib/"+kind);
    const ls0 = await asyncReadDir(proj.config.basedir+"/lib/"+kind);
    const ls = ls0.filter((i)=>i.endsWith(".js"))
        .filter((i)=>!i.startsWith("_"))
        .map((i)=>i.replace(/\.(?:[^.]+)$/, ""));
    console.log("** ls: ", ls);
    const promise_ls = [];
    const modules = [];
    for (const item of ls) {
        console.log(`** ../${kind}/${item}`);
        const p=import(`../${kind}/${item}`).then(async function(module) {
            console.log(`item ${item} loaded`);
            modules[item] = module;
            return module;
        });
        promise_ls.push(p);
    }
    await Promise.all(promise_ls);
    return modules;
}

export async function load_one(spec) {
    return await import("../"+spec);
}
