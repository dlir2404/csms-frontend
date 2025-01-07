'use server'
import { headers } from 'next/headers'

import { PaymentDefaultConfig } from '@/shared/constants/default.config'
import querystring from 'qs'
import * as crypto from 'crypto'
import moment from 'moment'
import { sortObject } from '@/shared/utils/vnPay.fn'
import { ICreateRedirectUrl, IVnPayPaymentResult } from '@/shared/types/payment'

export async function createRedirectUrl(payload: ICreateRedirectUrl) {
  const secretKey = process.env.VN_PAY_SECRET_KEY

  if (!secretKey) throw new Error('Missing vnpay secret key')
  let params: { [key: string]: string | number | undefined } = {
    ...PaymentDefaultConfig,
  }

  const currentDate = new Date()

  const headersList = headers()
  const ip =
    headersList.get('x-forwarded-for') ||
    headersList.get('x-real-ip') ||
    headersList.get('remote-addr') ||
    'Unknown IP'

  params['vnp_IpAddr'] = ip
  params['vnp_TxnRef'] = payload.orderId //replace with order id later
  params['vnp_OrderInfo'] = payload.content
  params['vnp_OrderType'] = payload.type
  params['vnp_Amount'] = payload.amount * 100
  params['vnp_CreateDate'] = moment(currentDate).format('YYYYMMDDHHmmss')

  params = sortObject(params)

  const signData = querystring.stringify(params, { encode: false })
  var hmac = crypto.createHmac('sha512', secretKey)
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  params['vnp_SecureHash'] = signed

  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
  vnpUrl += '?' + querystring.stringify(params, { encode: false })

  return vnpUrl
}

export const handleChecksumVnPay = async (params: IVnPayPaymentResult) => {
  const { vnp_SecureHash, ...rest } = params

  const secretKey = process.env.VN_PAY_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing VNPay secret key')
  }

  const sortedObject = sortObject(rest)

  const signData = querystring.stringify(sortedObject, { encode: false })
  var hmac = crypto.createHmac('sha512', secretKey)
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

  if (vnp_SecureHash === signed) {
    return true
  }

  return false
}
