import express from  'express'
import {controlHandler} from '../../utils'
import {LgaController} from './lgaController'
import {lgaValidationSchema} from './lgaValidator'
import {validation,} from '../../middleware'


const router = express.Router()
const call = controlHandler
const Lga = new LgaController()

router.use(validation(lgaValidationSchema))

router.post('/',  call( Lga.createLga, (req,res) =>[req.body, req.user]))
router.get('/', call(Lga.getLga, (req,res) => [req.user]))



export const LgaRouter =router