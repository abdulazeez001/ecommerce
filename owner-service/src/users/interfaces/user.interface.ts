import { Document } from 'mongoose';

export interface User extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address: string;
}

export interface UserQuery {
  email: string;
}
