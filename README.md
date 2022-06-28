
## 背景：
**按要求做一个简单的选举投票：**  
1. 系統管理員部分
    a. 管理員⽤⼾可以控制選舉的開始和結束
    b. 管理員可以在系統中添加候選⼈，不可移除候選⼈，⼀場選舉最少2個候選⼈
    c. 管理員可在選舉開始後的任何時間查詢選舉中候選⼈的實時得票情況，實時情況
    包括：
    i. 每個候選⼈獲得的票數
    ii. 投給該候選⼈的⽤⼾，10個⽤⼾⼀⾴
    d. 管理員可在選舉結束後查詢選舉最終結果
  2. 普通⽤⼾可以在驗證⾝分證後進⾏投票

    a. ⽤⼾需要登記郵箱和驗證香港⾝分證號碼⽅可進⾏投票
    i. 香港⾝分證號格式為：字⺟+6位數字+括號內1位數字，例如:A123456(7)
    b. ⽤⼾在投票之後可以⼀次性⾒到當時的選舉實時狀態
    c. ⽤⼾在選舉結束後，可通過之前登記的郵箱接收到選舉詳細結果
    d. 每個合法⽤⼾在每次選舉限投票⼀次

  **技術要求**
  1. 使⽤JavaScript/TypeScript語⾔
  2. 使⽤任⼀被廣泛使⽤的node.js Javascript/TypeScript框架
  3. 使⽤任意SQL數據庫或MongoDB
  4. 有單元測試代碼
  5. 良好的代碼風格和架構
  6. 必須附帶有詳細的Readme⽂檔來描述如何設置和運⾏你的項⽬
  7. 

    **額外加分項**
  1. 有Cache
  2. 有API⽂檔
  3. 有錯誤處理(Error Handling)
  4. 使⽤Docker

## 实体：
  总共4张表：
  1. 用户表：
     
     - 因为比较简单总共就两个身份，所以就没建角色表和权限表， 直接在用户表里面用`userType`字段区分`普通用户`和`管理员`，然后在`守卫`里面做接口权限判断。用户表实体如下:
     
     ```typescript
       @Entity('sys_users')
       export class UserEntity extends TimeEntity {
         @PrimaryGeneratedColumn()
         id?: number;
     
         @Column({comment: '用户名', default: ''})
         username?: string;
         
         @Column({comment: '密码', default: md5(123456)})
         password?: string;
         
         @Index()
         @Column({comment: '香港⾝分證號格式為：字⺟+6位數字+括號內1位數字,例如:A123456(7)', })
         idCard: string;
         
         @Index()
         @Column({ comment: '邮箱', nullable: true})
         email?: string;
         
         @Column({ comment: '状态 0:管理员 1:普通用户', default: USER_TYPE.Normal, type: 'tinyint' })
         userType?: number;
         
         @Column({ comment: '状态 0:正常 1:删除', default: 0, type: 'tinyint' })
         isDel?: number;
     
       }
     ```
     
  2. 候选人表

       - 题目中并没有对候选人有啥要求，实体如下：


       ```typescript
       /***
        * 候选人实体
        */
       @Entity('sys_candidate')
       export class CandidateEntity extends TimeEntity {
         @PrimaryGeneratedColumn()
         id?: number;
       
         @Column({comment: '用户名' })
         username: string;
       
       }
       ```


​       

  3. 选举记录表
     
       - 选举表实体：
       
          ```typescript
          /***
           * 选举表实体
           */
          @Entity("sys-election")
          export class ElectionEntity extends TimeEntity {
              @PrimaryGeneratedColumn()
              id?: number;
            
              @Column({comment: '投票选举的标题' })
              name: string;
          
              @Column({comment: '选举的内容描述', nullable: true })
              description?: string;
          
              @Column({comment: '选举的状态:0-未开始 1-进行中 2-结束', default: ELECTION_STATUS.NotStarted, type: 'tinyint' })
              status?: number;
          }
          ```
     
  4. 候选人表与选举记录的关联表

     1. 候选人与选举记录是多对多的关系，所以需要一张关联表，实体如下：

        ```typescript
        /***
         * 候选人表与选举表的关联表实体
         */
        @Entity('sys_candidate_election')
        export class Candidate_ElectionEntity extends TimeEntity {
          @PrimaryGeneratedColumn()
          id?: number;
        
          @Column({comment: '候选人表ID' })
          candidateId: number;
          
          @Column({comment: '选举表ID' })
          electionId: number;
        
          @Column({comment: '候选人票数', default: 0 })
          candidateNumber?: number;
        
          @Column({comment: '普通用户投票ID列表', default: '' })
          voterIdList?: string
        }
        ```

     2. 如果投票人数很多可以多建一张用户表与此表的关联表，这样方便后续的维护和扩展。我这里为了方便用`voterIdList`字段记录投票人的id用`,`分割,读取的时候用ORM的`@AfterLoad()` 监听器自动转成数组

     四个实体表继承的`TimeEntity`是一个公共的抽象类：

     ```typescript
     export abstract class TimeEntity {
         @UpdateDateColumn({comment: '更新时间'})
         updatedDate?: Date;
       
         @CreateDateColumn({comment: '创建时间'})
         createdDate?: Date;
         
         @Column({ comment: '状态 0:正常 1:删除', default: 0, type: 'tinyint' })
         isDel?: number;
     }
     ```

     

