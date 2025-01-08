export enum UserRole {
  MANAGER = 'manager',
  ORDER_TAKER = 'order_taker',
  BARISTA = 'barista',
}

export interface IUser {
  id: number
  username: string
  fullName?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
