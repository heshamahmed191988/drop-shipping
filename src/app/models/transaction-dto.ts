import { Data } from "@angular/router";

export interface TransactionDto {
    userId?: string;
    amount?: number;
    status?:string;
    withdrawalMethod?:string;
    datePlaced?:Date;

}
