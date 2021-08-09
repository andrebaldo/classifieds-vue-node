// AdvertisementStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import axiosInstance from "@/plugins/connectionBuilder.js";

const AdvertisementStore = {
  state: {
    savedAdvertisement: null,
    availableCategories: null
  },
  mutations: {
    setSavedAdvertisement(state, savedAd) {
      state.savedAdvertisement = savedAd;
    },
    setAvailableCategories(state, categories) {
      state.availableCategories = categories;
    }
  },
  actions: {
    saveAdvertisement({ commit, dispatch, getters }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        if (getters.savedAdvertisementGetter && getters.savedAdvertisementGetter._id) {
          payload._id = getters.savedAdvertisementGetter._id;
        }
        axiosInstance
          .post("advertisements/save", payload)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setSavedAdvertisement", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setSavedAdvertisement", null);
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    clearAdvertisement({ commit }) {
      commit("setSavedAdvertisement", null);
    },
    loadAdvertisementToEdit({ commit, dispatch }, ad) {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`advertisements?id=${ad._id}`)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setSavedAdvertisement", response.data[0]);
            commit("setSavedCarAdvertisement", response.data[0].car_advertisement);
            commit("setFilesUploaded", response.data[0].media_files);
            resolve();
          })
          .catch(error => {
            commit("setSavedAdvertisement", null);
            dispatch("handleApiErrors", error);
            reject();
          });
      })
    },
    clearForNewAdvertisement({ commit }) {
      commit("setSavedAdvertisement", null);
      commit("setSavedCarAdvertisement", null);
      commit("setFilesUploaded", []);
    },
    updateAdvertisement({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        axiosInstance
          .put(`advertisements/${payload._id}`, payload)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setSavedAdvertisement", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setSavedAdvertisement", null);
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    updateAdvertisementCategory({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        axiosInstance
          .put(`advertisements/updateCategory/${payload._id}`, payload)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setSavedAdvertisement", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setSavedAdvertisement", null);
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    sendMessageToAdvertiser({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        axiosInstance
          .post(`message-advertisements`, payload) // {ad_id, message, sender_id, link}
          .then(response => {
            commit("setIsProcessing", false);
            resolve(response.data);
          })
          .catch(error => {
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    loadAdAvaliableAdCategories({ commit, dispatch }) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        axiosInstance
          .get(`advertisement-categories`)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setAvailableCategories", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setAvailableCategories", []);
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    }
  },
  getters: {
    savedAdvertisementGetter(state) {
      return state.savedAdvertisement;
    },
    getAvailableAdCategories(state) {
      return state.availableCategories;
    }
  }
};

export default AdvertisementStore;
