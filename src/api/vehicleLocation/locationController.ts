import {BaseController} from '../baseController'
import {VehicleServiceLocation} from './vehicleService'
import {HttpStatusCode} from '../../enums'


export class locationController extends BaseController{

    private service = new VehicleServiceLocation()

    public getLocation = async (location) =>{

        const locate = await this.service.getLocation(location)

        return this.sendResponse({data:locate, statusCode:HttpStatusCode.OK})
    }
    
}