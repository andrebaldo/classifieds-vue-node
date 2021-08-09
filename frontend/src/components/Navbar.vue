<template>
  <div>
    <v-app-bar color="indigo" app hide-on-scroll>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="getIsUserLogged() === true" />

      <v-avatar :tile="true" @click.stop="goToHome()" class="mr-1">
        <img :src="require('@/assets/logo.png')" alt="logo" />
      </v-avatar>
      <v-toolbar-title>{{getCurrentRoute()}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon class="ml-2 mr-2" @click="toggleDark()">mdi-weather-night</v-icon>
      <!-- <v-btn
        rounded
        color="primary"
        to="login"
        v-if="getIsUserLogged() === undefined ||getIsUserLogged() === false && currentRoute !== 'login'"
      >
        <v-icon left>mdi-login-variant</v-icon>Login
      </v-btn>
      <v-btn
        rounded
        color="primary"
        to="register"
        v-if="getIsUserLogged() === undefined || getIsUserLogged() === false && currentRoute === 'login'"
      >
        <v-icon left>mdi-login-variant</v-icon>Register
      </v-btn>-->
      <v-btn
        rounded
        color="primary"
        @click="newAdvertisement()"
        v-if="getIsUserLogged() === undefined || getIsUserLogged() === false && currentRoute !== 'login'"
      >Create Ad</v-btn>

      <v-menu left bottom v-if="getIsUserLogged() === true">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="newAdvertisement()">
            <v-icon>mdi-playlist-plus</v-icon>
            <v-list-item-title>Create New Ad</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar @click="drawerGoToRoute('/profile')">
            <img v-if="getUserProfileRandon().length > 0" :src="getUserProfileRandon()" />
            <v-icon v-if="getUserProfileRandon().length === 0" class="display-1">mdi-account</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{getUserProfile? getUserProfile.DisplayName : "Profile not set"}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <div v-if="getIsUserLogged() === true">
          <v-list-item @click="drawerGoToRoute('/')">
            <v-list-item-icon>
              <v-icon>mdi-monitor-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Search</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="drawerGoToRoute('/advertisement')">
            <v-list-item-icon>
              <v-icon>mdi-text-box-multiple-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>My Advertisements</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="drawerGoToRoute('/profile')">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
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
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { routeMixins } from "@/mixins/routeMixins";
import { authMixins } from "@/mixins/authMixins";
export default {
  Name: "Navbar",
  mixins: [routeMixins, authMixins],
  computed: {
    ...mapGetters([
      "getIsUserLoggedIn",
      "currentScreenGetter",
      "getUserProfile"
    ])
  },
  watch: {
    $route(to) {
      this.currentRoute = to.name;
    }
  },

  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.dark = this.$vuetify.theme.dark;
    },
    getCurrentRoute() {
      return this.currentScreenGetter;
    },
    ...mapActions(["logout", "clearForNewAdvertisement"]),

    processLogout() {
      this.drawer = false;
      this.logout().then(() => {
        this.goToHome();
      });
    },
    newAdvertisement() {
      this.clearForNewAdvertisement();
      this.goToRoute("new-advertisement");
    },
    drawerGoToRoute(route) {
      this.drawer = false;
      this.goToRoute(route);
    },
    getUserProfileRandon() {
      if (
        this.getUserProfile &&
        this.getUserProfile.media_files &&
        this.getUserProfile.media_files.length > 0
      ) {
        if (this.getUserProfile.media_files == 1) {
          if (this.getUserProfile.media_files[0].url)
            return this.getUserProfile.media_files[0].url;
          else return "";
        } else {
          let max = Math.floor(this.getUserProfile.media_files.length - 1);
          let randonIndex = Math.floor(Math.random() * (max - 0 + 1)) + 0;
          if (this.getUserProfile.media_files[randonIndex].url)
            return this.getUserProfile.media_files[randonIndex].url;
          else return "";
        }
      } else {
        return "";
      }
    }
  },
  data: () => {
    return {
      drawer: false,
      color: "primary",

      miniVariant: false,
      expandOnHover: false,
      background: false,
      currentRoute: ""
    };
  },
  mounted() {
    if (localStorage.dark) {
      this.$vuetify.theme.dark = localStorage.dark === "true";
    }
  }
};
</script>