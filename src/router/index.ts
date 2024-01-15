import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHashHistory,
} from "vue-router";
import { useAccountStore } from "../store/account";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export enum RouteNames {
  Home = "Home",
  Test = "Test",
  Bot = "Bot",
  Trade = "Trade",
  Lending = "Lending",
  NewBot = "New-Bot",
  FSA = "FSA",
  Promo = "Promo",
  Dashboard = "Dashboard",
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
    path: "/trade/:pair?",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "trade" */ "../component/pages/Trade.vue"
      ),
    name: RouteNames.Trade,
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
        path: ":index",
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
  {
    path: "/promo",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "PROMO" */ "../component/pages/Promo.vue"
      ),
    name: RouteNames.Promo,
  },
  {
    path: "/dashboard",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "Dashboard" */ "../component/pages/Dashboard.vue"
      ),
    name: RouteNames.Dashboard,
  },
  {
    path: "/lending",
    component: () =>
      import(
        /* webpackPreload: true */ /* webpackChunkName: "Lending" */ "../component/pages/Lending.vue"
      ),
    name: RouteNames.Lending,
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  document.title = `coss3.io | ${String(to.name)}`;
});

export default router;
