<!-- 
frontend\src\modules\notification\SnackNotification.vue
Author: Author : Andre Baldo (http://github.com/andrebaldo/) -->
<template>
  <v-snackbar v-model="visibility" :color="getColor()" top :timeout="0" vertical>
    <span>{{message}}</span>
    <v-btn rounded color="primary" @click.native="setSnackbarVisibility(false)">Close</v-btn>
  </v-snackbar>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "SnackNotification",
  props: ["colorCondition", "visibility", "message", "color"],
  methods: {
    ...mapActions(["setSnackbarVisibility"]),
    getColor() {
      if (typeof this.colorCondition !== "undefined")
        return this.colorCondition ? "success" : "error";
      else return this.color;
    }
  }
};
</script>