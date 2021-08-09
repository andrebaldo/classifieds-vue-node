<!-- 
frontend\src\modules\authentication\Login.vue
Author: Author : Andre Baldo (http://github.com/andrebaldo/) -->
<template>
  <v-card>
    
    <ValidationObserver ref="observer" v-slot="{invalid, validate, reset }">
      <h3 class="pr-4 pl-4 pt-4" v-if="notLoggedMessage">
        Sorry you must be logged to perforn this action, please login or register first.
      </h3>
      <v-card-title primary-title>
        
        <h1>Login</h1>
        <v-spacer></v-spacer>
        <v-btn
        rounded
          color="success"
          :disabled="invalid || getIsProcessing || GetIsSnackbarVisible"
          @click="login({email:email, password:password})"
        >Login</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form rounded v-model="isLoginFormValid">
          <ValidationProvider
            v-slot="{ errors , invalid}"
            name="Email"
            rules="required|email"
            ref="validationProviderEmail"
          >
            <v-layout row wrap class="align-center">
              <v-flex xs12 sm9>
                <v-text-field
                  name="email"
                  label="Email*"
                  id="email"
                  v-model="email"
                  prepend-icon="mdi-account-circle"
                  required
                  type="email"
                  class="xs12 sm8"
                  :error-messages="errors"
                  color="primary"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm3>
                <v-btn
                rounded
                  color="primary"
                  class="xs12 sm4"
                  x-small
                  text
                  @click="forgotPassword()"
                >Forgot my password</v-btn>
              </v-flex>
            </v-layout>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors , invalid}"
            name="Password"
            rules="required"
            ref="validationProviderEmail"
          >
            <v-text-field
              name="password"
              label="Password*"
              id="password"
              v-model="password"
              :type="getPasswordFieldType()"
              prepend-icon="mdi-lock"
              :append-icon="getShowPasswordApendIcon()"
              @click:append="toggleShowPassword()"
              :error-messages="errors"
              required
            ></v-text-field>
          </ValidationProvider>

          <div class="text-center">
            <v-progress-circular indeterminate color="primary" v-if="getIsProcessing"></v-progress-circular>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <router-link to="/">Home page</router-link>
        <v-spacer></v-spacer>
        <router-link to="/register">Register</router-link>
      </v-card-actions>
    </ValidationObserver>
    <!-- <v-card-actions>
      <router-link to="register">I don't have an account yet</router-link>
      <v-spacer></v-spacer>
    </v-card-actions>-->
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { routeMixins } from "@/mixins/routeMixins";
import { required, email } from "vee-validate/dist/rules";
extend("email", email);
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "Login",
  mixins: [routeMixins],
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data: function() {
    return {
      showPassword: false,
      isLoginFormValid: false,
      email: "",
      password: "",
      mobilePhone: "",
      notLoggedMessage: false
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
    ...mapActions([
      "authenticateUserAndSetToken",
      "loadUserProfile",
      "sendForgotPassword"
    ]),
    login(loginData) {
      this.authenticateUserAndSetToken(loginData).then(user => {
        this.loadUserProfile({ userId: user._id });
        let newPath = this.$route.query.redirect || '/';
        this.goToRoute(newPath);
      });
    },
    forgotPassword() {
      if (this.email) {
        this.sendForgotPassword({ email: this.email });
      } else {
        this.$refs.validationProviderEmail.validate();
      }
    }
  },
  computed: {
    ...mapGetters([
      "getLoginProcessMessage",
      "getIsProcessing",
      "GetIsSnackbarVisible"
    ])
  },
  mounted(){
   
    if(this.$route.query.redirect){
      this.notLoggedMessage = true;
    }
    
  }
};
</script>