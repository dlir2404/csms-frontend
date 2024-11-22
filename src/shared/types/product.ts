import { ICategory } from "./category";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
    available: boolean;
    categories: ICategory[];
    createdAt: string;
    updatedAt: string;
    quantity?: number
}