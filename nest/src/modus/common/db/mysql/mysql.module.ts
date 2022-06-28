/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from 'src/config/mysqlConfig';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...mysqlConfig,
            autoLoadEntities: true,
        }),
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class MysqlModule { }
