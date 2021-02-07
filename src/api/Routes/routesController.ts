import {RoutesService} from './routesService'
import {BaseController} from '../baseController'
import {AddRoutes, getRoute} from './routesInterface'
import {HttpStatusCode} from '../../enums'

export class RoutesController extends BaseController{

    private services = new RoutesService()

    public createRoute = async (routeData:AddRoutes) =>{
        const data =  await this.services.createRoutes(routeData)
        return this.sendResponse({data:data, statusCode:HttpStatusCode.CREATED})
    }
    public searchRoute = async (routeData:getRoute) =>{
        const data = await this.services.searchRoute(routeData)
        return this.sendResponse({data, statusCode:HttpStatusCode.OK})
    }
}