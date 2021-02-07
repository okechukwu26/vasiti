import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, OneToMany} from 'typeorm-plus'
import { Roles} from '../Role'
import {Passengers} from '../Passenger'
import {Priviledge} from '../Priviledge'
@Entity()
export class Users extends BaseEntity {
@PrimaryGeneratedColumn('uuid')
public id:string
@Column()
public name:string
@Column({unique:true})
public phoneNumber:string
@Column({unique:true})
public email:string
@Column({select:false})
public password:string
@Column()
public gender:string
@Column('simple-array')
public priviledges:string[]
@ManyToOne(type => Roles, (role) => role.user)
public roles:Roles
@ManyToOne(type =>Priviledge, (priviledge) => priviledge.user)
public priviledge:Priviledge


@Column({nullable:true, unique:true})
public refreshToken:string
@Column({nullable:true, type:'uuid'})
public Terminal:string
@OneToMany(type =>Passengers, (passenger) => passenger.user)
public passenger:Passengers[]
@Column({type:'boolean',default:false})

public block:boolean

 @CreateDateColumn()
 public createdAt:Date
 @UpdateDateColumn()
 public updatedAt:Date
}