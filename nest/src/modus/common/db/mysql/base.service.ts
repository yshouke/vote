/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, RemoveOptions, Repository, SaveOptions, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class BaseService<T> {
    protected readonly rep: Repository<T>
    constructor(repository: Repository<T>) {
        this.rep = repository
    }
    
    async findOne(options: FindOneOptions<T>): Promise<T> {
        return await this.rep.findOne(options);
    }

    async insert(options: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<any> {
        return await this.rep.insert(options);
    }

    async saveMany(entities: DeepPartial<T>[], options?: SaveOptions): Promise<DeepPartial<T>[]> {
        return this.rep.save(entities, options);
    }

    async findMany(options?: FindManyOptions<T>): Promise<T[]> {
        return this.rep.find(options);
    }

    async removeOne(entity: T, options?: RemoveOptions): Promise<T> {
        return this.rep.remove(entity, options);
    }

    async removeMany(entity: T[], options?: RemoveOptions): Promise<T[]> {
        return this.rep.remove(entity, options);
    }

    async delete(options: string | number | Date | string[] | number[] | Date[] | FindConditions<T>): Promise<DeleteResult> {
        return this.rep.delete(options);
    }

    async update(conditions: string | number | Date | string[] | number[] | Date[] | FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {

        return this.rep.update(conditions, partialEntity);
        
    }
}
