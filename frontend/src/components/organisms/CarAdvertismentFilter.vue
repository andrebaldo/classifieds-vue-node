<template>
  <v-card>
    <v-card-text class="ma-2 pa-1">
      <v-form ref="myForm">
        <v-expansion-panels flat class="ma-0">
          <v-expansion-panel>
            <v-expansion-panel-header>Filter and sort</v-expansion-panel-header>
            <v-expansion-panel-content class="ma-0 pa-0">
              <v-flex class="d-inline-flex flex-wrap justify-space-between align-center">
                <v-flex xs12 sm6 lg3 xl2 class="d-inline-flex justify-space-between align-center">
                  <v-switch
                    small
                    class="pa-2 ma-0"
                    v-model="onlyCarAds"
                    label="Only cars"
                    hide-details
                  ></v-switch>

                  <v-btn
                    small
                    text
                    rounded
                    color="info"
                    @click="searchAdvertisements(true)"
                  >Clear Filters</v-btn>
                </v-flex>
                <v-flex xs12 sm6 lg3 xl2 class="d-inline-flex justify-space-between align-center">
                  <v-autocomplete
                    v-model="carmake"
                    :items="carMakes"
                    :loading="getIsProcessing"
                    :search-input.sync="searchCarmaker"
                    color="white"
                    item-text="Name"
                    item-value="MakeId"
                    label="Find by Make"
                    placeholder="All Makes"
                    return-object
                    class="pa-1"
                    hide-details
                    @change="loadModels()"
                    outlined
                    v-if="onlyCarAds"
                  ></v-autocomplete>
                  <v-autocomplete
                    v-if="carModels && onlyCarAds"
                    v-model="carModel"
                    :items="carModels"
                    :loading="getIsProcessing"
                    :search-input.sync="searchModel"
                    color="white"
                    hide-selected
                    hide-details
                    item-text="Name"
                    item-value="ModelId"
                    label="Model"
                    placeholder="All Models"
                    return-object
                    ref="validationProviderModel"
                    class="pa-1"
                    outlined
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm6 lg3 xl2 class="d-inline-flex justify-space-between align-center">
                  <v-text-field
                    name="minPrice"
                    label="Min price"
                    id="minPrice"
                    type="number"
                    outlined
                    class="pa-1"
                    hide-details
                    v-model="minPrice"
                    small
                  ></v-text-field>
                  <v-text-field
                    name="maxPrice"
                    label="Max price"
                    id="maxPrice"
                    type="number"
                    outlined
                    class="pa-1"
                    hide-details
                    v-model="maxPrice"
                    small
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 lg3 xl2 class="d-inline-flex justify-space-between align-center">
                  <span>Order by</span>
                  <AscDescButton
                    text="Date"
                    v-on:click="setOrderByDate"
                    class="ma-2"
                    :setClickedTimes="1"
                  />
                  <AscDescButton text="Price" v-on:click="setOrderByPrice" class="ma-2" />
                </v-flex>
                <v-flex class="d-inline-flex justify-end align-center">
                  <v-btn rounded color="info" class="ma-2" @click="searchAdvertisements()">Search</v-btn>
                </v-flex>
              </v-flex>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AscDescButton from "@/components/atoms/AscDescButton";
export default {
  data: () => {
    return {
      searchCarmaker: null,
      searchModel: null,
      carmake: null,
      carModels: null,
      carModel: null,
      minPrice: null,
      maxPrice: null,
      onlyCarAds: false,
      orderByDate: null,
      orderByPrice: null
    };
  },
  components: { AscDescButton },
  watch: {
    onlyCarAds() {
      if (typeof this.carMakes === "undefined" || this.carMakes.length === 0)
        this.loadAllMakes();
    },
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
      if (this.carModels.length > 0) return;
      if (this.getIsProcessing) return;
      if (
        typeof this.carmake === "undefined" ||
        this.carmake.carmodels.length === 0
      ) {
        return [];
      }
      return this.carmake.carmodels;
    }
  },
  methods: {
    ...mapActions(["loadAllMakes"]),
    loadModels() {
      this.carModels = this.carmake?.carmodels;
    },
    searchAdvertisements(clearSearch) {
      let searchParameters = {};
      if (clearSearch) {
        this.$emit("search", null);
        this.carmake = null;
        this.carModel = null;
        this.minPrice = null;
        this.maxPrice = null;
        this.onlyCarAds = false;
        this.orderByDate = null;
        this.orderByPrice = null;
      } else {
        searchParameters = {
          carmake: this.onlyCarAds ? this.carmake : null,
          carmodel: this.onlyCarAds ? this.carModel : null,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          onlyCarAds: this.onlyCarAds,
          orderByDate: this.orderByDate,
          orderByPrice: this.orderByPrice
        };
        this.$emit("search", searchParameters);
      }
      localStorage["searchParameters"] = JSON.stringify(searchParameters);
    },
    setOrderByDate(result) {
      if (result.active) {
          this.orderByDate = result.desc ? "createdAt:DESC" : "createdAt";
      } else {
        this.orderByDate = null;
      }
    },
    setOrderByPrice(result) {
      if (result.active) {
        this.orderByPrice = result.desc ? "Price:DESC" : "Price";
      } else {
        this.orderByPrice = null;
      }
    }
  },
  computed: {
    ...mapGetters(["getIsProcessing", "carMakesGetter"]),

    carMakes() {
      if (Array.isArray(this.carMakesGetter)) {
        return this.carMakesGetter;
      }
      return [];
    }
  },
  mounted() {
    if (localStorage["searchParameters"]) {
      let searchParameters = JSON.parse(localStorage["searchParameters"]);
      this.carmake = searchParameters.carmake;
      this.carModel = searchParameters.carmodel;
      this.minPrice = searchParameters.minPrice;
      this.maxPrice = searchParameters.maxPrice;
      this.onlyCarAds = searchParameters.onlyCarAds;
      this.orderByDate = searchParameters.orderByDate;
      this.orderByPrice = searchParameters.orderByPrice;
    }
  }
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0px;
}
.v-expansion-panel-header {
  padding: 2px;
}
</style>