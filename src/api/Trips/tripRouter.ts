import express, {Request} from 'express'
import {TripController} from './tripController'
import {controlHandler} from '../../utils'
import {validation} from '../../middleware'
import {TripUpdateSchema, TripSearch, TripValidationSchema} from './tripValidator'
import {authorize} from '../../middleware'



const router = express.Router()
const call = controlHandler
const control = new TripController()


router.post('/', authorize,  validation(TripValidationSchema), call(control.createTrip, (req,res) => [req.body, req.user]))
router.get('/search',  validation(TripSearch), call(control.searchTrip, (req:Request, res) => [req.query, req.body]))
router.put('/:id', authorize, validation(TripUpdateSchema), call(control.updateTrip, (req:Request,res) => [ req.params.id,req.body, req.user]))
 router.put('/day/:id', authorize,  call(control.updateDay, (req:Request,res) => [ req.params.id,req.body, req.user]))
 router.delete('/:id', authorize, call(control.deleteDays, (req:Request,res) => [ req.params.id, req.user]))
    router.get('/', call(control.getTrip, (req,res) =>[]) )

export const TripRouter = router
