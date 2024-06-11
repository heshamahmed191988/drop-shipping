import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-earning',
  standalone: true,
  imports: [CommonModule,FormsModule,TranslateModule,ReactiveFormsModule,NgClass],
  templateUrl: './earning.component.html',
  styleUrl: './earning.component.css'
})
export class EarningComponent implements OnInit {
  UserId: string = "";
  earning!: number;
  withdrawalForm: FormGroup;
  withdrawalSubmitted: boolean = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.withdrawalForm = this.formBuilder.group({
      withdrawalAmount: [0, Validators.required],
      withdrawalMethod: ['', Validators.required],
      phoneNumber: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
      numberOfWithdrawl: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserEarning();
  }

  getUserEarning() {
    this._authService.getCurrentUserId().subscribe(
      user => {
        this.UserId = user.userId;
        this._userService.getUserEarning(this.UserId).subscribe(
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
    console.log('Form validity:', this.withdrawalForm.valid); // Check form validity
    this.formErrors = {};
    if (this.withdrawalForm.invalid) {
      console.log('Form is invalid, displaying error messages.');
      this.validateForm(this.withdrawalForm);
      return;
    }
  
    if (this.withdrawalForm.get('withdrawalAmount')?.value > this.earning) {
      console.log('Withdrawal amount exceeds earnings, displaying error message.');
      this.formErrors['withdrawalAmount'] = 'عفوا رصيدك الحالى اقل من القيمة المراد سحبها';
      return;
    }
  
    this._userService.requestWithdrawal({
      userId: this.UserId,
      requestedAmount: this.withdrawalForm.get('withdrawalAmount')?.value,
      withdrawalMethod: this.withdrawalForm.get('withdrawalMethod')?.value,
      phoneNumber: this.withdrawalForm.get('phoneNumber')?.value,
      status: "Pending",
      numberOfWithdrawl: this.withdrawalForm.get('numberOfWithdrawl')?.value,
    }).pipe(
      tap(() => {
        // Withdrawal request successful
        console.log('Withdrawal request successful');
        this.withdrawalSubmitted = true;
        this.earning -= this.withdrawalForm.get('withdrawalAmount')?.value;
        // Reset withdrawal form
        this.withdrawalForm.reset();
        // Set success message
        this.formErrors['success'] = ' تهانينا لقد نجحت عملية السحب سوف يتم تاكيد العملية فى اقرب وقت ';
      }),
      catchError(error => {
        // Withdrawal request failed, handle error
        console.error('Error requesting withdrawal:', error);
        return of(null); // Return an observable to handle the error gracefully
      })
    ).subscribe(response => {
      if (response) {
        // Display success message
        console.log('Withdrawal request successful');
        this.formErrors['success'] = ' تهانينا لقد نجحت عملية السحب سوف يتم تاكيد العملية فى اقرب وقت ';
      }
    });
  }
  
  

  validateForm(form: FormGroup) {
    for (const field in form.controls) {
      const control = form.get(field);
      if (control instanceof FormGroup) {
        this.validateForm(control);
      } else {
        if (control && control.invalid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] = messages[key];
          }
        }
      }
    }
  }

  validationMessages: { [key: string]: { [key: string]: string } } = {
    'withdrawalAmount': {
      'required': 'Withdrawal amount is required.'
    },
    'withdrawalMethod': {
      'required': 'Withdrawal method is required.'
    },
    'phoneNumber': {
      'required': 'Phone number is required.'
    },
    'numberOfWithdrawl': {
      'required': 'Number of withdrawal is required.'
    }
  };
}