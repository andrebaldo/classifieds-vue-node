<template>
  <div>
    <v-card>
      <ValidationObserver ref="observer" v-slot="{invalid }">
        <v-card-text>
          <v-form v-model="isProfileFormValid">
            <v-container fluid class="pa-0">
              <ValidationProvider
                v-slot="{ errors , invalid}"
                name="Registration"
                rules="required"
                ref="validationProviderRegistration"
              >
                <v-layout row wrap align-center>
                  <v-flex xs8 sm9>
                    <v-text-field
                      name="Registration"
                      label="Registration"
                      id="Registration"
                      v-model="carDetails.Registration"
                      d-inline-flex
                      prepend-icon="mdi-car"
                      class="to-uppercase"
                      required
                      :error-messages="errors"
                      @input="checkCarDetailsValidation()"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm3>
                    <v-layout row justify-end>
                      <v-btn
                        rounded
                        color="primary"
                        @click="searchVehicleRegistration(carDetails.Registration)"
                        :disabled="invalid"
                      >Search</v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </ValidationProvider>
            </v-container>
            <v-row align="center" justify="space-around">
              <v-spacer></v-spacer>
            </v-row>
            <v-expansion-panels v-model="expanderOpen">
              <v-expansion-panel>
                <v-expansion-panel-header>Fill manually</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Make"
                    rules="required"
                    ref="validationProviderMake"
                  >
                    <v-autocomplete
                      v-model="carDetails.Make"
                      :items="makes"
                      :loading="getIsProcessing"
                      :search-input.sync="searchCarmaker"
                      color="white"
                      hide-no-data
                      hide-selected
                      item-text="Name"
                      item-value="MakeId"
                      label="Make*"
                      placeholder="Start typing to search"
                      return-object
                      :error-messages="errors"
                    ></v-autocomplete>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="Model" rules="required">
                    <v-autocomplete
                      v-model="carDetails.Model"
                      :items="models"
                      :loading="getIsProcessing"
                      :search-input.sync="searchModel"
                      color="white"
                      hide-no-data
                      hide-selected
                      item-text="Name"
                      item-value="ModelId"
                      label="Model*"
                      placeholder="Start typing to search"
                      return-object
                      :error-messages="errors"
                      ref="validationProviderModel"
                    ></v-autocomplete>
                  </ValidationProvider>
                  <v-text-field
                    name="modelVariant"
                    label="Model Variant"
                    id="modelVariant"
                    v-model="carDetails.ModelVariant"
                  ></v-text-field>

                  <v-text-field
                    name="category"
                    label="Category"
                    id="category"
                    v-model="carDetails.Category"
                  ></v-text-field>

                  <v-text-field
                    name="colour"
                    label="Colour"
                    id="colour"
                    v-model="carDetails.Colour"
                  ></v-text-field>

                  <v-text-field
                    name="engineCC"
                    label="Engine cc"
                    id="engineCC"
                    v-model="carDetails.EngineCC"
                  ></v-text-field>
                  <ValidationProvider v-slot="{ errors }" name="Fuel" rules="required">
                    <v-select
                      :items="['DIESEL', 'PETROL', 'ELETRIC', 'OTHER']"
                      name="fuel"
                      label="Fuel*"
                      id="fuel"
                      v-model="carDetails.Fuel"
                      :error-messages="errors"
                      required
                      ref="validationProviderFuel"
                    ></v-select>
                  </ValidationProvider>
                  <div>
                    <v-menu
                      ref="DateOfFirstRegistrationMenu"
                      v-model="DateOfFirstRegistrationMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="carDetails.DateOfFirstRegistration"
                          label="First Registration on"
                          persistent-hint
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="carDetails.DateOfFirstRegistration"
                        no-title
                        @input="DateOfFirstRegistrationMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn rounded color="warning" @click="stepBack()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn rounded color="success" @click="saveStepProgress()" :disabled="invalid">Continue</v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { required } from "vee-validate/dist/rules";
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import { routeMixins } from "@/mixins/routeMixins";
export default {
  Name: "CarAdvertisement",
  mixins: [routeMixins],
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    entries: [],
    isProfileFormValid: false,
    searchResult: {},
    searchCarmaker: null,
    searchModel: null,
    modelNotFound: { Name: "No models found", ModelId: 0 },
    DateOfFirstRegistrationMenu: false,
    expanderOpen: null,
    editStepper: true,
    carDetails: {
      Registration: "",
      Make: "",
      Model: "",
      ModelVariant: "",
      Category: "",
      Colour: "",
      EngineCC: "",
      Fuel: "",
      DateOfFirstRegistration: "",
      DateFirstRegistrationIOM: "",
      LicenceStatus: "",
      LicenceExpiresOn: "",
      registrationError: ""
    },
    foundRegistration: {}
  }),
  props: {
    nextStep: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapActions([
      "getRegistrationDetails",
      "findCarMakes",
      "saveCarAdDetails",
      "getCarMake",
      "loadAllMakes",
      "getCarMakeById",
      "clearForNewAdvertisement"
    ]),
    isFormValid() {
      let r =
        !this.isProfileFormValid ||
        this.getIsProcessing ||
        this.GetIsSnackbarVisible;
      return r;
    },
    searchVehicleRegistration(vehicleRegistration) {
      let payload = {
        registration: vehicleRegistration
      };
      this.getRegistrationDetails(payload)
        .then(foundReg => {
          this.foundRegistration = foundReg;
          // If the registration wasn't found load all makes
          if (typeof this.foundRegistration != "undefined") {
            //Fech the make on server and loads into the combobox
            this.getCarMake({
              Name: this.foundRegistration.Make,
              ModelName: this.foundRegistration.Model
            }).then(make => {
              if (make.length > 0) {
                this.fillFormData(this.foundRegistration, make);
              }
            });
          }
        })
        .catch(() => {
          if (this.allMakesLoadedGetter === false) {
            this.loadAllMakes();
          }
        });
    },
    fillFormData(foundRegistration, make) {
      if (typeof foundRegistration != "undefined") {
        this.$nextTick(() => {
          this.carDetails.Make = make[0];
          // this.input = null;
          // this.$refs.autocomplete.internalSearch = null;
        });

        this.carDetails.Registration = foundRegistration.Registration;
        this.carDetails.ModelVariant = foundRegistration.ModelVariant;
        this.carDetails.Category = foundRegistration.Category;
        this.carDetails.Colour = foundRegistration.Colour;
        this.carDetails.EngineCC = foundRegistration.EngineCC;
        this.carDetails.Fuel = foundRegistration.Fuel.toUpperCase();
        this.carDetails.DateOfFirstRegistration =
          foundRegistration.DateOfFirstRegistration;
        this.carDetails.DateFirstRegistrationIOM =
          foundRegistration.DateFirstRegistrationIOM;
        this.carDetails.LicenceStatus = foundRegistration.LicenceStatus;
        this.carDetails.LicenceExpiresOn = foundRegistration.LicenceExpiresOn;

        let model = make[0].carmodels.filter(m => {
          return (
            m.Name.toLowerCase() === this.foundRegistration.Model.toLowerCase()
          );
        });

        if (model.length > 0) {
          this.carDetails.Model = model[0];
        }

        this.checkCarDetailsValidation();
      } else {
        this.registrationError = "Registration not found.";
      }
    },
    fillFormDataWithSavedCarAd(savedCarAd) {
      if (typeof savedCarAd != "undefined") {
        this.carDetails.Registration = savedCarAd.Registration;
        this.carDetails.ModelVariant = savedCarAd.ModelVariant;
        this.carDetails.Category = savedCarAd.Category;
        this.carDetails.Colour = savedCarAd.Colour;
        this.carDetails.EngineCC = savedCarAd.EngineCC;
        this.carDetails.Fuel = savedCarAd.Fuel.toUpperCase();
        this.carDetails.DateOfFirstRegistration =
          savedCarAd.DateOfFirstRegistration;
        this.carDetails.DateFirstRegistrationIOM =
          savedCarAd.DateFirstRegistrationIOM;
        this.carDetails.LicenceStatus = savedCarAd.LicenceStatus;
        this.carDetails.LicenceExpiresOn = savedCarAd.LicenceExpiresOn;
        if (typeof savedCarAd.carmake === "string") {
          this.getCarMakeById(savedCarAd.carmake).then(() => {
            let make = this.makes.filter(m => m._id === savedCarAd.carmake);
            if (make.length > 0) {
              this.carDetails.Make = make[0];
              let model = make[0].carmodels.filter(
                m => m._id === savedCarAd.carmodel
              );

              if (model.length > 0) {
                this.carDetails.Model = model[0];
              }
            }
          });
        } else {
          let make = this.makes.filter(m => {
            return (
              m.Name.toLowerCase() === savedCarAd.carmake.Name.toLowerCase()
            );
          });
          if (make.length > 0) {
            this.carDetails.Make = make[0];
            let model = make[0].carmodels.filter(m => {
              return (
                m.Name.toLowerCase() === savedCarAd.carmodel.Name.toLowerCase()
              );
            });

            if (model.length > 0) {
              this.carDetails.Model = model[0];
            }
          }
        }
      } else {
        this.registrationError = "Registration not found.";
      }
    },
    saveStepProgress() {
      this.saveCarAdDetails(this.carDetails).then(() => {
        this.$emit("step-changed", {
          carAdId: this.savedCarAdvertisementGetter._id,
          newStep: 2
        });
      });
    },
    resetValidationProviders() {
      if (this.$refs.validationProviderRegistration) {
        if (this.expanderOpen === 0) {
          this.$refs.validationProviderRegistration.applyResult({
            valid: true,
            errors: []
          });
        }
      }
    },
    checkCarDetailsValidation() {
      if (typeof this.$refs.validationProviderMake === "undefined") {
        this.expanderOpen = 0;
        setTimeout(() => {
          this.expanderOpen = null;
          return (
            this.$refs.validationProviderMake.validate() &&
            this.$refs.validationProviderModel.validate() &&
            this.$refs.validationProviderFuel.validate()
          );
        }, 0);
      } else {
        return (
          this.$refs.validationProviderMake.validate() &&
          this.$refs.validationProviderModel.validate() &&
          this.$refs.validationProviderFuel.validate()
        );
      }
    },
    stepBack() {
      
      if (this.savedCarAdvertisementGetter) {
        this.goToRoute("advertisement");
        this.clearForNewAdvertisement();
      } else {
          this.$router.history.go(-1);
      }
    }
  },
  computed: {
    ...mapGetters([
      "getSnackbarMessageSuccess",
      "getSnackbarNotificationMessage",
      "GetIsSnackbarVisible",
      "getIsProcessing",
      "getFoundRegistration",
      "carMakesGetter",
      "savedCarAdvertisementGetter",
      "allMakesLoadedGetter"
    ]),
    makes() {
      if (Array.isArray(this.carMakesGetter)) {
        return this.carMakesGetter;
      }
      return [];
    },
    models() {
      if (
        typeof this.carDetails.Make === "undefined" ||
        typeof this.carDetails.Make.carmodels === "undefined" ||
        this.carDetails.Make.carmodels.length === 0
      ) {
        return [this.modelNotFound];
      } else {
        return this.carDetails.Make.carmodels;
      }
    }
  },
  watch: {
    searchCarmaker(searchTerm) {
      if (searchTerm === null || searchTerm.length === 0) return;
      if (this.getIsProcessing) return;
      if (Array.isArray(this.carMakesGetter)) {
        let existent = this.carMakesGetter.filter(make => {
          return make.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        if (existent.length > 0) {
          return;
        }
      }
      const getMakerParams = {
        Name: searchTerm
      };
      this.findCarMakes(getMakerParams);
    },
    searchModel() {
      if (this.models.length > 0) return;
      if (this.getIsProcessing) return;
      if (
        typeof this.carDetails.Make === "undefined" ||
        this.carDetails.Make.carmodels.length === 0
      ) {
        return [];
      }
      return this.carDetails.Make.carmodels;
    },
    expanderOpen() {
      this.resetValidationProviders();
      if (
        this.makes.length === 0 &&
        this.carDetails.Registration.length === 0
      ) {
        this.loadAllMakes();
      }
    }
  },
  mounted() {
    if (this.savedCarAdvertisementGetter !== null) {
      this.fillFormDataWithSavedCarAd(this.savedCarAdvertisementGetter);
    } else if (this.foundRegistration.Registration) {
      if (typeof this.carMakesGetter !== "undefined") {
        this.fillFormData(this.foundRegistration, this.carMakesGetter);
      }
      if (this.carDetails !== null) {
        this.fillFormData(this.foundRegistration, this.carMakesGetter);
      }
    }
  }
};
</script>
<style lang="css">
.to-uppercase input {
  text-transform: uppercase;
}
.v-expansion-panel-content__wrap {
  padding: 5px;
}
</style>
