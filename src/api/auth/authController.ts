import {BaseController} from '../baseController'
import {AuthService} from './authService'
import {HttpStatusCode} from '../../enums'
import {addCustomer,assignPriviledge,login} from './authInterface'
// import { Users } from '../User'



export class AuthController extends BaseController {

private service = new AuthService()

public  createCustomer = async (customer:addCustomer) => {

    const data =  await this.service.createCustomer(customer)

    return this.sendResponse({data, statusCode:HttpStatusCode.CREATED})


}

// public OverWrite = async (data:OverWrite, change, user:Users) =>{
//     const details = await this.service.overWriteRoleAction(data, change, user)
//     return this.sendResponse({data:details, message:'data has been overwritten', statusCode:HttpStatusCode.OK})
// }
public loginCustomer = async(loginData:login) =>{
    const login = await this.service.loginCustomer(loginData)
    return this.sendResponse({data:login, message:"logged in successfully", statusCode:HttpStatusCode.OK})
}
public loginUser = async(loginData:login) =>{
    const login = await this.service.loginUser(loginData)
    return this.sendResponse({data:login, message:"logged in successfully", statusCode:HttpStatusCode.OK})
}
public createUser =async (createUser:addCustomer) =>{
    const user = await  this.service.createUser(createUser)
    return this.sendResponse({data:user, message:'user created successfully', statusCode:HttpStatusCode.CREATED})
}
public assignPriviledge = async ( id: string ,assign:assignPriviledge,) =>{
    const data = await this.service.AssignPriviledge(id, assign,)
    return this.sendResponse({data})
}
public removePriviledge = async (id:string, assign:assignPriviledge) =>{
    const data = await this.service.RemovePriviledge(id, assign)
    return this.sendResponse({data})
}

}