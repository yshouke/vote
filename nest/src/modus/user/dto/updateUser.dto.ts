import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator'
import { IsHongKongIdCard } from 'src/decorators/ishonkonidcard.decorator';

enum userType{
    admin = 0,
    normal = 1
}
export class UpdateUserDto {

    @ApiProperty({ example: '', description: '用户id'})
    @IsNotEmpty({ message: '$property不能为空' })
    @IsNumber()
    id: number

    @IsNumber()
    isDel?: number

    @ApiProperty({ example: '', description: '用户名'})
    @IsOptional()
    username?: string;

    @ApiProperty({ example: '', description: '密码'})
    @IsOptional()
    @Length(6, 18)
    password?: string

    @ApiProperty({ example: '', description: '身份号码'})
    @IsHongKongIdCard()
    @IsOptional()
    idCard: string

    @ApiProperty({ example: '', description: '电子邮件'})
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ example: '', description: '用户身份'})
    @IsEnum(userType)	
    @IsOptional()
    userType?: number;
}