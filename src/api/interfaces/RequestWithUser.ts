import { Request } from 'express';
import { Usuario } from '../../models/usuarios';

export interface RequestWithUser extends Request {
    user?: Usuario;
}
