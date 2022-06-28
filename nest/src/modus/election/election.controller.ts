/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { deleteByIdDto } from 'src/dto/deleteById.dto';
import { AddElectionDto } from './dto/addElection.dto';
import { QueryElectionDto } from './dto/queryElection.dto';
import { QueryVotingUsersDto } from './dto/queryVotingUsers.dto';
import { UpdateElectionStatusDto } from './dto/updateElectionStatus.dto';
import { UserVotingDto } from './dto/userVoting.dto';
import { ElectionService } from './services/election.service';

@ApiTags('选举投票接口')
@Controller('election')
export class ElectionController {
    constructor(
        private readonly ElectionSer: ElectionService,
    ) {}
    /**
     * 添加选举记录
     * @param body: AddUserDto 
    */
    @ApiOperation({ summary: '添加选举记录' })
    @Post()
    async addElection(@Body() body: AddElectionDto) {
        return await this.ElectionSer.insertItem(body);
    }
    /**
     * 删除选举记录
     * @param body: AddUserDto 
    */
    @ApiOperation({ summary: '删除选举记录' })
    @ApiQuery({type: deleteByIdDto})
    @Delete()
    async deleteVoting(@Query() {id}: deleteByIdDto) {
        return await this.ElectionSer.deleteVoting(id);
    }
    /**
     *  修改选举记录的状态
    */
    @ApiOperation({ summary: '修改选举记录的状态' })
    @Put()
    async changeVotingStatus(@Body() body: UpdateElectionStatusDto) {
        return await this.ElectionSer.changeVotingStatus(body);
    }
    /**
     * 根据条件分页查找选举列表信息
    */
    @ApiOperation({ summary: '根据条件分页查找选举列表信息' })
    @Post('queryElectionList')
    async findElection(@Body() body: QueryElectionDto) {
        return await this.ElectionSer.findElection(body)
    }
  /**
   * 根据选举表的id，查询所有的候选人和对应的总票数
  */
    @ApiOperation({ summary: '根据选举表的id,查询所有的候选人和对应的总票数' })
    @ApiProperty({ example: '', description: 'id' })
    @Get('queryCandidateAndNumber')
    async queryCandidateAndNumber(@Query() {id}) {
        const list = await this.ElectionSer.queryCandidateNumByElectionId(id)
        return list
    }
    /**
     * 根据关联表的id 查询选举表里面候选人对应的所有投票的用户详情 分页返回
     * @param query QueryVotingUsersDto
     * @returns 
     */
    @ApiOperation({ summary: '查询候选人对应的投票的用户详情' })
    @Post('queryVotingUserList')
    async queryVotingUsers(@Body() query:QueryVotingUsersDto) {
        return this.ElectionSer.queryVotingUsers(query)
    }
    /**
     * 投票接口
     * @param data QueryVotingUsersDto
     * @returns 
    */
    @ApiOperation({ summary: '普通用户投票' })
    @Put('userVoting')
    async userVoting(@Body() data:UserVotingDto) {
        return this.ElectionSer.userVoting(data)
    }
}
