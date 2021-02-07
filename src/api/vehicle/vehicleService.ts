import {Vehicles} from './vehicleModel'
 import {VehicleType} from '../vehicleType'
import {AppError} from '../../utils'
import {AddVehicle} from './vehicleInterface'
import {PhoneNumberUtil, PhoneNumberFormat, PhoneNumber} from 'google-libphonenumber'


export class VehicleService {

    public createVehicle = async (vehicleData:AddVehicle) =>{
        const {isValidPhoneNumber,parsedPhoneNumber} = this.parsePhoneNumber(vehicleData.PCNextOfKinPhoneNumber)
       if(!isValidPhoneNumber){
           throw new AppError('invalid phone Number')
       }
        const vehicle = await Vehicles.findOne({where:[{
            PC:vehicleData.PC
        }]})
        if(vehicle){
            throw new AppError(`The PC ${vehicleData.PC} is already attributed to a vehicle`)

        }
    
        const type =  await VehicleType.findOneOrFail({id:vehicleData.typeId})
        .catch(() =>{
            throw new AppError('invalid vehicle type selected')
        })
        console.log(type)

       const newvehicle = Vehicles.create(vehicleData)
       newvehicle.PCPhoneNumber = parsedPhoneNumber
       newvehicle.Location = vehicleData.location
       

       newvehicle.vehicleType= type    
             

             return await newvehicle.save()

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

}


//emmanuel from benue 