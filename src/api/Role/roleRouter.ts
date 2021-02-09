import express from 'express'
import {controlHandler} from '../../utils'
import {RoleController} from './roleController'
import {validation} from '../../middleware'
import {RoleValidationSchema} from './roleValidator'




const router = express.Router()
const call = controlHandler
const control = new RoleController()

router.use(validation(RoleValidationSchema))



router.post('/', call(control.creatRole, (req, res) => [req.body]))
router.get('/', call(control.getRole, (req,res) => []))




export const RoleRouter = router