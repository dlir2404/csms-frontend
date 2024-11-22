'use client'
import { useCreateOrder } from '@/services/order.service'
import { ICart, ICartItem } from '@/shared/types/cart'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Empty, Modal, Table, TableProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useState } from 'react'

export default function Cart({
    cart, setCart
}: {
    cart: ICart | undefined,
    setCart: Dispatch<SetStateAction<ICart | undefined>>
}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const createOrder = useCreateOrder(() => {
        setIsLoading(false)
        setIsOpen(false)
        setCart(undefined)
        router.push('/orders')
    }, () => {
        setIsLoading(false)
    })

    if (!cart || cart.items.length === 0) {
        return <div className='w-full h-full flex items-center justify-center border-l-2'>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No items selected' />
        </div>
    }

    const removeItem = (item: ICartItem) => {
        setCart((prevCart) => {
            if (!prevCart) return undefined;

            const newItems = prevCart.items.filter(i => i.product.id !== item.product.id);

            if (newItems.length === 0) return undefined;

            const totalPrice = prevCart.totalPrice - (Number(item.product.price) * item.quantity);

            return {
                ...prevCart,
                items: newItems,
                totalPrice
            };
        });
    };


    const columns: TableProps<ICartItem>['columns'] = [
        {
            title: 'Num',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '20px',
            render: value => <p>x{value}</p>
        },
        {
            title: 'Name',
            dataIndex: 'product',
            key: 'product',
            render: value => <p>{value.name}</p>
        },
        {
            title: 'Price',
            dataIndex: 'product',
            key: 'product',
            width: '45px',
            render: value => <p>{formatCurrency(value.price)}</p>
        },
        {
            title: '',
            key: 'action',
            width: '32px',
            render: (_, record) => {
                return (
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(record)}
                    />
                )
            }
        }
    ]

    const handleOK = () => {
        setIsLoading(true)
        createOrder.mutate({
            totalPrice: cart.totalPrice,
            note: '',   //add later
            products: cart.items.map(item => {
                return {
                    productId: item.product.id,
                    quantity: item.quantity
                }
            })
        })
    }

    return (
        <div className='relative h-full'>
            <Table
                className='w-96'
                columns={columns}
                dataSource={cart?.items.map((item: any, index: number) => {
                    return {
                        key: index,
                        ...item
                    }
                })}
                pagination={false}
            />
            <div className='absolute left-0 right-0 bottom-0 border-t-slate-200 border-t'>
                <div className='flex justify-around font-bold p-4'>
                    <div>Total: </div>
                    <div>{formatCurrency(cart.totalPrice || 0)} VND</div>
                </div>
                <div className='text-2xl'>
                    <Button onClick={() => setIsOpen(true)} type='primary' className='w-full h-10 mb-2'>Create order</Button>
                </div>
            </div>
            <Modal
                title='Create order'
                open={isOpen}
                onOk={handleOK}
                onCancel={() => setIsOpen(false)}
                confirmLoading={isLoading}
            >
                <p>Create order with items from cart ?</p>
            </Modal>
        </div>
    )
}
