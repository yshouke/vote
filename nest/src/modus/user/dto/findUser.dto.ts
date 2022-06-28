import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator'
import { LimitDto } from 'src/dto/limit.dto';

export class FindUserDto extends LimitDto {

    @ApiProperty({ example: '', description: '用户名'})
    @IsOptional()
    username?: string;

    @ApiProperty({ example: '', description: 'id'})
    @IsOptional()
    id?: number;

    @ApiProperty({ example: '', description: '身份号码'})
    @IsOptional()
    idCard: string

    @ApiProperty({ example: '', description: '账号类型'})
    @IsOptional()
    userType?: number;
}