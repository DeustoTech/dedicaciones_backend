import { Sequelize } from 'sequelize-typescript';
import Logger from './logger';
import { createMySQLConnection } from './mysql';

const logger = Logger(__filename);

const dbConfig = {
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};

export const database = new Sequelize(
    <string>dbConfig.database,
    <string>dbConfig.username,
    <string>dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
        logging:
            process.env.MYSQL_LOGGING === 'true'
                ? (message: string) => logger.debug(message)
                : false,
        models: ['/src/models'],
    }
);

export async function initialize(): Promise<void> {
    const mysqlConnection = await createMySQLConnection({
        host: dbConfig.host,
        user: dbConfig.username,
        password: dbConfig.password,
    });

    await mysqlConnection.query(
        `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
    await mysqlConnection.end();
}
