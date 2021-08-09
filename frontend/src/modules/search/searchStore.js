import axiosInstance from "@/plugins/connectionBuilder.js";

const ImageUploadStore = {
    actions: {
        performSearch({ commit, dispatch }, payload) {
            return new Promise(function (resolve, reject) {
                axiosInstance
                    .post(`/advertisements/search`, { searchTerm: payload })
                    .then(response => {
                        commit("setIsProcessing", false);
                        commit("setPublicAds", response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        commit("setPublicAds", []);
                        dispatch("handleApiErrors", error);
                        reject(error);
                    });
            });
        },
    }
};

export default ImageUploadStore;
