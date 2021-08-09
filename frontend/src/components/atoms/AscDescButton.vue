<template>
  <div>
    <v-btn
      ref="mybtn"
      rounded
      :color="buttonColor"
      append-icon="mdi-sort-ascending"
      @click="toggleOrder()"
    >
      <v-icon left v-if="active">mdi-check-bold</v-icon>
      {{text}}
      <v-icon right v-if="!descending">mdi-sort-ascending</v-icon>
      <v-icon right v-if="descending">mdi-sort-descending</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "AscDescButton",
  data: () => {
    return {
      descending: true,
      active: false
    };
  },
  props: {
    text: String,
    setClickedTimes: Number
  },
  computed: {
    buttonColor() {
      if (this.active) return "primary";
      else return null;
    }
  },

  methods: {
    toggleOrder() {
      if (!this.active && this.descending) {
        this.active = true;
      } else if (this.active && this.descending) {
        this.descending = !this.descending;
      } else {
        this.active = false;
        this.descending = true;
      }

      this.$emit("click", { desc: this.descending, active: this.active });
    },
    resetStatus() {
      this.active = false;
      this.descending = true;
    }
  },
  mounted() {
    if (this.setClickedTimes) {
      for (let i = 0; i < this.setClickedTimes; i++) {
        this.$refs.mybtn.$el.click();
      }
    }
  }
};
</script>

<style>
</style>