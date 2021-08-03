import {BaseController} from '../baseController'
import{HttpStatusCode} from '../../enums'
import {VehicleTypeService} from './vehicleTypeService'
import {AddType} from './vehicleTypeInterface'


export class VehicleTypeController extends BaseController{
    private service = new VehicleTypeService()

    public createVehicleType = async (vehicleData:AddType) =>{
        const data = await this.service.createVehicleType(vehicleData)
        return this.sendResponse({data, statusCode:HttpStatusCode.CREATED})
    }
    public getVehicleType = async () =>{
        const data = await this.service.getVehicleType()
        return this.sendResponse({data, statusCode:HttpStatusCode.OK})
    }
}