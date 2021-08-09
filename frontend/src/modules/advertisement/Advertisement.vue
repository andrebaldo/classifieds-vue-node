<template>
  <v-card>
    <ValidationObserver v-slot="{invalid  }">
      <v-card-text>
        <form>
          <ValidationProvider v-slot="{ errors }" name="title" rules="required|max:150">
            <v-text-field
              v-model="title"
              :counter="150"
              :error-messages="errors"
              label="Title"
              required
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="description" rules="required|max:500">
            <v-textarea
              v-model="description"
              :counter="500"
              :error-messages="errors"
              label="Description"
              required
            ></v-textarea>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="price" rules="required">
            <v-text-field
              type="number"
              v-model="price"
              :error-messages="errors"
              label="Price"
              prefix="£"
              required
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="category" rules="required">
            <v-select
              :items="availableCategories"
              label="Category"
              v-model="category"
              outlined
              :error-messages="errors"
              item-text="CategoryName"
              item-value="id"
            ></v-select>
          </ValidationProvider>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn rounded color="warning" @click="stepBack()">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn rounded color="success" @click="saveStepProgress()" :disabled="invalid">Continue</v-btn>
      </v-card-actions>
    </ValidationObserver>
  </v-card>
</template>

<script>
import { required, email, max } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
//setInteractionMode('eager')

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters"
});

extend("email", {
  ...email,
  message: "Email must be valid"
});

import { routeMixins } from "@/mixins/routeMixins";
export default {
  mixins: [routeMixins],
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    title: "",
    description: "",
    price: 0,
    classification: "",
    availableCategories: []
  }),
  props: {
    nextStep: {
      type: Number,
      required: true
    }
  },
  watch: {
    classification() {
      this.filterCategories();
    }
  },
  methods: {
    ...mapActions([
      "saveAdvertisement",
      "loadUserProfile",
      "clearForNewAdvertisement"
    ]),
    filterCategories() {
      if (!this.classification) {
        this.availableCategories = this.getAvailableAdCategories.filter(
          c => c.CategoryName !== "Cars"
        );
      } else if (this.classification === "Car") {
        this.availableCategories = this.getAvailableAdCategories.filter(
          c => c.CategoryName === "Cars"
        );
        this.category = this.availableCategories[0].id;
      }
    },
    submit() {
      //this.$refs.observer.validate()
    },
    clear() {
      this.title = "";
      this.description = "";
      this.$refs.observer.reset();
    },
    saveStepProgress() {
      this.loadUserProfile({ userId: this.getLoggedUserId }).then(result => {
        let ad = {
          Title: this.title,
          Description: this.description,
          Price: this.price,
          advertiser: result._id,
          advertisement_category: this.category
        };
        this.saveAdvertisement(ad).then(() => {
          this.$emit("set-step", this.nextStep);
        });
      });
    },
    loadSavedAdData() {
      if (this.savedAdvertisementGetter !== null) {
        this.title = this.savedAdvertisementGetter.Title;
        this.description = this.savedAdvertisementGetter.Description;
        this.price = this.savedAdvertisementGetter.Price;
        this.category = this.savedAdvertisementGetter.advertisement_category;
        this.classification = this.savedAdvertisementGetter.ClassificationType;
      }
    },
    stepBack() {
      if (this.savedAdvertisementGetter) {
        this.goToRoute("advertisement");
        this.clearForNewAdvertisement();
      } else {
        this.$router.history.go(-1);
      }

      // if (this.nextStep - 1 === 1) {
      //   this.$router.history.go(-1);
      // } else {
      //   this.$emit("set-step", this.nextStep - 1);
      // }
    }
  },
  computed: {
    ...mapGetters([
      "savedAdvertisementGetter",
      "getUserProfile",
      "getLoggedUserId",
      "getAvailableAdCategories"
    ])
  },
  mounted() {
    this.loadSavedAdData();
    if (typeof this.getUserProfile === "undefined") {
      this.loadUserProfile({ userId: this.getLoggedUserId });
    }
    
    if (!this.getAvailableAdCategories) {
      this.loadAdAvaliableAdCategories().then(() => {
        this.filterCategories();
      });
    }else{
      this.filterCategories();
    }
  }
};
</script>

<style>
</style>