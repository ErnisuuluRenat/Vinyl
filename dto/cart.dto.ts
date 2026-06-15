import { Cart } from "../models/cart.model"
import { Product } from "../models/product.model"
import { MessageDto, ErrorDto } from "./common.dto"

export type CartAllDto = Pick<Cart, "quantity"> & {cartItemId : number} & Pick<Product, "price" | "title" | "artist">

export type CartProductIdDto = {productId : string}

export type CartAddItemDto =  MessageDto | ErrorDto