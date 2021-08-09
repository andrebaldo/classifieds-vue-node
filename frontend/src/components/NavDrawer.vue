<template>
  <v-navigation-drawer v-model="drawer" color="primary" fixed>
    <v-list dense nav class="py-0">
      <v-list-item two-line :class="miniVariant && 'px-0'">
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Application</v-list-item-title>
          <v-list-item-subtitle>Subtext</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <div v-if="getIsUserLogged() === true">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Advertisements</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goToRoute('/profile')">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="processLogout()">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="processLogout()">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  Name: "NavDrawer",
  data: () => {
    return {
      color: "primary",
      miniVariant: false,
      expandOnHover: false,
      background: false,
      drawer: this.drawerVisible
    };
  },
  props: ["drawerVisible"],
  computed: {},

  methods: {
    ...mapActions(["logout"]),
    processLogout() {
      this.logout().then(() => {
        this.goToRoute("login");
      });
    },
    getDrawerVisibilty() {
      return this.drawerVisible;
    }
  }
};
</script>

<style>
</style>