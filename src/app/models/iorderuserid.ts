export interface Iorderuserid {
    
    id:number
    userID:string
    datePlaced:string
    totalPrice:number
    status:string
    addressId?:number
    barcodeImageUrl: string;
    street?:string
    city?:string
    state?:string
    zipCode?:string

}