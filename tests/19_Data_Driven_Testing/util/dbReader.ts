import mysql from 'mysql2/promise';
import type { LoginRow } from './yamlReader';

/**
 * MySQL is async, so data can only arrive inside a hook/test,
 * not at test-collection time. See 300_DDT_MySQL.spec.ts.
 *
 * Config comes from env (.env is already loaded by playwright.config.ts):
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 */
export const dbConfig = {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'playwright_ddt',
};

/** True only when a DB host is explicitly configured, used to skip the suite. */
export function isDbConfigured(): boolean {
    return Boolean(process.env.MYSQL_HOST);
}

/** Runs any SELECT and returns the rows. */
export async function query<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
): Promise<T[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(sql, params);
        return rows as T[];
    } finally {
        await connection.end();
    }
}

interface LoginDataRecord {
    description: string;
    username: string;
    password: string;
    should_pass: number;
    expected_error: string;
}

/** Reads login_data and maps snake_case columns to the shared LoginRow shape. */
export async function readLoginDataFromDB(): Promise<LoginRow[]> {
    const rows = await query<LoginDataRecord>(
        'SELECT description, username, password, should_pass, expected_error ' +
        'FROM login_data WHERE is_active = ? ORDER BY id',
        [1]
    );

    return rows.map((r) => ({
        description: r.description,
        username: r.username,
        password: r.password,
        shouldPass: r.should_pass === 1,
        expectedError: r.expected_error,
    }));
}
