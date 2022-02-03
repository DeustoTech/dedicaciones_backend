import { v4 as uuidV4 } from 'uuid';

export class DedicacionesError extends Error {
    id = uuidV4();
    code: number;

    constructor(message: string, code: number = 0) {
        super(message);
        this.code = code;
    }
}
