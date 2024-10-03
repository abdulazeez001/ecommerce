import { Observable } from 'rxjs';

export interface ResponseMessageInterface {
  status_code: number;
  message: Array<string>;
  data: object;
}

export interface QueueTopologyInterface {
  queue: string;
  exchange: string;
  routing_key: string;
}

export interface MessageInterface {
  action: string;
  type: string;
  data: object;
}

export interface MessagePublisherInterface {
  worker: string;
  message: MessageInterface;
}

export interface IRMQMessage {
  action: string;
  type: string;
  data: object;
}

export interface IOwnerServiceGrpcMethods {
  GetUser(data: { id: string }): Observable<any>;
  ValidateUserToken(data: { token: string }): Observable<any>;
}

export interface IProductServiceGrpcMethods {
  UpdateProduct(id: string, data: any): Observable<any>;
}

export interface IOrderServiceGrpcMethods {
  UpdateOrder(id: string, data: any): Observable<any>;
}
