import{VehicleFeatureController} from './vehicleFeatureController'
import {vehiclesFeaturesValidationSchema} from './vehicleFeatureValidator'
import {controlHandler} from '../../utils'
import express from 'express'
import {validation} from '../../middleware'


const router = express.Router()
const call = controlHandler
const control = new VehicleFeatureController()

router.use(validation(vehiclesFeaturesValidationSchema))

router.post('/', call(control.createFeature, (req,res) => [req.body]))
router.patch('/:id', call(control.updateFeature, (req, res) => [req.params.id, req.body]))


export const VehicleFeatureRouter = router