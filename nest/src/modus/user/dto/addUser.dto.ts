import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import { IsHongKongIdCard } from 'src/decorators/ishonkonidcard.decorator';

enum userType{
    admin = 0,
    normal = 1
}

export class AddUserDto {

    @ApiProperty({ example: '', description: '用户名'})
    @IsOptional()
    username?: string;
    
    @ApiProperty({ example: '', description: '账号密码'})
    @IsOptional()
    @Length(6, 18)
    password?: string
    
    @ApiProperty({ example: '', description: '香港身份号码格式'})
    @IsNotEmpty({ message: '$property不能为空' })
    @IsHongKongIdCard()
    idCard: string

    @ApiProperty({ example: '', description: '电子邮件'})
    @IsNotEmpty({ message: '$property不能为空' })
    @IsEmail()	
    email: string;

    @ApiProperty({ example: '', description: '用户类型'})
    @IsEnum(userType)	
    @IsOptional()
    userType?: number;

}