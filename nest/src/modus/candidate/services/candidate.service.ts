/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateEntity } from 'src/entities/candidate.entity';
import { BaseService } from 'src/modus/common/db/mysql/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class CandidateService extends BaseService<CandidateEntity> {
    constructor(
        @InjectRepository(CandidateEntity)
        private readonly userRep: Repository<CandidateEntity>,
      ) {
        super(userRep);
    }
}
