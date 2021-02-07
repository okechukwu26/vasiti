
import {VehicleStatus} from '../../enums'
import{Vehicles} from '../vehicle'

export interface vehicleLocate {
    location:string
    left:string
    headingTo:string
    status:VehicleStatus
    vehicle:Vehicles
}