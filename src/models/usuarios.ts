import { Model, DataTypes } from 'sequelize';
import { database } from '../lib/database';
export interface UserProps {
    id?: number;
    email?: string;
    nombre?: string;
    isAdministrador?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Usuario extends Model<UserProps> implements UserProps {
    email!: string;
    nombre!: string;
    isAdministrador!: boolean;
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
        }
    },
    {
        sequelize: database,
        timestamps: true,
        tableName: 'usuarios',
    }
);
