<template>
  <v-app>
    <Navbar />

    <v-content>
      <v-dialog v-model="getShowIsProcessingAlert" hide-overlay persistent top vertical>
        <v-card color="primary">
          <v-card-title primary-title class="white--text">Please wait...</v-card-title>
          <v-card-text>
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <router-view />
    </v-content>

    <SnackNotification
      :visibility="GetIsSnackbarVisible"
      :colorCondition="getSnackbarMessageSuccess"
      :message="getSnackbarNotificationMessage"
    />

    <v-footer></v-footer>
    <v-footer padless>
      <v-flex class="text-center">
        <strong>Classi Manx</strong>
        &copy;{{ new Date().getFullYear() }} contact@classimanx.com
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import SnackNotification from "@/modules/notification/SnackNotification";
import { mapGetters } from "vuex";

export default {
  metaInfo: {
    // Children can override the title.
    title: "Isle of Man Classifieds",
    // Result: My Page Title ← My Site
    // If a child changes the title to "My Other Page Title",
    // it will become: My Other Page Title ← My Site
    titleTemplate: "%s ← ClassiManx",
    // Define meta tags here.
    meta: [
      { "http-equiv": "Content-Type", content: "text/html; charset=utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "Free classifeds for Isle of Man." }
    ]
  },
  name: "App",
  components: {
    Navbar,
    SnackNotification
  },
  computed: {
    ...mapGetters([
      "GetIsSnackbarVisible",
      "getSnackbarNotificationMessage",
      "getSnackbarMessageSuccess",
      "getShowIsProcessingAlert",
      "getLoggedUserId"
    ])
  }
};
</script>
<style>
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
