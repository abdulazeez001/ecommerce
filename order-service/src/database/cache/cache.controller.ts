import { Controller } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller()
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}
}
