const SQLite = require("better-sqlite3");

class Database {
    /**
     * Creating a database
     * @param options - Options object
     * @param options.path - path to set (e.g. "./data/db.sqlite")
     * @param options.table - Default table
     */
    constructor(options = {}) {
        this.defaultOptions = options;
        this.path = options.path && typeof options.path === 'string' ? options.path : './database.sqlite';
        this.selectedTable = options.table && typeof options.table === 'string' ? options.table : "master";
        this.rawDatabase = new SQLite(this.path);
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
    }

    /**
     * Raw Database
     * @type {IDBDatabase} - better-sqlite3 database object
     */
    /**
     * Changing a table
     * @param table
     * @returns {Database} - Database object
     */
    table(table) {
        if (!table || typeof table !== 'string') throw new TypeError("You entered an invalid table variable");
        this.selectedTable = table;
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        return this;
    }
    deleteTable(table) {
        if (!table || typeof table !== 'string') throw new TypeError("You entered an invalid table variable");
        this.selectedTable = this.defaultOptions.table;
        this.rawDatabase.prepare(`DELETE TABLE IF EXISTS ${table} (key, data)`).run();
        return true;
    }

    /**
     * Getting a key
     * @param key - Key to get
     * @returns {*} - Data from database
     */
    get(key) {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();
        if (!key || typeof key !== 'string') throw new Error("Key must be string!");
        const data = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key = ?`).get(key);
        try {
            data = JSON.parse(data.data)
        } catch {

        }
        return data;
    }

    /**
     * Getting all data
     * @returns {array} - Array from database
     */
    getAll() {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();

        let DBdata = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key IS NOT NULL`).all();
        const data = [];
        DBdata.forEach(r => {
            data.push({
                key: r.key,
                data: JSON.parse(r.data)
            });
        })

        return data;
    }

    /**
     * Set a data to dabase
     * @param key = Key to set
     * @param dataSet - Data to set
     * @returns {boolean} -
     */
    set(key, dataSet) {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();

        /* Fetching */
        const fetched = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key = ?`).get(key);
        /* Setting if not exists */
        if (!fetched) this.rawDatabase.prepare(`INSERT INTO ${this.selectedTable} (key, data) VALUES (?,?)`).run(key, '{}');
        /* Encoding to set */
        dataSet = JSON.stringify(dataSet);
        /* Setting a variable */
        this.rawDatabase.prepare(`UPDATE ${this.selectedTable} SET data = ? WHERE key = ?`).run(dataSet, key);
        /* Returing a boolean */
        return true;
    }

    /**
     * Deleting a item
     * @param key - Key to delete
     * @returns {boolean} - Deleted true or false
     */
    delete(key) {
        this.rawDatabase.prepare(`CREATE TABLE IF NOT EXISTS ${this.selectedTable} (key, data)`).run();

        /* Get from database */
        const fetched = this.rawDatabase.prepare(`SELECT * FROM ${this.selectedTable} WHERE key = ?`).get(key);
        /* If not exists returns false */
        if (!fetched) return false;
        /* Deleting data */
        this.rawDatabase.prepare(`DELETE FROM ${this.selectedTable} WHERE ID = ?`).run(key);
        /* Returns true */
        return true;
    }
}

module.exports = Database;
