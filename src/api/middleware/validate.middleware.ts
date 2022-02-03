import { NextFunction, Request, Response } from 'express';
import { checkToken } from '../lib/security';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { Usuario } from '../../models/usuarios';
import { BlackToken } from '../../models/blacklist';
import { APIError } from '../errors/APIError';
import { TokenExpiredError } from 'jsonwebtoken';

export async function validate(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new APIError('No header', 400);
        const authHeaderSplited = authHeader.split('Bearer ');
        if (authHeaderSplited.length !== 2)
            throw new APIError('Token is malformed', 400);
        const token = authHeaderSplited[1];

        const blackToken = await BlackToken.getTokenByToken(token);
        if (blackToken) throw new APIError('Token in blacklist', 403);

        const decodedToken = checkToken(token);
        if (typeof decodedToken === 'string' || !decodedToken.id)
            throw new APIError('Token is not in the correct format', 400);

        const user = await Usuario.encontrarUsuarioPorId(decodedToken.id);
        if (!user) throw new APIError('user not registered', 401);
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            error = new APIError('El token ha expirado', 410);
        }
        next(error);
    }
}
