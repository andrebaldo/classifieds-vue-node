<template>
  <div>
    <v-layout class="d-flex justify-center wrap">
      <v-flex xs12>
        <h3
          class="text-center pa-5"
          v-if="advertisements && advertisements.length === 0"
        >{{noItemsMessage}}</h3>
      </v-flex>
      <v-flex xs12 class="d-flex justify-center">
        <v-btn
          color="primary"
          v-if="showAddNewButtonWhenEmpty && advertisements && advertisements.length === 0"
          rounded
          @click="goToRoute('new-advertisement')"
        >Create New</v-btn>
      </v-flex>
    </v-layout>

    <v-container fluid class="d-flex flex-row-reverse">
      <v-layout row wrap>
        <v-flex xs12 sm12 md6 lg4 xl2 v-for="ad in advertisements" :key="ad.id" :id="ad._id">
          <v-card class="ma-2">
            <v-card-title color="primary">
              <v-flex class="d-inline-flex ma-0 justify-space-between">
                <span class="title one-line mr-2">{{ad.Title}}</span>
                <span
                  class="title one-line-no-ellipsis"
                  v-if="ad.Price > 0"
                >{{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits:0 }).format(ad.Price)}}</span>
                <span class="title one-line-no-ellipsis" v-if="ad.Price == 0">Free</span>
              </v-flex>
            </v-card-title>

            <v-card-text class="pa-0 image-previewer-container">
              <ImagePreviewer
                :images="getImageArray(ad)"
                :description="`${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits:0 }).format(ad.Price)} ${ad.Description ? ad.Description : '' }`"
              />

              <div class="pl-2 pr-2 body-2 mt-4" v-html="ad.Description"></div>
              <v-divider class="ma-2"></v-divider>
              <div v-if="ad.SourceUrl" class="pl-2 pr-2">
                <!-- <span>Indexed by carfinderbot &nbsp;</span> -->
                <a :href="ad.SourceUrl" target="_blank">go to source</a>
                <v-flex class="d-flex justify-end">
                  <span class="ml-2 mr-2">
                    {{Intl.DateTimeFormat('en-GB',
                    {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'}
                    ).format(new Date(ad.createdAt))}}
                  </span>
                </v-flex>
              </div>
              <div v-if="!ad.SourceUrl" class="pl-2 pr-2">
                <v-flex class="d-inline-flex">
                  <v-avatar
                    v-if="ad.advertiser.media_files && ad.advertiser.media_files.length > 0"
                  >
                    <img :src="ad.advertiser.media_files[0].url" />
                  </v-avatar>
                  <div class="ml-3">
                    <span class="font-weight-bold">{{ad.advertiser.DisplayName}}</span>
                    <br />
                    <!-- <div v-if="ad.advertiser.PhoneNumber">
                      <span class="body-2 mr-2">Phone:</span>
                      <span>{{ad.advertiser.PhoneNumber}}</span>
                    </div>-->

                    <br />
                    <div v-if="ad.advertiser.IsProfessionalTrader">
                      <v-icon class>mdi-car-multiple</v-icon>
                      <span class="body-2">Vehicle Sales Store</span>
                    </div>
                  </div>
                </v-flex>
                <v-flex class="d-flex justify-end">
                  <span class="ml-2 mr-2">
                    {{Intl.DateTimeFormat('en-GB',
                    {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'}
                    ).format(new Date(ad.createdAt))}}
                  </span>
                </v-flex>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-layout row class="pl-1 pr-1">
                <v-flex
                  class="d-inline-flex pl-1 pr-1"
                  v-if="showCopyLinkToShareButton||showSendMessageButton "
                >
                  <v-btn
                    color="success"
                    rounded
                    small
                    v-if="showCopyLinkToShareButton"
                    :href="`whatsapp://send?text=${getAdLink(ad._id)}`"
                    data-action="share/whatsapp/share"
                  >
                    <v-icon>mdi-whatsapp</v-icon>
                  </v-btn>

                  <v-btn
                    color="primary"
                    small
                    :value="`/ad=${ad.id}`"
                    @click.prevent="copyLink(ad._id)"
                    v-if="showCopyLinkToShareButton"
                    rounded
                  >
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                  <v-btn
                    color="primary"
                    small
                    @click="sendMessage(ad)"
                    v-if="!ad.SourceUrl && showSendMessageButton && getLoggedUserId !== ad.advertiser.user"
                    rounded
                  >Message</v-btn>
                </v-flex>
                <v-flex
                  class="d-inline-flex pl-1 pr-1"
                  v-if="showSendToTrashButton || showDeleteButton || showEditButton || showRecoverButton || ad.advertiser.id === currentAdvertiserId"
                >
                  <v-btn
                    v-if="showSendToTrashButton"
                    rounded
                    x-small
                    fab
                    dark
                    bottom
                    right
                    color="warning"
                    @click="sendToTrashDialog(ad)"
                  >
                    <v-icon dark>mdi-trash-can-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="showDeleteButton || ad.advertiser.id === currentAdvertiserId"
                    rounded
                    x-small
                    fab
                    dark
                    bottom
                    right
                    color="red"
                    @click="deleteForeverDialog(ad)"
                  >
                    <v-icon dark>mdi-delete-forever-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="showEditButton || ad.advertiser.id === currentAdvertiserId"
                    rounded
                    x-small
                    fab
                    dark
                    bottom
                    right
                    color="primary"
                    @click="editAd(ad)"
                  >
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="showRecoverButton"
                    rounded
                    dark
                    bottom
                    right
                    color="primary"
                    @click="recoverAd(ad)"
                  >
                    <v-icon dark>mdi-archive-arrow-up-outline</v-icon>Recover
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <span
                    class="ma-2 body-2"
                    v-if="!ad.advertisement_category"
                  >Help us to better classify this ad! Just click in a category:</span>
                  <span class="ma-2 body-2" v-if="ad.advertisement_category_thanks">Cheers!</span>
                </v-flex>
                <v-flex>
                  <div v-if="ad.advertiser.id === currentAdvertiserId">
                    <v-btn
                      class="ma-1"
                      v-for="cat in getAvailableAdCategories"
                      :key="cat._id"
                      rounded
                      :color="cat._id === ad.advertisement_category ? 'success' : ''"
                      small
                      @click="updateAdCategory(ad, cat._id)"
                    >{{cat.CategoryName}}</v-btn>
                  </div>
                  <div v-else-if="!ad.advertisement_category">
                    <v-btn
                      class="ma-1"
                      v-for="cat in getAvailableAdCategories"
                      :key="cat._id"
                      rounded
                      :color="cat._id === ad.advertisement_category ? 'success' : ''"
                      small
                      @click="updateAdCategory(ad, cat._id)"
                    >{{cat.CategoryName}}</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- <v-row>
  <v-col xs12 sm12 md6 lg4 xl2 v-for="ad in advertisements" :key="ad.id">

  </v-col>
    </v-row>-->
    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex xs12 sm12 md6 lg4 xl2 v-for="ad in advertisements" :key="ad.id"></v-flex>
      </v-layout>
    </v-container>
    <QuestionDialog
      v-on:dialog-yes="deleteDialogYes"
      v-on:dialog-cancel="deleteDialogCancel"
      v-model="deleteDialogModel"
      title="Send to trash"
      text="Do you want to send to trash?"
    />
    <QuestionDialog
      v-on:dialog-yes="deleteForeverDialogYes"
      v-on:dialog-cancel="deleteForeverDialogCancel"
      v-model="deleteForeverDialogModel"
      title="Delete forever?"
      text="Do you realy want to delete this ad?"
    />

    <SendMessageDialog
      :ad="currentAd"
      :ad-link="adLink"
      :show-dialog="sendMessageDialog"
      v-on:dialog-cancel="sendMessageDialogCancel"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { routeMixins } from "@/mixins/routeMixins";
import { authMixins } from "@/mixins/authMixins";
import { clipboardMixins } from "@/mixins/clipboardMixins";
import QuestionDialog from "@/modules/dialog/QuestionDialog";
import ImagePreviewer from "@/components/organisms/ImagePreviewer";
import SendMessageDialog from "@/components/organisms/SendMessageDialog";

export default {
  data: () => {
    return {
      imageHeight: "auto",
      deleteDialogModel: { showDialog: false, adId: "" },
      deleteForeverDialogModel: { showDialog: false, adId: "" },
      sendMessageDialog: false,
      adLink: "",
      currentAd: {}
    };
  },

  components: {
    QuestionDialog,
    ImagePreviewer,
    SendMessageDialog
  },
  mixins: [routeMixins, clipboardMixins, authMixins],
  props: {
    advertisements: {
      type: Array
    },
    noItemsMessage: {
      type: String,
      default: "There's no Ads in this section"
    },
    showEditButton: Boolean,
    showSendToTrashButton: Boolean,
    showRecoverButton: Boolean,
    showDeleteButton: Boolean,
    showAddNewButtonWhenEmpty: Boolean,
    showCopyLinkToShareButton: {
      type: Boolean,
      default: false
    },
    showSendMessageButton: Boolean,
    currentAdvertiserId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      "getLoggedUserId",
      "getAvailableAdCategories",
      "publicAdsGetter"
    ])
  },
  methods: {
    ...mapActions([
      "loadAdvertisementToEdit",
      "updateAdvertisement",
      "loadAllAdvertisementsByAdvertiser",
      "showMessage",
      "loadAdAvaliableAdCategories",
      "updateAdvertisementCategory"
    ]),
    ...mapMutations(["updatePublicAd", "setShowIsProcessingAlert"]),
    getImageArray(ad) {
      return ad.media_files.map(i => {
        return { url: i.url, id: i.id };
      });
    },
    editAd(ad) {
      this.loadAdvertisementToEdit(ad).then(() => {
        this.goToRoute("new-advertisement");
      });
    },
    deleteDialogYes(param) {
      let payload = {
        Status: "Deleted",
        _id: param
      };
      this.setShowIsProcessingAlert(false);
      this.updateAdvertisement(payload)
        .then(() => {
          this.deleteDialogModel.showDialog = false;
          this.loadAllAdvertisementsByAdvertiser();
          this.setShowIsProcessingAlert(true);
        })
        .catch(() => {
          this.deleteDialogModel.showDialog = false;
          this.setShowIsProcessingAlert(true);
        });
    },
    deleteDialogCancel() {
      this.deleteDialogModel.showDialog = false;
    },
    sendToTrashDialog(ad) {
      this.deleteDialogModel.adId = ad._id;
      this.deleteDialogModel.showDialog = true;
    },
    deleteForeverDialog(ad) {
      this.deleteForeverDialogModel.adId = ad._id;
      this.deleteForeverDialogModel.showDialog = true;
    },
    deleteForeverDialogYes(param) {
      let payload = {
        Status: "DeletedForever",
        _id: param
      };
      this.updateAdvertisement(payload)
        .then(() => {
          this.deleteForeverDialogModel.showDialog = false;
          this.loadAllAdvertisementsByAdvertiser();
        })
        .catch(() => {
          this.deleteForeverDialogModel.showDialog = false;
        });
    },
    deleteForeverDialogCancel() {
      this.deleteForeverDialogModel.showDialog = false;
    },
    recoverAd(ad) {
      let payload = {
        _id: ad._id,
        Status: "Published"
      };
      this.updateAdvertisement(payload).then(() => {
        this.loadAllAdvertisementsByAdvertiser();
      });
    },
    copyLink(id) {
      this.copyTextToClipboard(this.getAdLink(id))
        .then(result => {
          if (result) {
            this.showMessage({ message: "Link copied", success: true });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAdLink(id) {
      return `${window.location.origin}/?ad=${id}`;
    },
    sendMessage(ad) {
      this.currentAd = ad;
      this.adLink = `/?ad=${ad._id}`;

      if (!this.getIsUserLogged()) {
        this.$router.push({ name: "login", query: { redirect: this.adLink } });
      } else {
        this.sendMessageDialog = true;
      }
    },
    sendMessageDialogCancel(result) {
      this.sendMessageDialog = false;
      if (result && result.messageSent) {
        this.currentAd.messageSent = true;
      }
    },
    updateAdCategory(ad, categoryId) {
      let payload = {
        _id: ad._id,
        advertisement_category: categoryId
      };
      this.setShowIsProcessingAlert(false);
      ad.advertisement_category = categoryId;
      this.$set(this.advertisements, this.advertisements.indexOf(ad), ad);
      if (
        this.currentAdvertiserId &&
        this.currentAdvertiserId === ad.advertiser.id
      ) {
        this.updateAdvertisement(payload);
        this.setShowIsProcessingAlert(true);
      } else {
        this.updateAdvertisementCategory(payload);
        this.setShowIsProcessingAlert(true);
      }

      ad.advertisement_category_thanks = true;
      this.$set(this.advertisements, this.advertisements.indexOf(ad), ad);
      setTimeout(() => {
        ad.advertisement_category_thanks = false;
        this.$set(this.advertisements, this.advertisements.indexOf(ad), ad);
      }, 3000);
    }
  },
  mounted() {
    if (!this.getAvailableAdCategories) {
      this.loadAdAvaliableAdCategories();
    }
  }
};
</script>
<style lang="scss">
// .layout.row.wrap {
//   max-width: 320px;
// }

.one-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.one-line-no-ellipsis {
  white-space: nowrap;
}
</style>