import{AppError} from '../../utils'
import {Users} from './userModel'
import {updateUser} from './UserInference'


export class userService {

    public blockUser = async (userData:updateUser, user:Users) =>{
        if(!user.priviledges.includes('admin')){
            throw new AppError('UnAuthorized', null, 404)
        }
        const  block = await Users.findOneOrFail({where:[{
            id:userData.id
        }]})
        .catch(() =>{
            throw new AppError('invalid user id')
        })
        if(block.id === user.id){
            throw new AppError('You are not allowed to block yourself')
        }

        block.block = true
       await block.save()
       return "user blocked"


    }
    public unblockUser = async (userData:updateUser, user:Users) =>{
        if(!user.priviledges.includes("admin")){
            throw new AppError('UnAuthorized', null, 404)
        }
        const unblock = await Users.findOne({where:[{id:userData.id}]})
        .catch(() =>{
            throw new AppError('invalid user id')
        })
        unblock.block = false
        await unblock.save()
        return "user unblocked"
    }

}