import {VehicleFeatures} from './vehicleFeatureModel'
import {AppError} from '../../utils'
import {AddFeatures, UpdateFeatures} from './vehicleFeatureInterface'


export class VehicleFeatureService {
    public createvehicleFeature = async (vehiceData:AddFeatures) =>{
        const vehicle = await VehicleFeatures.findOne({attribute:vehiceData.attribute})
        if(vehicle){
            throw new AppError("vehicle feature already exist")
        } 
        const data = VehicleFeatures.create(vehiceData)

        await data.save()
        return data

    }
    public updateFeature = async (id:string, vehicleData:UpdateFeatures) =>{
        const vehicle = await VehicleFeatures.findOneOrFail({id})
          .catch(() => {
              throw new AppError('invalid feature selected')
          })
          vehicle.attribute = vehicleData.attribute

         return await vehicle.save()
    }

}