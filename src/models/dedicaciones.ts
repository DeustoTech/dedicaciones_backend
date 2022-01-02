import { Sequelize, Model, DataTypes } from 'sequelize';
import { database } from '../lib/database';
export interface DedicsProps {
    id_usuario: number;
    id_proyecto: number;
    id: number;
    fecha: Date;
    duracion: number;
    descripcion?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Dedicacion extends Model<DedicsProps> implements DedicsProps {
    fecha!: Date;
    duracion!: number;
    id_usuario!: number;
    id_proyecto!: number;
    id!: number;
}

Dedicacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_proyecto: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duracion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        timestamps: true,
        tableName: 'dedicaciones',
    }
);
