import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { TimeEntity } from './common/timeEntity';

/***
 * 候选人表实体
 */
@Entity('sys_candidate')
export class CandidateEntity extends TimeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({comment: '用户名' })
  username: string;

}