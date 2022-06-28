import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator'

export class userDto {
    @ApiProperty({ example: 'admin', description: '用户名', required: true })
    @IsNotEmpty({ message: '$property不能为空' })
    username: string;

    @ApiProperty({ example: '666666', description: '密码', required: true })
    @IsNotEmpty({ message: '$property不能为空' })
    @Length(6, 18)
    password: string
}