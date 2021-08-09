<template>
  <div>
    <ImageCarousel :fixedImageSize="true" :images="images" v-on:image-click="imageClick" />
  </div>
</template>

<script>
import ImageCarousel from "@/components/organisms/ImageCarousel";
import { routeMixins } from "@/mixins/routeMixins";
export default {
  mixins: [routeMixins],
  data: () => {
    return {
      dialog: false
    };
  },
  props: {
    images: Array,
    description: String
  },
  components: {
    ImageCarousel
  },
  methods: {
    imageClick() {
      this.$router.push({
        name: "ad.details",
        params: {
          images: this.images,
          description: this.description
        }
      });

      // this.goToRoute("ad-details", {
      //   images: this.images,
      //   description: this.description
      // });
    }
  }
};
</script>

<style>
</style>