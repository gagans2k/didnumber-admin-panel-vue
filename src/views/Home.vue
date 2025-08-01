<template>
  <div class="home">
    <dashBoard message="DID PANEL" />
    <loading-overlay :active="isLoading" :loader="loader" />
  </div>
</template>

<script>
import { ref } from 'vue';
import DashBoard from "@/pages/Dashboard/dashboard.vue";

export default {
  name: "Home",
  
  setup() {
    const isLoading = ref(false);
    const loader = ref("bars");

    return {
      isLoading,
      loader
    };
  },
  
  components: {
    DashBoard
  }
};
</script>
