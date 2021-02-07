import express from 'express'
import {controlHandler} from '../../utils'
import {StateController} from './stateController'
import {authorize} from '../../middleware'


const router = express.Router()
const call = controlHandler;
const States = new StateController()

router.post('/', authorize, call(States.createState, (req, res) =>[req.body, req.user]))
router.get('/', authorize, call(States.getState, (req, res) =>[req.user]))

export const stateRouter = router