<!-- 
frontend\src\views\RegisterView.vue
Author: Author : Andre Baldo (http://github.com/andrebaldo/) -->
<template>
  <v-container grid-list-xs>
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 md8 lg6>
        <ResetPassword />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ResetPassword from "@/modules/authentication/ResetPassword.vue";
export default {
  name: "ResetPasswordPage",
  components: {
    ResetPassword
  }
};
</script>
