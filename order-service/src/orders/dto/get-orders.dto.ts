import { IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetOrdersDto {
  @ApiPropertyOptional({ description: 'Page Number', type: Number })
  @IsOptional()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per Page', type: Number })
  @IsOptional()
  @IsPositive()
  limit?: number;
}
