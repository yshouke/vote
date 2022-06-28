
const dev = {
    host: 'localhost',
    password: '',
    port: 6379,
}

const pro = {
    host: '192.168.0.3',
    password: '000415',
    port: 6379,
}

export const redisConfig = process?.env?.NODE_ENV === 'local' ? dev : pro;
