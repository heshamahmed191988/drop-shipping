import { Injectable } from '@angular/core';
import { IcreatrOrder } from '../models/icreatr-order';
import { Iproduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  ordertype:number = 0;

  selectedSliderPrice: number = 0;
  earning: number = 0;
  quantity: number = 1;
  userId: string = "";
  addressId: number = 0;
  currentId: number = 0;
  orderErrorMessage: string = '';

  isOrderProcessing: boolean = false;
  isCreatingOrder: boolean = false;
  public order: IcreatrOrder = {
    userID: '',
    orderQuantities: [],
    addressId: 0,
    deliveryPrice:5000,
    earning:20,
    selectedPrice:0,

  };
//cart part
  UserIdcart: string = "";
  public product: Iproduct[] = [];
  selectedPrices: number[] = [];


  constructor() { }

  updateOrderData(data: any) {
    this.selectedSliderPrice = data.selectedSliderPrice;
    this.earning = data.earning;
    this.quantity = data.quantity;
    this.userId = data.userId;
    this.addressId = data.addressId;
    this.currentId = data.currentId;
    this.orderErrorMessage = data.orderErrorMessage;
    this.isOrderProcessing = data.isOrderProcessing;
    this.isCreatingOrder = data.isCreatingOrder;
    this.order.userID=data.userID;
    this.order.orderQuantities=data.orderQuantities;
    this.order.addressId=data.addressId;
    this.order.deliveryPrice=data.deliveryPrice;
    this.order.earning=data.earning;
    this.order.selectedPrice=data.selectedPrice;

    /////cart part
    this.UserIdcart = data.UserIdcart;
    this.product = data.product;
    this.selectedPrices = data.selectedPrices;
    this.ordertype=data.orderType;
  }

  getOrderData() {
    return {
      selectedSliderPrice: this.selectedSliderPrice,
      earning: this.earning,
      quantity: this.quantity,
      userId: this.userId,
      addressId: this.addressId,
      currentId: this.currentId,
      orderErrorMessage: this.orderErrorMessage,
      isOrderProcessing: this.isOrderProcessing,
      isCreatingOrder: this.isCreatingOrder,
      userID: this.order.userID,
      orderQuantities: this.order.orderQuantities,
      AddressId: this.order.addressId,
      deliveryPrice: this.order.deliveryPrice,
      Earning: this.order.earning,
      selectedPrice: this.order.selectedPrice,
      //cart part
      UserIdcart: this.UserIdcart,
      product: this.product,
      selectedPrices: this.selectedPrices,
      ordertype:this.ordertype,

    }
  }
  resetProductOrderData(data: any) {
    this.selectedSliderPrice =data.selectedPrice=0;
    this.earning =data.earning= 0;
    this.quantity =data.quantity= 1;
    this.userId =data.userId= "";
    this.addressId =data.addressId= 0;
    this.currentId =data.currentId= 0;
    this.orderErrorMessage =data.orderErrorMessage = '';

    this.isOrderProcessing =data.isOrderProcessing= false;
    this.isCreatingOrder =data.isCreatingOrder= false;
    this.order = {
      userID: '',
      orderQuantities: [],
      addressId: 0,
      deliveryPrice: 5000,
      earning: 20,
      selectedPrice: 0,
    };

    //cart part
   
  }

  resetcartOrderData(data: any) {
    this.UserIdcart =data.UserIdcart= "";
    this.product =data.product= [];
    this.selectedPrices =data.selectedPrices= [];
    this.ordertype=data.ordertype=0;
  }


}
