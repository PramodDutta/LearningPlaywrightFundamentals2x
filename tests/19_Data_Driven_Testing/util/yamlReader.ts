import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface LoginRow {
    description: string;
    username: string;
    password: string;
    shouldPass: boolean;
    expectedError: string;
}

/**
 * Reads a YAML file and returns it as a typed array.
 * Sync on purpose, so the data is ready at test-collection time
 * and we can create one test() per row.
 */
export function readYAML<T = LoginRow>(filePath: string): T[] {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const data = yaml.load(content) as T[];

    if (!Array.isArray(data)) {
        throw new Error(`Expected a YAML list in ${fullPath}, got ${typeof data}`);
    }
    return data;
}
