export interface Iorderdetails {
    userID:string
    orderitemid:number
    datePlaced:string
    totalPrice:number
    status:string
    quantity:number
    productname:string
    productid:number
    orderid:number
    addressId?:number
    productImage?:string
    productDescription?:string
    productPrice?:number
    barcodeImageUrl: string;
    selectedPrice?:number;

}