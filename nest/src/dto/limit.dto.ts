import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class LimitDto {
    
    @ApiProperty({ example: '', description: '每页显示的数量大小'})
    @IsNotEmpty({ message: '$property不能为空' })
    @IsNumber()
    pageSize: number;

    @ApiProperty({ example: '', description: '页码'})
    @IsNotEmpty({ message: '$property不能为空' })
    @IsNumber()
    pageNum: number;

}