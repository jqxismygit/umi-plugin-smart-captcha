import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [require.resolve('../lib')],
  routes: [
    {
      path: '/',
      routes: [
        {
          path: '/',
          redirect: '/user/login',
        },
        {
          path: '/user/login',
          component: '@/pages/index',
        },
      ],
    },
  ],
});
