// import {Trips} from '../Trips'
// import{Routes} from '../Routes'
// import {AppError} from '../../utils'
// import {addAvailability,searchTrip} from './tInterface'
// // import dayjs from 'dayjs'
// import { TripAvailabilty } from './tModel'
// import {VehicleType} from '../vehicleType'
// // import {Bookings} from '../Booking'

// import { TripStatus } from '../../enums'
// import {  Bookings } from '../Booking'
// // import {  In, Like } from 'typeorm-plus'

// // import {Seats} from './seatModel'
// // import {Like} from 'typeorm-plus'
// // import { TripStatus } from '../../enums'


// export class TripService{
//     public createTrip =async (tripData: addAvailability) =>{

//         await Routes.findOneOrFail({id:tripData.routeId})
//         .catch(() =>{
//             throw new AppError('invalid route selected')
//         })

//         await Trips.findOneOrFail({id:tripData.tripId})
//         .catch(() =>{
//             throw new AppError('invalid trip selected')
//         })









//     //     console.log(tripData)
//     //     await Routes.findOneOrFail({id: tripData.routeId})
//     //     .catch(() => {
//     //         throw new AppError('invalid route selected')
//     //     })
//     //    const trip = await Trips.findOneOrFail({ id: tripData.tripId})
//     //     .catch(() =>{
//     //         throw new AppError('invalid trip selected')
//     //     })
//     //     const type = await VehicleType.findOneOrFail({id:tripData.typeId})
//     //         .catch(() =>{
//     //             throw new AppError('invalid vehicle type selected')
//     //         })
//     //         console.log(type)

//     //     const avaliableTrips = await TripAvailabilty.find({where:[{
//     //          trip:tripData.tripId,
//     //          name:tripData.name
//     //     }]})
//     //     if(avaliableTrips.length > 0){
//     //         throw new AppError('Trip is already available')
//     //     }
//     //     const newTrip = TripAvailabilty.create(tripData)
//     //    newTrip.trip=trip
     
//     //    newTrip.Days = [...tripData.day]
//     //    newTrip.TripStatus = TripStatus.AVAILABLE

//     //    return await newTrip.save()
       
            


//     }
//     public searchTrips = async (tripData:searchTrip) =>{
//         const route = await Routes.find({ where:[{
//             id:tripData.routeId
//         }], relations:['trip']})



//     for(const toutes of route){
//         const number = await Bookings.find({where :[{
//             TravelDate:tripData.departureTime,
//                 trip:toutes.trip
            
            
//         }]})
//         console.log(number)


//     }
        
        



//     }
// }


















// // import {Trips} from '../Trips'
// // import{Routes} from '../Routes'
// // import {AppError} from '../../utils'
// // import {addAvailability} from './tInterface'
// // import dayjs from 'dayjs'
// // import { TripAvailabilty } from './tModel'
// // import {Seats} from './seatModel'
// // import {Like} from 'typeorm-plus'
// // import { TripStatus } from '../../enums'


// // export class TripService {
// //     public createTrip = async(tripData:addAvailability) =>{
// //         const route =   await Routes.findOneOrFail({id:tripData.routeId})
// //         .catch(() =>{
// //             throw new AppError('invalid route selected')
// //         })
       
// //       const trip =  await Trips.find({where:[{
// //           route:route.id
// //       }], relations:['type']})

// //      if(trip.length<= 0){
// //          throw new AppError('invalid trip selected')
// //      }
// //   if(trip.length === 1){
// //       const one = await Trips.findOne({where:[{
// //           id:tripData.tripId
// //       }], relations:["type"]})
// //       console.log(one)
// //       if(one.Days.length <= 0){
// //         throw new AppError('This trip is not available')
// //       }
// //       const day =  dayjs(tripData.departureTime).format('dddd').toLowerCase()
// //       const available = one.Days.includes(day)
// //       if(!available){
// //           throw new AppError('This trip is not available')
// //       }
// //       const data = await TripAvailabilty.find({departureTime:Like(`%${tripData.departureTime}%`)})

