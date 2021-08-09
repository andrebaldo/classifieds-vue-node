// frontend\src\router\index.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import Vue from "vue";

import VueRouter from "vue-router";
import AdvertisementListing from "@/components/pages/advertisement/AdvertisementListing";
import AdDetails from "@/components/pages/advertisement/AdDetails";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: AdvertisementListing,
    children: [
      {
        name: 'ad.details',
        path: 'ad-details',
        components: {
          dialog: AdDetails,
          default: AdvertisementListing
        },
        props: { default: false, dialog: true }
      }
    ]

  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView")
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/components/pages/ResetPasswordPage")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView"),

  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView"),
    meta: { requiresAuth: true }
  },
  {
    path: "/advertisement",
    name: "advertisement",
    component: () => import("@/views/AdvertisementView"),
    meta: { requiresAuth: true }
  },
  {
    path: "/new-advertisement",
    name: "new-advertisement",
    component: () => import("@/components/pages/advertisement/NewAdvertisementIndex"),
    meta: { requiresAuth: true }
  },
  {
    path: "/new-car-ad",
    name: "new-car-ad",
    component: () => import("@/components/pages/advertisement/NewCarAdvertisement"),
    meta: { requiresAuth: true }
  },
  {
    path: "/new-generic-ad",
    name: "new-generic-ad",
    component: () => import("@/components/pages/advertisement/NewGenericAdvertisement"),
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});



router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth && !localStorage.loginToken) {
    next({
      name: "login"
    });
  } else {
    next();
  }
  let currentPage = to.path.replace(/\/*/g, "").replace(/[-*]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  if (!localStorage.loginToken || currentPage === "") {
    currentPage = "Classi Manx";
  }
  router.app.$store._mutations.setCurrentScreen[0](currentPage);
});


export default router;
