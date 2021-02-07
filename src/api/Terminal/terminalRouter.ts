import express from 'express'
import {TerminalController} from './terminalController'
import {authorize, validation } from '../../middleware'
import {terminalValidationSchema} from './terminalValidator'
import {controlHandler} from '../../utils'


const router = express.Router()
const call = controlHandler
router.use(validation(terminalValidationSchema))
const terminal = new TerminalController()



router.post('/', authorize, call(terminal.createTerminal, (req, res) => [req.body, req.user]))
router.delete('/delete/:id', authorize, call(terminal.deleteTerminal, (req, res) =>[req.params.id, req.user]))
router.get('/',  call(terminal.getTerminal, (req,res) =>[]))
export const TerminalRouter = router