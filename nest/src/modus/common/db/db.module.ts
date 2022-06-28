/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';
import { RedisCacheModule } from './redis/redis-cache.module';

@Module({
    imports: [MysqlModule, RedisCacheModule],
    controllers: [],
    providers: [],
    exports:[RedisCacheModule]
})
export class DbModule {}
