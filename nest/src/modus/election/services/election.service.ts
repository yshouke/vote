/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate_ElectionEntity } from 'src/entities/candidate.election.entity';
import { ElectionEntity } from 'src/entities/election.entity';
import { BaseService } from 'src/modus/common/db/mysql/base.service';
import { getConnection, getManager, Like, Repository } from 'typeorm';
import { AddElectionDto } from '../dto/addElection.dto';
import { QueryElectionDto } from '../dto/queryElection.dto';
import {map, groupBy, slice, chain, find, each, concat} from 'lodash'
import { CandidateEntity } from 'src/entities/candidate.entity';
import { UserEntity } from 'src/entities/users.entity';
import { QueryVotingUsersDto } from '../dto/queryVotingUsers.dto';
import { UpdateElectionStatusDto } from '../dto/updateElectionStatus.dto';
import { UserVotingDto } from '../dto/userVoting.dto';
import { CommService } from 'src/modus/common/comm.service';
import { ELECTION_STATUS } from 'src/enums';
import { RedisCacheService } from 'src/modus/common/db/redis/redis-cache.service';
@Injectable()
export class ElectionService extends BaseService<ElectionEntity> {
    constructor(
        @InjectRepository(ElectionEntity)
        private readonly electionRep: Repository<ElectionEntity>,
        @InjectRepository(Candidate_ElectionEntity)
        private readonly candidateElectionRep: Repository<Candidate_ElectionEntity>,
        @InjectRepository(CandidateEntity)
        private readonly candidateRep: Repository<CandidateEntity>,
        @InjectRepository(UserEntity)
        private readonly userRep: Repository<UserEntity>,
        private readonly commonSer: CommService,
        private readonly redisCacheService: RedisCacheService
      ) {
        super(electionRep);
    }
  /**
   * 事务添加一条选举记录，然后再更新关联表
  */
  async insertItem(body: AddElectionDto) {
    const electionData: ElectionEntity = {
      name: body.name,
      status: body.status || ELECTION_STATUS.NotStarted,
      description: body.description
    } 

    const result = await getManager().transaction(async (manager) => {
      // 先插入选举表
      const electionId = (await manager.save(ElectionEntity, electionData)).id
      // 拼装关联数据，候选人Id和选举表Id
      const candidateElectionData: Candidate_ElectionEntity[] = body.candidateIds.map(candidateId=> ({
        candidateId,
        electionId,
      }))
      console.log(candidateElectionData)
      // 再插入关联表
      return await manager.save(Candidate_ElectionEntity, candidateElectionData)
    })
    return result
  }
  /**
   * 根据条件分页查找选举列表信息
  */
  async findElection(options: QueryElectionDto) {
    const {pageSize, pageNum, ...opt} = options
    const [userList, count] = await this.electionRep.findAndCount({
        where: {...opt, isDel: 0},
        order: {updatedDate: 'DESC'},
        skip: pageSize * (pageNum-1),
        take: pageSize,
        // cache: true,
    });
    return {list: userList, count, pageSize, pageNum}
  }

  /**
   *
   * 根据选举表的id，查询所有的候选人信息和对应的票数
  */
  async queryCandidateNumByElectionId(id: number) {
    const list = await this.candidateElectionRep.find({join:{alias: "CE", leftJoinAndSelect: {
    }},where: {electionId: id, isDel: 0}, order:{candidateNumber: 'DESC'}})
    // 查询对应的候选人信息
    const candidateList = await this.candidateRep.findByIds(map(list, 'candidateId'), {cache: true})
    const cadidateMap = groupBy(candidateList, 'id')
    // 拼装返回
    return list.map(v => ({...v, candidate: cadidateMap?.[v.candidateId]?.[0]}))
  }

