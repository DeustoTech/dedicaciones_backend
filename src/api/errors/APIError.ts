import { DedicacionesError } from '../../errors';
export class APIError extends DedicacionesError {
    httpCode: number;

    constructor(message: string, httpCode = 500, code?: number) {
        super(message, code);
        this.httpCode = httpCode;
    }
}
