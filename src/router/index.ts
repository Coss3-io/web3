import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHashHistory,
} from "vue-router";

export enum RouteNames {
  Home = "Home",
  Test = "Test",
  Bot = "Bot",
  NewBot = "New-Bot",
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
    path: "/bot",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "bot" */ "../component/pages/Bot.vue"
      ),
    children: [
      {
        path: "",
        name: RouteNames.NewBot,
        component: () =>
        import(
          /* webpackPreload: true */ /* webpackChunkName: "newBot" */ "../component/sections/Bot/NewBot.vue"
          ),
        },
        {
          path: ":id",
          name: RouteNames.Bot,
          component: () =>
            import(
              /* webpackPreload: true */ /* webpackChunkName: "botId" */ "../component/sections/Bot/BotDetails.vue"
            ),
        },
    ],
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
