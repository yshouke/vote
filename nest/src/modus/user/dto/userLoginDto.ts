import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator'
import { userDto } from './userDto';

export class userLoginDto extends userDto {

}