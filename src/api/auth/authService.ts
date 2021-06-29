
import {Roles} from '../Role'
import{AppError} from '../../utils'
import {addCustomer,login,assignPriviledge } from './authInterface'
 import {PhoneNumberUtil, PhoneNumberFormat, PhoneNumber} from 'google-libphonenumber'
 import { Users } from '../User'
 import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
 import { v4 as uuidv4, } from 'uuid';
import { Priviledge } from '../Priviledge'
 import {Terminals} from '../Terminal'



export class AuthService {
    //registration of customer

     createCustomer = async (customer:addCustomer) =>{
         //check if role is customer

        if(customer.role !== "customer"){
            throw new AppError('UnAuthorized', null, 404)
        }
        //validating customer phoneNumber
        let {parsedPhoneNumber,isValidPhoneNumber} =this.parsePhoneNumber(customer.phoneNumber)
        if(!isValidPhoneNumber){
            throw new AppError('invalid phone number')
        }
        //checking for existing phone Number
        const phone = await Users.findOne({phoneNumber:parsedPhoneNumber})
        if(phone){
            throw new AppError(`An account with ${customer.phoneNumber} already exists`)
        }
        //checking for existing email
        const email = await Users.findOne({email:customer.email})
        if(email){
            throw new AppError(`A user with this email ${customer.email} already exists `)
        }
        //verify role
        const role = await Roles.findOneOrFail({where:[{role:customer.role}]})
        .catch(() =>{
            throw new AppError('invalid role selected')
        })
        const expriviledge = await Priviledge.findOne({where:[{name:role.role}]})
        if(!expriviledge){
            throw new AppError('invalid priviledge selected')
        }
        customer.phoneNumber=parsedPhoneNumber,
        customer.password = await bcrypt.hash(customer.password, 8)
       
        const user = Users.create(customer)
        user.priviledge=expriviledge
        user.roles=role
        user.gender = customer.gender
        let priviledge = [expriviledge]
        user.priviledges = priviledge.map(item => item.name)
       await user.save()
       //generate token and refreshToken

       const refreshToken = await this.generateRefreshToken(user)
       const AccessToken = await this.generateAcessToken(user)
       return {user, refreshToken, AccessToken}
     
      

        

    }
    public loginCustomer = async (loginData:login) =>{
        console.log(loginData)
         let {isValidPhoneNumber,parsedPhoneNumber} = this.parsePhoneNumber(loginData.phoneNumber)
            if(!isValidPhoneNumber){
                throw new AppError('invalid phone Number')
            }
            const user = await Users.findOne({where:[{phoneNumber:parsedPhoneNumber}],
             select:["id", "email", "password","priviledges", "phoneNumber", "name"],
            relations:["roles", "priviledge"]
            })
         
            if(!user){
                throw new AppError('no user with this credential exist')
            }
            if(user.block){
                throw new AppError('UnAuthorized', null, 404)
            }
            const isMatch = await bcrypt.compare(loginData.password,user.password )
            if(!isMatch){
                throw new AppError('no user with this credential exist')
            }

            delete (user.password)

            const refreshToken = await this.generateRefreshToken(user)
            const AccessToken = await this.generateAcessToken(user)
            return {user, refreshToken, AccessToken}

    }
    public createUser = async(addUser:addCustomer) =>{
        if(addUser.role === "customer"){
            throw new AppError('UnAuthorized', null, 404)
        }
            if(addUser.terminal === null){
                throw new AppError('terminal ID required', null, 404)
            }
        let {isValidPhoneNumber,parsedPhoneNumber} = this.parsePhoneNumber(addUser.phoneNumber)
        if(!isValidPhoneNumber){
            throw new AppError('invalid phone Number')
        }
       
              const terminal  =await Terminals.findOneOrFail({where:[{id:addUser.terminal}]})
        .catch(() =>{
            throw new AppError('invalid terminal')
        })

       
         const phone = await Users.findOne({where:[{phoneNumber:parsedPhoneNumber}]})       

        if(phone){
            throw new AppError(`A user with this phoneNumber ${addUser.phoneNumber} already exist`)
        }
        const email = await Users.findOne({where:[{email:addUser.email}]})
        if(email){
            throw new AppError(`A user with this email ${addUser.email} already exists`)
        }
  
        const role = await Roles.findOneOrFail({where:[{role:addUser.role}]})
        .catch(() =>{
            throw new AppError('invalid role selected')
        })
        console.log(role,terminal)
     
       addUser.phoneNumber=parsedPhoneNumber
       //hash password
        addUser.password = await bcrypt.hash(addUser.password,8)
       const priviledge = await Priviledge.findOne({where:[{name:role.role}]})
       const user = Users.create(addUser)       
        user.Terminal =terminal.id
        user.priviledge=priviledge      
        
        let priv = [priviledge]
        user.priviledges = priv.map(item => item.name)
        user.roles=role
        const refreshToken = await this.generateRefreshToken(user)
        const AccesToken = await this.generateAcessToken(user)
        return {user, refreshToken, AccesToken}
       
                

    }
    public loginUser = async (loginData:login) =>{

        let {isValidPhoneNumber,parsedPhoneNumber} = this.parsePhoneNumber(loginData.phoneNumber)
            if(!isValidPhoneNumber){
                throw new AppError('invalid phone Number')
            }

            const user = await Users.findOne({where:[{phoneNumber:parsedPhoneNumber}],
                select:["id", "name", "password","phoneNumber", "priviledge","Terminal"],
                relations:["roles", "priviledge"]
            })
            if(!user){
                throw new AppError('no user with this credential exists ')
            }
            if(user.block){
                throw new AppError('UnAuthorized', null, 404)
            }
            const isMatch = await bcrypt.compare(loginData.password, user.password)
            if(!isMatch){
                throw new AppError('no user with this credential exists')
            }
            if(user.roles.role === "customer"){
                throw new AppError('UnAuthorized', null, 404)
            }
            delete (user.password)
            console.log(user)
          

            const refreshToken = await this.generateRefreshToken(user)
            const AccessToken = await this.generateAcessToken(user)

            return {user, refreshToken, AccessToken}
    }

