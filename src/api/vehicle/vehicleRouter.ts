import express from 'express'
import { authorize } from '../../middleware'
import {controlHandler} from '../../utils'
import {VehicelController} from './vehicleController'

const router = express.Router()
const call = controlHandler
const control = new VehicelController()

router.post('/', call(control.createVehicle, (req, res) => [req.body]))
router.get('/', call(control.getVehicle, (req,res) =>[]))
router.put('/:id', authorize, call(control.changeVehicleStatus, (req,res) => [req.params.id,req.body, req.user]))

export const VehicleRouter = router