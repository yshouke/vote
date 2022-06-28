import { defineConfig } from 'umi';

export default defineConfig({
  mfsu: {},
  nodeModulesTransform: {
    type: 'none',
  },
  history: {type: 'hash'},
  // layout: {},
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  //   { path: '/p', component: '@/pages/products' },
  // ],
  fastRefresh: {}
});