   public AssignPriviledge = async (id :string, assign:assignPriviledge, ) =>{
       const user = await Users.findOneOrFail({where:[{id}]})
       .catch(() =>{
           throw new AppError('user not found')
       })
     
    for(let priviledge of assign.priviledge){
        const isMatch = user.priviledges.every(item => priviledge.includes(item))
       if(!isMatch){
           user.priviledges.push(priviledge)

       }
   }
   await user.save()
   return "updated successfully"

   }

   public RemovePriviledge = async (id:string, assign:assignPriviledge) =>{
       const user = await Users.findOneOrFail({where:[{id}]})
       .catch(() =>{
           throw new AppError('user not found')
       })
      for (let priviledge of assign.priviledge){
          console.log(priviledge)

      const isMatch = user.priviledges.filter(item => item !==priviledge)

      user.priviledges = []
      for (let match of isMatch){
          user.priviledges.push(match)
      }
     
     
      }
      await user.save()
      return "updated successfully"
   }


    private parsePhoneNumber(phoneNumber: string) {
        const phoneNumberUtilInstance = PhoneNumberUtil.getInstance();
        let googlePhoneNumber: PhoneNumber;
        let parsedPhoneNumber: string;
        try {
          googlePhoneNumber = phoneNumberUtilInstance.parse(phoneNumber.toString(), "NG");
          parsedPhoneNumber = phoneNumberUtilInstance.format(googlePhoneNumber, PhoneNumberFormat.E164);
        } catch (error) {
          /* Handle errors thrown by phoneNumber parsing */
          throw new AppError(error.message);
        }
        const isValidPhoneNumber = phoneNumberUtilInstance.isValidNumberForRegion(googlePhoneNumber, "NG");
        return { isValidPhoneNumber, parsedPhoneNumber };
      }

      private generateAcessToken = async (user:Users) =>{
        const body = { id: user.id };
        const token = jwt.sign({ iss: "http://localhost:3000", user: body },"AIzaSyDnN72_PIUPd6mHgVQv2GuhpLn4wot3ke4", {
          expiresIn: '1d',
        });
        return token;

      }
      private async generateRefreshToken(user: Users) {
        const refreshToken = uuidv4();
        user.refreshToken = refreshToken;
        await user.save();
        return refreshToken;
      }

     

}


