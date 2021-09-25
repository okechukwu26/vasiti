
//import {Varieties} from '../Varieties'
export interface CreateProduct {
    product_name:string
    product_description:string,
    price:string,
    size:string,
    quantity:string,
    color:string,
    product_variable:[{}]
 



}
export interface updateProduct{
    product_name:string
    product_description:string,

}
export interface updateVarieties{
    price:string,
    size:string,
    quantity:string,
    color:string,
    image:string[]

}