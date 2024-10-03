import { Document } from 'mongoose';

export interface Order extends Document {
  product_ids: string;
  quantity: string;
  total_price: string;
  products_hash: string;
}

export interface OrderQuery {
  total_price: string;
}
