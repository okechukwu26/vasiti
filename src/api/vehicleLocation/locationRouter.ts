import {controlHandler} from '../../utils'
import express from 'express'
import {locationController} from './locationController'

const router = express.Router()
const call = controlHandler
const control = new locationController()



router.get('/', call(control.getLocation, (req,res) =>[req.body]))





export const locationRouter = router




