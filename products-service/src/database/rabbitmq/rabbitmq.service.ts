import { Injectable, Inject } from '@nestjs/common';
import { MessagePublisherInterface } from './interfaces/rabbitmq.interface';

import { ConfigService } from '@nestjs/config';
import { ChannelWrapper } from 'amqp-connection-manager';
import { Options } from 'amqplib';
import { queueTopology } from 'src/common/utils/queue-topology';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('RABBITMQ_CHANNEL_WRAPPER')
    private readonly channelWrapper: ChannelWrapper,
    private readonly configService: ConfigService,
  ) {}

  async publishMessage(data: Array<MessagePublisherInterface>) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataToPublish = data;
        if (dataToPublish.length > 0) {
          for (let i = 0; i < dataToPublish.length; i += 1) {
            const { message, worker } = dataToPublish[i];
            const { routing_key, exchange } = queueTopology(worker);

            const options: Options.Publish = {
              persistent: true, // Ensure that the message is persistent
              mandatory: true,
            };
            await this.channelWrapper.publish(
              exchange,
              routing_key,
              message,
              options,
            );
          }
        } else {
          reject(
            new Error('Nothing to publish. Please provide job description'),
          );
        }
        console.log('published message(s) to rabbitmq');
        resolve({ done: true });
      } catch (error) {
        reject(error);
      }
    });
  }
}
