import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile('db.json', JSON.stringify(this.#database))
    }

    select(table) {
        const data = this.#database[table] ?? []
        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist();

        return data;

    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if (rowIndex > -1) {

            if (data.completed_at) {
                let dados = this.#database[table][rowIndex]
                dados.completed_at = data.completed_at
                data = dados
            }


            this.#database[table][rowIndex] = { id, ...data };
            this.#persist();
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }
}