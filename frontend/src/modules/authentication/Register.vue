<!-- 
frontend\src\modules\authentication\Register.vue
Author: Author : Andre Baldo (http://github.com/andrebaldo/) -->
<template>
  <v-card>
    <v-card-title primary-title>
      <h1>Register</h1>
    </v-card-title>
    <v-card-text>
      <v-form rounded v-model="isRegisterFormValid">
        <v-text-field
          name="email"
          label="Email*"
          id="email"
          v-model="email"
          prepend-icon="mdi-account-circle"
          required
          :rules="[checkIsRequired(email), validateEmail(email)]"
          type="email"
        ></v-text-field>

        <v-text-field
          name="password"
          label="Password*"
          id="password"
          v-model="password"
          :type="getPasswordFieldType()"
          prepend-icon="mdi-lock"
          :append-icon="getShowPasswordApendIcon()"
          @click:append="toggleShowPassword()"
          counter="50"
          required
          :rules="[checkIsRequired(password), checkMinLenght(password.length,8)]"
          loading
        >
          <template v-slot:progress>
            <v-progress-linear :value="progress(8)" :color="color(8)" absolute height="7"></v-progress-linear>
          </template>
        </v-text-field>

        <div class="text-center">
          <v-progress-circular indeterminate color="primary" v-if="getIsProcessing"></v-progress-circular>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <router-link to="login">Login</router-link>
      <v-spacer></v-spacer>
      <v-btn
      rounded
        color="success"
        :disabled="!isRegisterFormValid || getIsProcessing || GetIsSnackbarVisible"
        @click="register() "
      >
        <v-icon left>mdi-account-plus</v-icon>Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { routeMixins } from "@/mixins/routeMixins";
export default {
  name: "Register",
  mixins: [routeMixins],
  data: function() {
    return {
      showPassword: false,
      isRegisterFormValid: false,
      email: "",
      password: ""
    };
  },
  methods: {
    register() {
      let payload = { email: this.email, password: this.password };
      this.registerNewUser(payload).then(() => {
        setTimeout(() => {
          this.authenticateUserAndSetToken(payload).then(() => {
            this.setSnackbarVisibility(false);
            this.goToHome();
          });
        }, 2000);
      });
    },
    getPasswordFieldType: function() {
      if (this.showPassword) {
        return "text";
      } else {
        return "password";
      }
    },
    toggleShowPassword: function() {
      this.showPassword = !this.showPassword;
    },
    getShowPasswordApendIcon: function() {
      if (this.showPassword) {
        return "mdi-eye";
      } else {
        return "mdi-eye-off";
      }
    },
    checkIsRequired: function(value, errorMessage) {
      if (!errorMessage) {
        errorMessage = "This field is required";
      }
      return !!value || errorMessage;
    },
    checkMinLenght(valueLenght, minLength, errorMessage) {
      if (!errorMessage) {
        errorMessage = `Min length is ${minLength}`;
      }
      return (!!valueLenght && valueLenght >= minLength) || errorMessage;
    },
    progress(minLength) {
      return Math.min(100, (this.password.length / minLength) * 100);
    },
    color(minLength) {
      let selectedColorIndex = 0;
      if (this.progress(minLength) < 40) {
        selectedColorIndex = 0;
      } else if (
        this.progress(minLength) > 40 &&
        this.progress(minLength) < 100
      ) {
        selectedColorIndex = 1;
      } else {
        selectedColorIndex = 2;
      }
      return ["error", "warning", "success"][selectedColorIndex];
    },
    ...mapActions([
      "registerNewUser",
      "setSnackbarVisibility",
      "authenticateUserAndSetToken"
    ]),
    validateEmail(email) {
      var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return (
        re.test(String(email).toLowerCase()) ||
        "Oops, this doesn't looks like rigth, can you check please?"
      );
    }
  },
  computed: {
    ...mapGetters([
      "getRegistrationProcessMessage",
      "getIsProcessing",
      "GetIsSnackbarVisible"
    ])
  }
};
</script>