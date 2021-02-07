import express from 'express'
import {CaptainController} from './captainController'
import {controlHandler} from '../../utils'
import {authorize} from '../../middleware'

const router = express.Router()
const call = controlHandler
const control = new CaptainController()

router.get('/', authorize, call(control.getCaptainFee, (req, res)=>[req.body, req.user]))


export const CaptainRouter = router


