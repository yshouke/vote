import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { LimitDto } from "src/dto/limit.dto";

export class QueryVotingUsersDto extends LimitDto {
    @ApiProperty({ example: '', description: 'id', required: true })
    @IsNotEmpty({ message: '$property不能为空' })
    id: number;
}