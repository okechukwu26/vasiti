import { SeatStatus, TripStatus } from "../../enums";
export interface addAvailability{
   
    routeId:string
       tripId:string  
       typeId:string
       name:string
    status?:SeatStatus  
    tripStatus?: TripStatus 
    day:Array<string>
   
    
}

export interface searchTrip {
    tripId:string,
    routeId:string
   departureTime: string
   id:string
}