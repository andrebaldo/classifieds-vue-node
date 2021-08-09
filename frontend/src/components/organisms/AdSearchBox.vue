<template>
  <v-layout>
    <v-flex>
      <v-text-field
        rounded
        label="Search"
        solo
        hide-details
        prepend-inner-icon="mdi mdi-magnify"
        :append-icon="getAppendSearchIcon()"
        @click:append="clickSearchAppendIcon()"
        v-model="searchTerm"
        v-on:keyup="checkKeyPressed"
        :loading="getIsProcessing"
      ></v-text-field>

      <!-- <v-autocomplete
      v-model="autoCompleteModel"
      :loading="getIsProcessing"
      :items="autoCompleteItems"
      :search-input.sync="searchAutocomplete"
      cache-items
      hide-no-data
      hide-details
      label="Search"
      ></v-autocomplete>-->
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AdSearchBox",
  data: () => {
    return {
      searchTerm: null,
      searchTimeout: null,
      lastSearchTerm: null,
      isAppendIconClickToClearSearch: false
    };
  },
  computed: {
    ...mapGetters(["getIsProcessing"])
  },
  props: {
    incomingSearchTerm: String
  },
  watch: {
    // searchTerm() {
    //   if (this.searchTerm === null || this.searchTerm.length === 0) return;
    //   if (this.getIsProcessing) return;

    //   clearTimeout(this.searchTimeout);
    //   this.searchTimeout = setTimeout(() => {
    //     clearTimeout(this.searchTimeout);
    //     this.performSearch(this.searchTerm);
    //   }, 2000);
    // },
    incomingSearchTerm() {
      this.searchTerm = this.incomingSearchTerm;
    }
    // searchAutocomplete(val) {
    //   val && val !== this.select && this.querySelections(val);
    // }
  },

  methods: {
    clickSearchAppendIcon() {
      if (this.isAppendIconClickToClearSearch) {
        this.searchTerm = "";
        this.lastSearchTerm = "";
      }else{
        this.lastSearchTerm = this.searchTerm;
      }

      this.performSearch(this.searchTerm);
    },
    getAppendSearchIcon() {
      if (this.searchTerm && this.lastSearchTerm !== this.searchTerm) {
        this.isAppendIconClickToClearSearch = false;
        return "mdi-subdirectory-arrow-right";
      } else {
        this.isAppendIconClickToClearSearch = true;
        return "mdi-close";
      }
    },
    performSearch(term) {
      this.$emit("search", term);
    },
    checkKeyPressed(e) {
      if (e.keyCode === 13) {
        this.performSearch(this.searchTerm);
      } else if (this.searchTerm === "") {
        this.performSearch(null);
      }
    }
  }
};
</script>

<style>
</style>