 
import {Trips} from '../Trips'
import {Vehicles} from '../vehicle'
import { CaptainFee } from './captainModel'
import {InTransit} from '../Booking/bookingInterface'
import {Routes} from '../Routes'
import {AppError} from '../../utils'
import {captainData} from './captainInterface'
import { Users} from '../User'




export class CapTainService {
    public createCaptainFee = async (trip:Trips, vehicle:Vehicles, transitData:InTransit, route:Routes) =>{
        const isAvailable = await CaptainFee.find({where:[{
            NameOfCaptain:vehicle.PC,
            TravelDate:transitData.travelDate,
            Route: `${route.Terminal} - ${route.route}`

        }]})
        if(isAvailable.length > 0){
            throw new AppError('captain fee has already been created')
        }
        const fee = CaptainFee.create()

        fee.TravelDate =transitData.travelDate
        fee.NameOfCaptain = vehicle.PC
        fee.Route = `${route.Terminal} - ${route.route}`
        if(route.type === "short route"){
            fee.fee = 1500
            fee.RouteType = route.type
        }else if(route.type === "medium route"){
            fee.fee = 2000
            fee.RouteType=route.type
        }else{
            fee.fee = 2500
            fee.RouteType = route.type
        }
        await fee.save()
        return "captain fee created"


       

    }
    public getCaptainFee = async (fee:captainData, user:Users) =>{
        if(user.block){
            throw new AppError('UnAuthorized', null, 404)
        }
        if(!user.priviledges.includes("captain")){
            throw new AppError('UnAuthorize', null, 404)


        }

       const vehicle = await Vehicles.findOneOrFail({where:[{
           id:fee.id
       }]})
       .catch(() =>{
           throw new AppError('invalid vehicle selected')
       })

      const captain = await CaptainFee.find({where:[{
          NameOfCaptain:vehicle.PC
      }]})

     if(captain.length <= 0){
         return "No fee for this captain"
     }

     const num = captain.map(item => item.fee)
    const amount = num.reduce((acc, value) =>{

        return acc + value

     }, 0)


   return {amount, captain}
     
    
    }

}
