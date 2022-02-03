import { lightship } from './configs/lightship.config';
import { setUpExpress } from './api/configs/express.config';
import Logger from './api/lib/logger';
import { database, initialize } from './api/lib/database';
import './jobs/deleteExpiredTokens';
import './models'; // TODO remove (this is only to create all models)
import { DedicacionesError } from './errors';

const logger = Logger(__filename);

async function main() {
    await initialize();
    await database.sync({ alter: true });

    const server = setUpExpress(process.env.PORT);
    if (!server) throw new DedicacionesError('no server from express');
    logger.info('Server listening at', process.env.PORT);

    lightship.registerShutdownHandler(() => {
        server.close();
        logger.debug('Procesos cerrados'); //cerrar procesos
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received');
        lightship.shutdown();
    });
}

main();
