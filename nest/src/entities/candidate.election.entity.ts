import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import { TimeEntity } from './common/timeEntity';
import {split} from 'lodash'
/***
 * 候选人表与选举表的关联表实体
 */
@Entity('sys_candidate_election')
export class Candidate_ElectionEntity extends TimeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({comment: '候选人表ID' })
  candidateId: number;
  
  @Column({comment: '选举表ID' })
  electionId: number;

  @Column({comment: '候选人票数', default: 0 })
  candidateNumber?: number;

  @Column({comment: '投票人ID列表', default: '' })
  voterIdList?: string

  @AfterLoad()
  formatVoterIdList?() {
    const list: any = this.voterIdList?.length ? split(this.voterIdList, ',') : []
    this.voterIdList = list
  }
}