import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategy/local.strategy';
import { UsersModule } from '../user/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt.config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    })],
    controllers: [],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
})
export class AuthModule { }
