
// import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'
// import {Trips} from '../Trips'
// import {TripStatus} from '../../enums'
// import {Bookings} from '../Booking'

// @Entity()
// export class TripAvailabilty extends BaseEntity{
//     @PrimaryGeneratedColumn('uuid')
//     public id:string
//      @Column()
//     public name: string
//     @Column('simple-array')
//     public Days:string[]
//      @Column({type:"enum", enum:TripStatus, default:TripStatus.AVAILABLE})
//     public TripStatus:TripStatus
//         @ManyToOne(type =>Trips, (trip) =>trip.available, {eager:true})
//     @JoinTable({name:"trip"})
//     public trip: Trips  
//     @OneToMany(type => Bookings, (booking) => booking.avaliable)
//     public booking:Bookings[]
   
//     @CreateDateColumn()
//     public createdAt:Date
//     @UpdateDateColumn()
//     public updatedAt:Date
// }






