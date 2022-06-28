/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { deleteByIdDto } from 'src/dto/deleteById.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AddCandidateDto } from './dto/addUser.dto';
import { CandidateService } from './services/candidate.service';

@ApiTags('候选人接口')
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('candidate')
export class CandidateController {
    constructor(
        private readonly candidateSer: CandidateService,
    ) {}
    /**
     * 添加候选人
     * @param body: AddUserDto 
    */
    @ApiOperation({ summary: '添加候选人接口'})
    @Post()
    async addCandidate(@Body() body: AddCandidateDto) {
        await this.candidateSer.insert(body);
        return;
    }

    /**
     * 根据id删除指定候选人
     * @param id:  候选人Id
    */
    @ApiOperation({ summary: '删除候选人接口'})
    @ApiQuery({type: deleteByIdDto})
    @Delete()
    async delCandidateById(@Query() {id}: deleteByIdDto) {
        await this.candidateSer.update(id, {isDel: 1})
        return;
    }
    /**
     * 查找所有候选人
    */
    @ApiOperation({ summary: '查找所有候选人接口'})
    @Get()
    async findCandidate(@Query() {username}) {
        return await this.candidateSer.findMany({
            where: {
                ...(username ? {username} : {}),
                isDel: 0
            },
            order:{updatedDate: 'DESC'}
        })
    }
}
