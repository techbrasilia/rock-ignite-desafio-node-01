import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const tasks = database.select('tasks');

            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res, dadosFile) => {

            if (!req.body && dadosFile) {
                dadosFile.forEach(e => {
                    //console.log('item: ', e)
                    const task = {
                        id: randomUUID(),
                        title: e[0],
                        description: e[1],
                        created_at: new Date()
                    };
                    database.insert('tasks', task)
                });
            } else if (req.body && !dadosFile.length) {
                const { title, description } = req.body;
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    created_at: new Date()
                };
                database.insert('tasks', task)
            } else {
                return res.writeHead(404).end("Nenhum dado inserido!");
            }


            return res.writeHead(201).end("Task criada!");
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body;
            try {
                database.update('tasks', id, {
                    title,
                    description,
                    updated_at: new Date()
                });

                return res.writeHead(201).end();
            } catch (error) {
                console.log('erro:', error)
                return res.writeHead(404).end();
            }


        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {
            const { id } = req.params

            database.update('tasks', id, {
                completed_at: new Date()
            });

            return res.writeHead(201).end();

        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id);

            return res.writeHead(204).end();

        }
    }
]