import {BaseController} from '../baseController'
import {PriviledgeService} from './priviledgeService'
import {HttpStatusCode} from '../../enums'
import { priviledgeData } from './priviledgeInterface'

export class PriviledgeController extends BaseController {
    private service = new PriviledgeService()


    public createPriviledge = async (data:priviledgeData) =>{
        const priviledge = await this.service.createPriviledge(data)

        return this.sendResponse({data:priviledge, message:"created successfully", statusCode:HttpStatusCode.CREATED})
    }


}