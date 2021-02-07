export interface AddTrip{
    routeId:string,
    schedule:string,
    typeId:string
    price:number
    day:Array<string>
    


}
export interface searchTrips {
    routeId:string
   travelDate:string
    


}
export interface updateTrips {
   
    price?:string,
    schedule?:string
}

export interface updateDay{


    day:Array<string>
}
