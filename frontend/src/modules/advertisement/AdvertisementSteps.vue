<template>
  <div>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Vehicle</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Title</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Pictures</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1" class="pa-0">
          <CarAdvertisement v-on:step-changed="stepperStepChanged" :nextStep="2" />
        </v-stepper-content>

        <v-stepper-content step="2" class="pa-0">
          <Advertisement v-on:set-step="setStep" :nextStep="3"  ref="advertisement" />
        </v-stepper-content>

        <v-stepper-content step="3" class="pa-0">
          <v-card>
            <v-card-text>
              <ImageUpload
                v-on:set-step="setStep"
                v-on:upload-succeed="uploadSucceed"
                v-on:upload-error="uploadError"
                :nextStep="3"
                uploadButtonText="Save"
                :referenceEntity="getReferenceEntityUpload()"
                :filesToEdit="filesUploadedGetter"
              />
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import CarAdvertisement from "@/modules/advertisement/CarAdvertisement";
import Advertisement from "@/modules/advertisement/Advertisement";
import ImageUpload from "@/modules/fileUpload/ImageUpload";
import { mapGetters, mapActions } from "vuex";
import { routeMixins } from "@/mixins/routeMixins";
export default {
  Name: "Advertisemment",
  mixins: [routeMixins],
  data: () => {
    return {
      step: 1
    };
  },
  components: {
    CarAdvertisement,
    Advertisement,
    ImageUpload
  },
  computed: {
    ...mapGetters([
      "savedAdvertisementGetter",
      "savedCarAdvertisementGetter",
      "getUserProfile",
      "getLoggedUserId",
      "filesUploadedGetter"
    ])
  },
  methods: {
    ...mapActions([
      "saveAdvertisement",
      "loadUserProfile",
      "loadAllAdvertisementsByAdvertiser",
      "clearAdvertisement",
      "clearCarAdvertisement"
    ]),
    getReferenceEntityUpload() {
      if (this.savedAdvertisementGetter) {
        return {
          name: "advertisement",
          id: this.savedAdvertisementGetter._id
        };
      }
    },
    setStep(step) {
      this.step = step;
    },
    stepperStepChanged(payload) {
      /* Checks if there is an Advertisement saved, if not saves one just to preserve the
       * relationship between the Advertisement and CarAd
       */
      if (this.savedAdvertisementGetter === null) {
        const adBuilt = this.buildAdtvertisementTitle();
        const mockAd = {
          Title: adBuilt.Title,
          Description: "",
          car_advertisement: payload.carAdId,
          advertiser: this.getUserProfile._id,
          ClassificationType: "Car"
        };
        this.saveAdvertisement(mockAd).then(() => {
          this.step = payload.newStep;
          this.$refs.advertisement.loadSavedAdData();
        });
      } else if (
        this.savedAdvertisementGetter &&
        !this.savedAdvertisementGetter.car_advertisement
      ) {
        //Save create relationship between carsAds and Ads
        let ad = this.savedAdvertisementGetter;
        ad.car_advertisement = this.savedCarAdvertisementGetter._id;

        if (!ad.ClassificationType) {
          ad.ClassificationType = "Car";
        }
        this.saveAdvertisement(ad).then(() => {
          this.step = payload.newStep;
          this.$refs.advertisement.loadSavedAdData();
        });
      } else {
        let ad = this.savedAdvertisementGetter;

        if (!ad.ClassificationType) {
          ad.ClassificationType = "Car";
          this.saveAdvertisement(ad).then(() => {
            this.step = payload.newStep;
            this.$refs.advertisement.loadSavedAdData();
          });
        } else {
          this.step++;
          this.$refs.advertisement.loadSavedAdData();
        }
      }
    },
    buildAdtvertisementTitle() {
      if (this.savedCarAdvertisementGetter !== null) {
        const carAd = this.savedCarAdvertisementGetter;
        let adTitle = "";
        let firstDate = null;
        if (
          typeof carAd.carmake !== "undefined" &&
          carAd.carmake.Name.length > 0
        ) {
          adTitle = carAd.carmake.Name;
          if (
            typeof carAd.carmodel !== "undefined" &&
            carAd.carmodel.Name.length > 0
          ) {
            adTitle =
              adTitle.length > 0
                ? `${adTitle} ${carAd.carmodel.Name}`
                : adTitle;
          }
          if (
            typeof carAd.DateOfFirstRegistration !== "undefined" &&
            carAd.DateOfFirstRegistration.length > 0
          ) {
            firstDate = new Date(carAd.DateOfFirstRegistration);
          }
          if (
            typeof carAd.DateOfFirstRegistrationIOM !== "undefined" &&
            carAd.DateOfFirstRegistrationIOM.length > 0
          ) {
            let regDateIOM = new Date(carAd.DateOfFirstRegistrationIOM);
            if (firstDate !== null && firstDate > regDateIOM) {
              firstDate = regDateIOM;
            }
          }
          if (firstDate !== null) {
            adTitle += ` ${firstDate.getFullYear()}`;
          }
        }
        return {
          Title: adTitle
        };
      }
    },
    uploadSucceed() {
      this.clearAdvertisement();
      this.clearCarAdvertisement();
      this.goToRoute("advertisement");
    },
    uploadError() {}
  },
  mounted() {
    if (typeof this.getUserProfile === "undefined") {
      this.loadUserProfile({ userId: this.getLoggedUserId });
    }
  }
};
</script>

<style>
</style>