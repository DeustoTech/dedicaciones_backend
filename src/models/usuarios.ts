import { Model, DataTypes } from 'sequelize';
import { database } from '../api/lib/database';
export interface UserProps {
    id?: number;
    email?: string;
    nombre?: string;
    isAdministrador?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Usuario extends Model<UserProps> implements UserProps {
    id?: number;
    email!: string;
    nombre!: string;
    isAdministrador!: boolean;

    createdAt?: Date;
    updatedAt?: Date;

    static async encontrarUsuarioPorId(id: number): Promise<Usuario | null> {
        const response = await Usuario.findOne({ where: { id } });
        return response;
    }

    static async encontrarUsuarioPorEmail(
        email: string
    ): Promise<Usuario | null> {
        const response = await Usuario.findOne({ where: { email } });
        return response;
    }
}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: { msg: 'Not an email' },
            },
            allowNull: false,
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isAdministrador: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize: database,
        timestamps: true,
        tableName: 'usuarios',
        indexes: [
            {
                fields: ['email'],
                unique: true,
            },
        ],
    }
);
