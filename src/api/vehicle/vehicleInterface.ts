import {VehicleStatus} from '../../enums'
export interface AddVehicle {
    plateNumber:string
    chasisNumber:string
    typeId:string
    PC:string
    HC:string
    PCNextOfKin:string,
     PCNextOfKinPhoneNumber:string 
     location:string

}

export interface vehicleStatus {
    vehicleStatus:VehicleStatus
    id:string

}