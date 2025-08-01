<template>
  <v-container fluid>
    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      >{{ snackbarMessage }}</v-snackbar
    >
    <!-- LOADER -->
    <!-- <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate class="white--text"></v-progress-circular>
    </div> -->

    <v-row>
      <v-col xs="12" sm="4" md="3">
        <!-- USER PROFILE -->
        <v-card
          color="#f53663"
          height="100"
          dark
          :to="{ name: 'Profile', query: $route.query }"
        >
          <v-card-subtitle class="white--text">User Profile</v-card-subtitle>
          <!-- <v-card-text><span class="font-weight-medium text-h6">{{accountListCount}}</span></v-card-text> -->
        </v-card>
      </v-col>
      <!-- CALL HISTORY -->
      <v-col xs="12" sm="4" md="3">
        <v-card
          color="#3fd4be"
          height="100"
          dark
          :to="{ name: 'Call History', query: $route.query }"
        >
          <v-card-subtitle class="white--text">Call History</v-card-subtitle>
        </v-card>
      </v-col>
      <!-- OUTBOUND/INBOUND LIMITS -->
      <v-col xs="12" sm="4" md="3">
        <v-card
          color="sky green"
          height="100"
          dark
          :to="{ name: 'Customer Devices list', query: $route.query }"
        >
          <v-card-subtitle class="white--text"
            >Customer Devices list</v-card-subtitle
          >
        </v-card>
      </v-col>
      <!-- WALLET BALANCE -->
      <v-col xs="12" sm="4" md="3">
        <v-card
          color="#4f0084"
          height="100"
          dark
          :to="{ name: 'Wallet Balance', query: $route.query }"
        >
          <v-card-subtitle class="white--text">Wallet Balance</v-card-subtitle>
        </v-card>
      </v-col>
      <!-- DID CALL LIMITS -->
      <v-col xs="12" sm="4" md="3">
        <v-card
          class="info"
          height="100"
          dark
          :to="{ name: 'Did Call Limits', query: $route.query }"
        >
          <v-card-subtitle class="white--text">Did Call Limits</v-card-subtitle>
        </v-card>
      </v-col>
      <!-- IP LOCATION-->
      <v-col xs="12" sm="4" md="3">
        <v-card
          class="primary"
          height="100"
          dark
          :to="{ name: 'IP Location', query: $route.query }"
        >
          <v-card-subtitle class="white--text">Ip Location</v-card-subtitle>
        </v-card>
      </v-col>
       <!-- Uploaded Documentation-->
       <v-col xs="12" sm="4" md="3">
        <v-card
          class="purple"
          height="100"
          dark
          :to="{ name: 'Uplaoded Documents', query: $route.query }"
        >
          <v-card-subtitle class="white--text">Uplaoded Documents</v-card-subtitle>
        </v-card>
      </v-col>
       <!-- Inbound SMS Log-->
      <v-col xs="12" sm="4" md="3">
        <v-card
          class="primary"
          height="100"
          dark
          :to="{ name: 'Inbound SMS Log', query: $route.query }"
        >
          <v-card-subtitle class="white--text">Inbound SMS Log</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
  </v-container>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      accountListCount: "",
    };
  },
  methods: {},
  created() {
    // this.getCountAll()
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  },
};
</script>