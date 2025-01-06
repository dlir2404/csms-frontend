'use client'
import { VN_PAY_RESPONSE_CODE } from '@/shared/constants/response.code';
import { IVnPayPaymentResult } from '@/shared/types/payment';
import { formatVNPDate } from '@/shared/utils/format.date';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { CheckCircleOutlined, CloseCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function PaymentResult({
  searchParams
}: { searchParams: IVnPayPaymentResult }) {

  const router = useRouter()

  return (
    <div className='fixed top-[64px] flex items-center justify-center right-0 bottom-0 left-0 bg-slate-100'>
      <div className='w-[600px] bg-white rounded-3xl'>
        <div className='w-full h-[250px] flex items-center justify-center border-b border-dashed'>
          <div className='w-full flex flex-col items-center justify-center'>
          {searchParams.vnp_TransactionStatus == '00'
              ? <CheckCircleOutlined className='text-[80px] text-green-500 mb-4'/>
              : <CloseCircleOutlined className='text-[80px] text-red-500 mb-4'/>
            }
          <div className='text-2xl'>
            {searchParams.vnp_TransactionStatus == '00'
              ? <div className='text-green-500'>Giao dịch thành công</div>
              : <div className='text-red-500'>Giao dịch thất bại</div>
            }
          </div>
          {searchParams.vnp_TransactionStatus != '00' && (
            <div className='text-base'>{VN_PAY_RESPONSE_CODE[searchParams.vnp_ResponseCode]}</div>
          )}
          </div>
        </div>
        <div className='text-base my-4 mx-16 flex flex-col gap-4'>
          <div className='flex justify-between'>
            <div>Thời gian giao dịch</div>
            <div>{formatVNPDate(searchParams.vnp_PayDate)}</div>
          </div>
          <div className='flex justify-between'>
            <div>Mã giao dịch</div>
            <div>{searchParams.vnp_BankTranNo || 'Không có'}</div>
          </div>
          <div className='flex justify-between'>
            <div>Số tiền thanh toán</div>
            <div>{formatCurrency(parseInt(searchParams.vnp_Amount) / 100)} VND</div>
          </div>
          <div className='flex justify-between'>
            <div>Nội dung thanh toán</div>
            <div>{searchParams.vnp_OrderInfo}</div>
          </div>
        </div>
        <div onClick={() => router.push('/')} className='flex justify-center p-6 text-lg text-blue-600 cursor-pointer border-t border-dashed'>
          <div>
            Về trang chủ
            <RightOutlined className='ml-4' />
          </div>
        </div>
      </div>
    </div>
  )
}
