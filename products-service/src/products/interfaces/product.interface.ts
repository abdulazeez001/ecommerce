import { Document } from 'mongoose';
import { Observable } from 'rxjs';

export interface Product extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address: string;
}

export interface ProductQuery {
  name: string;
}

export interface ProductOwner extends Document {
  first_name: string;
  last_name: string;
  address: string;
  gender: string;
  password: string;
  email: string;
}

export interface IOwnerServiceGrpcMethods {
  GetUser(data: { id: string }): Observable<any>;
  ValidateUserToken(data: { token: string }): Observable<any>;
}
