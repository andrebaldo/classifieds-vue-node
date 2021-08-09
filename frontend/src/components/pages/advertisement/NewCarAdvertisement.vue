<template>
  <v-container grid-list-xs>
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 md8 lg6>
        <AdvertisementSteps />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdvertisementSteps from "@/modules/advertisement/AdvertisementSteps";
export default {
  name: "NewAdvertisementView",
  components: {
    AdvertisementSteps
  }
};
</script>