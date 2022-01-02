import express from 'express';

import router from '../routers';
import cors from 'cors';
export let app: express.Express | null = null;

export function setUpExpress(port = process.env.PORT) {
    return new Promise<void>((resolve, reject) => {
        try {
            app = express();
            app.use(
                cors({
                    origin: '*',
                })
            );
            app.use('/', router);

            app.listen(port, () => {
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}
