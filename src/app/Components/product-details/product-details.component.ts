import { Component, EventEmitter, OnChanges, OnInit, SimpleChanges, input, output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { ProductStateService } from '../../services/product-state.service';
import { ReviewComponent } from '../review/review.component';
import { SafeBase64Pipe } from '../../pipes/safe-base64.pipe';
import { Observable } from 'rxjs';
//paypal
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaypalService } from '../../services/paypal.service';
import { IcreatrOrder } from '../../models/icreatr-order';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ICartService } from '../../services/icart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AddressSharedService } from '../../services/address-shared.service';
import { ReviewService } from '../../services/review.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AnimationService } from '../../services/animation.service';
import { OrderService } from '../../services/order.service';
@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule,FormsModule, ReviewComponent,SafeBase64Pipe,TranslateModule,NgxPayPalModule,FormsModule,RouterLink,NgxSpinnerModule]
})
export class ProductDetailsComponent implements OnInit {
  selectedSliderPrice: number = 0;

  public Quantity: number = 1;
  public UserId: string = "";
  // "82b5b776-9a7a-4556-99e6-983e9509064d;
  adressId:number = 0;
  isOrderProcessing: boolean = false;
orderErrorMessage: string = '';
  ProductQuantity: number= 1;
  mainImageUrl!: string ; 
  randomProducts: Iproduct[] = [];
  Products: Iproduct[] = [];
  public order: IcreatrOrder = {
    userID: '',
    orderQuantities: [],
    addressId: 0,
    deliveryPrice:5000

  };
  isCreatingOrder: boolean = false;
  
    public total: number = 0
  lang: string = 'en';
  //  selectedCategoryId = Math.floor(Math.random() * 10) + 1;
  selectedCategoryId: number =0;
  public isAddressSubmitted: boolean = true;
  public pageNumber: number = 1;
  public pageSize: number =3;
  reviewlength: number =0;
  
  public currentProduct: Iproduct = {
    id: 0,
    itemscolor: [],
    productimages: [],
    nameAr: '',
    nameEn: '',
    brandNameAr: '',
    brandNameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    colors: [],
    itemimages: [],
    productDescription: '',
    price: 0,
    rating:0,
    categoryNameEn:'',
    categoryNameAr:'',
    maxPrice:0,
    minPrice:0
  };

  payPalConfig: IPayPalConfig | undefined;
  currentId: number = 0;
  constructor(private activatedrouter: ActivatedRoute
    , private location: Location, private route: Router,
    private _ProductServiceService: ProductServiceService,
    private _PaypalService: PaypalService,
     private _AuthService: AuthService,
     private _Cart:ICartService,
     private translate: TranslateService,
     private productStateService: ProductStateService
     ,private router:Router,private addressshared:AddressSharedService,
     private reviewService: ReviewService,
     private spinner:NgxSpinnerService,
     private animationService: AnimationService,
    private orderservice: OrderService) {
    this.setUserid();
    
        this._PaypalService.updateOrderData.subscribe({
      next: (data) => {

        this.order.userID = this.UserId;
        this.order.orderQuantities = [];
        this.order.addressId=this.adressId;

        this.order.orderQuantities.push({
          quantity: this.Quantity,
          productID: this.currentId,
          unitAmount: Number(this.currentProduct.price)
        });
        this._PaypalService.create = this.order;

      }
    })
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.animationService.openspinner();
    this.fetchReviews();

    this.activatedrouter.paramMap.subscribe((paramMap) => {
      this.currentId = Number(paramMap.get('id'));
      this.selectedCategoryId = Number(paramMap.get('selectedCategoryId'));
      this._ProductServiceService.getProductById(this.currentId).subscribe({
          next: (res) => {
              this.currentProduct = res;
              // Ensure 'mainImageUrl' is set here after 'currentProduct' is updated
              if (this.currentProduct.productimages && this.currentProduct.productimages.length > 0) {
                  this.mainImageUrl = this.currentProduct.productimages[0];
              } else {
                  // Optionally, set a placeholder image if no images are available
                  this.mainImageUrl = 'path/to/your/placeholder/image.jpg';
              }
              this.fetchReviews();
              this.productStateService.changeProductId(this.currentId); // Update product ID state
          },
          error: (err) => console.log(err)
      });
  });


    this.lang = localStorage.getItem('lang') || 'en'; // Initialize language from localStorage
    this.translate.use(this.lang);
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(langChangeEvent => {
      this.lang = langChangeEvent.lang;
    });

    //paypal
    //this._PaypalService.initConfig();
    this.addressshared.addressSubmitted$.subscribe(submitted => {
      this.isAddressSubmitted = submitted;
    });

    // this.activatedrouter.paramMap.subscribe((paramMap) => {
    //   this.currentId = Number(paramMap.get('id'));
    //   this._ProductServiceService.getProductById(this.currentId).subscribe({
    //     next: (res) => {
    //       this.currentProduct = res;
    //       // console.log(this.currentProduct.productimages[0])
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     }
    //   });
    // });
    this.activatedrouter.paramMap.subscribe((paramMap) => {
      this.currentId = Number(paramMap.get('id'));
      this._ProductServiceService.getProductById(this.currentId).subscribe({
        next: (res) => {
          this.currentProduct = res;
          this.fetchReviews();
          this.RandomProducts();
          this.productStateService.changeProductId(this.currentId);
          this.ProductQuantity = this.currentProduct.stockQuantity as number; // Update product ID state
        },
        error: (err) => console.log(err)
      });
    });
    this.fetchReviews();

