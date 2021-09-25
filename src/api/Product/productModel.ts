import { BaseEntity, Column, CreateDateColumn, Entity,     PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'


@Entity()
export class Products extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
     id: string
     @Column()
     product_name:string
     @Column()
     product_description:string
     @Column({type:"json"})
     product_variables:[{}]
     @CreateDateColumn()
     date_uploaded:Date
     @UpdateDateColumn()
     date_edited:Date

}
