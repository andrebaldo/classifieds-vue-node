<template>
  <v-container grid-list-xs>
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 md8 lg6 v-if="updateProfileRequired">
        <h3>Before continuing, please update your 'Display Name' and 'Phone Number' so people can better identify you.</h3>
        <UserProfile />
      </v-flex>
      <v-flex xs12 md8 lg6 v-if="!updateProfileRequired">
        <v-card>
          <v-card-text class="pa-2">
            <h3>Please choose an ad category</h3>
            <v-divider></v-divider>
            <v-layout class="mt-2 mb-2">
              <v-flex class="d-inline-flex justify-space-between">
                <v-btn color="primary" @click="goToRoute('new-generic-ad')" rounded>Generic</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="goToRoute('new-car-ad')" rounded>Car</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn color="warning" rounded @click="goToHome()">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { routeMixins } from "@/mixins/routeMixins";
import { mapGetters } from "vuex";
import UserProfile from "@/modules/profile/UserProfile";
export default {
  mixins: [routeMixins],
  components: {
    UserProfile
  },
  computed: {
    ...mapGetters(["getUserProfile", "savedAdvertisementGetter"]),
    updateProfileRequired() {
      if (
        !this.getUserProfile ||
        !this.getUserProfile.DisplayName ||
        !this.getUserProfile.PhoneNumber
      ) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    if (this.savedAdvertisementGetter) {
      if (this.savedAdvertisementGetter.ClassificationType === "Car") {
        this.goToRoute("new-car-ad");
      } else {
        this.goToRoute("new-generic-ad");
      }
    }
  }
};
</script>

<style>
</style>