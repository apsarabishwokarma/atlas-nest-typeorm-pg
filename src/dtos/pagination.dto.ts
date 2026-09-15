import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationInputDto {
  @ApiProperty({
    description: 'Number of items to query',
    required: false,
    // type: Number,
    // name:"take"
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  take?: number;

  @ApiProperty({
    description: 'Number of items to skip',
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  skip?: number;

  @ApiProperty({
    description: 'Search by text entities',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Sort by a specific column',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';
}
