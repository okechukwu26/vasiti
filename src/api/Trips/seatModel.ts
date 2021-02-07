import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm-plus'
import {SeatStatus} from '../../enums'
import {Trips} from './tripModel'




@Entity()
export class Seats extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id:string
    @Column()
    public seatNumber:number
    @Column({type:"enum", enum:SeatStatus, default: SeatStatus.AVAILABLE})
    public seatStatus:SeatStatus   
   
    
    @ManyToOne(type => Trips, (trip) => trip.seat)
    public trip: Trips
   
    @CreateDateColumn()
    public createdAt:Date
    @UpdateDateColumn()
    public updatedAt:Date
   



}