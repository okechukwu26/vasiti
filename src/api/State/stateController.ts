import {BaseController} from '../baseController'
import {StatesService} from './stateServices'

export class StateController extends BaseController {
    private Service = new StatesService()

    public createState = async (stateData:any) =>{
        const data = await this.Service.createState(stateData)
        return this.sendResponse({data})

    }
    public getState = async () =>{
        const data = await this.Service.getState()

        return this.sendResponse({data})
    }
}