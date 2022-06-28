import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class deleteByIdsDto {
    
    @ApiProperty({ example: '', description: 'id数组'})
    @IsNotEmpty({ message: '$property不能为空' })
    @IsArray()
    ids: number[];
}