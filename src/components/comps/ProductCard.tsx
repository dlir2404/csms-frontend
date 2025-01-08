import { useAppContext } from '@/app/app-context'
import { ICart } from '@/shared/types/cart'
import { IProduct } from '@/shared/types/product'
import { UserRole } from '@/shared/types/user'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Tooltip } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { Dispatch, SetStateAction } from 'react'

export default function ProductCard({
  product,
  quantity,
  setCart,
}: {
  product: IProduct
  quantity?: number
  setCart: Dispatch<SetStateAction<ICart | undefined>>
}) {
  const appContext = useAppContext()
  const handleIncrease = () => {
    setCart((prevCart) => {
      if (!prevCart) {
        // If cart doesn't exist, create new cart with first item
        return {
          items: [
            {
              product,
              quantity: 1,
            },
          ],
          totalPrice: Number(product.price),
        }
      }

      const existingItem = prevCart.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        // If item exists, increase quantity
        return {
          ...prevCart,
          items: prevCart.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          totalPrice: prevCart.totalPrice + Number(product.price),
        }
      } else {
        // If item doesn't exist, add new item
        return {
          ...prevCart,
          items: [...prevCart.items, { product, quantity: 1 }],
          totalPrice: prevCart.totalPrice + Number(product.price),
        }
      }
    })
  }

  const handleDecrease = () => {
    setCart((prevCart) => {
      if (!prevCart) return undefined

      const existingItem = prevCart.items.find((item) => item.product.id === product.id)

      if (!existingItem) return prevCart

      if (existingItem.quantity === 1) {
        // If last item, remove it from cart
        const newItems = prevCart.items.filter((item) => item.product.id !== product.id)
        return newItems.length === 0
          ? undefined // Return undefined if cart is empty
          : {
              ...prevCart,
              items: newItems,
              totalPrice: prevCart.totalPrice - Number(product.price),
            }
      }

      // Decrease quantity
      return {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        ),
        totalPrice: prevCart.totalPrice - Number(product.price),
      }
    })
  }

  return (
    <Badge.Ribbon
      text={product.available ? 'Available' : 'Unavailable'}
      color={product.available ? 'blue' : 'red'}
      className="mb-4"
    >
      <Card
        hoverable
        cover={
          <img
            alt={product.name}
            src={product.thumbnail}
            className="h-48 object-cover rounded-t-md"
          />
        }
        className="rounded-md"
      >
        <Meta
          title={
            <Tooltip title={product.name}>
              <h3 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                {product.name}
              </h3>
            </Tooltip>
          }
          description={
            <>
              <p className="text-gray-700 mb-4">Price: {formatCurrency(product.price)} VND</p>
              {appContext.user?.role === UserRole.ORDER_TAKER && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={handleDecrease}
                    disabled={!quantity || quantity === 0}
                  />
                  <span className="w-6 text-center">{quantity || 0}</span>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleIncrease}
                    disabled={!product.available}
                  />
                </div>
              )}
            </>
          }
        />
      </Card>
    </Badge.Ribbon>
  )
}
