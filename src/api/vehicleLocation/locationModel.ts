import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'
import {Vehicles} from '../vehicle'
import {VehicleStatus} from '../../enums'


@Entity()
export class VehicleLocation extends BaseEntity{
@PrimaryGeneratedColumn('uuid')
public id:string
@OneToOne(type=> Vehicles)
@JoinColumn()
public vehicle:Vehicles
@Column()
public Location:string
@Column()
public Left:string
@Column()
public HC:string
@Column()
public HeadingTo:string
@Column({type:"enum", enum:VehicleStatus})
public status:VehicleStatus
@CreateDateColumn()
public createdAt:Date
@UpdateDateColumn()
public updatedAt:Date

}