 import {AppError} from '../../utils'
 import {Roles} from './roleModel'
 import {addRole} from './roleInterface'


 

 export class RoleService {

public CreateRole = async (role:addRole) =>{
    //change to lower case
    const newRole = role.role.toLowerCase()

const exRole = await Roles.findOne({role:newRole})
if(exRole){
    throw new AppError('role already exist')
}
return await Roles.create(role).save()



   



}

 }