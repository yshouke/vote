import { ELECTION_STATUS } from "src/enums";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TimeEntity } from "./common/timeEntity";

/***
 * 选举表实体
 */
@Entity("sys-election")
export class ElectionEntity extends TimeEntity {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({comment: '投票选举的标题' })
    name: string;

    @Column({comment: '选举的内容描述', nullable: true })
    description?: string;

    @Column({comment: '选举的状态:0-未开始 1-进行中 2-结束', default: ELECTION_STATUS.NotStarted, type: 'tinyint' })
    status?: number;
}