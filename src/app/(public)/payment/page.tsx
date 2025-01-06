'use client'
import { createRedirectUrl } from '@/app/actions/payment.action';
import PaymentMethod from '@/components/payment/PaymentMethod';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function page() {
    const router = useRouter()

    const onVNPayClick = async () => {
        const url = await createRedirectUrl({
            orderId: "1",
            content: "Test content from next",
            type: 'media', //category
            amount: 100000000
        })

        router.push(url);
    }

    return (
        <div className='fixed top-[64px] flex items-center justify-center right-0 bottom-0 left-0 bg-slate-200'>
            <div className='w-[600px] bg-white rounded-3xl p-6'>
                <div className='w-full text-2xl font-bold text-center'>Chọn phương thức thanh toán</div>
                <div>
                    <PaymentMethod onClick={onVNPayClick} thumbnail='/images/vnpay-logo.jpg' name='Thanh toán qua VNPay' />
                </div>
            </div>            
        </div>
    )
}
