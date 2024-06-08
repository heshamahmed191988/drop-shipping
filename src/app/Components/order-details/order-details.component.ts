import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Iorderdetails } from '../../models/iorderdetails';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Iproduct } from '../../models/iproduct';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [FormsModule,CommonModule,TranslateModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  orderid:number=1;
  orderdetails:Iorderdetails[]= []
  lang: string = 'en';

  constructor(private route: ActivatedRoute,private _OrderServices:OrderService)
  {

  }
  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.route.params.subscribe(params => {
      const orderid = params['orderid'];
      this.orderid = params['orderid'];
      console.log('Order ID:', this.orderid);
    });
    this._OrderServices.getorderdetails(this.orderid).subscribe(res =>{
      this.orderdetails = res
      console.log(this.orderdetails)
  })
  }


  getProductName(product: Iproduct): string {
    return this.lang === 'en' ? product.nameEn : product.nameAr;
  }

  getProductDescription(product: Iproduct): string {
    return this.lang === 'en' ? product.descriptionEn : product.descriptionAr;
  }

  getBrandName(product: Iproduct): string {
    return this.lang === 'en' ? product.brandNameEn : product.brandNameAr;
  }

  
}
