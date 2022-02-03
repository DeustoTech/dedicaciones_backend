import express, { Request, Response, NextFunction } from 'express';
import router from '../routers';
import cors from 'cors';
import { sendError } from '../lib/statusMessage';
import { APIError } from '../errors/APIError';
import { DedicacionesError } from '../../errors';
import Logger from '../lib/logger';
export let app: express.Express | null = null;

const logger = Logger(__filename, 'error');

export function setUpExpress(port = process.env.PORT) {
    try {
        app = express();
        app.use(
            cors({
                origin: '*',
            })
        );
        app.use('/', router);

        app.use(
            (
                error: Error,
                _req: Request,
                res: Response,
                next: NextFunction
            ) => {
                logger.error(error);
                // if (process.env.NODE_ENV !== 'production')
                //     return sendError(res, error);

                if (!(error instanceof DedicacionesError)) {
                    error = new Error('Error inesperado');
                } else if (!(error instanceof APIError)) {
                    error = new Error(
                        'Ha ocurrido un error inesperado. Contacte con la siguiente referencia: ' +
                            error.id
                    );
                }

                sendError(res, error);
            }
        );

        const server = app.listen(port, () => {});
        return server;
    } catch (error) {
        logger.error(error);
    }
}
