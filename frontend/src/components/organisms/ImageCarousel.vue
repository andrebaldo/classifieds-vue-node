<template>
  <v-carousel
    class="media-files"
    show-arrows-on-hover
    hide-delimiter-background
    :hide-delimiters="images.length > 5"
    :height="imageHeight"
    fade-transition
  >
    <v-carousel-item v-for="(media, index) in images" :key="index">
      <v-img
        @click="imageClick()"
        :id="`media-image-${media.id}`"
        :min-height="imageHeight"
        :src="media.url"
        eager
      ></v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  // Vuetify components provide
  // a theme variable that is
  // used to determine dark
  inject: ["theme"],
  data: () => {
    return { imageHeight: "auto" };
  },
  props: {
    images: Array,
    fixedImageSize: {
      type: Boolean,
      default: true
    },
    maxHeight: String
  },
  methods: {
    imageClick() {
      this.$emit("image-click");
    },
    getImageHeight() {
      let imageEl;
      
      if (Array.isArray(this.images) && this.images.length > 0)
        imageEl = document.getElementById(`media-image-${this.images[0].id}`);

      if (
        this.imageHeight === "auto" &&
        typeof imageEl !== "undefined" &&
        imageEl !== null &&
        imageEl.clientHeight > 0
      ) {
        if (imageEl.clientHeight > window.innerHeight * 0.8)
          this.imageHeight = window.innerHeight * 0.8;
        else this.imageHeight = imageEl.clientHeight;

        return true;
      }
      return false;
    },
    setImageHeight() {
      this.getImageHeight();
      if (imageHeightInterval === undefined) {
        var imageHeightInterval = setInterval(() => {
          if (this.getImageHeight()) {
            clearInterval(imageHeightInterval);
          }
        }, 500);
      }
    }
  },
  mounted() {
    if (this.fixedImageSize) {
      this.setImageHeight();
      window.onresize = () => {
        this.imageHeight = "auto";
        this.setImageHeight();
      };
    }
  }
};
</script>

<style>
</style>