import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert, AfterLoad } from 'typeorm';
import { TimeEntity } from './common/timeEntity';
import * as md5 from 'md5'
import { USER_TYPE } from 'src/enums';
/***
 * 用户表实体
 */
@Entity('sys_users')
export class UserEntity extends TimeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({comment: '用户名', default: ''})
  username?: string;

  @Column({comment: '密码', default: md5(123456)})
  password?: string;

  @Index()
  @Column({comment: '香港⾝分證號格式為：字⺟+6位數字+括號內1位數字,例如:A123456(7)', })
  idCard: string;

  @Index()
  @Column({ comment: '邮箱', nullable: true})
  email?: string;

  @Column({ comment: '状态 0:管理员 1:普通用户', default: USER_TYPE.Normal, type: 'tinyint' })
  userType?: number;
  
  @AfterLoad()
  formatVoterIdList?() { 
    !this.username && (this.username = this.email)
  }
}