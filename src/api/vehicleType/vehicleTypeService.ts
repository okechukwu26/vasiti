import {AddType} from './vehicleTypeInterface'
import {AppError} from '../../utils'
import {VehicleType} from './vehicleTypeModel'
import {VehicleFeatures} from '../vehicleFeature'


export class VehicleTypeService {


    public createVehicleType = async (vehicleData:AddType) =>{
        const feature = await VehicleFeatures.findOneOrFail({id:vehicleData.featureId})
        .catch(() =>{
            throw new AppError('vehicle feature does not exist')
        })
        const type = await VehicleType.findOne({seatNumber:vehicleData.seatNumber})
        if(type){
            throw new AppError('vehicle type already exist')
        }

        const data = VehicleType.create(vehicleData)
        data.feature = feature
       return await data.save()

    }
    public getVehicleType = async () =>{
        try {
            return await VehicleType.find()
            
        } catch (error) {
            throw new AppError(error)
            
        }

    }
}