<template>
  <div>
    <v-file-input
      v-model="files"
      counter
      label="Pictures"
      multiple
      placeholder="Select pictures"
      prepend-icon="mdi-camera"
      accept="image/png, image/jpeg, image/bmp"
      :show-size="1000"
    ></v-file-input>
    <draggable v-model="allFiles" group="people" @start="drag=true" @end="drag=false">
      <transition-group type="transition" name="flip-list">
        <v-card v-for="file in allFiles" :key="file.key" class="sortable-card pa-1 xs12 lg2 xl1">
          <v-card-title primary-title class="ma-0 pa-0">
            <v-spacer></v-spacer>
            <v-btn width="auto" height="auto" icon @click="deleteImage(file)">
              <v-icon class="ma-0">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="ma-0 pa-0">
            <v-img
              :src="convertToUrl(file)"
              aspect-ratio="1"
              class="grey lighten-2"
              :alt="file.name"
            ></v-img>
          </v-card-text>
        </v-card>
      </transition-group>
    </draggable>
    <!-- <v-row>
      <v-col v-for="(file, index) in getAllFiles()" :key="index" class="d-flex child-flex" cols="4"></v-col>
    </v-row>-->
    <v-row v-if="showButtons">
      <v-btn rounded color="warning" @click="stepBack()">Back</v-btn>
      <v-spacer></v-spacer>
      <v-btn rounded color="success" @click="onSubmit()">{{uploadButtonText}}</v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import draggable from "vuedraggable";
import Pica from "pica";
const pica = Pica();

export default {
  data: () => ({
    files: [],
    filesToDeleteOnSave: [],
    tempSortedFiles: [],
    resizedFiles: []
  }),
  components: {
    draggable
  },
  props: {
    uploadButtonText: {
      type: String,
      default: "Upload"
    },
    maximunPicturesAllowed: Number,
    showButtons: {
      type: Boolean,
      default: true
    },
    referenceEntity: Object,
    filesToEdit: Array,
    nextStep: {
      type: Number,
      required: false
    }
  },
  watch: {
    files() {
      if (Array.isArray(this.filesToEdit)) {
        for (const file of this.files) {
          this.resizeImage(file);

          // if (!this.filesToEdit.includes(file)) {
          //   this.filesToEdit.push(file);
          // }
        }
      }
    }
  },
  computed: {
    ...mapGetters(["filesUploadedGetter"]),
    allFiles: {
      get: function() {
        return this.getAllFiles();
      },
      set: function(newValue) {
        this.tempSortedFiles = newValue;
      }
    }
  },
  methods: {
    ...mapActions(["uploadFiles", "deleteFile"]),
    ...mapMutations(["setIsProcessing"]),
    resizeImage(imageFile) {
      var img = new Image();
      this.setIsProcessing(true);
      img.onload = () => {
        let src = document.createElement("canvas");
        src.width = img.width;
        src.height = img.height;

        let ctx = src.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var offScreenCanvas = document.createElement("canvas");
        offScreenCanvas.width = 500;
        offScreenCanvas.height = 350;

        pica
          .resize(src, offScreenCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
          })
          .then(() => {
            let resized = offScreenCanvas.toDataURL();
            var file = this.dataURItoBlob(resized);
            Object.assign(file, imageFile);
            file.src = resized;
            this.resizedFiles.push(file);
            if (this.files.length == this.resizedFiles.length){
              this.setIsProcessing(false);
            }
          });
      };

      img.src = window.URL.createObjectURL(imageFile);
    },
    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);
      // separate out the mime component
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    convertToUrl(file) {
      if (Array.isArray(file)) {
        return null;
      }

      if (file.url) {
        return file.url;
      }
      if (file.src) {
        return file.src;
      }
      return null;
    },
    getAllFiles() {
      let allFiles = [];
      let fileCounter = 0;
      if (Array.isArray(this.filesToEdit)) {
        for (const file of this.filesToEdit) {
          file.key = fileCounter;
          fileCounter++;
          if (!allFiles.includes(file)) {
            allFiles.push(file);
          }
        }
      }
      for (const file of this.resizedFiles) {
        file.key = fileCounter;
        fileCounter++;
        if (!allFiles.includes(file)) {
          allFiles.push(file);
        }
      }

      if (this.tempSortedFiles.length > 0) {
        let auxSort = [];
        for (let i = 0; i < this.tempSortedFiles.length; i++) {
          const element = this.tempSortedFiles[i];
          let found = allFiles.find(v => v.key === element.key);
          if (found) {
            auxSort.push(found);
            allFiles.splice(allFiles.indexOf(found), 1);
          }
        }
        if (allFiles.length > 0) {
          auxSort.push(allFiles);
        }
        return auxSort;
      }

      return allFiles;
    },

    onSubmit(referenceEntity) {
      let payload = {
        files: this.allFiles,
        referenceEntity: !this.referenceEntity
          ? referenceEntity
          : this.referenceEntity
      };
      this.uploadFiles(payload)
        .then(result => {
          this.files = [];
          this.resizedFiles = [];
          for (const fileId of this.filesToDeleteOnSave) {
            this.deleteFile(fileId).then(() => {
              this.filesToDeleteOnSave.splice(
                this.filesToDeleteOnSave.indexOf(fileId)
              );
            });
          }
          this.$emit("upload-succeed", result);
        })
        .catch(err => {
          this.$emit("upload-error", err);
        });
    },
    stepBack() {
      this.$emit("set-step", this.nextStep - 1);
    },
    deleteImage(file) {
      if (Array.isArray(this.filesToEdit) && this.filesToEdit.includes(file)) {
        this.filesToEdit.splice(this.filesToEdit.indexOf(file), 1);
      }

      if (Array.isArray(this.files) && this.files.includes(file)) {
        this.files.splice(this.files.indexOf(file), 1);
      }
      if (file._id) {
        this.filesToDeleteOnSave.push(file.id);
      }
    }
  },
  mounted() {}
};
</script>

<style>
.sortable-card {
  width: 50%;
  display: inline-block;
}
/* .flip-list-move {
  transition: transform 0.5s;
} */
</style>