import SQLite from "better-sqlite3";

export declare type Data = string | object | Array<Data>;

export interface DefaultOptions {
    path: string;
    table: string;
}

export declare class Database {
    defaultOptions: DefaultOptions;
    rawDatabase: SQLite.Database;
    path: string;
    selectedTable: string;

    constructor(defaultOptions: DefaultOptions);

    table(table: string): this;

    deleteTable(table: string): boolean;

    get(key: string): Data;

    getAll(): Array<Data>;

    set(key: string, dataSet: Data): boolean;

    delete(key: string): boolean;
}