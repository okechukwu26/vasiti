import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'


@Entity()
export class CaptainFee extends BaseEntity {
@PrimaryGeneratedColumn('uuid')
public id:string
@Column()
public NameOfCaptain:string
@Column()
public Route:string
@Column()
public RouteType:string
@Column()
public fee:number
@Column()
public TravelDate:string
@CreateDateColumn()
public createdAt:Date
@UpdateDateColumn()
public updatedAt:Date

}