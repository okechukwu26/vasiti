import express  from "express"
import {controlHandler} from '../../utils'
import { ProductController } from "./productController"
import multer from "multer"
import path from "path"



const router = express.Router()
const call = controlHandler
const control = new ProductController()

const storage = multer.diskStorage({
    destination:"./src/image",
    filename:(req,file, cb) =>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage
})

router.post("/", upload.single("image"),  call(control.CreateProduct,  (req,res) =>[req.file, req.body]))
router.delete("/", call(control.DeleteVarieties, (req,res) => [req.body]))
router.put("/:id", call(control.UpdateProduct,(req,res) => [req.params.id, req.body]) )
router.put('/varieties/:id', call(control.UpdateVarieties, (req, res) => [req.params.id, req.body]))
router.get("/", call(control.GetProduct, (req,res) => []))
export const productRouter =  router