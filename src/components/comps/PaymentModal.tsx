import { usePayOrder } from '@/services/payment.service';
import { PaymentMethod } from '@/shared/constants/payment';
import { IOder } from '@/shared/types/order';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Menu, MenuProps, Modal } from 'antd'
import Image from 'next/image';
import React, { useState } from 'react'

interface IPaymentModal {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOk: () => void;
    order: IOder;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'cash',
        label: 'In cash',
        icon: <Image width={32} height={32} src="/images/cash.png" alt='cash' />,
    },
    {
        key: 'vnpay',
        label: 'VNPay',
        icon: <Image width={32} height={32} src="/images/vnpay-logo.jpg" alt='vnpay' />,
    },
    {
        key: 'momo',
        label: 'Momo',
        icon: <Image width={32} height={32} src="/images/momo-logo.png" alt='vnpay' />,
    },
];

export default function PaymentModal({
    open,
    setOpen,
    onOk,
    order
}: IPaymentModal) {
    const [loading, setLoading] = useState(false)
    const pay = usePayOrder(() => {
        setOpen(false),
        setLoading(false),
        onOk()
    }, () => {
        setLoading(false)
    })

    const handlePay = () => {
        setLoading(true)
        pay.mutate({
            orderId: order.id,
            amount: +order.totalPrice,
            paymentMethod: PaymentMethod.CASH
        })
    }

    const showConfirm = () => {
        Modal.confirm({
            title: 'Confirm to process payment?',
            onOk: handlePay,
            cancelText: 'Cancel'
        })
    }

    return (
        <>
            <Modal
                title="Process payment"
                open={open}
                width={800}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <div className='flex gap-4 h-[400px]'>
                    <div className='mb-4 h-full flex flex-col'>
                        <div className='mb-4'>Choose payment method</div>
                        <Menu
                            className='flex-1'
                            onClick={() => {}}
                            style={{ width: 256 }}
                            defaultSelectedKeys={['cash']}
                            mode="inline"
                            items={items}
                        />
                    </div>
                    <div className='bg-slate-100 rounded-md flex-1 py-16 px-20'>
                        <div className='text-lg flex flex-col gap-8'>
                            <div className='flex items-center justify-between'>
                                <div>Subtotal</div>
                                <div>{formatCurrency(500000)} VND</div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div>VAT</div>
                                <div>{formatCurrency(500000)} VND</div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div>Total</div>
                                <div>{formatCurrency(500000)} VND</div>
                            </div>
                            <Button loading={loading} onClick={showConfirm} size='large' type='primary'>Confirm payment</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}