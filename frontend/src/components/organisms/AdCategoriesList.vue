<template>
  <v-layout>
    <v-flex class="d-flex flex-wrap justify-space-between ma-2">
      <v-btn
        class="mt-1"
        v-for="cat in availableCategories"
        :key="cat._id"
        rounded
        :color="getColor(cat)"
        small
        @click="setCategoriesFilter(cat)"
      >{{cat.CategoryName}}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => {
    return {
      selectedCategories: [],
      availableCategories: []
    };
  },
  computed: {
    ...mapGetters(["getAvailableAdCategories"])
  },
  methods: {
    setCategoriesFilter(cat) {
      let catIndex = this.selectedCategories.indexOf(cat);
      if (catIndex > -1) {
        this.selectedCategories.splice(catIndex, 1);
      } else {
        this.selectedCategories.push(cat);
      }

      this.$emit(
        "setCategoriesFilter",
        this.selectedCategories.map(c => c._id)
      );
    },
    getColor(cat) {
      let catIndex = this.selectedCategories.indexOf(cat);
      if (catIndex > -1) {
        return "success";
      }
      return null;
    }
  },
  mounted() {
    var interval = setInterval(() => {
      if (this.getAvailableAdCategories) {
        this.availableCategories = this.getAvailableAdCategories;
        if (!this.availableCategories.find(c => c.id === "uncategorised")) {
          this.availableCategories.push({
            CategoryName: "Uncategorised",
            _id: "uncategorised",
            id: "uncategorised"
          });
        }

        clearInterval(interval);
      }
    }, 500);
  }
};
</script>

<style>
</style>