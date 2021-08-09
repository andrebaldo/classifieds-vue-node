<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <v-card class="pa-0 ma-0">
      <v-layout wrap justify-center>
        <v-flex xs12 sm12 md8 lg5 xl5>
          <ImageCarousel :fixedImageSize="false" :images="images" />
          <div class="body-1 ml-2 mt-2 font-weight-medium" v-html="description"></div>
          <v-fab-transition>
            <v-btn dark fab fixed top right @click="$router.back()" color="warning" small>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-fab-transition>
          <v-btn color="warning" @click="$router.back()">Back</v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import ImageCarousel from "@/components/organisms/ImageCarousel";

export default {
  data: () => {
    return {
      dialog: true
    };
  },
  components: { ImageCarousel },
  props: {
    images: {
      type: Array,
      required: true
    },
    description: String
  },
  mounted() {}
};
</script>

<style>
</style>