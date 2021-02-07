// import{HttpStatusCode} from'../../enums'
import {BaseController} from '../baseController'
// import{TripService} from './tService'
import {addAvailability, searchTrip} from './tInterface'



export class TripController extends BaseController{

    // private service = new TripService()


    public createTrip = async (tripData:addAvailability) =>{
        // const trip = await this.service.createTrip(tripData)
        // return this.sendResponse({data:trip, statusCode:HttpStatusCode.CREATED})
    }

    public searchTrip = async(tripData:searchTrip) =>{
        // const trip = await this.service.searchTrips(tripData)
        // return this.sendResponse({data:trip, statusCode:HttpStatusCode.OK})
    }
}