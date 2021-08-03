import express from 'express'
import {controlHandler} from '../../utils'
import {VehicelController} from './vehicleController'

const router = express.Router()
const call = controlHandler
const control = new VehicelController()

router.post('/', call(control.createVehicle, (req, res) => [req.body]))
router.get('/', call(control.getVehicle, (req,res) =>[]))

export const VehicleRouter = router