'use client'
import Cart from '@/components/comps/Cart'
import ProductCard from '@/components/comps/ProductCard'
import { useGetListProduct } from '@/services/product.service'
import { ICart, ICartItem } from '@/shared/types/cart'
import { IProduct } from '@/shared/types/product'
import { Spin } from 'antd'
import { useState } from 'react'
import './scrollbar.css'
import { useAppContext } from '../app-context'
import { UserRole } from '@/shared/types/user'
import { useGetListCategory } from '@/services/category.service'

export default function Home() {
  const [cart, setCart] = useState<ICart | undefined>()
  const [category, setCategory] = useState<number | undefined>()
  const appContext = useAppContext()

  const { data: products, isLoading } = useGetListProduct({
    page: 1,
    pageSize: 1000,
    category,
  })

  const { data: categories } = useGetListCategory({
    page: 1,
    pageSize: 1000,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    )
  }

  if (!products || !products.rows) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No products found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-112px)]">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex gap-4 w-full overflow-x-scroll scrollbar-hidden flex-nowrap">
          {categories?.rows?.map((ctgr: { id: number; name: string }) => {
            return (
              <div
                className={
                  `px-4 py-2 rounded-lg border whitespace-nowrap cursor-pointer ` +
                  (ctgr.id === category ? 'bg-blue-500 text-white' : '')
                }
                key={ctgr.id}
                onClick={() => {
                  if (ctgr.id === category) {
                    setCategory(undefined)
                  } else {
                    setCategory(ctgr.id)
                  }
                }}
              >
                {ctgr.name}
              </div>
            )
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-4 list-products">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.rows.map((product: IProduct) => (
              <div key={product.id} className="flex flex-col h-full">
                <ProductCard
                  product={product}
                  quantity={
                    cart?.items.find((item: ICartItem) => item.product.id === product.id)?.quantity
                  }
                  setCart={setCart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {appContext.user?.role === UserRole.ORDER_TAKER && (
        <div className="w-80 flex-shrink-0">
          <Cart cart={cart} setCart={setCart} />
        </div>
      )}
    </div>
  )
}
