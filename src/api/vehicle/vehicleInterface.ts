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
    available:string,
    down:string,
    arrived:string
    id:string

}