import {BaseController} from '../baseController'
import {VehicleService} from './vehicleService'
import{HttpStatusCode} from '../../enums'
import {AddVehicle} from './vehicleInterface'



export class VehicelController extends BaseController{

    private service = new VehicleService()

    public createVehicle = async (vehicelData:AddVehicle) =>{
        const vehicle = await this.service.createVehicle(vehicelData)

        return this.sendResponse({data:vehicle, message:"vehicle created suucessfully", statusCode:HttpStatusCode.CREATED})
    }
    public getVehicle = async () =>{
        const vehicle = await this.service.getVehicle()
        return this.sendResponse({data:vehicle, statusCode:HttpStatusCode.OK})
    }


}