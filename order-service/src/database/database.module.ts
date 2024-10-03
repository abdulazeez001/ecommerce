import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { CacheModule } from './cache/cache.module';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [CacheModule],
})
export class DatabaseModule {}
