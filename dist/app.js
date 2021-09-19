"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class Database {
    constructor(defaultOptions) {
        this.defaultOptions = defaultOptions;
        this.path = "./database.sqlite";
        this.selectedTable = "master";
        this.path = this.defaultOptions.path && typeof this.defaultOptions.path === "string" ? this.defaultOptions.path : "./database.sqlite";
        this.selectedTable = this.defaultOptions.table && typeof this.defaultOptions.table === "string" ? this.defaultOptions.table : "main";
        this.rawDatabase = new better_sqlite3_1.default(this.path);
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
    }
    table(table) {
        if (!table || typeof table !== "string")
            throw new TypeError("You entered an invalid table variable");
        this.selectedTable = table;
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        return this;
    }
    deleteTable(table) {
        if (!table || typeof table !== "string")
            throw new TypeError("You entered an invalid table variable");
        this.selectedTable = this.defaultOptions.table;
        this.rawDatabase.prepare(`DELETE TABLE IF EXISTS ${table} (key, data)`).run();
        return true;
    }
    get(key) {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        if (!key || typeof key !== "string")
            throw new Error("Key must be string!");
        let data = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key = ?`).get(key);
        try {
            data = JSON.parse(data.data);
        }
        catch (_a) {
        }
        return data;
    }
    getAll() {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        const DBdata = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key IS NOT NULL`).all();
        const data = [];
        DBdata.forEach(r => {
            data.push({
                key: r.key,
                data: JSON.parse(r.data),
            });
        });
        return data;
    }
    set(key, dataSet) {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        const fetched = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key = ?`).get(key);
        if (!fetched)
            this.rawDatabase.prepare(`INSERT INTO ${this.selectedTable} (key, data) VALUES (?,?)`).run(key, "{}");
        dataSet = JSON.stringify(dataSet);
        this.rawDatabase.prepare(`UPDATE ${this.selectedTable} SET data = ? WHERE key = ?`).run(dataSet, key);
        return true;
    }
    delete(key) {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        const fetched = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key = ?`).get(key);
        if (!fetched)
            return false;
        this.rawDatabase.prepare(`DELETE FROM ${this.selectedTable} WHERE key = ?`).run(key);
        return true;
    }
}
exports.Database = Database;