## 目录结构及说明：

```bash
src：
    │  app.controller.spec.ts
    │  app.controller.ts
    │  app.module.ts
    │  app.service.ts
    │  main.ts
    │
    ├─config  // 存放所有配置文件的目录
    │      crypto.config.ts // crypto 配置文件
    │      jwt.config.ts  // jwt 配置文件
    │      mailer.config.ts  // 邮箱 配置文件
    │      mysqlConfig.ts  // mysql 配置文件
    │      redis.config.ts  // redis 配置文件
    │
    ├─decorators // 存放公共自定义装饰器的文件目录
    │      ishonkonidcard.decorator.ts // 校验香港身份 装饰器
    │      roles.decorator.ts // 区分管理员与普通用户权限校验 装饰器
    │
    ├─dto // 存放公共dto的文件目录
    │      deleteById.dto.ts // 根据id删除的Dto
    │      deleteByIds.dto.ts // 根据id list 删除的Dto
    │      limit.dto.ts // 分页的Dto
    │
    ├─entities // 存放所有实体的文件目录
    │  │  candidate.election.entity.ts // 候选人与选举的关联关联表 实体
    │  │  candidate.entity.ts // 候选人表 实体
    │  │  election.entity.ts // 选举表 实体
    │  │  users.entity.ts  // 用户表 实体
    │  │
    │  └─common // 公共实体文件目录
    │          timeEntity.ts // 公共实体
    │
    ├─enums // 全局的枚举配置文件目录
    │      index.ts // 枚举配置文件
    │      
    ├─filter // 异常处理文件目录
    │      exception.filter.ts // 全局异常捕获处理
    │
    ├─interceptor // 拦截器文件目录
    │      transform.interceptor.ts // 拦截成功的响应，统一转换数据
    │
    ├─modus // 功能模块文件目录
    │  ├─auth // 权限文件模块
    │  │  │  auth.module.ts
    │  │  │  auth.service.ts
    │  │  │
    │  │  ├─guards // 守为文件目录
    │  │  │      local.guard.ts // 本地守卫
    │  │  │      roles.guard.ts // 权限守卫
    │  │  │
    │  │  └─strategy // 策略文件目录
    │  │          jwt.strategy.ts // jwt 策略
    │  │          local.strategy.ts // 本地策略
    │  │
    │  ├─candidate // 候选人模块目录
    │  │  │  candidate.controller.spec.ts // 候选人接口单元测试
    │  │  │  candidate.controller.ts // 候选人控制器
    │  │  │  candidate.module.ts // 候选人模块
    │  │  │
    │  │  ├─dto // 候选人接口dto
    │  │  │      addUser.dto.ts
    │  │  │
    │  │  └─services // 候选人service文件目录
    │  │          candidate.service.ts // 候选人接口service
    │  │
    │  ├─common // 公共模块目录
    │  │  │  comm.service.ts  //  公共模块service文件
    │  │  │  common.module.ts //  公共模块module文件
    │  │  │
    │  │  └─db // 数据库模块目录
    │  │      │  db.module.ts  //  数据库模块文件
    │  │      │
    │  │      ├─mysql // mysql模块目录
    │  │      │      base.service.ts  //  mysql 公共service文件
    │  │      │      mysql.module.ts  //  mysql module文件
    │  │      │
    │  │      └─redis // redis模块目录
    │  │              redis-cache.module.ts //  redis缓存模块文件
    │  │              redis-cache.service.ts  //  redis缓存service文件
    │  │
    │  ├─election  //  选举模块文件目录
    │  │  │  election.controller.spec.ts //  选举接口单元测试
    │  │  │  election.controller.ts  //  选举控制器
    │  │  │  election.module.ts  // 选举module文件
    │  │  │
    │  │  ├─dto //  选举接口Dto
    │  │  │      addElection.dto.ts
    │  │  │      queryElection.dto.ts
    │  │  │      queryVotingUsers.dto.ts
    │  │  │      updateElectionStatus.dto.ts
    │  │  │      userVoting.dto.ts
    │  │  │
    │  │  └─services // 选举service文件目录
    │  │          election.service.ts  //  选举service文件
    │  │
    │  └─user  // 用户模块文件目录
    │      │  users.controller.spec.ts  //  用户接口单元测试
    │      │  users.controller.ts  // 用户控制器
    │      │  users.module.ts  // 用户module文件
    │      │
    │      ├─dto  //  用户接口Dto
    │      │      addUser.dto.ts
    │      │      findUser.dto.ts
    │      │      updateUser.dto.ts
    │      │      userDto.ts
    │      │      userLoginDto.ts
    │      │
    │      └─services //  用户service文件目录
    │              users.service.ts  //  用户service文件
    │
    └─services  // 公共的service文件目录


	
```

## 前端页面：

虽然不要求前端界面，但这题目简单时间又多，就一起做了。截个图：

