<!-- 
frontend\src\modules\authentication\Register.vue
Author: Author : Andre Baldo (http://github.com/andrebaldo/) -->
<template>
  <v-card>
    <v-card-title primary-title>
      <h1>Reset your password</h1>
    </v-card-title>
    <v-card-text>
      <v-form rounded v-model="isFormValid">
        <v-text-field
          name="password"
          label="Password*"
          id="password"
          v-model="password"
          :type="getPasswordFieldType()"
          prepend-icon="mdi-lock"
          :append-icon="getShowPasswordApendIcon()"
          @click:append="toggleShowPassword()"
          counter="8"
          required
          :rules="[checkIsRequired(password), checkMinLenght(password.length,8)]"
          loading
        >
          <template v-slot:progress>
            <v-progress-linear :value="progress(8)" :color="color(8)" absolute height="7"></v-progress-linear>
          </template>
        </v-text-field>
        <v-text-field
          name="passwordConfirmation"
          label="Confirm your password*"
          id="passwordConfirmation"
          v-model="passwordConfirmation"
          :type="getPasswordFieldType()"
          prepend-icon="mdi-lock"
          :append-icon="getShowPasswordApendIcon()"
          @click:append="toggleShowPassword()"
          counter="8"
          required
          :rules="[checkIsRequired(password), checkMinLenght(password.length,8), checkPasswordMatches(password, passwordConfirmation)]"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <router-link to="login">Go to login</router-link>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        :disabled="!isFormValid || getIsProcessing || GetIsSnackbarVisible"
        @click="resetPassword()"
      >
        <v-icon left>mdi-account-plus</v-icon>Reset Password
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
      isFormValid: false,
      email: "",
      password: "",
      passwordConfirmation: ""
    };
  },
  methods: {
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
    checkPasswordMatches: function(value1, value2, errorMessage) {
      if (!errorMessage) {
        errorMessage = "This password don't match with the previous password";
      }

      return value1 === value2 || errorMessage;
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
    resetPassword() {
      let payload = {
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
        code: this.$route.query.code
      };

      this.sendResetPassword(payload).then(user => {
        this.loadUserProfile({ userId: user._id });
        this.goToHome();
      });
    },
    ...mapActions(["sendResetPassword", "loadUserProfile"])
  },
  computed: {
    ...mapGetters([
      "getIsRegistrationProcessSucceed",
      "getRegistrationProcessMessage",
      "getIsProcessing",
      "GetIsSnackbarVisible"
    ])
  }
};
</script>