import { createRedirectUrl } from '@/app/actions/payment.action'
import { usePayOrder } from '@/services/payment.service'
import { PaymentMethod } from '@/shared/constants/payment'
import { IOder } from '@/shared/types/order'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { Button, InputNumber, Menu, MenuProps, Modal } from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import PrintBill from './PrintBill'
import Link from 'next/link'

interface IPaymentModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onOk: () => void
  order: IOder
}

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'cash',
    label: 'In cash',
    icon: <Image width={32} height={32} src="/images/cash.png" alt="cash" />,
  },
  {
    key: 'vnpay',
    label: 'VNPay',
    icon: <Image width={32} height={32} src="/images/vnpay-logo.jpg" alt="vnpay" />,
  },
  {
    key: 'momo',
    label: 'Momo',
    icon: <Image width={32} height={32} src="/images/momo-logo.png" alt="vnpay" />,
  },
]

export default function PaymentModal({ open, setOpen, onOk, order }: IPaymentModal) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>('cash')
  const [qrModal, setQrModal] = useState(false)
  const [payUrl, setPayUrl] = useState('')
  const [discount, setDiscount] = useState<number>(0)
  const [discountValid, setDiscountValid] = useState(true)
  const pay = usePayOrder(
    () => {
      setOpen(false), setLoading(false), onOk()
    },
    () => {
      setLoading(false)
    }
  )

  const handlePay = () => {
    setLoading(true)
    pay.mutate({
      orderId: order.id,
      total: +(order.totalPrice * 1.1 - discount),
      paymentMethod: PaymentMethod.CASH,
    })
  }

  const showConfirm = () => {
    Modal.confirm({
      title: 'Confirm to process payment?',
      onOk: handlePay,
      cancelText: 'Cancel',
    })
  }

  useEffect(() => {
    createRedirectUrl({
      orderId: order?.id,
      // content: "Thanh toán đơn hàng " + data.orderId,
      type: 'drink', //category
      amount: order?.totalPrice * 1.1 - (discount || 0),
    }).then((url) => {
      setPayUrl(url)
    })
  }, [discount])

  const showVNPayQR = async () => {
    if (!payUrl) {
      const url = await createRedirectUrl({
        orderId: order?.id,
        // content: "Thanh toán đơn hàng " + data.orderId,
        type: 'drink', //category
        amount: order.totalPrice * 1.1 - (discount || 0),
      })

      setPayUrl(url)
    }
    setQrModal(true)
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
        <div className="flex gap-4 h-[400px]">
          <div className="mb-4 h-full flex flex-col">
            <div className="mb-4">Choose payment method</div>
            <Menu
              className="flex-1"
              onClick={(value) => {
                setPaymentMethod(value.key)
              }}
              style={{ width: 256 }}
              defaultSelectedKeys={['cash']}
              mode="inline"
              items={items}
            />
          </div>
          <div className="bg-slate-100 rounded-md flex-1 py-16 px-20">
            <div className="text-lg flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>Subtotal</div>
                <div>{formatCurrency(order?.totalPrice)} VND</div>
              </div>
              <div className="flex items-center justify-between">
                <div>VAT</div>
                <div>{formatCurrency(order?.totalPrice / 10)} VND</div>
              </div>
              <div
                className={`flex items-center justify-between relative ${!discountValid ? 'mb-4' : ''}`}
              >
                <div>Discount</div>
                <div className="">
                  <InputNumber
                    value={discount}
                    onChange={(value) => {
                      console.log(value)
                      if (value && (value < 0 || value > order.totalPrice * 1.1)) {
                        setDiscountValid(false)
                      }

                      setDiscount(value || 0)
                    }}
                  />{' '}
                  VND
                </div>
                {!discountValid && (
                  <div className="absolute text-sm text-red-500 -bottom-6 right-8">
                    Discount invalid
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>Total</div>
                <div>{formatCurrency(order?.totalPrice * 1.1 - discount)} VND</div>
              </div>
              {paymentMethod === 'cash' && (
                <div className="flex gap-4">
                  <PrintBill order={order} discount={discount} />
                  <Button
                    className="flex-1"
                    disabled={!discountValid}
                    loading={loading}
                    onClick={showConfirm}
                    size="large"
                    type="primary"
                  >
                    Confirm payment
                  </Button>
                </div>
              )}
              {paymentMethod === 'vnpay' && (
                <div className="flex gap-4">
                  <PrintBill order={order} />
                  <Button
                    className="flex-1"
                    disabled={!discountValid}
                    loading={loading}
                    onClick={showVNPayQR}
                    size="large"
                    type="primary"
                  >
                    Show payment QR
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={qrModal} width={250} footer={null} onCancel={() => setQrModal(false)}>
        <div className="w-full flex justify-center">
          <QRCodeCanvas value={payUrl} size={200} />
        </div>
        <div className="text-center mt-4">
          or click:{' '}
          <Link target="_blank" href={payUrl}>
            Link
          </Link>
        </div>
      </Modal>
    </>
  )
}
