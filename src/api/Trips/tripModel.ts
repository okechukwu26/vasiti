import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, } from 'typeorm-plus'
import {Routes} from '../Routes'
import {VehicleType} from '../vehicleType'

import {Bookings} from '../Booking'
import {Seats} from  './seatModel'
import {TripStatus} from '../../enums'

@Entity()
export class Trips extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    public id: string
    @Column()
    public price:number
    @Column()
    public schedule:string
        @Column('simple-array')
    public Days:string[]
    @Column({type:"enum", enum:TripStatus, default:TripStatus.AVAILABLE})
    public TripStatus:TripStatus
   
    @ManyToOne(type => Routes, (route) => route.trip)
        public route:Routes
  @ManyToOne(type => VehicleType, (type) => type.trip)
        public type:VehicleType

 @OneToMany(type =>Bookings, (book) => book.trip)
        public book:Bookings[]
 @OneToMany(type => Seats, (seat) => seat.trip)
        public seat:Seats[]

    @CreateDateColumn()
     public createdAt:Date
     @UpdateDateColumn()
     public updatedAt:Date

}