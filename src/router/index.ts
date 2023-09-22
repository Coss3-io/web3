import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHashHistory,
} from "vue-router";

export enum RouteNames {
  Home = "Home",
  Test = "Test",
  FSA = "FSA",
}

let routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "home" */ "../component/pages/Home.vue"
      ),
    name: RouteNames.Home,
  },
  {
    path: "/test",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "test" */ "../component/pages/Test.vue"
      ),
    name: RouteNames.Test,
  },
  {
    path: "/fsa",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "FSA" */ "../component/pages/FSA.vue"
      ),
    name: RouteNames.FSA,
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
