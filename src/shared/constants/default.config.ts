export const PaymentDefaultConfig = {
  vnp_Version: '2.1.0',
  vnp_Command: 'pay',
  vnp_TmnCode: process.env.NEXT_PUBLIC_vnp_TmnCode,
  vnp_Locale: 'vn',
  vnp_CurrCode: 'VND',
  vnp_ReturnUrl: process.env.NEXT_PUBLIC_vnp_ReturnUrl,
}
