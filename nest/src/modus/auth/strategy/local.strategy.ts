import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { USER_TYPE } from 'src/enums';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.exception('---账号或密码无效---', HttpStatus.FORBIDDEN)
    }
    console.log(user)
    if (user.userType != USER_TYPE.Admin) {
      this.exception('---非管理员用户无权限登录---', HttpStatus.UNAUTHORIZED)
    }
    return user;
  }
  exception(message, httpCode){
    throw new HttpException({
      status: httpCode,
      message,
    }, httpCode);
  }
}