import { verify, Secret, JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export type JWTToken = string;

export function checkToken(
    token: JWTToken,
    secret: Secret | undefined = process.env.JWT_SECRET
): JwtPayload | string {
    if (!secret) throw new Error('No secret provided');
    const decoded = verify(token, secret);
    return decoded;
}

export function createToken(
    idNumber: number,
    secret: Secret,
    expTime: string
): string {
    const token = jwt.sign({ id: idNumber }, secret, {
        expiresIn: expTime,
    });
    return token;
}
