<template>
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
</template>

<script>
export default {
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
    }
  }
};
</script>

<style>
</style>