import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'




@Entity()
export class Customers extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    public id: string
    @Column()
    public role:string
    @Column()
    public firstName: string
    @Column()
    public lastName:string
    @Column({ nullable: true, unique: true })
    public email:string
    @Column({unique:true})
    public phoneNumber:number
  
  
   @CreateDateColumn()
   public createdAt:Date
   @UpdateDateColumn()
   public updatedAt: Date



}