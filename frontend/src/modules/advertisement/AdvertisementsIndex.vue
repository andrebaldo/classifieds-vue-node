<template>
  <div>
    <v-tabs v-model="tab" grow>
      <!-- <v-tab>Unpublished</v-tab> -->
      <v-tab>
        <v-badge :content="publishedAdsGetter.length" inline>Published</v-badge>
      </v-tab>
      <v-tab>
        <v-badge :content="deletedAdsGetter.length" inline>Trash</v-badge>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- <v-tab-item>
        <AdvertisementCard
          :showEditButton="true"
          :showSendToTrashButton="true"
          :advertisements="waitingPublicationAdsGetter"
        ></AdvertisementCard>
      </v-tab-item>-->
      <v-tab-item>
        <AdvertisementCard
          :showEditButton="true"
          :showSendToTrashButton="true"
          :advertisements="publishedAdsGetter"
          :showAddNewButtonWhenEmpty="true"
        ></AdvertisementCard>
      </v-tab-item>
      <v-tab-item>
        <AdvertisementCard
          :showDeleteButton="true"
          :showRecoverButton="true"
          :advertisements="deletedAdsGetter"
        ></AdvertisementCard>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AdvertisementCard from "@/modules/advertisement/AdvertisementCard";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    AdvertisementCard
  },
  data: () => {
    return {
      tab: null
    };
  },
  methods: {
    ...mapActions(["loadAllAdvertisementsByAdvertiser", "loadUserProfile"]),
    callback() {
      alert("");
    }
  },
  computed: {
    ...mapGetters([
      "waitingPublicationAdsGetter",
      "publishedAdsGetter",
      "deletedAdsGetter",
      "getUserProfile",
      "getLoggedUserId"
    ])
  },
  mounted() {
    this.loadAllAdvertisementsByAdvertiser();
  }
};
</script>
<style>
.v-slide-group__prev {
  display: none !important;
}
</style>