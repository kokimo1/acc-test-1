import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import ManageEmployees from '../views/ManageEmployees.vue';
import ManageSingleEmployee from '../views/ManageSingleEmployee.vue';
import NewRequest from '../views/NewRequest.vue';
import LeaveItem from '../views/LeaveItem.vue';
import Holidays from '../views/Holidays.vue';

import UserInfo from '../components/UserInfo.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home,
      UserInfo,
    },
  },
  {
    path: '/leave-item/:uuid',
    name: 'Leave Item',
    components: {
      default: LeaveItem,
      UserInfo,
    },
  },
  {
    path: '/manage-employees',
    name: 'Manage Employees',
    components: {
      default: ManageEmployees,
    },
  },
  {
    path: '/manage-employees/:uin',
    name: 'Manage Single Employee',
    components: {
      default: ManageSingleEmployee,
      UserInfo,
    },
  },
  {
    path: '/manage-employees/:uin/leave-item/:uuid',
    name: 'Employee Leave Item',
    components: {
      default: LeaveItem,
      UserInfo,
    },
  },
  {
    path: '/new-request',
    name: 'New Leave Request',
    components: {
      default: NewRequest,
      UserInfo,
    },
  },
  {
    path: '/holidays',
    name: 'Holidays',
    components: {
      default: Holidays,
      UserInfo,
    },
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      default: Login,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  // {
  //   path: '/404',
  //   name: '404',
  //   components: {
  //     default: 404,
  //   },
  // },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
