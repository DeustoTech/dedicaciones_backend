import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../api/lib/database';
export interface ColabsProps {
    id_usuario: number;
    id_proyecto: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Colaboracion extends Model<ColabsProps> implements ColabsProps {
    id_usuario!: number;
    id_proyecto!: number;
}

Colaboracion.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        id_proyecto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        timestamps: true,
        tableName: 'colaboraciones',
    }
);
