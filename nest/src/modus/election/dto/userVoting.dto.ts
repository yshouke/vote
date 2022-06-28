import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'


export class UserVotingDto {
    @ApiProperty({ example: '', description: 'id', required: true })
    @IsNotEmpty({ message: '$property不能为空' })
    id: number;

    @ApiProperty({ example: '', description: '选举记录Id', required: true })
    @IsNotEmpty({ message: '$property不能为空' })
    electionId: number;

    @ApiProperty({ example: '', description: '令牌', required: true })
    @IsNotEmpty({ message: '请先进行注册登记后再投票' })
    token: string;
}