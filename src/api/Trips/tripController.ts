import {BaseController} from '../baseController'
import {TripService} from './tripService'
import {HttpStatusCode} from '../../enums'
import{AddTrip, searchTrips,updateTrips, updateDay} from './tripInterface'
import {Users} from '../User'


export class TripController extends BaseController{
    private services = new TripService()

    public createTrip = async (tripData:AddTrip, user:Users) =>{
        const data =  await this.services.createTrip(tripData, user)
        return this.sendResponse({data:data, statusCode: HttpStatusCode.CREATED})
    }
    public searchTrip = async (tripData: searchTrips) =>{
        const data = await this.services.searchTrip(tripData)
        return this.sendResponse({data:data, statusCode:HttpStatusCode.OK})

    }
    public updateTrip = async (id:string,trip:updateTrips, user:Users) =>{
        const trips = await this.services.updateTrip(id,trip, user)
        return this.sendResponse({data:trips, message:"trip updated", statusCode:HttpStatusCode.OK})
    }
    public updateDay =async (id:string, day:updateDay, user:Users) =>{
        const data = await this.services.updateDay(id, day, user)
        return this.sendResponse({data, statusCode:HttpStatusCode.OK})
    }
    public deleteDays = async(id:string,  user:Users) =>{
        const data = await this.services.deleteDay(id,user)
        return this.sendResponse({data, statusCode:HttpStatusCode.OK})
    }
    public getTrip = async () => {
        const data = await this.services.getTrip()

        return this.sendResponse({data, statusCode:HttpStatusCode.OK})
    }
}