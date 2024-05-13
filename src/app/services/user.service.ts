import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iedituser } from '../models/iedituser';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { WithdrawalRequest } from '../models/withdrawal-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient ,private _Authservice:AuthService) { }
  updateUser(user:Iedituser):Observable<void>{
    return this.http.put<void>(`${environment.baseUrl}/api/UserInfo?userId=${user.userId}`,{
      userName:user.userName,
      currentPassword:user.currentPassword,
      newPassword:user.newPassword,
      confirmPassword:user.confirmPassword
    })
  }


  getUserEarning(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/api/UserInfo/${userId}`);
  }


  requestWithdrawal(withdrawalRequest: WithdrawalRequest): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/UserInfo/withdrawal`, withdrawalRequest);
  }
}