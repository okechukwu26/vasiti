import express from 'express'
import {controlHandler} from '../../utils'
import {VehicleTypeController} from './vehicleTypeController'
import {VehicleTypesValidationSchema} from './vehicleTypeValidator'
import {validation} from '../../middleware'


const router = express.Router()
const call = controlHandler
const control = new VehicleTypeController()
router.use(validation(VehicleTypesValidationSchema))

router.post('/', call(control.createVehicleType, (req,res) =>[req.body]))
router.get("/", call(control.getVehicleType, (req,res) =>[]))

export const VehicleTypeRouter = router