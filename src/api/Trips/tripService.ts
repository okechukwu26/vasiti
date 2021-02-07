import {Trips } from './tripModel'
import {Routes} from '../Routes'
import {AppError} from '../../utils'
import {AddTrip, searchTrips,updateDay} from './tripInterface'
import {VehicleType} from '../vehicleType'
import {Seats} from './seatModel'
import dayjs from 'dayjs'
import {Bookings} from '../Booking'
import {TripStatus} from '../../enums'
import{BOOK} from '../../enums'
import {updateTrips} from './tripInterface'
import { Users } from '../User'




export class TripService {
    public createTrip = async (tripData:AddTrip, user:Users) =>{
       
       const route = await Routes.findOneOrFail({id:tripData.routeId})
            .catch(() =>{
                throw new AppError("invalid route")
            })
           const type =   await VehicleType.findOneOrFail({id:tripData.typeId})
            .catch(() =>{
                throw new AppError('invalid vehicle type selected')
            })
            console.log(route, type)

           const trip = await Trips.findOne({where:[{
               schedule:tripData.schedule
           }]})
           if(trip){
               throw new AppError('schedule already exists')
           }
           const newTrip = Trips.create(tripData)
           const seat = []
         

           for(let i= 1; i<=type.seatNumber; i++){
              

            seat.push({seatNumber:i,})


           }

           
       newTrip.seat = await Seats.save(seat)
       newTrip.type = type  
       newTrip.route = route 
       newTrip.Days = tripData.day 
 return await newTrip.save()

        }


    public searchTrip = async( tripData:searchTrips) =>{

       
      const day =  dayjs(tripData.travelDate).format('dddd').toLowerCase()

       const trips =await Trips.find({where:[{
           route:tripData.routeId

       }], relations:['type', 'seat', 'route']})
         if(!trips){
             throw new AppError('invalid trip selected')
         }    

       const searchResult = []
    for (let trip of trips){

       const available =  trip.Days.includes(day)
       if(!available){
           trip.TripStatus =TripStatus.NOTAVAILABLE
           searchResult.push(trip)
       }

       const booking =  await Bookings.find({where:[{
           trip:trip.id,
           TravelDate:tripData.travelDate,
           service:BOOK.BOOK_A_SEAT
           
       }], relations:["passengerId"]})

    
      if(booking.length === 0){
         searchResult.push(trip)
                  
       }
    
       
       else{
         for(const book of booking){
           trip.seat = trip.seat.filter(item => item.id !== book.seat)
   }
        searchResult.push(trip)
         }
    }
   
   return searchResult
     

    
}

public updateTrip = async (id:string,trips:updateTrips, user:Users) =>{

   
   const trip = await Trips.findOneOrFail({ id})
   .catch(() => {
       throw new AppError('invalid trip selected')
   })
  
 
   const updates = Object.keys(trips)
   const allowed = ["price", 'schedule',]
   const isAllowed = updates.every(item => allowed.includes(item))
  
    if(!isAllowed){
        throw new AppError('invalid updates')
    }
  

    updates.forEach(item => trip[item] = trips[item])
  return await trip.save()

}
public updateDay = async (id:string, day:updateDay, user:Users) =>{
    
   
    
     let newDay = day.day.map(item => item.toLowerCase())
   
     
  
    
 const AllowedUpdates = ["monday", "tuesday","wednesday", "thursday", "friday", "saturday", "sunday"]
 const isAllowed = newDay.every(item => AllowedUpdates.includes(item))
    if(!isAllowed){
        throw new AppError('invalid day selected')
    }

 let trip =  await Trips.findOneOrFail({id})
    .catch(() =>{
        throw new AppError('invalid trip selected')
    })
   
    for(let days of newDay){
        if(trip.Days.includes(days)){
           return null
        }
      trip.Days.push(days)
    }
    await trip.save()
    return "updated"

      

}

public deleteDay = async(id:string, user:Users) =>{


   const trip = await Trips.findOneOrFail({where:[{
       id
   }], relations:["seat"]})
   .catch(() =>{
       throw new AppError('invalid trip selected')
   })
   const seat = await Seats.find({where:[{
       trip:trip.id
   }]})
    seat.forEach( async item => {
        await Seats.getRepository().delete({id:item.id})
    })
    await Trips.getRepository().delete({id:trip.id})

    // await trip.save()
    return 'trip deleted'

}
}



