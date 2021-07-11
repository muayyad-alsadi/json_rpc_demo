import {proj} from "../proj.js";
import {JsonRpcHttpServer} from "@alsadi/json_rpc_server";
import {load_all} from "../utils/loader";
import http from "http";
import WebSocket from "ws";
import {formated_validations} from "../utils/formater";

function validate(method_name, props) {
    const schema_validator = proj.ajv.getSchema(`controllers.${method_name}.in`);
    const is_valid = schema_validator(props);
    if (is_valid) return [is_valid, props];
    return [
        is_valid,
        formated_validations(schema_validator.errors),
    ];
}

export async function start() {
    await proj.init();
    const server = new JsonRpcHttpServer("rpc", ["assets", "build", "index.html", "favicon.ico"], proj.config.basedir+"/public");
    const http_server = http.createServer((request, response)=>server.handle_w_errors(request, response));
    const modules = await load_all("controllers");
    const func_prefix = "action_";
    const func_prefix_len = func_prefix.length;
    for (const [module_name, module] of Object.entries(modules)) {
        for (const [func_name, callback] of Object.entries(module)) {
            if (!func_name.startsWith(func_prefix)) continue;
            const method_name = module_name+"."+func_name.substr(func_prefix_len);
            console.log(method_name);
            server.add_method(method_name, callback, (props)=>validate(method_name, props));
        }
    }
    const wss = new WebSocket.Server({server: http_server, path: "/ws"});
    server.ws_attach(wss);
    http_server.listen(8080);
}


