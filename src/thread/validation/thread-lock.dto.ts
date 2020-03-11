import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ThreadLockDto {
  @IsOptional()
  @IsString()
  @Transform((v, data) => data.reason.trim())
  @IsNotEmpty()
  reason: string;
}
