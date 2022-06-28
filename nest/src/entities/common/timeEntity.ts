import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class TimeEntity {
    @UpdateDateColumn({comment: '更新时间'})
    updatedDate?: Date;
  
    @CreateDateColumn({comment: '创建时间'})
    createdDate?: Date;
    
    @Column({ comment: '状态 0:正常 1:删除', default: 0, type: 'tinyint' })
    isDel?: number;
}