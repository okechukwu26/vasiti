import {BaseController} from '../baseController'
import {LgaServices} from './lgaServices'
import {AddLga} from './lgaInterface'
import { HttpStatusCode } from "../../enums";
import {Users} from '../User'

export class  LgaController extends BaseController{
   private Lga = new LgaServices

    public createLga = async (lgaData: AddLga, user:Users) =>{

            const data = await this.Lga.createLga(lgaData, user)
            return this.sendResponse({data:data, statusCode:HttpStatusCode.CREATED})

    }
    public getLga = async (user:Users) =>{
            const data = await this.Lga.getLga(user)
            return this.sendResponse({data})
    }
}