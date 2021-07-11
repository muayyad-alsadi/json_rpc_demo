import {proj} from "../proj";
import fs from "fs";
import jsdoc from "jsdoc-api";

function param_to_schema(param) {
    const key = param.name.replace(/^params\./, "");
    const type = param.type.names.join("|");
    console.log(key, ":", type);
    if (type.startsWith("Schemas.")) {
        // make Schemas.user => {"$ref": "/user"}
        return [key, {"$ref": type.replace(/^Schemas\./, "/")}];
    }
    return [key, {type}];
}

export async function start() {
    if (process.argv.length<5) {
        console.log("pass <dir_name> <func_prefix> for example `controllers action`");
        process.exit();
    }
    const rpc_type = process.argv[3];
    const func_prefix = process.argv[4]+"_";
    const ls = (await fs.promises.readdir(`./lib/${rpc_type}`)).filter((i)=>i.endsWith(".js"));
    console.log(ls);
    const sw_tags = [];
    const sw_paths = {};
    const sw_schemas = {
        "generic": {"type": "object"},
    };
    const sw_path_temp = (await fs.promises.readFile(proj.config.basedir+"/swagger_template_path.json")).toString();
    for (const fn of ls) {
        const bn = fn.replace(/.(?:[^.]+)$/, "");
        sw_tags.push({name: bn, description: bn});
        const source = (await fs.promises.readFile(`./lib/${rpc_type}/${fn}`)).toString();
        const res = await jsdoc.explain({
            source: source,
        });
        // console.log(JSON.stringify(res, null, 2));
        const items = res.filter((i)=>(i.comment && i.kind=="function" && i.name.startsWith(func_prefix)));
        for (const item of items) {
            const name = item.name.replace(func_prefix, "");
            console.log(` ** ${rpc_type}.${bn}.${name}`);
            const params = item.params.filter((i)=>i.name.startsWith("params."));
            const required = params.filter((param)=>(param.description||"").startsWith("required")).map((param)=>param.name.replace(/^params\./, ""));
            const properties = Object.fromEntries(
                params.map(param_to_schema));
            const schema_name = `${rpc_type}.${bn}.${name}.in`;
            const schema = {
                "$id": `/${schema_name}`,
                "type": "object",
                "additionalProperties": false,
                "properties": properties,
                "required": required,
            };
            await fs.promises.writeFile(`schemas/${schema_name}.json`, JSON.stringify(schema, null, 2));
            sw_schemas[schema_name] = schema;
            sw_paths[`/${bn}.${name}`] = JSON.parse(sw_path_temp
                .replace("[\"tags\"]", JSON.stringify([bn]))
                .replace("\"func_in\"", JSON.stringify(`#/components/schemas/${schema_name}`))
                .replace("\"func_out\"", JSON.stringify("#/components/schemas/generic")));
        }
    }
    const json_temp = (await fs.promises.readFile(proj.config.basedir+"/swagger_template.json")).toString();
    let out = json_temp.replace("@TAGS@", JSON.stringify(sw_tags, null, 2));
    out = out.replace("@PATHS@", JSON.stringify(sw_paths, null, 2));
    out = out.replace("@SCHEMAS@", JSON.stringify(sw_schemas, null, 2));
    await fs.promises.writeFile(proj.config.basedir+"/public/build/swagger.json", out);
    process.exit(0);
}

