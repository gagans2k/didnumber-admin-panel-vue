<template>
  <v-container fluid>
    <!-- SNACKBAR -->
   <!-- <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      >{{ snackbarMessage }}</v-snackbar
    > -->
    <loading :active="isLoading" :loader="loader" />
    <v-row>
      <v-col xs="12" sm="4" md="3">
        <!-- ACCOUNT LIST -->
        <v-card color="#f53663" height="100" dark :to="{ name: 'AccountList' }">
          <v-card-subtitle>Account List</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-medium text-h6">{{accountListCount}}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- LIVE CALLS -->
      <v-col xs="12" sm="4" md="3">
        <v-card color="#3fd4be" height="100" dark :to="{ name: 'Live List' }">
          <v-card-subtitle>Live Calls</v-card-subtitle>
        </v-card>
      </v-col>
      <!-- Import Location Data -->
      <v-col xs="12" sm="4" md="3">
        <v-card color="sky green" height="100" dark :to="{ name: 'Dashboard import' }">
          <v-card-subtitle>Import Location Data</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-medium text-h6">{{countries}}</span>
          </v-card-text>
       </v-card>
      </v-col>
      <!-- Did Numbers -->
      <v-col xs="12" sm="4" md="3">
        <v-card color="#6495ed" height="100" dark :to="{ name:'Did Numbers' }" >
          <v-card-subtitle>Did Number's</v-card-subtitle>
           <v-card-text>
            <span class="font-weight-medium text-h6">{{numbers}}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Customer Order's List -->
      <v-col xs="12" sm="4" md="3">
        <v-card
          color="#9acd32"
          height="100"
          dark
          :to="{ name: 'Orders' }">
          <v-card-subtitle>Customer Order's List</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-medium text-h6">{{orders}}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Billing Account Transaction's Detail -->
      <v-col xs="12" sm="4" md="3">
        <v-card
         color="#ffa500"
          height="100"
          dark
          :to="{ name: 'Billing Account Transactions' }">
          <v-card-subtitle >Billing A/C Transaction's </v-card-subtitle>
          <v-card-text v-bind="attrs" v-on="on" ><span class="font-weight-medium text-h6">{{ paypalTransactions }} - {{ customerTransactions }}</span></v-card-text>
        </v-card>
      </v-col>
      <v-col xs="12" sm="4" md="3">
        <v-card
          color="#1E90FF"
          height="100"
          dark
          :to="{ name: 'Customer Verify Documentations' }">
          <v-card-subtitle>Customer Verify Documentation's</v-card-subtitle>
         <v-card-text>
            <span class="font-weight-medium text-h6">{{documentInfoCount}}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col xs="12" sm="4" md="3">
        <v-card
          color="#6A5ACD"
          height="100"
          dark
          :to="{ name: 'Customer Login Authentications' }">
          <v-card-subtitle>Customer Login Authentication's</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-medium text-h6">{{partyAuthentications}}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
//import AllApiCalls from "../../services/AllApiCalls";
import dashboardCountAllAPI from "@/services/dashboardAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  //mixins: [AllApiCalls],
   components: {
    Loading,
  },
  data() {
    return {
      accountListCount: "",
      orders: "",
      getDetails:"",
      paypalTransactions: "",
      customerTransactions: "",
      numbers: "",
      isLoading: false,
      showLoader: false,
      loader: "bars",
      customerLoginAuthentication: "",
      partyAuthentications: "",
      countries: "",
      documentInfoCount: ""
    };
  },

  methods: {
    async getCountAll() {
      this.isLoading = true;
      try {
        let response = await dashboardCountAllAPI.getCountAllApi();
        if (response.responseMessage == "success") {
          this.accountListCount = response.allCount.users;
          this.orders = response.allCount.orders;
          this.paypalTransactions = response.allCount.paypalTransactions;
          this.customerTransactions = response.allCount.customerTransactions;
          this.numbers = response.allCount.numbers;
          this.partyAuthentications = response.allCount.partyAuthentications;
          this.documentInfoCount = response.allCount.documentInfoCount;
          this.countries = response.allCount.countries;
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Some internal error has occurred. Please try after sometime.",
          color: "error",
        });
      }
    },
  },

  created() {
    this.getCountAll();
  },
};
</script>
<style scoped>
</style>