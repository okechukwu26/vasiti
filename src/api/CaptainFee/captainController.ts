import {CapTainService} from './captainService'
import {BaseController} from '../baseController'
import {Users} from '../User'
import{captainData} from './captainInterface'



export class CaptainController extends BaseController {

private service = new CapTainService()

public getCaptainFee =  async (id:captainData, user:Users) =>{

    const fee = await this.service.getCaptainFee(id, user)

    return  this.sendResponse({data:fee})
}



}