// //       if(data.length > 0){
// //         const seatAvaliable = data.map(item => item.seat)
// //         const available = seatAvaliable.find(item => item.filter(item => item.seatStatus === "available"))
// //          if(available.length <= 0){
// //          const status =   data.find(item => item.TripStatus)
// //          status.TripStatus = TripStatus.BOOKED
// //          await TripAvailabilty.save(data)
// //          return data
             
// //          }else{
// //              return data
// //          }

// //       }else{
// //           const temp = TripAvailabilty.create(tripData)
// //           temp.trip=one
// //           temp.departureTime =tripData.departureTime
// //           const seat=[]
// //           for(var i =1; i<= one.type.seatNumber; i++){
// //                 seat.push({seatNumber:i})
// //           }
// //           temp.seat =await Seats.save(seat)
// //           const saveTrip =await temp.save()
// //           return [saveTrip]
          

// //       }
// //   }else{
// //       const data =  await TripAvailabilty.find({departureTime: Like(`%${tripData.departureTime}`)})

// //       if(data.length > 0){
// //          const seat = data.map(item => item.seat)
// //          const available =seat.find(item => item.filter(item => item.seatStatus ==="available"))
// //          if(available.length<= 0){
// //              const status = data.find(item => item.TripStatus)
// //              status.TripStatus = TripStatus.BOOKED
// //              await TripAvailabilty.save(data)
// //              return data
// //          }else{
// //              return data
// //          }
// //       }
     

// //     const TripAvaliables: TripAvailabilty[] =[]
// //     for(const available of trip){
        
// //         if(available.Days.length<= 0){
// //             throw new AppError('This trip is not available')
// //         }
// //         // const day = dayjs(tripData.departureTime).format('dddd')
// //         // const isAvailable = available.Days.includes(day)
// //         // if(!isAvailable){
// //         //     throw new AppError('this.trip is not available')
// //         // }
        
        
// //         const TripAvaliable = TripAvailabilty.create(tripData)
// //     const seat =[]
// //     const type = trip.map(item => item.type.seatNumber )
// //     console.log(type)
   

    
// //         TripAvaliable.seat = await Seats.save(seat)
        
    

// //         TripAvaliables.push(TripAvaliable)
          
           

// //     }
// //     await TripAvailabilty.save(TripAvaliables)
   
   


  
// //   }
     

// // //     const seat =[]

// // //     for(var i =1; i <= trip.type.seatNumber; i++){
// // //         seat.push({seatNumber:i})

// // //     }
// // //        temp.seat =await Seats.save(seat)
// // //        console.log(temp)

// // //  const avalaibility = await temp.save()
// // //  console.log(avalaibility)

// // //     return [avalaibility]
            
        
    
            
            
        
// // //     }


// //     }
// //     public searchTrips = async (tripData:addAvailability) =>{

       


// //         const data =  await this.createTrip(tripData)
// //        return data
        

        

// //     }
// // }


// // // export class TripAvalability {

// // // public createTripAvailability = async (availableData:addAvailability) =>{
// // //      await Routes.findOneOrFail({id:availableData.routeId})
// // //     .catch(() =>{
// // //         throw new AppError("invalid route selected") 
// // //     })
// // //     const trip = await Trips.findOneOrFail({id:availableData.tripId})
// // //     .catch(() =>{
// // //         throw new AppError('invalid trip selected')
// // //     })
// // //    const type =  await VehicleType.findOneOrFail({ id: availableData.typeId})
// // //     .catch(() =>{
// // //         throw new AppError('invalid vehicle type selected')
// // //     })
    
  
// // //     const available = await TripAvailabilty.findOne({Time: availableData.time})
// // //     if(available){
// // //         throw new AppError('trip already exist')
// // //     }
// // //     const data = TripAvailabilty.create(availableData)

   
// // //     data.trip=trip
// // //     data.Time =availableData.time

// // //     const seat =[]

// // //     for(var i =1; i <= type.seatNumber; i++){
// // //         seat.push({seatNumber:i})

// // //     }
// // //        data.seat =await Seats.save(seat)

// // //  const avalaibility = await data.save()

// // //     return avalaibility
   

  

   
    
// // // }

  
    
// // // }
