import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'
import {Users} from '../User'

@Entity()
export class Roles extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    public id:string
    @Column({unique:true})
    public role:string
   
    @OneToMany(type => Users, (user) => user.roles)
    public user:Users[]
  
  
      @CreateDateColumn()
    public createdAt: Date
    @UpdateDateColumn()
    public updatedAt:Date

} 