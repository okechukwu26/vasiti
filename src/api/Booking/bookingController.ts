import {BaseController} from '../baseController'
import{BookingService} from './bookingService'
import {HttpStatusCode,} from '../../enums'
import {addBooking, AssignBus, GetBookingWithVehicle, InTransit, updateBooking, vehicleStatus,bookingStatus, passengerStatus, searchBooking, manifest} from './bookingInterface'
import {Users} from '../User'

export class BookingControler extends BaseController{
    private service = new BookingService()

    //CUSTOMER BOOKING
    public BookATrip = async (bookingData:addBooking, user:Users) =>{
        const data = await this.service.BookATrip(bookingData, user)
        return this.sendResponse({data:data, statusCode:HttpStatusCode.CREATED})

    }
    //get ref
    public Reference = async(id, user:Users) =>{
        const data = await this.service.Reference(id, user)
        return this.sendResponse({data,statusCode:HttpStatusCode.OK })

    }
    //searchBooking
    public searchBooking = async(search:searchBooking, user:Users)=>{
        const data = await this.service.SearchBooking(search,user)
        return this.sendResponse({data:data, statusCode:HttpStatusCode.OK})
    }
    //USER BOOKING
    public UserBooking = async (bookingData:addBooking, user:Users) =>{
        const data = await this.service.UserBooking(bookingData,user)
        return this.sendResponse({data, statusCode:HttpStatusCode.CREATED})
    }
    public UnAuthBooking = async (bookingData:addBooking) =>{
        const data = await this.service.BookATrip(bookingData)
        return this.sendResponse({data, message:"booking successfull", statusCode:HttpStatusCode.OK})
    }
    public AssignBus = async(bookingData:AssignBus, user:Users) =>{
        const bus = await this.service.assignus(bookingData, user)

        return this.sendResponse({data:bus, message:"vehicle assigned", statusCode:HttpStatusCode.CREATED})
    }
    public GetBookingWithVehicles = async (bookingData:GetBookingWithVehicle, user:Users) =>{
        const booking = await this.service.GetBookingWithVehicles(bookingData,user)
        return this.sendResponse({ data:booking, message:"fetched", statusCode : HttpStatusCode.OK})
    }
    public updateBookingStatus = async (update:updateBooking, user:Users) =>{
        const status = await this.service.updataBookingStatus(update, user)
        return this.sendResponse({data:status, message:"booking updated", statusCode:HttpStatusCode.OK})
    }
    public vehicleStatus =async( vehicleStatus:vehicleStatus, user:Users) =>{

        const vehicle = await this.service.vehicleArrived(vehicleStatus, user)

        return this.sendResponse({data:vehicle, message:"vehicle status updated", statusCode:HttpStatusCode.OK})
    }
    public InTransitVehicle = async (transitData:InTransit, user:Users) =>{
        const transit = await this.service.InTransit(transitData,user)
        return this.sendResponse({data:transit})
    }
    public changeToDelay = async(bookingData:bookingStatus, user:Users) =>{

        const data = await this.service.changeToDelay(bookingData, user)

        return this.sendResponse({data})

    }
    public changePassengerTrip = async (bookingData:passengerStatus) =>{

        const status = await this.service.changePassengerStatus(bookingData)
        return this.sendResponse({data:status})
        
    }
    public printManifest = async(manifest:manifest,user:Users) =>{
        const vehicle = await this.service.PrintManifest(manifest, user)
        return this.sendResponse({data:vehicle, statusCode:HttpStatusCode.OK})
    }
}
