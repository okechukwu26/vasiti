import {BOOK,BookingType, VehicleStatus,BookingStatus} from '../../enums'
import {Passengers} from '../Passenger'
import {Profile} from '../Profile'


export interface addBooking{
    tripId:string
    returnTripId?:string    
    travelDate:string
    numberOfTravellers:number
    seat?:string
    ReturnSeat?:string
    referenceId:string
    passenger:Passengers[]
    profile:Profile
    type:BookingType
    service:BOOK
    returnDate ?:string
    pickupLocation?:string
   

    
}

export interface AssignBus{
    travelDate:string
    tripId:string
    schedule:string
    typeId:string
    service:BOOK
    type:BookingType
    vehicleId:string
    status:BookingStatus
  


}
export interface InTransit {
    vehicleStatus:VehicleStatus
    vehicleId:string
    route:string
    schedule:string
    travelDate:string
    type:BookingType
    service:BOOK

}
export interface GetBookingWithVehicle{
     travelDate:string
     schedule:string
     tripId:string
     vehicle:string
     service:string
     type:string
}
export interface updateBooking {
    travelDate:string
    referenceId:string
   
}
export interface vehicleStatus{
  
    status:VehicleStatus,
    id:string,
    routeId:string
}

export interface bookingStatus{
    id:string,
     
}
export interface passengerStatus {
    trip:string,
    route:string,
    schedule:string

}