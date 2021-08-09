
const getDefaultState = () => {
  return {
    items: [],
    status: 'empty'
  }
}

const globalStore = {
  state: {
    isProcessing: false,
    error: "",
    currentScreen: "",
    showIsProcessingAlert: true
  },
  getters: {
    getIsProcessing(state) {
      return state.isProcessing;
    },
    getShowIsProcessingAlert(state) {
      return state.showIsProcessingAlert && state.isProcessing;
    },
    getErrorMessage(state) {
      return state.error;
    },
    currentScreenGetter(state) {
      return state.currentScreen;
    }
  },
  mutations: {
    setIsProcessing(state, isProcessing) {
      state.isProcessing = isProcessing;
    },
    setCurrentScreen(state, currentStreen) {
      state.currentScreen = currentStreen;
    },
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    setShowIsProcessingAlert(state, value) {
      state.showIsProcessingAlert = value;
    },
  },
  actions: {
    handleApiErrors({ commit, dispatch }, error) {
      let showError = false;
      commit("setIsProcessing", false);
      if (error.message.toLowerCase() === "Network Error".toLowerCase()) {
        commit("setSnackNotificationMessage", {
          success: false,
          message: "Something went wrong, it looks like we lost communication with our servers..",
        });
        showError = true;
      } else if (error && error.response && error.response.data && error.response.data.message) {
        commit("setSnackNotificationMessage", {
          success: false,
          message: error.response.data.message[0].messages[0].message,
        });
        showError = true;
      }
      //{"statusCode":400,"error":"Bad Request","message":[{"messages":[{"id":"Auth.form.error.email.taken","message":"Email is already taken."}]}],"data":[{"messages":[{"id":"Auth.form.error.email.taken","message":"Email is already taken."}]}]}
      if (showError)
        dispatch("toggleSnackBarvisibleAction");
    },
    resetApplicationState({ commit }) {
      commit('resetState');
    }
  },
};

export default globalStore;
