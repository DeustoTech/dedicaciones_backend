import { Response } from 'express';
import { DedicacionesError } from '../../errors';
import { APIError } from '../errors/APIError';

const DEFAULT_HTTP_ERROR_CODE = 500;

export type Data = Record<string, unknown>;
export interface ResponseOpts {
    code?: number;
}

export async function sendResponse(
    res: Response,
    data: Data,
    opts?: ResponseOpts
): Promise<void> {
    if (!opts) opts = { code: 1 }; // valor por defecto

    res.send({
        code: opts.code,
        data,
    });
}

export async function sendError(
    res: Response,
    error: APIError | DedicacionesError | Error,
    opts?: ResponseOpts
): Promise<void> {
    if (!opts) opts = { code: -1 };

    res.status(
        error instanceof APIError ? error.httpCode : DEFAULT_HTTP_ERROR_CODE
    ).send({
        code: error instanceof DedicacionesError ? error.code : opts.code,
        error: {
            message: error.message,
        },
    });
}
