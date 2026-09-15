import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ type: String })
  message: string;
}
