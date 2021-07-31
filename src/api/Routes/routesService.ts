import {Terminals} from '../Terminal'
import {Routes} from './routesModel'
import {AddRoutes, getRoute} from './routesInterface'
import {AppError } from '../../utils'


export class RoutesService {
    public createRoutes = async ( routeData:AddRoutes) =>{
       const terminal = await Terminals.findOneOrFail({id:routeData.terminalId})
        .catch(() =>{
            throw new AppError("invalid terminal selected")
        })
     
        const arrival = await Terminals.findOne({name: routeData.arrivalName})
        if(!arrival){
            throw new AppError('invalid arrival route name selected')
        }
        const exroute = await Routes.findOne({where:[{
            route:routeData.route,
            terminal:routeData.terminalId
        }]})
        console.log(exroute, terminal)
        if(exroute){
            throw new AppError('route name already exists')
        }

        const newRoute = Routes.create(routeData)
        newRoute.route = arrival.name
        newRoute.Terminal= terminal.name
        newRoute.arrivalId = arrival.id
        newRoute.type = routeData.type
        newRoute.terminal=terminal
        newRoute.arrivalTerminal =arrival
        return await newRoute.save()

       






        // const exroute = await Routes.findOne({ name: routeData.name})
        // if(exroute){
        //     throw new AppError('routes already exists')
        // }
        // const route = Routes.create(routeData)
        // route.terminal =terminal
        // await route.save()
        // return route

    }
    public searchRoute = async (routeData:getRoute) =>{
        const terminal= await Terminals.findOneOrFail({id:routeData.terminalId})
        .catch(() =>{
            throw new AppError('invalid terminal selected')
        })
        const route = await Routes.find({where:[{
            Terminal:routeData.Terminal,
            terminal:terminal.id
        }]})
        if(!route){
           return "No routes exists for this terminal"

        }
        return route
       
    }
}