import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'
import {Passengers} from '../Passenger'

@Entity()
export class Profile extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    public id: string
    @Column()
    public nextOfKin:string
    @Column()
    public nextOfKinPhoneNumber:string
    @Column()
    public address:string
    @OneToMany(type => Passengers, (passenger) => passenger.profile)
    public passenger:Passengers[]
    @CreateDateColumn()
    public createdAt:Date
    @UpdateDateColumn()
    public updatedAt:Date
   
}