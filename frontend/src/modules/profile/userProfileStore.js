// frontend\src\modules\profile\userProfileStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import axiosInstance from "@/plugins/connectionBuilder.js";

const userProfileStore = {
  state: {
    displayName: "",
    isProfessionalTrader: false,
    userProfile: {}
  },
  mutations: {
    setUserProfile(state, profile) {
      state.userProfile = profile;
    }
  },
  actions: {
    createFirstProfile({ dispatch }, payload) {
      let userProfilePayload = {
        DisplayName: payload.email,
        PhoneNumber: "",
        IsProfessionalTrader: false,
        userId: payload._id
      };
      dispatch("saveUserProfile", userProfilePayload);
    },
    saveUserProfile({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        axiosInstance
          .post("advertisers", payload)
          .then(function (response) {
            commit("setIsProcessing", false);
            commit("setUserProfile", response.data);
            resolve(response.data);
          })
          .catch(function (error) {
            dispatch("handleApiErrors", error);
            reject();
          });
      });
    },
    loadUserProfile({ commit, dispatch, getters }, payload) {
      commit("setIsProcessing", true);
      return new Promise(function (resolve, reject) {
        axiosInstance
          .get(`advertisers/loadUserProfile/${payload.userId}`)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setUserProfile", response.data);
            resolve(response.data);
          })
          .catch(error => {
            if (payload && payload.userId) {
              if (error.response.data.statusCode === 404) {
                dispatch("createFirstProfile", getters.getLoggedUser).then(() => {
                  dispatch("loadUserProfile", payload);
                })
              } else {
                commit("setIsProcessing", false);
                dispatch("handleApiErrors", error);
                reject(error);
              }
            }

          });
      });
    }
  },
  getters: {
    getUserProfile(state) {
      return state.userProfile;
    }
  }
};

export default userProfileStore;
