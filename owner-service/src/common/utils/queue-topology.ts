import 'dotenv/config';
import { QueueTopologyInterface } from './interfaces';

export const queueTopology = (worker: string): QueueTopologyInterface => {
  const queue_prefix = process.env.RABBITMQ_QUEUE_PREFIX;
  const exchange = `${queue_prefix}.exchange`;
  let topology;
  switch (worker) {
    case 'user':
      topology = {
        queue: `${queue_prefix}.queue`,
        exchange,
        routing_key: `${queue_prefix}.route`,
      };
      break;
    case 'product':
      topology = {
        queue: `${queue_prefix}.product.queue`,
        exchange,
        routing_key: `${queue_prefix}.product.route`,
      };
      break;
    case 'order':
      topology = {
        queue: `${queue_prefix}.order.queue`,
        exchange,
        routing_key: `${queue_prefix}.order.route`,
      };
      break;
    default:
      throw new Error('Invalid queue: Something bad happened!');
  }

  return topology;
};

export const RETRY_EXCHANGE_NAME = 'retry.exchange';
