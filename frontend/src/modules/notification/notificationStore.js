// frontend\src\modules\notification\notificationStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
const store = {
  state: {
    isSnackbarVisible: false,
    message: "",
    success: true,
    showImediatly: true
  },
  mutations: {
    setIsSnackbarVisible(state, isVisible) {
      state.isSnackbarVisible = isVisible;
    },
    setSnackNotificationMessage(state, messagePayLoad) {
      state.message = messagePayLoad.message;
      state.success = messagePayLoad.success;
      if (messagePayLoad.showImediatly) {
        state.isSnackbarVisible = true;
      }
    }
  },
  actions: {
    setSnackbarVisibility({ commit }, isVisible) {
      commit("setIsSnackbarVisible", isVisible);
    },
    toggleSnackBarvisibleAction: {
      root: true,
      handler({ commit }) {
        commit("setIsSnackbarVisible", true);
        setTimeout(
          c => {
            c("setIsSnackbarVisible", false);
          },
          15000,
          commit
        );
      }
    },
    showSnackbarMessage: {
      root: true,
      handler({ commit }, messagePayload) {
        commit("setMessage", messagePayload);
        commit("setIsSnackbarVisible", true);
        setTimeout(
          c => {
            c("setIsSnackbarVisible", false);
          },
          15000,
          commit
        );
      }
    },
    showMessage({commit}, payload){
      commit("setSnackNotificationMessage", payload);
      commit("setIsSnackbarVisible", true);
      
      setTimeout(
        c => {
          c("setIsSnackbarVisible", false);
        },
        15000,
        commit
      );
    }
  },
  getters: {
    GetIsSnackbarVisible(state) {
      return state.isSnackbarVisible;
    },
    getSnackbarNotificationMessage(state) {
      return state.message;
    },
    getSnackbarMessageSuccess(state) {
      return state.success;
    }
  }
};

export default store;
