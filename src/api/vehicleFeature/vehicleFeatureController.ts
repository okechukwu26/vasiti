import {BaseController} from '../baseController'
import {HttpStatusCode} from '../../enums'
import {VehicleFeatureService} from './vehicleFeatureService'
import {AddFeatures, UpdateFeatures} from './vehicleFeatureInterface'


export class VehicleFeatureController extends BaseController {
    private Service = new VehicleFeatureService()

    public createFeature = async (feature:AddFeatures) =>{
        const data = await this.Service.createvehicleFeature(feature)
        return this.sendResponse({data:data, statusCode:HttpStatusCode.CREATED})
    }
    public updateFeature  =async ( id:string, feature:UpdateFeatures) =>{
        const data = await this.Service.updateFeature( id,feature)
        return this.sendResponse({data:data, message:"update succesfully", statusCode:HttpStatusCode.CREATED})
    }

}
