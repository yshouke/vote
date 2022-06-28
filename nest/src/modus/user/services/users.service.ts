/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { FindOneOptions } from 'typeorm';
import { userDto } from '../dto/userDto';
import { Repository } from 'typeorm/repository/Repository';
import { BaseService } from 'src/modus/common/db/mysql/base.service';
import { FindUserDto } from '../dto/findUser.dto';
import { AddUserDto } from '../dto/addUser.dto';

import * as md5 from 'md5'
import { UpdateUserDto } from '../dto/updateUser.dto';
import { CommService } from 'src/modus/common/comm.service';
import { isNil, omitBy } from 'lodash';

@Injectable()
export class UsersService extends BaseService<UserEntity> {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRep: Repository<UserEntity>,
      ) {
        super(userRep);
    }

   async insertUsers(body: AddUserDto) {
        // const initPassword = Math.random().toString(36).slice(-8);
        let insertData: UserEntity = {
            ...body,
            password: md5(body?.password || 123456),
            isDel: 0
        }
        await super.insert(insertData)
        return;
    }
    /**
     * 注册普通用户，生成tokent密钥进行投票
    */
    async insertNormalUsers({email, idCard}: { email: string; idCard: string; }) {
        const user = {
            idCard,
            isDel: 0,
            userType: 1
        }
        let data: string
        let {id} = await this.userRep.findOne(user) || {}
        if (!id){
            const userInsert = await this.userRep.insert({...user, email})
            console.log(userInsert)
            data = `${idCard},${userInsert.identifiers[0].id},${CommService.currentTime()}`
        } else {
            data = `${idCard},${id},${CommService.currentTime()}`
        }
        const encryptData = CommService.cryptoEncrypt(data)
        return encryptData
    }
    /**
     * 根据ID编辑(删除)用户表信息
    */
    async updateUserById(data: UpdateUserDto) {
        let updateData: UserEntity = data
        return await super.update(data.id, updateData)
    }
    /**
     * 根据条件分页查找用户表信息
    */
    async findUsers(options: FindUserDto) {
        const {pageSize, pageNum, ...opt} = options
        const [userList, count] = await this.userRep.findAndCount({
            select: ['username', 'idCard', 'email', 'id', 'userType'],
            where: {...opt, isDel: 0},
            skip: pageSize * (pageNum-1),
            take: pageSize,
            cache: true
        });
        return {list: userList, count, pageSize, pageNum}
    }
    /**
     * 删除对象里面的 空字符 && undefined && null 
     * @param data 
     * @returns 
     */
    filterNullValues = (data) => {
        return omitBy(data, (v) => isNil(v) || v === '' );
    }

}

