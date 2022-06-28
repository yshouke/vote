


import { defineConfig } from 'umi';

export default defineConfig({
    proxy: {
        '/api': {
        target: 'http://localhost:3000', //代理的地址
        pathRewrite: { '^/api': '' },
        changeOrigin: true
        }
    },
    define: {
        ENV: 'local',
        BASE_URL: 'http://localhost:3000/api',
        'process.env': process.env
    }
    
});