1. 管理员登录界面：![登录图片](https://github.com/yshouke/vote/blob/master/react/images/image-20220627225648745.png)
2. 所有用户列表：![image-20220627230135687](https://github.com/yshouke/vote/blob/master/react/images/image-20220627230116290.png)
3. 所有候选人列表：![所有候选人列表](C:\Users\bauiw\AppData\Roaming\Typora\typora-user-images\image-20220627230318348.png)
4. 选举记录相关页面![image-20220627230526209](C:\Users\bauiw\AppData\Roaming\Typora\typora-user-images\image-20220627230526209.png)
5. ![image-20220627230618784](C:\Users\bauiw\AppData\Roaming\Typora\typora-user-images\image-20220627230618784.png)

6. ![image-20220627230919142](C:\Users\bauiw\AppData\Roaming\Typora\typora-user-images\image-20220627230919142.png)

7.  普通用户投票页面：![image-20220627231136909](C:\Users\bauiw\AppData\Roaming\Typora\typora-user-images\image-20220627231136909.png)



## 项目启动：

```bash
# 后端
	#本地
        # 后端根目录
        # 命令: pnpm install // 建议用pnpm安装依赖或yarn 
        # 命令：npm run start:dev
	#生产
		# 后端根目录
		# 命令：docker build -t vote:v1.0 . // 打包镜像
		# 命令：docker run -d --restart=always -p 3000:3000 vote:v1.0 // 启动镜像
# 前端
	#本地
		# 前端根目录
		# 命令： npm install // 或yarn
		# 命令： npm start
	#生产
		# npm build // 生成静态资源在dist目录
		
```



## 演示站点：

​	反正前端都写完了，直接部署吧..	

​	演示站点地址：https://simple-election-vote.site/#/user/login

​	账号：admin

​	密码： 666666

​	选举列表点选举名称可以跳到前台投票页面。

​	因为是孟买的服务器且才1核2G，国内访问慢。

​	后端服务器是国内的直接通过postman调api接口会快很多http://120.76.230.143:3000/，

​	swagger文档http://120.76.230.143:3000/doc

1. 演示站点前端服务器配置：

   ```nginx
   		# 演示站点nginx静态服务配置：
   		    listen 80;
               listen 443 ssl http2;
               server_name simple-election-vote.site;
               index index.html index.htm default.htm default.html;
               # npm build 静态文件
               root /www/wwwroot/simple-election-vote.site; 
               
               #HTTP_TO_HTTPS_START
               #强制443
               if ($server_port !~ 443){
                   rewrite ^(/.*)$ https://$host$1 permanent;
               }
               
           #  演示站点nginx反向代理后端服务器配置：
           	# 带/api/路径的代理到后端服务器 http://120.76.230.143:3000/
               location ^~ /api/
               {
                   proxy_pass http://120.76.230.143:3000/;
               	# 如果域名没有备案，代理到国内云服务器，Host值必须写IP不能写域名
                   proxy_set_header Host 124.156.85.143;
                   proxy_set_header X-Real-IP $remote_addr;
                   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                   proxy_set_header REMOTE-HOST $remote_addr;
   
                   add_header X-Cache $upstream_cache_status;
   
                   #Set Nginx Cache
                   
                   set $static_fileVnn845Z8 0;
                   if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
                   {
                       set $static_fileVnn845Z8 1;
                       expires 12h;
                       }
                   if ( $static_fileVnn845Z8 = 0 )
                   {
                   add_header Cache-Control no-cache;
                   }
               }
   
               # PROXY-END/
   ```

2.  演示站点后端服务器配置：

   ​	

   ```bash
   # docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet // 自定义桥接网卡
   # docker network connect mynet myredis // redis镜像加入自定义网络
   # docker network connect mynet mysql  // mysql镜像加入自定义网络
   # docker run -d --restart=always -p 3000:3000 vote:v1.0 // 启动后端镜像
   # docker network connect mynet vote:v1.0 // 加入自定义网络，代码里面要修改redis.config 和myslq.config 里面的ip地址
   
   
   ```



## 总结：

​	结合上面的 目录结构及说明，演示站点，swagger文档，再加上代码里的注释应该可以比较快速理解代码，再总结一下


1. 共四张表【`用户表`，`选举表`，`候选人表`，`候选人与选举关联表`】对应了modus文件夹下面的【`user`, `election`, `candidate`】模块，投票的逻辑在对应的service里面

2. 投票的逻辑：![image-20220628111142859](C:\Users\bauiw\AppData\Roaming\Typora\typora-user-images\image-20220628111142859.png)

3.   权限相关在 roles.guard.ts和local.strategy.ts 文件里面， 一个校验登录，一个校验管理员和普通用户的的权限

4. 数据库和redis缓存写在`common/db`下面，配置在`config文件夹`下面， orm的sql查询缓存写入redis 3表 1.5秒失效，`redis的set，get `封装在`redis-cache.service`服务里面写入2表

   


5. 错误处理与统一接口返回: `exception.filter.ts`里面封装了统一的错误处理，返回前端，`transform.interceptor.ts` 定义了接口成功统一的数据格式`{statusCode: '200',message: '成功',data: any}`

   ​    

