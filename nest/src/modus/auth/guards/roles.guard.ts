/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
/**
 * 管理员权限的守卫
 */
@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(
    private reflector: Reflector,

  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request?.user) {
      throw new Error("未登录状态或登录过期");
    }
    const {userType} = request.user;
    if (userType !== 0) {
      throw new Error("非管理员权限");
    }
    return true
  }


}
