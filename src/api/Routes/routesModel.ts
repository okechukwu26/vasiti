import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm-plus'
import {Terminals} from '../Terminal'
import {Trips} from '../Trips'




@Entity()
export class Routes extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    public id:string

    @Column()
    public route:string
    @Column()
    public Terminal:string
    @Column()
    public type:string
    @Column({type:'uuid'})
    public arrivalId:string

    @ManyToOne((type) =>Terminals, (terminal) => terminal.route)
    public terminal:Terminals
    @ManyToOne(type => Terminals,(terminal) => terminal.route )
    public arrivalTerminal: Terminals
    @OneToMany(type => Trips, (trip) => trip.route)
    public trip:Trips[]
    @CreateDateColumn()
    public createdAt:Date

    @UpdateDateColumn()
    public updatedAt:Date

}