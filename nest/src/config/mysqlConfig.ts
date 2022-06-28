import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import {resolve} from 'path'

const dir = resolve(__dirname, '../entities/**/*{.ts,.js}')
const dev: MysqlConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'vote_system',
    entities: [
        dir,
    ],
    synchronize: true,
    cache: {
        type: 'ioredis',
        duration: 1500,
        options: {
            host: 'localhost',
            password: '',
            port: 6379,
            db:'3'
        }
    },
}

const pro: MysqlConnectionOptions = {
    type: 'mysql',
    host: '192.168.0.2',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'vote_system',
    entities: [
        dir,
    ],
    synchronize: true,
    cache: {
        type: 'ioredis',
        duration: 1500,
        options: {
            host: '192.168.0.3',
            password: '000415',
            port: 6379,
            db:'3' // orm的缓存放在redis 3库
        }
    },
    extra: {
        connectionTimeoutMillis: 2000
    }
}


export const mysqlConfig = process?.env?.NODE_ENV === 'local' ? dev : pro;
