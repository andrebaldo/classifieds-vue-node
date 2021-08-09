<template>
  <v-card>
    <v-card-text>
      <ValidationObserver ref="observer" v-slot="{ validate, reset }">
        <v-form v-model="isProfileFormValid">
          <ImageUpload
            v-on:upload-succeed="uploadSucceed"
            v-on:upload-error="uploadError"
            :filesToEdit="imageUploadFilesToEdit"
            :showButtons="false"
            ref="imageUploadComponent"
          />

          <ValidationProvider v-slot="{ errors }" name="Name" rules="required|max:100">
            <v-text-field
              :counter="100"
              :error-messages="errors"
              name="displayName"
              label="Display Name*"
              id="displayName"
              v-model="displayName"
              prepend-icon="mdi-briefcase-account-outline"
            ></v-text-field>
          </ValidationProvider>

          <v-text-field
            name="phoneNumber"
            label="Phone Number"
            id="phoneNumber"
            v-model="phoneNumber"
            prepend-icon="mdi-phone"
            type="tel"
          ></v-text-field>

          <v-switch v-if="false" v-model="isProfessionalTrader" label="List me as a car store"></v-switch>
        </v-form>
      </ValidationObserver>
    </v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click="$router.push('/')">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save()" :disabled="isFormValid()">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, max } from "vee-validate/dist/rules";
import ImageUpload from "@/modules/fileUpload/ImageUpload";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters"
});

// extend("email", {
//   ...email,
//   message: "Email must be valid"
// });

export default {
  name: "UserProfile",
  data: () => {
    return {
      isProfileFormValid: false,
      isProfessionalTrader: false,
      displayName: "",
      phoneNumber: "",
      savedProfile: null,
      imageUploadFilesToEdit: null
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    ImageUpload
  },
  methods: {
    ...mapActions(["saveUserProfile", "loadUserProfile"]),
    save() {
      let userProfilePayload = {
        DisplayName: this.displayName,
        PhoneNumber: this.phoneNumber,
        IsProfessionalTrader: this.isProfessionalTrader,
        userId: localStorage.userId
      };

      this.saveUserProfile(userProfilePayload).then(result => {
        let referenceEntity = {
          name: "advertiser",
          id: result._id
        };
        this.$refs.imageUploadComponent.onSubmit(referenceEntity);
      });
    },
    isFormValid() {
      let r =
        !this.isProfileFormValid ||
        this.getIsProcessing ||
        this.GetIsSnackbarVisible;
      // if (r === false) {
      // }
      return r;
    },
    uploadSucceed() {
      this.loadUserProfile({ userId: this.getLoggedUserId }).then(result => {
        this.imageUploadFilesToEdit = result.media_files;
      });
    },
    uploadError() {}
  },
  computed: {
    ...mapGetters([
      "getSnackbarMessageSuccess",
      "getSnackbarNotificationMessage",
      "GetIsSnackbarVisible",
      "getIsProcessing",
      "getLoggedUserId",
      "getUserProfile"
    ])
  },
  mounted() {
    let payload = { userId: this.getLoggedUserId };
    this.loadUserProfile(payload).then(result => {
      this.isProfessionalTrader = this.getUserProfile.IsProfessionalTrader;
      this.displayName = this.getUserProfile.DisplayName;
      this.phoneNumber = this.getUserProfile.PhoneNumber;
      this.imageUploadFilesToEdit = result.media_files;
    });
  }
};
</script>

<style>
</style>