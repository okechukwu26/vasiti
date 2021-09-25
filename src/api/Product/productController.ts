import {BaseController} from '../baseController'
// import { CreateProduct } from './productInterface'
import {ProductService} from "./productService"

export class ProductController extends BaseController {
    private service = new ProductService()

        CreateProduct = async(product, file) =>{
            const data =  await this.service.CreateNewProduct(product, file)
            return this.sendResponse({data,})
        }

        DeleteVarieties = async(id) =>{
            const data = await this.service.DeleteVarieties(id)
            return this.sendResponse({data})
        }
        UpdateProduct = async (id, product) =>{
            const data = await this.service.UpdateProduct(id, product)
            return this.sendResponse({data})
        }
        UpdateVarieties = async (id, varieties) =>{
            const data  = await this.service.UpdateVarieties(id, varieties)
            return this.sendResponse({data})
        }
        GetProduct = async () =>{
            const data = await this.service.GetProduct()
            return this.sendResponse({data})
        }
    
}