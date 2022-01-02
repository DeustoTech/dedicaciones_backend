import { Sequelize } from 'sequelize';
import { Usuario } from '../models/usuarios';
import { GoogleUserJwt } from '../api/controllers/google.openid.controller';

import Logger from '../lib/logger';
import { createMySQLConnection } from '../lib/mysql';

const logger = Logger(__filename);

// (message: string) => logger.debug(message) instead of logger.debug beacause logger gets all the args, and we only want the first one

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

export function logUserInDB(
    googleUserInfo: Partial <GoogleUserJwt>
): void {
    Usuario.findOrCreate({
        where: { nombre: googleUserInfo.name, email: googleUserInfo.email },
        defaults: {
            nombre: googleUserInfo.name,
            email: googleUserInfo.email,
            isAdministrador: false,
        },
    });
}
