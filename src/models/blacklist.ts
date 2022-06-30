import {
    Column,
    CreatedAt,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { checkToken } from '../api/lib/security';
import { TokenExpiredError } from 'jsonwebtoken';

@Table({ timestamps: true })
export class BlackToken extends Model {
    @Column
    token!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    static async getTokenByToken(token: string): Promise<BlackToken | null> {
        const response = await BlackToken.findOne({ where: { token } });
        return response;
    }

    async revokeToken(): Promise<boolean> {
        try {
            checkToken(this.token);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                await this.destroy();
                return true;
            }
        }
        return false;
    }
}
