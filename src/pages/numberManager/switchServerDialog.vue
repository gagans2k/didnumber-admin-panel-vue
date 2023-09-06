<template>
  <div class="text-center">
    <v-sheet
      class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
      color="blue-grey darken-3"
      width="400"
      dark
    >
      <div class="white--text text--lighten-1 mb-4">
        Are you sure, you want to Switch?
      </div>

      <v-btn
        :disabled="loading"
        class="ma-1"
        text
        color="grey"
        plain
        @click="closeSwitchServerModal"
      >
        No
      </v-btn>

      <v-btn
        :loading="loading"
        class="ma-1"
        color="error"
        text
        @click="switchServer"
      >
        yes
      </v-btn>
    </v-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    switchServer() {
      this.$emit("removeServer");
    },
    closeSwitchServerModal() {
      this.$emit("closeSwitchServer");
    },
  },
};
</script>