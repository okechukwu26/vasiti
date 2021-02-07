import {Priviledge} from './priviledgeModel'
import {AppError} from '../../utils'
import {priviledgeData} from './priviledgeInterface'



export class PriviledgeService {

public createPriviledge = async (data:priviledgeData) =>{

    const priviledge = await Priviledge.findOne({where:[{name:data.name}]})
    if(priviledge){
        throw new AppError('priviledge already exits')
    }

    const newPriviledge = Priviledge.create(data)

    return await newPriviledge.save()

}

}