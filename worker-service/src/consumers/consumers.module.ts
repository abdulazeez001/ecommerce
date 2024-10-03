import { Module, Global } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { OwnerModule } from './owners/owner.module';

@Global()
@Module({
  imports: [ProductModule, OwnerModule],
  providers: [],
  exports: [],
})
export class ConsumersModule {}
