import {Entity, PrimaryGeneratedColumn, Column, BaseEntity,OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm-plus'
import {VehicleType} from '../vehicleType'
@Entity()
export class VehicleFeatures extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    public id:string
    @Column()
    public attribute:string
    @OneToMany(type =>VehicleType, (type) => type.feature)
    public type:VehicleType[]
    @CreateDateColumn()
    public createdAt:Date
    @UpdateDateColumn()
    public updatedAt:Date
}
