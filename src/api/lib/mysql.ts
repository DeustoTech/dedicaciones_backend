import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';
import Logger from './logger';

const logger = Logger(__filename);

export async function createMySQLConnection(config: ConnectionOptions): Promise<Connection> {
    return mysql.createConnection(config);
}