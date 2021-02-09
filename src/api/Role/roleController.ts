import {BaseController} from '../baseController'
import {RoleService} from './roleService'
import {addRole} from './roleInterface'
import {HttpStatusCode} from '../../enums'



export class RoleController extends BaseController{

    private service = new RoleService()


    public creatRole = async (roles:addRole) =>{
        const role = await this.service.CreateRole(roles)
        return this.sendResponse({data:role, message:"role created", statusCode:HttpStatusCode.CREATED})
    }
    public getRole = async () =>{
        const role = await this.service.getRole()
        return this.sendResponse({data:role})
    }
}