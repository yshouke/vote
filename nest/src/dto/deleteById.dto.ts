import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class deleteByIdDto {

    @ApiProperty({ example: '', description: 'id'})
    @IsNotEmpty({ message: '$property不能为空' })
    id: string | number;
}