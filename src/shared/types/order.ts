import { IProduct } from "./product";
import { IUser } from "./user";

export enum OrderStatus {
    CREATED = 'created',
    PROCESSING = 'processing',
    COMPLETED = 'completed'
}

export interface IOder {
    id: number;
    totalPrice: number;
    note?: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    products: IProduct[];
    createBy: IUser;
    processBy: IUser;
}