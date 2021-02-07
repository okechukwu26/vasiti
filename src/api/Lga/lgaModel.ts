import {Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm-plus'
import {Terminals} from '../Terminal'
import {States} from '../State'


@Entity()
export class LGA extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    public id:number
    @Column()
    public name: string
    @OneToMany(type => Terminals, (terminal) => terminal.lga)
    public terminal:Terminals[]
    @ManyToOne(type => States, (state) => state.lga )
    public state:States
    @CreateDateColumn()
    public createdAt:Date
    @UpdateDateColumn()
    public updatedAt:Date
}