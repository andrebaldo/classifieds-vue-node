<!-- 
frontend\src\views\ProfileView.vue
Author: Author : Andre Baldo (http://github.com/andrebaldo/) -->
<template>
<v-container grid-list-xs>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md8 lg6>
      <UserProfile />
    </v-flex>
  </v-layout>
</v-container>

</template>

<script>
import UserProfile from "@/modules/profile/UserProfile";
export default {
  name: "LoginView",
  components: {
    UserProfile
  }
};
</script>
