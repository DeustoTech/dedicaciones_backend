import { Usuario } from '../../models/usuarios';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { Response, NextFunction } from 'express';
import { sendResponse } from '../lib/statusMessage';
import { BlackToken } from '../../models/blacklist';
import { APIError } from '../errors/APIError';

export function getUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) {
    try {
        sendResponse(res, { user: req.user as Usuario });
    } catch (error) {
        next(error);
    }
}
export function logout(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new APIError('No header', 400);
    const authHeaderSplited = authHeader.split('Bearer ');
    if (authHeaderSplited.length !== 2)
        throw new APIError('Token is malformed', 400);
    const token = authHeaderSplited[1];
    BlackToken.create({
        token: token,
    });
    sendResponse(res, {});
}
