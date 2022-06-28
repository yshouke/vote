import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { ELECTION_STATUS } from 'src/enums';


export class UpdateElectionStatusDto {
    @ApiProperty({ example: '', description: 'id' })
    @IsNotEmpty({ message: '$property不能为空' })
    id: string;

    @ApiProperty({ example: '', description: '状态' })
    @IsNotEmpty({ message: '$property不能为空' })
    @IsEnum(ELECTION_STATUS)	
    status: number;

    // @IsUrl()
    @ApiProperty({ example: '', description: '结果详情url地址' })
    @IsOptional()
    resultUrl?: string;
}