import express from 'express'
import {PriviledgeController} from './priviledgeController'
import {controlHandler} from '../../utils'



const router = express.Router()
const call = controlHandler
const control = new PriviledgeController()


router.post('/', call(control.createPriviledge, (req,res) => [req.body]))



export const PriviledgeRouter = router