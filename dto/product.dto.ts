import { Product } from "../models/product.model";

export type ProductGenresDto = Product['genre'][]

export type ProductQueryDto = Partial<Pick<Product, "genre"> & {search : string}>

export type ProductsDto = Product[]