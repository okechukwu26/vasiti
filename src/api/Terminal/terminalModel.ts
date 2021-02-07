import { Column, Entity, OneToMany, CreateDateColumn,UpdateDateColumn, BaseEntity,PrimaryGeneratedColumn, ManyToOne} from 'typeorm-plus'
import {Routes} from '../Routes'
import {LGA} from '../Lga'
import {States} from '../State'


@Entity()
export class Terminals extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
   public id:string
   @Column()
   public name:string
   @OneToMany((type) => Routes, (route) => route.terminal)
   public route:Routes[]
   @ManyToOne(type => LGA, (lga) => lga.terminal)
   public lga:LGA
  @ManyToOne(type => States, (state) => state.terminal)
  public state: States
   @CreateDateColumn()
   public createdAt:Date
   @UpdateDateColumn()
   public updatedAt:Date

}