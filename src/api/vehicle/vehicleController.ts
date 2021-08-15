import {BaseController} from '../baseController'
import {VehicleService} from './vehicleService'
import{HttpStatusCode} from '../../enums'
import {AddVehicle,vehicleStatus} from './vehicleInterface'
import {Users} from "../User"



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
    public changeVehicleStatus = async(id, data:vehicleStatus, user:Users) =>{
        const vehicle = await this.service.changeVehicleStatus(id, data, user)
        return this.sendResponse({data:vehicle, statusCode:HttpStatusCode.OK})

    }


}