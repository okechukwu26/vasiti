import {CreateProduct, updateProduct, updateVarieties} from "./productInterface"
//import {VarietiesController} from "../Varieties/variantController"
import {Products} from "./productModel"

 import { AppError } from '../../utils';



export class ProductService {

    CreateNewProduct = async (product, file:CreateProduct) =>{
      
        try {
            const body = JSON.stringify(file)
            const data = JSON.parse(body)
            if(data.description === "" || data.name === ""){
                throw new AppError("invalid data")
            }
       
            console.log(file,data)
        const newProduct = Products.create(file)
        newProduct.product_variables=[{"image":[product.filename],"price":file.price, "quantity":file.quantity,"size":file.size,"color":file.color}]
        

            return await newProduct.save()

            
            

            
            
            // return await newProduct[0].save()
                
                
            
            
        } catch (error) {
            throw new AppError(error )
            
            
        }

            


    }

    DeleteVarieties = async (id) =>{
        console.log(id)
        const product = await Products.findOneOrFail({where:[{
            id:id.id
        }]}).catch((err) =>{
            throw new AppError("invalid product selected")
        })

            try {

               product.product_variables= [{}]
               await product.save()
               return "Variety deleted"

                
            } catch (error) {
                throw new AppError(error)
                
            }

    }
    UpdateProduct = async (id, updateData:updateProduct) => {
        console.log(id);
        
       
        try {
            const product = await Products.findOneOrFail({where:[{
                id:id
            }]}).catch((err) =>{
                throw new AppError("invalid product selected")
            })
            const updates = Object.keys(updateData)
            //const value = Object.values(updateData)
            const allowed = ["product_name","product_description",]
            const isAllowed = updates.every(item => allowed.includes(item))
            if(!isAllowed){
                throw new AppError("invalid update")
            }

            
            updates.forEach(item => product[item] = updateData[item])

          
                return await product.save()
                


            
            
            
        } catch (error) {
            throw new AppError(error)
            
        }


    }
    UpdateVarieties = async (id, updateData:updateVarieties) => {


        try {
            const product = await Products.findOneOrFail({id}).catch(() =>{
                throw new AppError("invalid product id")
            } )
            const updates = Object.keys(updateData)
            const allowed = ["price", "quantity",  "color", "price"]
            const isAllowed = updates.every(item => allowed.includes(item))

            if(!isAllowed){
                throw new AppError("invalid updates")
            }

            updates.forEach(item => product.product_variables[item] = updateData[item])
            console.log(product);
            
            
        } catch (error) {
            throw new AppError(error)
            
        }



    }
}