import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const processFile = async () => {
    const records = [];
    const parser = fs
        .createReadStream(`${__dirname}/desafio.csv`)
        .pipe(parse({
            // CSV options if any
        }));
    for await (const record of parser) {
        // Work with each record
        if (record[0] == 'title' && record[1] == 'description') {
            continue;
        }
        records.push(record);
    }
    return records;
};