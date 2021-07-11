import sqlite3 from "sqlite3";
import path, { resolve } from "path";
import fs from "fs";
import Ajv from "ajv";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * The project singleton
 * @property {Cache} cache
 */
export class Project {
    /** @constructor  */
    constructor() {
        this.init_done = false;
        this.config={};
        this.config.basedir = path.normalize(path.join(__dirname, ".."));
    }

    query(sql, params) {
        const self = this;
        return new Promise(function(resolve, reject) {
            self.db.all(sql, params, function(err, rows) {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }


    /**
     *
     */
    async init() {
        if (this.init_done) return;
        this.init_done = true;
        this.db = new sqlite3.Database(this.config.basedir+"/main.db");
        await this.load_schemas();
        console.log("init done");
    }

    async load_schemas() {
        const ajv = new Ajv.default({coerceTypes: true});
        this.ajv = ajv;
        this.schemaJsonStr = {};
        const ls = (await fs.promises.readdir("./schemas")).filter((i)=>i.endsWith(".json"));
        for (const fn of ls) {
            const name = fn.replace(/\.([^.]+)$/, "");
            console.log("schema", name);
            const schema_str = (await fs.promises.readFile(`./schemas/${fn}`)).toString();
            this.schemaJsonStr[name] = schema_str;
            const schema = JSON.parse(schema_str);
            ajv.addSchema(schema, name);
        }
    }
}

global.proj=global.proj || new Project();

/** @type {Project} */
export const proj=global.proj;

