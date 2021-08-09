<template>
  <v-container fluid class="d-flex">
    <v-layout row wrap>
      <v-flex xs12 class="ma-2">
        <AdSearchBox v-on:search="setSearchTerm" :incomingSearchTerm="routeSearchTerm" />
        <AdCategoriesList v-on:setCategoriesFilter="setCategoryFilter" />
        <AdSortBox v-on:setsort="setSort" />
      </v-flex>
      <v-flex xs12>
        <AdvertisementCard
          :noItemsMessage="noItemsMessage"
          :advertisements="publicAdsGetter"
          :showAddNewButtonWhenEmpty="showAddNewButtonWhenEmpty"
          :showCopyLinkToShareButton="true"
          :showSendMessageButton="true"
          :currentAdvertiserId="getCurrentAdvertiserId()"
        ></AdvertisementCard>
      </v-flex>
    </v-layout>
    <router-view name="dialog"></router-view>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import AdvertisementCard from "@/modules/advertisement/AdvertisementCard";
import AdSearchBox from "@/components/organisms/AdSearchBox";
import AdSortBox from "@/components/organisms/AdSortBox";
import AdCategoriesList from "@/components/organisms/AdCategoriesList";
///import CarAdvertismentFilter from "@/components/organisms/CarAdvertismentFilter";
export default {
  components: { AdvertisementCard, AdSearchBox, AdSortBox, AdCategoriesList },
  computed: {
    ...mapGetters([
      "publicAdsGetter",
      "getIsProcessing",
      "getUserProfile",
      "getLoggedUserId"
    ])
  },
  data: () => {
    return {
      carmake: null,
      carmodel: null,
      parameters: {
        Status: "Published",
        _limit: 5,
        _start: 0,
        _sort: "createdAt:DESC"
      },
      sort: null,
      searchTerm: null,
      noItemsMessage: null,
      noItemsMessageDefault: "Sorry, no items found for your search :(",
      routeSearchTerm: "",
      showAddNewButtonWhenEmpty: true,
      userProfile: null
    };
  },
  methods: {
    ...mapActions(["loadPublicAdvertisements","loadUserProfile", "loadAdAvaliableAdCategories"]),
    ...mapMutations(["setPublicAds", "setShowIsProcessingAlert"]),
    setSort(sort) {
      this.sort = sort;
      this.parameters._start = 0;
      if (this.sort) {
        this.parameters._sort = this.sort;
        this.onSearch(null);
      }
    },
    setSearchTerm(term) {
      this.setShowIsProcessingAlert(false);
      this.parameters._start = 0;
      this.searchTerm = term;
      if (this.searchTerm) {
        this.parameters.searchTerm = this.searchTerm;
      } else {
        delete this.parameters.searchTerm;
      }
      return this.onSearch(null);
    },
    setCategoryFilter(categories) {
      this.setShowIsProcessingAlert(false);
      this.parameters._start = 0;
      if (categories) {
        this.parameters.advertisement_category_in = categories;
      } else {
        delete this.parameters.advertisement_category_in;
      }
      return this.onSearch(null);
    },
    onSearch() {
      // this.parameters = {
      //   Status: "Published",
      //   _limit: 5,
      //   _start: 0,
      //   _sort: "createdAt:DESC"
      // };
      // if (payload === null)
      //   return this.loadPublicAdvertisements(this.parameters);

      // if (payload.carmake) {
      //   this.parameters["car_advertisement.carmake"] = payload.carmake._id;
      //   if (payload.carmodel) {
      //     this.parameters["car_advertisement.carmodel"] = payload.carmodel._id;
      //   }
      // }
      // if (payload.minPrice) {
      //   this.parameters.Price_gt = payload.minPrice;
      // }
      // if (payload.maxPrice) {
      //   this.parameters.Price_lt = payload.maxPrice;
      // }
      // if (payload.onlyCarAds) {
      //   this.parameters.ClassificationType = "Car";
      // }
      // delete this.parameters._sort;
      // if (payload.orderByDate) {
      //   this.parameters._sort = payload.orderByDate;
      // }
      // if (payload.orderByPrice) {
      //   this.parameters._sort
      //     ? (this.parameters._sort += `,${payload.orderByPrice}`)
      //     : (this.parameters._sort = payload.orderByPrice);
      // }

      // this.carmake = payload?.carmake;
      // this.carmodel = payload?.carmodel;
      this.noItemsMessage = this.noItemsMessageDefault;
      this.setScrollListener();
      return this.loadPublicAdvertisements(this.parameters).then(() => {
        this.setShowIsProcessingAlert(true);
        this.showAddNewButtonWhenEmpty = true;
      });
    },
    setScrollListener() {
      if (window.onscroll === this.onScroll) return;
      window.onscroll = this.onScroll;
    },
    onScroll() {
      let scrollPercentage =
        (document.documentElement.scrollTop + window.innerHeight) /
        document.documentElement.scrollHeight;
      if (scrollPercentage >= 0.9) {
        if (!this.getIsProcessing && this.$route.name === "home") {
          this.parameters._start = this.publicAdsGetter.length;
          this.parameters._limit = 5;
          this.setShowIsProcessingAlert(false);
          this.loadPublicAdvertisements(this.parameters)
            .then(() => {
              this.setShowIsProcessingAlert(true);
            })
            .catch(() => {
              this.setShowIsProcessingAlert(true);
            });
        }
      }
    },
    getCurrentAdvertiserId() {
      if (this.userProfile) return this.userProfile._id;

      return this.getUserProfile && this.getUserProfile.id
        ? this.getUserProfile._id
        : "";
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.ad) {
      this.routeSearchTerm = this.$route.query.ad;
      this.setSearchTerm(this.$route.query.ad).then(() => {
        if (this.publicAdsGetter || this.publicAdsGetter.length === 0) {
          this.showAddNewButtonWhenEmpty = false;
          this.noItemsMessage = "Sorry this item isn't avaible anymore.";
        }
      });
    } else {
      this.loadPublicAdvertisements(this.parameters);
      this.setScrollListener();
    }

    if (this.getLoggedUserId) {
      let payload = { userId: this.getLoggedUserId };
      this.loadUserProfile(payload).then(profile => {
        this.userProfile = profile;
      });
    }

    if (!this.getAvailableAdCategories) {
      this.loadAdAvaliableAdCategories();
    }
  }
};
</script>

<style>
</style>