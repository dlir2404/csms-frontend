'use client'
import { useCreateOrder } from '@/services/order.service'
import { ICart, ICartItem } from '@/shared/types/cart'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Modal, Table, TableProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'

export default function Cart({
  cart,
  setCart,
}: {
  cart: ICart | undefined
  setCart: Dispatch<SetStateAction<ICart | undefined>>
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [noteModal, setNoteModal] = useState(false)
  const [itemNoteModal, setItemNoteModal] = useState(false)
  const [note, setNote] = useState()
  const [item, setItem] = useState<any>()
  const inputRef = useRef<any>()
  const inputRef2 = useRef<any>()

  const createOrder = useCreateOrder(
    (data: any) => {
      setIsLoading(false)
      setIsOpen(false)
      setCart(undefined)
      router.push(`/orders/${data.id}`)
    },
    () => {
      setIsLoading(false)
    }
  )

  if (!cart || cart.items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border-l-2">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No items selected" />
      </div>
    )
  }

  const removeItem = (item: ICartItem) => {
    setCart((prevCart) => {
      if (!prevCart) return undefined

      const newItems = prevCart.items.filter((i) => i.product.id !== item.product.id)

      if (newItems.length === 0) return undefined

      const totalPrice = prevCart.totalPrice - Number(item.product.price) * item.quantity

      return {
        ...prevCart,
        items: newItems,
        totalPrice,
      }
    })
  }

  const columns: TableProps<ICartItem>['columns'] = [
    {
      title: 'Num',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20px',
      render: (value) => <p>x{value}</p>,
    },
    {
      title: 'Name',
      dataIndex: 'product',
      key: 'product',
      render: (value) => <p>{value.name}</p>,
    },
    {
      title: 'Price',
      dataIndex: 'product',
      key: 'product',
      width: '45px',
      render: (value) => <p>{formatCurrency(value.price)}</p>,
    },
    {
      title: '',
      key: 'action',
      width: '32px',
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
      render: (_, record) => {
        return <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(record)} />
      },
    },
  ]

  const handleOK = () => {
    setIsLoading(true)
    console.log({
      totalPrice: cart.totalPrice,
      note: note,
      products: cart.items.map((item) => {
        return {
          productId: item.product.id,
          quantity: item.quantity,
          note: item.note,
        }
      }),
    })
    createOrder.mutate({
      totalPrice: cart.totalPrice,
      note: note,
      products: cart.items.map((item) => {
        return {
          productId: item.product.id,
          quantity: item.quantity,
          note: item.note,
        }
      }),
    })
  }
  return (
    <div className="relative h-full">
      <Table
        className="w-96 cursor-pointer"
        columns={columns}
        dataSource={cart?.items.map((item: any, index: number) => {
          return {
            key: index,
            ...item,
          }
        })}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            setItemNoteModal(true)
            setItem(record)
          },
        })}
      />
      <div className="absolute left-0 right-0 bottom-0">
        <div
          className="flex justify-between items-center p-4 border-slate-200 border cursor-pointer"
          onClick={() => setNoteModal(true)}
        >
          <div>Add note</div>
          <PlusOutlined />
        </div>
        <div className="flex justify-around font-bold p-4">
          <div>Total: </div>
          <div>{formatCurrency(cart.totalPrice || 0)} VND</div>
        </div>
        <div className="text-2xl">
          <Button onClick={() => setIsOpen(true)} type="primary" className="w-full h-10 mb-2">
            Create order
          </Button>
        </div>
      </div>
      <Modal
        title="Create order"
        open={isOpen}
        onOk={handleOK}
        onCancel={() => setIsOpen(false)}
        confirmLoading={isLoading}
      >
        <p>Create order with items from cart ?</p>
      </Modal>
      <Modal
        title="Add note"
        open={noteModal}
        onOk={() => {
          setNoteModal(false)
          if (inputRef.current) {
            setNote(inputRef.current.input.value)
          }
        }}
        onCancel={() => setNoteModal(false)}
        confirmLoading={isLoading}
      >
        <p>Add note for this order</p>
        <Input ref={inputRef} defaultValue={note} placeholder="note" />
      </Modal>
      {itemNoteModal && (
        <Modal
          title="Add note"
          open={itemNoteModal}
          onOk={() => {
            setItemNoteModal(false)
            if (inputRef2.current) {
              setCart((prevVal) => {
                if (!prevVal) return undefined
                const newItems = prevVal.items.map((e) => {
                  if (e.product.id === item?.product?.id) {
                    return {
                      ...e,
                      note: inputRef2.current.input.value,
                    }
                  }
                  return e
                })
                return {
                  totalPrice: prevVal.totalPrice,
                  note: prevVal.note,
                  items: newItems,
                }
              })
            }
            setItem(undefined)
          }}
          onCancel={() => setItemNoteModal(false)}
          confirmLoading={isLoading}
        >
          <p>Add note for this item</p>
          <Input
            ref={inputRef2}
            defaultValue={cart.items.find((e) => e?.product?.id === item?.product?.id)?.note}
            placeholder="note"
          />
        </Modal>
      )}
    </div>
  )
}
