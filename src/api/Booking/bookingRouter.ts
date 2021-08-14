import {BookingControler} from './bookingController'
import {controlHandler} from '../../utils'
import express, {Request} from 'express'
import{authorize,validation} from '../../middleware'

import {createBookingSchema} from './bookingValidator'


const router = express.Router()
const call = controlHandler
const control = new BookingControler()


    //customer  booking
router.post('/', authorize, validation(createBookingSchema), call(control.BookATrip, (req,res) => [req.body, req.user]))
    //user booking
router.post('/user', authorize,  validation(createBookingSchema), call(control.UserBooking, (req,res) =>[req.body, req.user]))
//getRefence
router.get('/ref', authorize, call(control.Reference, (req:Request,res) => [req.query, req.user]))        
//searchBooking
router.get('/search', authorize, call(control.searchBooking, (req,res) => [req.body, req.user]))    
//assign bus to a booking
router.put('/',  authorize, call(control.AssignBus, (req, res) => [req.body, req.user]))
router.get('/', authorize, call(control.GetBookingWithVehicles, (req, res) =>[req.body, req.user]))
router.put('/status', authorize, call(control.updateBookingStatus, (req, res) => [req.body, req.user]))
router.put('/vehicleStatus',  call(control.vehicleStatus, (req, res) => [req.body, req.user]))
router.post('/unauth', validation(createBookingSchema), call(control.UnAuthBooking, (req,res) => [req.body]))
router.post('/transit', authorize, call(control.InTransitVehicle, (req,res) =>[req.body, req.user]))
router.put('/delay', authorize, call(control.changeToDelay, (req, res) =>[req.body, req.user]))
router.post('/trip', call(control.changePassengerTrip, (req,res) =>[req.body]))
// print manifest
router.post('/manifest', authorize,  call(control.printManifest, (req,res) => [req.body, req.user]))

export const BookingRouter = router