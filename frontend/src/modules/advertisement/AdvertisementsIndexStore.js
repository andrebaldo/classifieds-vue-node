// AdvertisementsIndexStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import axiosInstance from "@/plugins/connectionBuilder.js";

const AdvertisementStore = {
    state: {
        allAds: [],
        publicAds: []
    },
    mutations: {
        setAllAds(state, pulishedAds) {
            state.allAds = pulishedAds;
        },
        setPublicAds(state, publicAds) {
            if (Array.isArray(publicAds)) {
                state.publicAds = publicAds;
            }
        },
        includePublicAds(state, publicAds) {
            for (const iterator of publicAds) {
                const exists = state.publicAds.filter(ad => ad._id === iterator._id);
                if (exists.length === 0) {
                    state.publicAds.push(iterator);
                }
            }
        },
        updatePublicAd(state, ad){
            debugger
            var found = state.publicAds.find(a=> a._id === ad._id);
            if(found){
                found = ad;
            }
        }
    },
    actions: {
        loadAdvertisements({ dispatch, commit }, payload) {
            let params = {
                params: payload
            };
            return new Promise(function (resolve, reject) {
                commit("setIsProcessing", true);
                axiosInstance
                    .get("advertisements", params)
                    .then(response => {
                        resolve(response.data);
                        commit("setIsProcessing", false);
                    })
                    .catch(error => {
                        dispatch("handleApiErrors", error);
                        reject(error);
                    });
            });
        },
        loadAllAdvertisementsByAdvertiser({ commit, dispatch, getters }) {

            if (typeof getters.getUserProfile._id === "undefined") {
                dispatch("loadUserProfile", { userId: getters.getLoggedUserId }).then(() => {

                    let params = {
                        advertiser: getters.getUserProfile._id,
                        _sort: "createdAt:DESC"
                    };

                    dispatch("loadAdvertisements", params)
                        .then((result) => {

                            commit("setAllAds", result);
                        })
                });
            } else {
                let params = {
                    advertiser: getters.getUserProfile._id,
                    _sort: "createdAt:DESC"
                };

                dispatch("loadAdvertisements", params)
                    .then((result) => {

                        commit("setAllAds", result);
                    })
            }

        },
        loadPublicAdvertisements({ commit, dispatch }, params) {
            return dispatch("loadAdvertisements", params)
                .then((result) => {
                    if (params._start > 0) {
                        commit("includePublicAds", result);
                    } else {
                        commit("setPublicAds", result);
                    }
                })
        },
        performAdvertisementSearch({ commit, dispatch }, payload) {
            var params = {
                query: `query {
                    advertisements (limit:10, sort:"Title:asc"
                    , where:{Title_contains: "${payload.searchTerm}"}){
                      Title
                    }
                  }`
            };
            return new Promise(function (resolve, reject) {
                commit("setIsProcessing", true);
                axiosInstance
                    .post("graphql", params)
                    .then(response => {
                      
                        if (response.data && response.data.data && response.data.data.advertisements) {
                            resolve(response.data.data.advertisements.map(ad => ad.Title));
                        } else {
                            resolve([]);
                        }

                        resolve(response.data);
                        commit("setIsProcessing", false);
                    })
                    .catch(error => {
                        dispatch("handleApiErrors", error);
                        reject(error);
                    });
            });

        }
    },
    getters: {
        publishedAdsGetter(state) {
            return state.allAds.filter(ad => ad.Status === "Published");
        },
        waitingPublicationAdsGetter(state) {
            return state.allAds.filter(ad => ad.Status === "WaitingPublication");
        },
        deletedAdsGetter(state) {
            return state.allAds.filter(ad => ad.Status === "Deleted");
        },
        publicAdsGetter(state) {
            return state.publicAds;
        }
    }
};

export default AdvertisementStore;
