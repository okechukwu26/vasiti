
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, JoinColumn,  PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm-plus'
import {BookingStatus,BookingType,BOOK,paymentType} from '../../enums'
import {Trips} from '../Trips'
import {Passengers} from '../Passenger'
import {Payments} from '../Payment'
import {Profile} from '../Profile'





@Entity({orderBy:{createdAt:"DESC"}})
export class Bookings extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
    public id: string
    @Column()
    public amount:number

   @Column({unique:true})
    public referenceId:string

   @Column()
    public numberOfTravellers: number
    @OneToOne(type => Passengers, { eager: true })
    @JoinColumn()
    public passengerId:Passengers
    @Column({type:"enum", enum:paymentType})
   public paymentType: paymentType
   @OneToOne(type => Profile)
   @JoinColumn()
   public profile:Profile
   

   @Column({ type: 'enum', enum: BookingType })
     public type: BookingType;

  @Column({type:"enum", enum:BOOK})
  public service:BOOK;

  
    @Column()
     public TravelDate:string
     @Column({nullable:true})
     public pickupLocation:string

     @Column({nullable:true})
     public ReturnDate:string

     @Column({nullable:true})
    public seat:string
    @Column({nullable:true})
    public ReturnSeat:string
    @Column({nullable:true})
    public schedule:string
   
   
    @Column({nullable:true, type:'uuid'})
    public ConfirmedReturnTripId:string
   
     @Column({type:'uuid'})
     public ConfirmedTripId:string

     @Column()
     public ConfirmedTravelDate:string

     @Column({nullable:true})
     public ConfirmedReturnDate:string     
  
    @ManyToOne(type => Trips, (trip) => trip.book)
    public trip:Trips
    @ManyToOne(type =>Payments, (payment) => payment.booking)
    public payment:Payments
    @Column({type:'uuid', nullable:true})
    public vehicle:string
    @Column()
    public DepartureTerminal:string
    @Column()
    public ArrivalTerminal:string
   
   
   
  

    @Column({nullable:true, type:'uuid'})
    public ReturnTripId:string
    
      @Column({type:'enum', enum:BookingStatus, default: BookingStatus.APPROVED})
    public bookingStatus:BookingStatus

    @CreateDateColumn()
    public createdAt:Date

    @UpdateDateColumn()
    public updatedAt:Date
    
}