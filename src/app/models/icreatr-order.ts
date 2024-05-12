export interface IcreatrOrder {
    userID: string,
    orderQuantities: { quantity: number, productID: number , unitAmount: number }[],
    addressId?:number;
    deliveryPrice?:number
    earning?:number;
}