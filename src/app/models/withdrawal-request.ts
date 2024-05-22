export interface WithdrawalRequest {
    userId?: string;
    requestedAmount?: number;
    withdrawalMethod?: string;
    phoneNumber?: string;
    status: string;
    numberOfWithdrawl:number;
  }