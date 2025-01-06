export interface ICreateRedirectUrl {
  orderId: string | number
  content?: string
  type: string
  amount: number
}

export interface IVnPayPaymentResult {
  vnp_TmnCode: string
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo: string
  vnp_CardType: string
  vnp_PayDate: string
  vnp_OrderInfo: string
  vnp_TransactionNo: string
  vnp_ResponseCode: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string //our order id
  vnp_SecureHashType: string
  vnp_SecureHash: string
}
