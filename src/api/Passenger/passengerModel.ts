import { BaseEntity, Column, CreateDateColumn, Entity,    ManyToOne,  PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'
import {Users } from '../User'
import {Profile} from '../Profile'



@Entity()
export class Passengers extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    public id:string
    @Column()
    public FullName:string
    @Column()
    public phoneNumber:string
    @Column({nullable:true})
    public seat:string
    @Column({nullable:true})
    public ReturnSeat:string
    @ManyToOne(type => Profile, (profile) => profile.passenger)
       public profile:Profile
    
    @ManyToOne(type =>Users, (user) =>user.passenger, {nullable:true})
    public user:Users
     
    @CreateDateColumn()
    public createdAt:Date
    @UpdateDateColumn()
    public updatedAt:Date

}