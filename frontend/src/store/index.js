// frontend\src\store\index.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import Vue from "vue";
import Vuex from "vuex";
import globalStore from "./gobalStore";

import authStore from "@/modules/authentication/authStore";
import notificationStore from "@/modules/notification/notificationStore";
import userProfileStore from "@/modules/profile/userProfileStore";
import CarAdvertisementStore from "@/modules/advertisement/CarAdvertisementStore";
import ImageUploadStore from "@/modules/fileUpload/ImageUploadStore";
import AdvertisementStore from "@/modules/advertisement/AdvertisementStore";
import AdvertisementsIndexStore from "@/modules/advertisement/AdvertisementsIndexStore"
//import SearchStore from "@/modules/search/searchStore"

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    authStore,
    notificationStore,
    userProfileStore,
    globalStore,
    CarAdvertisementStore,
    AdvertisementStore,
    AdvertisementsIndexStore,
    ImageUploadStore,

  }
});
export default store; 
