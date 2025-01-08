import { IProduct } from './product'

export interface ICartItem {
  product: IProduct
  quantity: number
  note?: string
}

export interface ICart {
  items: ICartItem[]
  totalPrice: number
  note?: string
}