  /**
   * 根据关联表的id
   * 查询选举表里面候选人对应的所有投票的用户详情
   * 分页返回
     * @param options QueryVotingUsersDto
     * @returns {list: userInfoList, count: voterIdList.length, pageSize, pageNum}
  */
  async queryVotingUsers(options: QueryVotingUsersDto) {
    const {pageSize, pageNum, id} = options
    const {voterIdList} = await this.candidateElectionRep.findOne(id)
    const userIds = this.pagination(pageNum, pageSize, voterIdList)
    const userInfoList = await this.userRep.findByIds(userIds, {select: ['username', 'idCard', 'email', 'id', 'userType'], cache: true})
    return {list: userInfoList, count: voterIdList.length, pageSize, pageNum}
  }

  /**
   *  删除未开始或已结束的选举的记录
  */
 async deleteVoting(_id: number | string) {
  const {status, id} = await this.electionRep.findOne(_id)
  // 判断状态，只有未开始或已结束的记录可以删除
  if (status == ELECTION_STATUS.NotStarted || status == ELECTION_STATUS.Ended) {
    // 删除记录
    await this.electionRep.update(id, {isDel: 1})
  } else {
    throw new Error("只能删除未开始或已结束的选举的记录");
  }
 }
  /**
   *  修改选举的记录的状态,若状态结束，发送邮件
  */
  async changeVotingStatus({id, status, resultUrl}: UpdateElectionStatusDto) {
    await this.electionRep.update(id, {status})
    // 若状态状态结束，发送邮件
    if (status == ELECTION_STATUS.Ended){
      // 查找所有投票用户的id
      const ids = chain(await this.candidateElectionRep.find({
        where:{electionId: id},
      })).map("voterIdList").flatten().value();
      // 根据id找到对应的邮箱地址，然后发送邮件
      (await this.userRep.findByIds(ids)).forEach(user => this.sendEmail(user, resultUrl));
    }
  }
  /**
   * @param UserEntity
   */
  async sendEmail({email}: UserEntity, resultUrl: string){
    console.log(email)
    this.commonSer.example({
      to: email, // 要发送的目标邮箱
      subject: '选举投票已结束, 快来查看结果吧✔', // 标题
      text: resultUrl || 'welcome', // 发送内容
    })
  }
  /**
   *  用户投票
   * @param {id, electionId, token}
  */
 async userVoting({id, electionId, token}: UserVotingDto) {
    // 解密获取当前投票用户的id
    const [idCard, userId] = CommService.decrypt(token).split(',')
    if (!userId) {throw new Error("无效的身份用户, 请重新登记")}

    // 查表验证当前的选举投票的状态是否进行中， 未开始和已结束的不能投票
    const {status} = (await this.electionRep.findOne(electionId)) || {}

    if (status != ELECTION_STATUS.InProgress) {throw new Error("只有进行中的选举, 才可以投票")}

    // 查询所有投票的用户
    const userList = await this.candidateElectionRep.find({
      where:{electionId},
    })

    // 过滤用户的id，判断当前用户是否已经投票
    const isVoted = chain(userList)
      .map("voterIdList")
      .flatten()
      .includes(userId)
      .value()
    let msg:string
    if (isVoted) {
      msg=(`当前用户(${idCard} -- id:${userId})已经投过票, 不可重复投票`);
    } else{ 
      // 未投票，更新当前候选人的投票用户和数量
      const ids = concat(userId, find(userList, ['id', id])?.voterIdList || [])
      this.candidateElectionRep.update(id, {
        voterIdList: ids.join(','),
        candidateNumber: ids.length
      })
      msg='投票成功'
    }
    return {isVoted, msg, userId}
 }
 /**
  * 字符或数组分页
  * @param pageNo number
  * @param pageSize number
  * @param array string | any[]
  * @returns any[]
  */
 pagination(pageNo:number, pageSize:number, array: string | any[]): string[] {
    const offset = (pageNo - 1) * pageSize;
    const data = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    return Array.isArray(data) ? data : [data]
  }
}
