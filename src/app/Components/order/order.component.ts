import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from '../products/products.component';
import { Iorderuserid } from '../../models/iorderuserid';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Iorderdetails } from '../../models/iorderdetails';
import{ IUpdateOrder } from '../../models/iupdate-order'
import { Iproduct } from '../../models/iproduct';
import { IcreatrOrder } from '../../models/icreatr-order';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AnimationService } from '../../services/animation.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SafeBase64Pipe } from '../../pipes/safe-base64.pipe';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent,NgxSpinnerModule,TranslateModule,SafeBase64Pipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
  
})
export class OrderComponent implements OnInit{
  public currentProduct: Iproduct | undefined;
  public order: IcreatrOrder = { userID: "", orderQuantities: [],addressId:0};
  adressId:number = 0;
  searchTerm: string = '';
  filteredOrders: Iorderuserid[] = [];

   orders: Iorderuserid[] = []
   orderdetails:Iorderdetails[]= []
  public updateorder:IUpdateOrder ={orderId:1,productId:1,quantity:1,orderItemId:1,totalPrice:1}
  UserId:string = ""
  // 82b5b776-9a7a-4556-99e6-983e9509064d
constructor(private _OrderService:OrderService,private _AuthService:AuthService,private animationService:AnimationService,private router: Router)
{

}

ngOnInit(): void {
  this.animationService.openspinner();
    this.setUserid();
  }
setUserid() {
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.UserId = user.userId
      console.log(this.UserId)
      
      this._OrderService.getOrerByUserId(this.UserId).subscribe({
        next:(res)=>{
          this.orders = res;
          this.filteredOrders=res;
        },
        error:(err)=>{
          console.log(err)
        }
      })
      this.getaddressidbyuserid(this.UserId);
    })
  }
  details(orderid: number) {

    this.router.navigate(['/OrderDetails', orderid]);
  }
  updateQuantity(orderupdate: Iorderdetails, quantity: string) {
    this.updateorder.productId = orderupdate.productid;
    this.updateorder.quantity = Number(quantity);
    this.updateorder.orderId = orderupdate.orderid;
    this.updateorder.orderItemId = orderupdate.orderitemid;
    
    this._OrderService.updateOrder(this.updateorder).subscribe({
      next: (res) => {
        console.log(res);
        // Refetch order details to reflect changes
        this.details(this.updateorder.orderId);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this._OrderService.deleteOrder(orderId).subscribe(
        response => {
          if (response) {
            alert('Order deleted successfully.');
            // Remove the order from the local list
            this.orders = this.orders.filter(order => order.id !== orderId);
            this.filteredOrders = this.filteredOrders.filter(order => order.id !== orderId);
          } else {
            alert('Failed to delete order: ' + response.Message);
          }
        },
        error => {
          console.error('Error deleting order:', error);
          alert('An error occurred while deleting the order.');
        }
      );
    }
  }
  


//   delete(id:number){
//     this._OrderService.DeleteOrder(id).subscribe(
//      {
//        next:(res)=>{
//          console.log("deleted successfully");
//        },
//        error:(err)=>{
//          console.log(err);
//        }
// })}

getaddressidbyuserid(userid: string) {
  if (!userid) return;

  this._AuthService.GetAddressIdByUserId(userid).subscribe({
    next: (data) => {
      // Assuming 'data' correctly represents the address ID you need
      this.adressId = +data; // Correctly update adressId with the received data
      this.order.addressId = this.adressId; // Now update the order with the correct address ID
    },
    error: (error) => console.log(error)
  });
}
searchByOrderStatus() {
  if(!this.searchTerm.trim()){
    this.filteredOrders = [...this.orders];;
  }
  else{
  this.filteredOrders = this.orders.filter(order => order.status.toLowerCase() === this.searchTerm.toLowerCase());
  }
}
}

