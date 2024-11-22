'use client'
import Cart from "@/components/comps/Cart";
import ProductCard from "@/components/comps/ProductCard";
import { useGetListProduct } from "@/services/product.service";
import { ICart, ICartItem } from "@/shared/types/cart";
import { IProduct } from "@/shared/types/product";
import { Spin } from "antd";
import { useState } from "react";
import './scrollbar.css';

export default function Home() {
  const [cart, setCart] = useState<ICart | undefined>();

  const { data: products, isLoading } = useGetListProduct({
    page: 1,
    pageSize: 1000
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!products || !products.rows) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-112px)]">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 list-products">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.rows.map((product: IProduct) => (
              <div
                key={product.id}
                className="flex flex-col h-full"
              >
                <ProductCard 
                product={product} 
                quantity={cart?.items.find((item: ICartItem) => item.product.id === product.id)?.quantity}
                setCart={setCart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-80 flex-shrink-0">
        <Cart cart={cart} setCart={setCart}/>
      </div>
    </div>
  );
}