import { BaseEntity, Column, Entity,    OneToMany,  PrimaryGeneratedColumn } from 'typeorm-plus'
import {Users} from '../User'


@Entity()
export class Priviledge extends BaseEntity{
 @PrimaryGeneratedColumn('uuid')
 public id:string
 @Column({unique:true})
 public name:string
 @OneToMany(type => Users, (user) => user.priviledge)
 public user:Users[]
 @Column({type:'boolean',  default:false})
 public view:boolean
 @Column({type:'boolean',  default:false})
 public edit:boolean
 @Column({type:'boolean', default:false})
 public delete:boolean
 



}