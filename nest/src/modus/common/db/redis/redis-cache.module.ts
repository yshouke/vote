import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/config/redis.config';
import { RedisCacheService } from './redis-cache.service';
 
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
      auth_pass: redisConfig.password,
      db: '2' // 目标库
    }),
  ],
  controllers: [],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule { }