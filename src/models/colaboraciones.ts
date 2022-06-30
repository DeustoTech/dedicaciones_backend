import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Proyecto } from './proyectos';
import { Usuario } from './usuarios';
@Table
export class Colaboracion extends Model {
    @ForeignKey(() => Usuario)
    @Column
    id_usuario!: number;

    @ForeignKey(() => Proyecto)
    @Column
    id_proyecto!: number;

    @Column
    rol!: string;
}
