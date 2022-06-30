import schedule from 'node-schedule';
import { BlackToken } from '../models/blacklist';
import { lightship } from '../configs/lightship.config';
import Logger from '../api/lib/logger';

const logger = Logger(__filename);

const job = schedule.scheduleJob('*/1 * * * *', async function () {
    const tokens = await BlackToken.findAll();

    for (const token of tokens) {
        if (lightship.isServerShuttingDown()) {
            logger.debug('Not procesing more tokens because shutting down');
            break;
        }

        const beacon = lightship.createBeacon();

        try {
            const revoked = await token.revokeToken();
            logger.verbose('Revoked token', revoked); //FIXME does not appear
        } catch (error) {
            logger.error(error);
        } finally {
            await beacon.die();
        }
    }
});
