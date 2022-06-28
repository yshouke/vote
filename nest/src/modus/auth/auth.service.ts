/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/services/users.service';
import * as md5 from 'md5'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.findOne({where: {username, password: md5(password)}})
        if (user) {
            const { password, ...result } = user;
            return await this.login(result);
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user.username, userType: user.userType, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
            ...user
        }
    }
}
