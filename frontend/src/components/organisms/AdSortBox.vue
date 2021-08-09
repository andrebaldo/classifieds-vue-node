<template>
  <v-layout>
    <v-flex xs12 class="d-inline-flex justify-end align-center">
      <span>Order by</span>
      <AscDescButton
        text="Date"
        v-on:click="setOrderByDate"
        class="ma-2"
        ref="btnOrderByDate"
        :setClickedTimes="1"
      />
      <AscDescButton text="Price" v-on:click="setOrderByPrice" class="ma-2" ref="btnOrderByPrice" />
    </v-flex>
  </v-layout>
</template>

<script>
import AscDescButton from "@/components/atoms/AscDescButton";
export default {
  components: { AscDescButton },
  data: () => {
    return {
      orderByDate: null,
      orderByPrice: null
    };
  },
  methods: {
    setOrderByDate(result) {
      if (result.active) {
          this.orderByDate = result.desc ? "createdAt:DESC" : "createdAt";
      } else {
        this.orderByDate = null;
      }
      this.$emit("setsort", this.orderByDate);
      this.$refs.btnOrderByPrice.resetStatus();
    },
    setOrderByPrice(result) {
      if (result.active) {
        this.orderByPrice = result.desc ? "Price:DESC" : "Price";
      } else {
        this.orderByPrice = null;
      }
      this.$emit("setsort", this.orderByPrice);
      this.$refs.btnOrderByDate.resetStatus();
    }
  }
};
</script>

<style>
</style>