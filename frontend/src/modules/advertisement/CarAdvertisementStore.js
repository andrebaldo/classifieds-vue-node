// CarAdvertisementStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import axiosInstance from "@/plugins/connectionBuilder.js";

const CarAdvertisementStore = {
  state: {
    foundRegistration: {},
    makes: {},
    savedCarAdvertisement: null,
    allMakesLoaded: false
  },
  mutations: {
    setFoundRegistration(state, foundReg) {
      state.foundRegistration = foundReg;
    },
    setMakes(state, data) {
      state.makes = data;
    },
    setSavedCarAdvertisement(state, savedAd) {
      state.savedCarAdvertisement = savedAd;
    },
    setAllMakesLoaded(state, isLoaded) {
      state.allMakesLoaded = isLoaded;
    }
  },
  actions: {
    getRegistrationDetails({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        payload.username = payload.email;
        commit("setIsProcessing", true);
        axiosInstance
          .get(`advertisements/searchVehicle/${payload.registration}`)
          .then(response => {
            commit("setIsProcessing", false);
            resolve(response.data);
          })
          .catch(function (error) {
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    findCarMakes({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        let params = { params: {} };
        if (payload && payload.MakerId) {
          params = { params: { MakerId: payload.MakerId.toUpperCase() } };
        }
        if (payload.Name) {
          params = {
            params: {
              Name_contains: payload.Name
            }
          };
        }
        axiosInstance
          .get("carmakes", params)
          .then(result => {
            commit("setIsProcessing", false);
            commit("setMakes", result.data);
            resolve(result.data);
          })
          .catch(error => {
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    loadAllMakes({ commit, dispatch }) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        var p = { params: { _limit: 300 } };
        axiosInstance
          .get("carmakes", p)
          .then(result => {
            commit("setIsProcessing", false);
            let topBrands = [
              "audi",
              "bmw",
              "ford",
              "honda",
              "jaguar",
              "land rover",
              "mercedes-benz",
              "nissan",
              "porsche",
              "toyota",
              "vauxhall",
              "volkswagen"
            ];
            topBrands.sort().reverse();
            if (Array.isArray(result.data)) {
              for (const brand of topBrands) {
                let found = result.data.filter(f => f.Name.toLowerCase() === brand);
                if (found.length > 0) {
                  let removed = result.data.splice(result.data.indexOf(found[0]), 1);
                  result.data.unshift(removed[0]);
                }
              }
            }

            commit("setMakes", result.data);
            commit("setAllMakesLoaded", true);
            resolve(result.data);
          })
          .catch(error => {
            commit("setAllMakesLoaded", false);
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },

    getCarMake({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        let params = { params: {} };
        if (payload && payload.MakerId) {
          params = { params: { MakerId: payload.MakerId.toUpperCase() } };
        } else if (typeof payload === "string") {
          params = { params: { _id: payload } };
        }
        if (payload.Name) {
          params = {
            params: {
              Name: payload.Name,
              ModelName: payload.ModelName
            }
          };
        }
        axiosInstance
          .get("carmakes/findMakeAndModel", params)
          .then(result => {
            commit("setIsProcessing", false);
            commit("setMakes", [result.data]);
            resolve([result.data]);
          })
          .catch(error => {
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    getCarMakeById({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        axiosInstance
          .get(`carmakes/${payload}`)
          .then(result => {
            commit("setIsProcessing", false);
            commit("setMakes", [result.data]);
            resolve([result.data]);
          })
          .catch(error => {
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },

    saveCarAdDetails({ commit, dispatch, getters }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        payload.carmake = typeof payload.Make === "object" ? payload.Make._id : "Not Informed";
        payload.carmodel = typeof payload.Model === "object" ? payload.Model._id : "Not Informed";
        payload.createdByUser = getters.getLoggedUserId;
        if (getters.savedCarAdvertisementGetter && getters.savedCarAdvertisementGetter._id) {
          payload._id = getters.savedCarAdvertisementGetter._id;
        }

        axiosInstance
          .post("car-advertisements/save", payload)
          .then(response => {
            commit("setIsProcessing", false);
            commit("setSavedCarAdvertisement", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setSavedCarAdvertisement", null);
            dispatch("handleApiErrors", error);
            reject(error);
          });
      });
    },
    clearCarAdvertisement({ commit }) {
      commit("setSavedCarAdvertisement", null);
    }
  },
  getters: {
    getFoundRegistration(state) {
      return state.foundRegistration;
    },
    carMakesGetter(state) {
      return state.makes;
    },
    savedCarAdvertisementGetter(state) {
      return state.savedCarAdvertisement;
    },
    allMakesLoadedGetter(state) {
      return state.allMakesLoaded;
    }
  }
};

export default CarAdvertisementStore;
