'use client'
import { useAppContext } from '@/app/app-context';
import PaymentModal from '@/components/comps/PaymentModal';
import { useCompleteOrder, useGetOrder, useProcessOrder } from '@/services/order.service';
import { PaymentStatus } from '@/shared/constants/payment';
import { OrderStatus } from '@/shared/types/order';
import { IProduct } from '@/shared/types/product';
import { UserRole } from '@/shared/types/user';
import { formatDate } from '@/shared/utils/format.date';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { Button, Col, Image, Modal, Row, Table, TableProps, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import PrintBill from '@/components/comps/PrintBill';

interface OrderPageProps {
    params: {
        orderId: number;
    };
}

const showStatus = (value: string) => {
    if (value === OrderStatus.CREATED) return <Tag color="volcano">Waiting for processing</Tag>
    if (value === OrderStatus.PROCESSING) return <Tag color="blue">Processing</Tag>
    if (value === OrderStatus.COMPLETED) return <Tag color="green">Completed</Tag>
}

const showPayment = (value: string | undefined, paymentMethod?: string) => {
    if (value === PaymentStatus.COMPLETED)
        return (<>
            <div className='flex justify-between items-center'>
                <div>Payment: </div>
                <div><Tag color="green">PAID</Tag></div>
            </div>
            <div className='flex justify-between items-center'>
                <div>Payment method: </div>
                <div>{paymentMethod === 'cash' ? "CASH" : ''}</div>
            </div>
        </>)

    return (<div className='flex justify-between items-center'>
        <div>Payment: </div>
        <div><Tag color="volcano">UNPAID</Tag></div>
    </div>)
}

export default function OrderDetail({ params }: OrderPageProps) {
    const { data, isLoading, refetch } = useGetOrder(params.orderId)
    const [processLoading, setProcessLoading] = useState(false)
    const [completeLoading, setCompleteLoading] = useState(false)
    const [processModal, setProcessModal] = useState(false)
    const [completeModal, setCompleteModal] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)
    const { user } = useAppContext()

    const searchParams = useSearchParams();
    const show = searchParams.get('show');

    useEffect(() => {
        if (show === 'pay') {
            setPaymentModal(true)
        }
    }, [])

    let totalPrice = 0;
    let totalQuantity = 0;
    const products = data?.products.map((item: IProduct, index: number) => {
        totalPrice += (item.quantity || 0) * item.price
        totalQuantity += item.quantity || 0
        return {
            key: index + 1,
            ...item
        }
    })

    let dataSource
    if (products != undefined) {
        dataSource = [
            ...products,
            {
                key: 'Total',
                quantity: totalQuantity,
                price: totalPrice
            }
        ]
    }

    const columns: TableProps<any>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            render: (value) => {
                if (value === "Total")
                    return <p className='font-bold text-ls'>{value}</p>
                return <p>{value}</p>
            }
        },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (value) => {
                if (value != undefined) {
                    return <Image width={60} height={60} src={value}></Image>
                }
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => {
                if (record.key === "Total") return <p className='text-lg font-bold'>{formatCurrency(record.price)} VND</p>
                return <p>{formatCurrency((record.quantity || 0) * record.price)} VND</p>
            }
        }
    ]

    const processOrder = useProcessOrder(() => {
        setProcessLoading(false)
        setProcessModal(false)
        refetch()
    }, () => {
        setProcessLoading(false)
    })

    const handleOKProcess = () => {
        setProcessLoading(true)
        processOrder.mutate({ id: params.orderId })
    }

    const completeOrder = useCompleteOrder(() => {
        setCompleteLoading(false)
        setCompleteModal(false)
        refetch()
    }, () => {
        setCompleteLoading(false)
    })

    const handleOKComplete = () => {
        setCompleteLoading(true)
        completeOrder.mutate({ id: params.orderId })
    }

    return (
        <div>
            <div className='pr-16'>
                <div className='flex gap-4'>
                    <Col span={16} className='bg-slate-100 p-4 rounded-lg'>
                        <div className='text-center text-xl font-bold mb-4'>Items</div>
                        <Table
                            bordered
                            loading={isLoading}
                            columns={columns}
                            scroll={{ x: 'max-content' }}
                            dataSource={dataSource}
                            pagination={false}
                        />
                    </Col>
                    <Col span={8} className='bg-slate-100 p-4 rounded-lg'>
                        <div className='text-center text-xl font-bold mb-4'>Detail information</div>
                        <div className='p-4 flex flex-col gap-4'>
                            <div className='flex justify-between items-center'>
                                <div>Created by: </div>
                                <div>{data?.createdBy?.fullName || data?.createdBy.username}</div>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div>Barista: </div>
                                <div>{data?.processBy?.fullName || data?.processBy?.username || ''}</div>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div>Created at: </div>
                                <div>{formatDate(data?.createdAt)}</div>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div>Status: </div>
                                <div>{showStatus(data?.status)}</div>
                            </div>
                            {showPayment(data?.payment?.status, data?.payment?.paymentMethod)}
                            <div className='flex justify-between items-center'>
                                <div>Note: </div>
                                <div>{data?.note}</div>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            <div className='p-16 flex gap-4 float-end'>
                {user?.role === UserRole.ORDER_TAKER && (
                    <>
                        <Button disabled={data?.status !== OrderStatus.CREATED} size='large' danger>Cancel order</Button>
                        <PrintBill order={data} />
                        <Button disabled={data?.payment?.status === PaymentStatus.COMPLETED} onClick={() => setPaymentModal(true)} size='large' type='primary'>Pay order</Button>
                    </>
                )}
                {user?.role === UserRole.BARISTA && (
                    <>
                        {data?.status === OrderStatus.CREATED && (
                            <Button onClick={() => setProcessModal(true)} size='large' type='primary'>Process order</Button>
                        )}
                        {data?.status === OrderStatus.PROCESSING && (
                            <Button onClick={() => setCompleteModal(true)} size='large' type='primary'>Complete order</Button>
                        )}
                    </>
                )}
            </div>

            <Modal
                title='Process order'
                open={processModal}
                onOk={handleOKProcess}
                onCancel={() => setProcessModal(false)}
                confirmLoading={processLoading}
            >
                <p>Confirm to process this order ?</p>
            </Modal>
            <Modal
                title='Complete order'
                open={completeModal}
                onOk={handleOKComplete}
                onCancel={() => setCompleteModal(false)}
                confirmLoading={completeLoading}
            >
                <p>Confirm to complete this order ?</p>
            </Modal>
            <PaymentModal onOk={() => refetch()} open={paymentModal} setOpen={setPaymentModal} order={data}></PaymentModal>
        </div>
    )
}