import express from 'express'
import {controlHandler} from '../../utils'
import {AuthController} from './authController'
// import {authorize} from '../../middleware'

const router = express.Router()
const call = controlHandler
const control = new AuthController()


router.post('/signup/customer', call(control.createCustomer, (req, res) => [req.body]))
 router.post('/remove/:id', call(control.removePriviledge, (req,res) => [ req.params.id,req.body,]) )
 router.post('/login/customer', call(control.loginCustomer, (req,res) => [req.body]))
 router.post('/loginUsers', call(control.loginUser, (req,res) => [req.body]))
 router.post('/signup/user', call(control.createUser, (req,res) =>[req.body]))
 router.post('/assign/:id', call(control.assignPriviledge, (req,res) => [req.params.id, req.body]))
//  router.delete()   


export const AuthRouter = router