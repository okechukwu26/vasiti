import {Terminals} from './terminalModel'
import {AddTerminal} from './terminalInference'
import {States} from '../State'
import {LGA} from '../Lga'
import {AppError} from '../../utils'
import {Users} from '../User'
import {Routes} from '../Routes'
 import {Trips, Seats} from '../Trips'


export class TerminalService {

    public createTerminal = async (terminalData:AddTerminal, user:Users) =>{
       if(user.priviledges.includes('manager')){
        const lga =  await LGA.findOneOrFail({id:terminalData.lgaId})
        .catch(() =>{
            throw new AppError("invalid lga selected")
        })
        const state = await States.findOneOrFail({id: terminalData.stateId})
            .catch(() => {
                throw new AppError('invalid state selected')
            })
            const tempTerminal = await Terminals.findOne({ name:terminalData.name})
            if(tempTerminal){
                throw new AppError("terminal already exists")
            }
            const terminal = Terminals.create(terminalData)
            terminal.state=state
            terminal.lga=lga

             return await terminal.save()

       }else {
           throw new AppError('UnAuthorized', null, 404)
       }
      
    }
    public deleteTerminal = async (id:string, user:Users) =>{
        if(user.priviledges.includes('admin')){


            const terminal = await Terminals.findOneOrFail({id})
            .catch(() =>{
                throw new AppError('invalid terminal selected')
            })
           
          
    
            const route = await Routes.find({where:[{terminal:terminal.id}]})
            console.log(route)
            try {
                route.forEach(async item => {
                    const trip = await Trips.find({where:[{route:item.id}]})
                    trip.forEach(async item =>{
                        const seat = await Seats.find({where:[{trip:item.id}]})
                        seat.forEach(async item => {
                            await Seats.getRepository().delete({id:item.id})
    
                        })
                        await Trips.getRepository().delete({id:item.id})
                    })
                    await Routes.getRepository().delete({id:item.id})
                })
                 
                
            } catch (error) {
                console.log(error)
                
            }
           
            await Terminals.getRepository().delete({id:terminal.id})
           
        return "terminal deleted"


        }


    }
    public getTerminal = async () =>{
        return await Terminals.find()
    }

}