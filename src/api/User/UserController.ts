import {BaseController} from '../baseController'
import {userService} from './UserService'
import {updateUser} from './UserInference'
import {Users} from './userModel'

export class UserController extends BaseController{
    private service = new userService()
    public updateUser = async (userData:updateUser, user:Users) =>{
        const data =  await this.service.blockUser(userData, user)
        return this.sendResponse({data})
    }
    public unblock = async (userData:updateUser, user:Users) =>{
        const unblocked = await this.service.unblockUser(userData,user)
        return this.sendResponse({data:unblocked})
    }

}