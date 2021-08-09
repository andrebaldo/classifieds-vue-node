<template>
  <div class="text-center">
    <ValidationObserver v-slot="{ invalid  }">
      <v-dialog v-model="show">
        <v-card>
          <v-card-title primary-title>Send message to advertiser</v-card-title>
          <v-card-text>
            <ValidationProvider v-slot="{ errors }" name="Message" rules="required|max:500|min:2">
              <v-textarea
                outlined
                name="message"
                label="Message"
                v-model="message"
                :counter="150"
                :error-messages="errors"
              ></v-textarea>
            </ValidationProvider>
          </v-card-text>
          <v-card-actions>
            <v-btn rounded color="warning" @click="cancel()">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn rounded color="primary" @click="sendMessage()" :disabled="invalid">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </ValidationObserver>
  </div>
</template>

<script>
import { required, max, min } from "vee-validate/dist/rules";
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters"
});

extend("min", {
  ...min,
  message: "{_field_} may not be less than {length} characters"
});

import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => {
    return {
      message: ""
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    ad: {
      type: Object,
      required: true
    },
    adLink: {
      type: String,
      required: true
    },
    showDialog: Boolean
  },
  computed: {
    ...mapGetters(["getIsProcessing", "getLoggedUserId", "getUserProfile"]),
    show: {
      get() {
        return this.showDialog;
      }
    }
  },
  methods: {
    ...mapActions(["sendMessageToAdvertiser"]),
    sendMessage() {
      if (!this.getLoggedUserId) {
        this.$router.push({ name: "login", query: { redirect: this.adLink } });
      } else {
        this.sendMessageToAdvertiser({
          message: this.message,
          ad_id: this.ad._id,
          sender_id: this.getLoggedUserId,
          link: `${window.location.origin}${this.adLink}`
        }).then(() => {
          this.$emit("dialog-cancel", { messageSent: true });
        });
      }
    },
    cancel() {
      this.$emit("dialog-cancel");
    }
  }
};
</script>

<style>
</style>