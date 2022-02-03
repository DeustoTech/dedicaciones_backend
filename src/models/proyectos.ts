import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../api/lib/database';
export interface projectProps {
    id: number;
    nombre: string;
    date_inic?: Date;
    date_fin?: Date;
    createdAt?: Date;
    id_admin?: number;
    updatedAt?: Date;
}

export class Proyecto extends Model<projectProps> implements projectProps {
    id!: number;
    nombre!: string;
}

Proyecto.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        timestamps: true,
        tableName: 'proyectos',
    }
);
