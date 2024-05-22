import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TransactionDto } from '../../models/transaction-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-transactions',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './client-transactions.component.html',
  styleUrl: './client-transactions.component.css'
})
export class ClientTransactionsComponent implements OnInit {
  userId: string = "";
  transactions: TransactionDto[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  
  constructor(private _userservice: UserService,private _AuthService: AuthService,private _router: Router){

  }
  ngOnInit(): void {
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.userId = user.userId;
      this.loadTransactions();
    });
  }

  loadTransactions() {
    this._userservice.getTransactionsByUserId(this.userId, this.currentPage, this.pageSize)
      .subscribe(transactions => {
        this.transactions = transactions;
      });
  }

  nextPage() {
    this.currentPage++;
    this.loadTransactions();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

}
