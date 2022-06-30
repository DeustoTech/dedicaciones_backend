import { database } from '../api/lib/database';
import {
    BelongsToMany,
    Column,
    CreatedAt,
    Default,
    Model,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';
import { CreationOptional, Optional } from 'sequelize/types';
import { Colaboracion } from './colaboraciones';
import { Proyecto } from './proyectos';

interface UsuarioAttributes {
    id: number;
    nombre: string;
    email: string;
    isHabilitado: boolean;
    isAdministrador: boolean;
    proyectos: Proyecto[];
}

interface UsuarioCreationAttributes
    extends Optional<
        UsuarioAttributes,
        'id' | 'isHabilitado' | 'isAdministrador' | 'proyectos'
    > {}
@Table({ timestamps: true, tableName: 'usuarios' })
export class Usuario extends Model<
    UsuarioAttributes,
    UsuarioCreationAttributes
> {
    @Column
    nombre!: string;

    @Unique
    @Column
    email!: string;

    @Default(true)
    @Column
    isHabilitado!: boolean;

    @Default(false)
    @Column
    isAdministrador!: boolean;

    @BelongsToMany(() => Proyecto, () => Colaboracion)
    proyectos?: Proyecto[];

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
