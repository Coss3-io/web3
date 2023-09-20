import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHashHistory,
} from "vue-router";

export enum RouteNames {
  Home = "Home",
  Test = "Test",
}

let routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "ressources" */ "../component/pages/Home.vue"
      ),
    name: RouteNames.Home,
  },
  {
    path: "/test",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "ressources" */ "../component/pages/Test.vue"
      ),
    name: RouteNames.Test,
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  document.title = `coss3.io | ${String(to.name)}`;
});

export default router;
