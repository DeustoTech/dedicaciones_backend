import { lightship } from './configs/lightship.config';
import { setUpExpress } from './api/configs/express.config';
import Logger from './lib/logger';
import { database, initialize } from './lib/database';

const logger = Logger(__filename);

async function main() {
    
    await initialize();
    await database.sync();
  

    await setUpExpress(process.env.PORT);
    logger.info('Server listening at', process.env.PORT);

    lightship.registerShutdownHandler(() => {
        logger.debug('Cerrando procesos...'); //cerrar procesos
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received');
        lightship.shutdown();
    });
}

main();
