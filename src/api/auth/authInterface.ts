export interface addCustomer {
    role:string,
    name:string,
    phoneNumber:string,
    email:string,
    password:string
    terminal?: string
    priviledges:string[]
    gender:string

}
export interface assignPriviledge {
  
   priviledge:string[]
    
}
export interface login {
    phoneNumber:string,
    password:string
}