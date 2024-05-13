import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-earning',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './earning.component.html',
  styleUrl: './earning.component.css'
})
export class EarningComponent implements OnInit {
  UserId: string = "";
  earning!: number;
  withdrawalAmount: number = 0;
  withdrawalMethod: string = "";
  phoneNumber: string = "";
  withdrawalSubmitted: boolean = false;
  errorMessage: string = '';
  errorMessagesuccess:string = '';
    constructor(private _userservice: UserService,private _AuthService: AuthService,private _router: Router){

  }
  ngOnInit(): void {
    
    this.getUserEarning();
  }



  getUserEarning() {
    this._AuthService.getCurrentUserId().subscribe(
      user => {
        this.UserId = user.userId;
        this._userservice.getUserEarning(this.UserId).subscribe(
          data => {
            this.earning = data;
          },
          error => {
            console.error('Error fetching user earning:', error);
          }
        );
      },
      error => {
        console.error('Error fetching user ID:', error);
      }
    );
  }
  requestWithdrawal() {
    if (this.withdrawalAmount > this.earning) {
      this.errorMessage = 'Withdrawal amount exceeds earnings.';
      return;
    }
  
    this._userservice.requestWithdrawal({
      userId: this.UserId,
      requestedAmount: this.withdrawalAmount,
      withdrawalMethod: this.withdrawalMethod,
      phoneNumber: this.phoneNumber,
    }).pipe(
      tap(() => {
        // Withdrawal request successful
        console.log('Withdrawal request successful');
        this.withdrawalSubmitted = true; 
        this.earning -= this.withdrawalAmount;
        // Reset withdrawal form fields
        this.withdrawalAmount = 0;
        this.withdrawalMethod = "";
        this.phoneNumber = "";
      }),
      catchError(error => {
        // Withdrawal request failed, handle error
        console.error('Error requesting withdrawal:', error);
        return of(null); // Return an observable to handle the error gracefully
      })
    ).subscribe(response => {
      if (response) {
        // Display success message
        this.errorMessagesuccess = response.message; // Assuming the server responds with a message field
      }
    });
  }
  
}
