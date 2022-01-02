import { Request, Response } from 'express';
import {logUserInDB} from '../../lib/database'
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../models/usuarios';

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

export async function getAuthorizationUrl(req: Request, res: Response) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    
    res.send({authUrl});
}

export async function callback(req: Request, res: Response) {
    const { code } = req.query;
    if (!code) throw new Error('Callback is not valid');
    if (typeof code !== 'string') throw new Error('code not a string');
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (typeof tokens.id_token !== 'string')
        throw new Error('code not a string');
    const googleUserInfo = jwt.decode(
        tokens.id_token
    ) as Partial<GoogleUserJwt>;

    if (!googleUserInfo?.name || !googleUserInfo?.email) {
        throw new Error('undefined userInfo');
    }
    // logUserInDB(googleUserInfo);
     Usuario.findOrCreate({
         where: { nombre: googleUserInfo.name, email: googleUserInfo.email },
         defaults: {
             nombre: googleUserInfo.name,
             email: googleUserInfo.email,
             isAdministrador: false,
         },
     });
    res.redirect('http://localhost:3000/home');
}
