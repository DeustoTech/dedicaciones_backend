import { NextFunction, Request, Response } from 'express';
import { google } from 'googleapis';
import jwt, { verify } from 'jsonwebtoken';

import Logger from '../lib/logger';
import { UniqueConstraintError } from 'sequelize';
import { Usuario } from '../../models/usuarios';
import { createToken } from '../lib/security';
import { sendError, sendResponse } from '../lib/statusMessage';
import { APIError } from '../errors/APIError';

const logger = Logger(__filename, 'debug');
export interface GoogleUserJwt {
    azp: string;
    aud: string;
    sub: string;
    hd: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
}
if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URL
) {
    throw new Error('Open id vars not found in env');
}

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

export async function getAuthorizationUrl(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });

        sendResponse(res, { authUrl });
    } catch (error) {
        next(error);
    }
}

export async function callback(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { code } = req.query;

        if (!code) throw new Error('Callback is not valid');
        if (typeof code !== 'string') throw new Error('code not a string');
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        if (typeof tokens.id_token !== 'string')
            throw new Error('id_token not a string');
        const googleUserInfo = jwt.decode(
            tokens.id_token
        ) as Partial<GoogleUserJwt>;

        if (!googleUserInfo?.name || !googleUserInfo?.email) {
            throw new Error('undefined userInfo');
        }

        const usuario = new Usuario({
            nombre: googleUserInfo.name,
            email: googleUserInfo.email,
        });
        if (googleUserInfo?.email === process.env.MYSQL_ADMIN)
            usuario.isAdministrador = true;

        let result: Usuario | undefined;
        try {
            result = await usuario.save();
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                logger.debug('User already exists');
                const result2 = await Usuario.encontrarUsuarioPorEmail(
                    googleUserInfo.email
                );
                if (result2) result = result2;
            } else throw error;
        }

        if (!result)
            throw new APIError(
                'Ha ocurrido un error al crearse el usuario en la base de datos'
            );

        if (
            !process.env.JWT_SECRET ||
            !process.env.JWT_EXPIRES_IN ||
            !result.id
        ) {
            throw new Error('undefined JWTInfo');
        }

        const token = createToken(
            result.id,
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRES_IN
        );

        res.redirect(`http://localhost:3000/home/${token}`);
    } catch (error) {
        next(error);
    }
}
