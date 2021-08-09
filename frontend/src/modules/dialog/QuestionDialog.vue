<template>
  <div class="text-center">
    <v-dialog v-model="show">
      <v-card>
        <v-card-title primary-title>{{title}}</v-card-title>

        <v-card-text>{{text}}</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="warning" @click="cancel()" rounded>Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="yes()" rounded>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "QuestionDialog",
  props: {
    title: {
      default: "Confirmation",
      type: String
    },
    text: {
      type: String,
      default: "Do you confirm the action?"
    },
    buttons: {
      type: String,
      default: "YesCancel"
    },
    value: Object
  },
  methods: {
    yes() {
      this.$emit("dialog-yes", this.value.adId);
    },
    cancel() {
      this.$emit("dialog-cancel", this.value.adId);
    }
  },
  computed: {
    show: {
      get() {
        return this.value.showDialog;
      }
    }
  }
};
</script>