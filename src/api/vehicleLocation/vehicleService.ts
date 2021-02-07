import {VehicleLocation} from './locationModel'
import {AppError} from '../../utils'
import {Vehicles} from '../vehicle'
import {vehicleLocate} from './vehicleInterface'



export class VehicleServiceLocation {

    public CreateVehicleLocation = async (vehicelData:vehicleLocate) =>{

        const vehicle = await Vehicles.findOneOrFail({where:[{
            id:vehicelData.vehicle.id
        }]})
        .catch(() =>{
            throw new AppError('invalid vehicle data')
        })
        console.log(vehicle)
        const location = VehicleLocation.create(vehicelData)
        location.status=vehicelData.status
        location.HeadingTo =vehicelData.headingTo,
        location.Left =vehicelData.left,
        location.Location=vehicelData.headingTo
        location.vehicle=vehicelData.vehicle
        location.HC=vehicle.HC
        
        await location.save()    

    }
    public getLocation = async (location) =>{

        const locate = await VehicleLocation.find({where:[{
            HC:location.HC
        }]})


        console.log(locate)

      


    }
}