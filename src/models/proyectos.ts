import {
    Sequelize,
    Model,
    Column,
    Table,
    BelongsToMany,
    DataType,
} from 'sequelize-typescript';
import { Colaboracion } from './colaboraciones';
import { Usuario } from './usuarios';
@Table({
    timestamps: false,
})
export class Proyecto extends Model {
    @Column
    nombre!: string;

    @Column
    fecha_inic?: Date;

    @Column
    fecha_fin?: Date;

    @Column
    descripcion!: string;

    @BelongsToMany(() => Usuario, () => Colaboracion)
    usuarios?: Usuario[];
}
