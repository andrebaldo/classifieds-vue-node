// ImageUploadStore.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/)
import axiosInstance from "@/plugins/connectionBuilder.js";

const ImageUploadStore = {
  state: {
    filesUploaded: []
  },
  mutations: {
    setFilesUploaded(state, files) {
      state.filesUploaded = files;
    }
  },
  actions: {
    uploadFiles({ commit, dispatch }, payload) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);
        if (!payload || !payload.referenceEntity) {
          reject("No referenceEntity informed");
          return;
        }

        for (let i = 0; i < payload.files.length; i++) {
          const f = payload.files[i];
          f.DisplayOrder = i + 1;
        }
        // Existing Files
        let filesToEdit = payload.files.filter(x => typeof x._id !== "undefined");
        let buildFormData = () => {
          const formData = new FormData();
          if (payload.referenceEntity) {
            formData.append("ref", payload.referenceEntity.name);
            formData.append("refId", payload.referenceEntity.id);
            formData.append("fieldName", "media_files");
          }
          if (filesToEdit.length > 0) {
            formData.append("filesToEdit", JSON.stringify(filesToEdit));
          }
          return formData;
        };

        let formData = buildFormData();
        // New files
        let files = payload.files.filter(x => typeof x._id === "undefined");

        if (files.length > 0) {
          files.forEach(file => {
            formData.append("files", file);
          });
          axiosInstance.post("media-files/upload/", formData)
          .then(response =>{
            commit("setIsProcessing", false);
            commit("setFilesUploaded", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setFilesUploaded", []);
            dispatch("handleApiErrors", error);
            reject(error);
          });
        } else {
          axiosInstance.post("media-files/upload/", formData)
          .then(response =>{
            commit("setIsProcessing", false);
            commit("setFilesUploaded", response.data);
            resolve(response.data);
          })
          .catch(error => {
            commit("setFilesUploaded", []);
            dispatch("handleApiErrors", error);
            reject(error);
          });
        }     
          
      });
    },
    deleteFile({ commit, dispatch }, mediaId) {
      return new Promise(function (resolve, reject) {
        commit("setIsProcessing", true);

        axiosInstance
          .delete(`media-files/${mediaId}`)
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
  },
  getters: {
    filesUploadedGetter(state) {
      return state.filesUploaded;
    }
  }
};

export default ImageUploadStore;
