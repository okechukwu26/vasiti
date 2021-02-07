import express from 'express'
import {UserController} from './UserController'

import {controlHandler} from '../../utils'


const router = express.Router()
const control = new UserController()
const call = controlHandler


router.put('/block',  call(control.updateUser, (req, res) =>[req.body, req.user]))
router.put('/unblock', call(control.unblock, (req,res) => [req.body, req.user]))





export const userRouter = router
