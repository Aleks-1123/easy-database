import SQLite from "better-sqlite3";

export type Data = string | object | Array<Data>

export interface DefaultOptions {
    path: string,
    table: string
}

export class Database {
    public rawDatabase: SQLite.Database;
    public path: string = "./database.sqlite";
    public selectedTable: string = "master";

    constructor(
        public defaultOptions: DefaultOptions,
    ) {
        this.path = this.defaultOptions.path && typeof this.defaultOptions.path === "string" ? this.defaultOptions.path : "./database.sqlite";
        this.selectedTable = this.defaultOptions.table && typeof this.defaultOptions.table === "string" ? this.defaultOptions.table : "main";
        this.rawDatabase = new SQLite(this.path);
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${ this.selectedTable } (key, data)`).run();
    }

    table(table: string): this {
        if (!table || typeof table !== "string") throw new TypeError("You entered an invalid table variable");
        this.selectedTable = table;
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${ this.selectedTable } (key, data)`).run();
        return this;
    }

    deleteTable(table: string): boolean {
        if (!table || typeof table !== "string") throw new TypeError("You entered an invalid table variable");
        this.selectedTable = this.defaultOptions.table;
        this.rawDatabase.prepare(`DELETE TABLE IF EXISTS ${ table } (key, data)`).run();
        return true;
    }

    get(key: string): Data {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${ this.selectedTable } (key, data)`).run();
        if (!key || typeof key !== "string") throw new Error("Key must be string!");
        let data = this.rawDatabase.prepare(`SELECT * FROM ${ this.selectedTable } WHERE key = ?`).get(key);
        try {
            data = JSON.parse(data.data);
        } catch {

        }
        return data;
    }

    getAll(): Array<Data> {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${ this.selectedTable } (key, data)`).run();

        const DBdata = this.rawDatabase.prepare(`SELECT * FROM ${ this.selectedTable } WHERE key IS NOT NULL`).all();
        const data = [];
        DBdata.forEach(r => {
            data.push({
                key: r.key,
                data: JSON.parse(r.data),
            });
        });

        return data;
    }


    set(key: string, dataSet: Data): boolean {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${ this.selectedTable } (key, data)`).run();
        const fetched = this.rawDatabase.prepare(`SELECT * FROM ${ this.selectedTable } WHERE key = ?`).get(key);
        if (!fetched) this.rawDatabase.prepare(`INSERT INTO ${ this.selectedTable } (key, data) VALUES (?,?)`).run(key, "{}");
        dataSet = JSON.stringify(dataSet);
        this.rawDatabase.prepare(`UPDATE ${ this.selectedTable } SET data = ? WHERE key = ?`).run(dataSet, key);
        return true;
    }


    delete(key: string): boolean {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${ this.selectedTable } (key, data)`).run();
        const fetched = this.rawDatabase.prepare(`SELECT * FROM ${ this.selectedTable } WHERE key = ?`).get(key);
        if (!fetched) return null;
        this.rawDatabase.prepare(`DELETE FROM ${ this.selectedTable } WHERE key = ?`).run(key);
        return true;
    }
}

