import {
    Column,
    CreatedAt,
    ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { Tarea } from './tareas';
import { Usuario } from './usuarios';

@Table
export class Dedicacion extends Model {
    @Column
    fecha!: Date;

    @Column
    duracion!: number;

    @Column
    descripcion?: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @ForeignKey(() => Usuario)
    @Column
    id_usuario!: number;

    @ForeignKey(() => Tarea)
    @Column
    id_tarea!: number;
}
