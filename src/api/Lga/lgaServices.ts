
import {LGA} from './lgaModel'
// import {getRepository} from 'typeorm-plus'
import {States} from '../State'
import {AppError} from '../../utils'
import {AddLga} from './lgaInterface'
import {Users} from '../User'

export class LgaServices {

public createLga = async (lgaData:AddLga, user:Users) =>{
  try {
    const state =  await States.findOneOrFail({id:lgaData.stateId})
    .catch(() => { throw new AppError('invalid state selected')})
     const exlga = await LGA.findOne({ name:lgaData.name})       
     if(exlga){
      throw new AppError("lga already exist")

     }
     const lga = LGA.create(lgaData)
     lga.state=state

     return await  lga.save()


    
} catch (error) {
 throw new AppError(error)
    
}
  


 




  

}
public getLga = async (user:Users) =>{
  if(user.block){
    throw new AppError('UnAutorized', null, 404)
  }
  if(!user.priviledges.includes('manager')){
    throw new AppError('UnAuthorized', null, 404)


  }

  const lga = await LGA.find()

return lga
    

}

}