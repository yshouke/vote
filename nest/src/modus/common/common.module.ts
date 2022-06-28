import { CommService } from './comm.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from './db/db.module';

@Module({
    imports: [DbModule],
    controllers: [],
    providers: [
        CommService,],
    exports: [CommService, DbModule]
})
export class CommModule { }
