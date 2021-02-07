import {Entity, PrimaryGeneratedColumn,  Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany} from 'typeorm-plus'
import {LGA} from '../Lga'
import {Terminals} from '../Terminal'

@Entity()
export class States extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    public id:number
    @Column()
    public name:string
    @OneToMany(type => LGA, (lga) => lga.state)
    public lga:LGA[]
    @OneToMany(type => Terminals, (terminal) => terminal.state)
    public terminal:Terminals[]
    @CreateDateColumn()
    public createdAt:Date
    @UpdateDateColumn()
    public updatedAt:Date
}