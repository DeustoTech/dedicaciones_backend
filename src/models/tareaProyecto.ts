import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { Proyecto } from './proyectos';
import { Tarea } from './tareas';
import { Usuario } from './usuarios';

@Table
export class TareaProyecto extends Model {
    @ForeignKey(() => Tarea)
    @Column
    id_tarea!: number;

    @ForeignKey(() => Proyecto)
    @Column
    id_proyecto!: number;
}
