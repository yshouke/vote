
/*
https://docs.nestjs.com/modules
*/
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { CommModule } from '../common/common.module';
import { DbModule } from '../common/db/db.module';
import { BaseService } from '../common/db/mysql/base.service';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [
        CommModule,
        TypeOrmModule.forFeature([
            UserEntity
        ])
    ],
    controllers: [
        UsersController
    ],
    providers: [
        UsersService,
    ],
    exports: [UsersService]
})
export class UsersModule { }
