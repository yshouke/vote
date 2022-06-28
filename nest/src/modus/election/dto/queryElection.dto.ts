import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { LimitDto } from "src/dto/limit.dto";

export class QueryElectionDto extends LimitDto {

    @ApiProperty({ example: '', description: '选举名称'})
    @IsOptional()
    name?: string;

    @ApiProperty({ example: '', description: '选举id'})
    @IsOptional()
    id?: number;

    @ApiProperty({ example: '', description: '选举状态'})
    @IsOptional()
    status?: number;
}