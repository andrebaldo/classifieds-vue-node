// frontend\src\modules\authentication\authStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import axiosInstance from "@/plugins/connectionBuilder.js";

const authStore = {
  state: {
    isUserLoggedIn: false,
    isRegistrationProcessSucceed: false,
    registrationProcessMessage: "",
    loginToken: "",
    loginProcessMessage: "",
    userId: "",
    user: null
  },
  mutations: {
    setLogged(state, loginResult) {
      state.isUserLoggedIn = loginResult.success;
      state.loginProcessMessage = loginResult.message;
      if (loginResult.success) {
        state.loginToken = loginResult.token;
        state.userId = loginResult.userId._id;
        localStorage.loginToken = loginResult.token;
        localStorage.userId = state.userId;
        state.user = loginResult.userId;
      } else {
        localStorage.removeItem("loginToken");
        localStorage.removeItem("userId");
      }
    },


    setLogout(state) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("userId");
      state.isUserLoggedIn = false;
      state.userId = null;
    }
  },
  actions: {
    registerNewUser({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        payload.username = payload.email;
        commit("setIsProcessing", true);
        axiosInstance
          .post("auth/local/register", payload)
          .then(function (response) {
            commit("setIsProcessing", false);
            commit("setSnackNotificationMessage", {
              success: true,
              message: "You have successfully registered, logging you in...",
              showImediatly: true
            });

            resolve(response);
          })
          .catch(function (error) {

            commit("setIsProcessing", false);
            dispatch("handleApiErrors", error);
            reject(error);
          });

      });

    },
    authenticateUserAndSetToken({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        let loginPayload = {
          identifier: payload.email,
          password: payload.password
        };
        axiosInstance
          .post("auth/local", loginPayload)
          .then(function (response) {
            commit("setIsProcessing", false);
            dispatch("resetApplicationState");
            commit("setLogged", {
              success: true,
              token: response.data.jwt,
              message: "Credentials accepted!",
              userId: response.data.user
            });
            resolve(response.data.user);
          })
          .catch(function (error) {
            dispatch("handleApiErrors", error);
            reject();
          });
      });
    },
    setSnackbarVisibility({ commit }, isVisible) {
      commit("setIsSnackbarVisible", isVisible);
    },
    logout({ commit, dispatch }) {
      dispatch("resetApplicationState");
      commit("setIsProcessing", false);
      commit("setLogout");
      commit("setSnackNotificationMessage", {
        success: true,
        message: "You logged out.",
        showImediatly: true
      });
    },
    sendResetPassword({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);

        axiosInstance
          .post("auth/reset-password", payload)
          .then(function (response) {
            commit("setIsProcessing", false);
            dispatch("resetApplicationState");
            commit("setLogged", {
              success: true,
              token: response.data.jwt,
              message: "Credentials accepted!",
              userId: response.data.user
            });
            commit("setSnackNotificationMessage", {
              success: true,
              message: "Password updated!",
            });
            dispatch("toggleSnackBarvisibleAction");



            resolve(response.data.user);
          })
          .catch(function (error) {

            if (error?.response?.data?.message[0]?.messages[0]?.id === "Auth.form.error.code.provide") {
              error.response.data.message[0].messages[0].message = "This reset link was expired, please request a new one.";
            }
            dispatch("handleApiErrors", error);



            reject();
          });
      });
    },
    sendForgotPassword({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);

        axiosInstance
          .post("auth/forgot-password", payload)
          .then(function (response) {
            commit("setIsProcessing", false);
            commit("setSnackNotificationMessage", {
              success: true,
              message: "Reset password email sent.",
            });
            dispatch("toggleSnackBarvisibleAction");
            resolve(response.data);
          })
          .catch(function (error) {
            dispatch("handleApiErrors", error);
            reject();
          });
      });
    },
  },
  getters: {

    getRegistrationProcessMessage(state) {
      return state.registrationProcessMessage;
    },
    getLoginProcessMessage(state) {
      return state.loginProcessMessage;
    },
    getIsUserLoggedIn() {
      if (localStorage.loginToken) {
        return true;
      }
      return false;
    },
    getLoggedUserId(state) {
      return state.userId || localStorage.userId;
    },
    getLoggedUser(state) {
      return state.user;
    }
  }
};

export default authStore;
