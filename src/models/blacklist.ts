import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../api/lib/database';
import { checkToken } from '../api/lib/security';
import { TokenExpiredError } from 'jsonwebtoken';

export interface BlackTokenProps {
    id?: number;
    token: string;
}

export class BlackToken
    extends Model<BlackTokenProps>
    implements BlackTokenProps
{
    id?: number;
    token!: string;
    createdAt?: Date;
    updatedAt?: Date;

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
BlackToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        timestamps: true,
        tableName: 'blacklist',
    }
);
