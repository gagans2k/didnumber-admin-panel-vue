<template>
  <div class="home">
    <dashBoard message="DID PANEL" />
    <loading-overlay :active="isLoading" :loader="loader" />

  </div>
</template>

<script>
import DashBoard from "@/pages/Dashboard/dashboard.vue";
export default {
  name: "Home",
  data() {
    return {
      isLoading: false,
      //fullPage: false,
      loader: "bars"
    }
  },
  components: {
    DashBoard,
    Loading
  },
  methods: {
  }
};
</script>
