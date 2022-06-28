/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Request, Post, UseGuards, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AddUserDto } from './dto/addUser.dto';
import { FindUserDto } from './dto/findUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { userLoginDto } from './dto/userLoginDto';
import { UsersService } from './services/users.service';


@Controller('user')
@ApiTags('用户接口')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
    ) {}

    @Post('login')
    @ApiOperation({ summary: '管理员用户登录接口'})
    @UseGuards(LocalAuthGuard)
    async userLogin(@Body() body: userLoginDto, @Request() req){
        return req.user
    }
    /**
     * 添加管理员用户
     * @param body: AddUserDto 
    */
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOperation({ summary: '添加管理员接口'})
    @Post()
    async addAdminUser(@Body() body: AddUserDto){
        return await this.userService.insertUsers(body)
    }
    /**
     * 添加普通用户投票
     * @param body: AddUserDto 
    */
    @ApiOperation({ summary: '添加普通用户接口'})
    @Post('addNormalUser')
    async addNormalUser(@Body() {email,idCard}: AddUserDto){
        return await this.userService.insertNormalUsers({email,idCard})
    }
    /**
     * 修改用户管理员信息
     * @param data: UpdateUser 
     */
    @ApiOperation({ summary: '修改用户信息接口'})
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put()
    async updateUsers(@Body() data: UpdateUserDto): Promise<any>{
        return await this.userService.updateUserById(data)
    }
    /**
     * 删除用户管理员信息
     * @param data: UpdateUser 
    */
    @ApiOperation({ summary: '删除用户接口'})
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete()
    async delUsers(@Body() data: UpdateUserDto): Promise<any>{
        return  await this.userService.updateUserById(data)
    }
    /**
     * 查找所有用户
     * @param body: FindUserDto 
    */
    @ApiOperation({ summary: '获取用户列表接口'})
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('findUsers')
    async findUsers(@Body() data: FindUserDto){
        return this.userService.findUsers(data)
    }
}
