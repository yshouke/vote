/*
https://docs.nestjs.com/modules
*/
import { ElectionService } from './services/election.service';
import { ElectionController } from './election.controller';
import { Module } from '@nestjs/common';
import { CommModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { ElectionEntity } from 'src/entities/election.entity';
import { Candidate_ElectionEntity } from 'src/entities/candidate.election.entity';
import { CandidateEntity } from 'src/entities/candidate.entity';
import { RedisCacheModule } from '../common/db/redis/redis-cache.module';

@Module({
    imports: [
        CommModule,
        TypeOrmModule.forFeature([
            ElectionEntity,
            Candidate_ElectionEntity,
            CandidateEntity,
            UserEntity
        ])],
    controllers: [
        ElectionController,],
    providers: [
        ElectionService,],
})
export class ElectionModule { }