    // this.setUserid()
   // this.payPalConfig = this._PaypalService.payPalConfig;
  }
  // addToOrder(currentProduct:Iproduct){
  //   this._Cart.addtoOrder(currentProduct);
  // }  
  onPriceChange(event: any) {
    this.selectedSliderPrice = event.target.value;
  }

  createOrder(): void {
    // Assuming you have already populated the order details, add the logic to send the order to the server
    // You can use the OrderService to send the order data
    this.isOrderProcessing = true;
    this.isCreatingOrder = true;
    // Update order data
    this.order.userID = this.UserId;
    this.order.addressId = this.adressId; // Assuming addressId is set elsewhere



    // Prepare order data
    const orderData = {
        userID: this.order.userID,
        orderQuantities: this.order.orderQuantities.map(item => ({
          quantity: this.Quantity,
          productID: this.currentId,
          unitAmount: Number(this.selectedSliderPrice)
        })),
        addressId: this.order.addressId,
        deliveryPrice: this.order.deliveryPrice // Assuming deliveryPrice is set elsewhere
    };

    // Send order data to the server
    this.orderservice.CreateOrder(orderData).subscribe(
        (response) => {
            // Handle success response
           // console.log('Order created successfully:', response);
            // Optionally, reset the order or perform any other actions
            this.isOrderProcessing = false;

            this.resetOrder();
        },
        (error) => {
            // Handle error response
            //console.error('Error creating order:', error);
            // Optionally, reset the order or perform any other error handling
            this.resetOrder();
            this.orderErrorMessage = 'There was a problem creating the order. Please try again.';

        }).add(() => {
          this.isOrderProcessing = false;
          this.router.navigateByUrl('/Order');

      });
    
}
  resetOrder(): void {
    this.order = {
      userID: '',
      orderQuantities: [],
      addressId: 0,
    };
    this.orderErrorMessage = '';
    this.isOrderProcessing = false;
    this.isCreatingOrder = false;
  }
  updateMainImage(image: string) {
    this.mainImageUrl = image;
}
  addToCart(product: Iproduct, quantity: number) {
    this._Cart.addtoOrder(product, quantity);
  }
  fetchReviews() {
    this.reviewService.getReviewsByProductId(this.currentProduct.id!).subscribe({
      next: (reviews) => {
        if (reviews && reviews.length > 0) {
          let totalRating = 0;
          for (let review of reviews) {
            totalRating += review.rating || 0;
          }
          this.currentProduct.rating = totalRating / reviews.length;
          this.reviewlength=reviews.length;//new
        } else {
          this.currentProduct.rating = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
    });
  }

  
  getTotalPrice() {
    return this._Cart.getTotalPrice();
  }

  removeItem(productId: number) {
    this._Cart.removeOrderItem(productId);
  }

  clearCart() {
    this._Cart.removeAllOrder();
  }
  buy(value: string) {
    this.Quantity = Number(value);
  }


  createorder

    (): void {

  }

  setUserid() {
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.UserId = user.userId;
      this.getaddressidbyuserid(this.UserId);
      //console.log(this.UserId)
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

  gottoAddress() {
    this.getaddressidbyuserid(this.UserId);
    this.router.navigate(['/address']);
  }
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
  RandomProducts(): void {
    this._ProductServiceService.getproudectsbycatogry(this.selectedCategoryId,this.pageSize,this.pageNumber).subscribe({
      next: (res: Iproduct[]) => {
        this.Products = res; 
        this.randomProducts = this.getRandomProducts(this.Products);
      },
      
    });
  
}
  
  getRandomProducts(products: Iproduct[]): Iproduct[] {
    let randomProducts: Iproduct[] = [];
    let maxIndex = Math.min(6, products.length);
    let randomIndices: number[] = [];
    while (randomIndices.length < maxIndex) {
      let randomIndex = Math.floor(Math.random() * products.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
        randomProducts.push(products[randomIndex]);
      }
    }
    return randomProducts;
  }
  
  calculateProductRating(product: Iproduct): void {
    this.reviewService.getReviewsByProductId(product.id!).subscribe({
      next: (reviews) => {
        if (reviews && reviews.length > 0) {
          let totalRating = 0;
          for (let review of reviews) {
            totalRating += review.rating || 0;
          }
          product.rating = totalRating / reviews.length;
        } else {
          product.rating = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
    });
  }

  NavigateToDetails(proId: number) {
    this.router.navigateByUrl(`/Details/${proId}/${this.selectedCategoryId}`);
}
updateQuantity() {
  if (this.Quantity > this.ProductQuantity) {
    this.Quantity = this.ProductQuantity;
}
}
getCategoryName(product: Iproduct): string {
  return this.lang === 'en' ? product.categoryNameEn! : product.categoryNameAr!;
}
  }





