import { CandidateModule } from './modus/candidate/candidate.module';
import { ElectionModule } from './modus/election/election.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/exception.filter';
import { CommModule } from './modus/common/common.module';
import { UsersModule } from './modus/user/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modus/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
@Module({
  imports: [
    CandidateModule,
    ElectionModule,
    CommModule,
    UsersModule,
    AuthModule,
    MailerModule.forRoot(mailerConfig)
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService
  ],
})
export class AppModule { }
