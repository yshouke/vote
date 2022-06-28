import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import { IsHongKongIdCard } from 'src/decorators/ishonkonidcard.decorator';
import { ELECTION_STATUS } from 'src/enums';


export class AddElectionDto {

    @ApiProperty({ example: '', description: '选举的名称' })
    @IsNotEmpty({ message: '$property不能为空' })
    name: string;

    @ApiProperty({ example: [], description: '候选人的id' })
    @IsNotEmpty({ message: '候选人ID不能为空' })
    @IsArray()
    @ArrayMinSize(2)
    candidateIds: number[]
    
    @ApiProperty({ example: '', description: '选举投票的描述' })
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '', description: '选举状态' })
    @IsEnum(ELECTION_STATUS)	
    @IsOptional()
    status?: number;


}