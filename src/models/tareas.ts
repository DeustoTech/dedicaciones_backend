import {
    Table,
    Model,
    Column,
    BelongsToMany,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { Colaboracion } from './colaboraciones';
import { Dedicacion } from './dedicaciones';
import { Proyecto } from './proyectos';
import { TareaProyecto } from './tareaProyecto';
import { Usuario } from './usuarios';

@Table
export class Tarea extends Model {
    @Column
    nombre!: string;

    @Column
    descripcion!: string;

    @Column
    public!: boolean;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @BelongsToMany(() => Usuario, () => Dedicacion)
    usuarios?: Usuario[];

    @BelongsToMany(() => Proyecto, () => TareaProyecto)
    proyectos?: Proyecto[];
}
