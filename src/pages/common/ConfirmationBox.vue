<template>
  <v-card class="pa-2">
    <v-card-title class="pt-4 px-2">
      <span class="title">{{ confirmationMessage }}?</span>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="subtitle-1 error" dark @click="close()">Cancel</v-btn>
      <v-btn class="subtitle-1 primary" dark @click="emitEvent()">Yes</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["confirmationMessage"],
  data() {
    return {};
  },
  methods: {
    emitEvent() {
      this.$emit("confirmed");
    },
    close() {
      this.$emit("closeConfirmation");
    },
  },
};
</script>
