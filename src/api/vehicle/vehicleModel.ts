import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm-plus'


import {VehicleStatus} from '../../enums'
import {VehicleType} from '../vehicleType'


@Entity()
export class Vehicles extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id:string
    @Column({unique:true})
    public plateNumber:string

    @Column({unique:true})
    public chasisNumber:string
    //PERMANENT CAPTAIN
    @Column()
    public PC:string
    @Column()
    public PCPhoneNumber:string
    @Column()
    public PCNextOfKin:string
    @Column()
    public PCNextOfKinPhoneNumber:string 
    //HANDOVER CAPTAIN
    @Column({nullable:true})
    public HC:string
    @Column({nullable:true})
    public HCNextOfKin:string
    @Column({nullable:true})
    public HCNextOfKinPhoneNumber:number
    @Column()
    public Location:string

    @Column({type:"enum", enum:VehicleStatus, default:VehicleStatus.AVAILABLE})
    public vehicleStatus:VehicleStatus

   @OneToOne(type => VehicleType )
   @JoinColumn()
   public vehicleType:VehicleType

   
  
    @CreateDateColumn()
    public createdAt:Date

    @UpdateDateColumn()
    public updatedAt:Date
    


}