import {BaseController} from '../baseController'
import {AddTerminal} from './terminalInference'
import {TerminalService} from './terminalService'
import {Users} from '../User'


export class TerminalController extends BaseController {
    private Services = new TerminalService()

    public createTerminal = async (terminalData:AddTerminal, user:Users) =>{
        const data =  await this.Services.createTerminal(terminalData, user)
        return this.sendResponse({data})

    }
    public deleteTerminal = async(id:string, user:Users) =>{
        const data = await this.Services.deleteTerminal(id, user)
        return this.sendResponse({data})
    }
    public getTerminal = async () =>{
        const terminal =  await this.Services.getTerminal()
        return this.sendResponse({data:terminal})
    }
}