import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'

export class AddCandidateDto {
    
    @ApiProperty({ example: '', description: '候选人名字'})
    @IsNotEmpty({ message: '$property不能为空' })
    username: string;
}