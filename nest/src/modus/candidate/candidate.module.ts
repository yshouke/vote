/*
https://docs.nestjs.com/modules
*/
import { CandidateController } from './candidate.controller';
import { CandidateService } from './services/candidate.service';
import { Module } from '@nestjs/common';
import { CommModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from 'src/entities/candidate.entity';

@Module({
    imports: [
        CommModule,
        TypeOrmModule.forFeature([
            CandidateEntity
        ])],
    controllers: [
        CandidateController,],
    providers: [
        CandidateService,],
})
export class CandidateModule { }
