import {States} from './stateModel'
import {getRepository} from 'typeorm-plus'


export class StatesService{
    public createState = async (stateData: any) =>{
        console.log(stateData)
        try {
        
          const StateRepo = getRepository(States)
          const state = StateRepo.create(stateData)

          await StateRepo.save(state).catch(err =>{
              console.log('error' + err)
          })
          console.log('new state created' + state)
          return state
         
       
            
        } catch (error) {
            console.log(error)
            
        }
   

    }
    public getState = async () =>{
        const state = await States.find()

        return state
    }
}