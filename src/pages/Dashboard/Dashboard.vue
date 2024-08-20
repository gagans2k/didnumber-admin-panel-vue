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
    <!-- LOADER -->
    <!-- <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div> -->

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
        </v-card>
      </v-col>
      <!-- Did Numbers -->
      <v-col xs="12" sm="4" md="3">
        <v-card color="#6495ed" height="100" dark :to="{ name:'Did Numbers' }" >
          <v-card-subtitle>Did Number's</v-card-subtitle>
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
          :to="{ name: 'Billing Account Transactions' }"
        >
          <v-card-subtitle
            >Billing A/C Transaction's </v-card-subtitle
          >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-card-text v-bind="attrs" v-on="on"
                ><span class="font-weight-medium text-h6"
                  >{{ paypalTransactions }} - {{ customerTransactions }}</span
                ></v-card-text
              >
            </template>
            <div>Paypal Transactions - {{ paypalTransactions }}</div>
            <div>Customer Transactions - {{ customerTransactions }}</div>
          </v-tooltip>
        </v-card>
      </v-col>
       <v-col xs="12" sm="4" md="3">
        <v-card
          color="#6495ed"
          height="100"
          dark
          :to="{ name: 'Customer Verify Documentations' }">
          <v-card-subtitle>Customer Verify Documentation's</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-medium text-h6">{{customerVerifyDocumentations}}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
//import AllApiCalls from "../../services/AllApiCalls";
import dashboardCountAllAPI from "@/services/dashboardAPI.js";
export default {
  //mixins: [AllApiCalls],
  data() {
    return {
      accountListCount: "",
      orders: "",
      getDetails:"",
      paypalTransactions: "",
      customerTransactions: "",
      customerVerifyDocumentations: "",
    };
  },

  methods: {
    async getCountAll() {
      try {
        let response = await dashboardCountAllAPI.getCountAllApi();
        this.accountListCount = response.allCount.users;
        this.orders = response.allCount.orders;
        this.paypalTransactions = response.allCount.paypalTransactions;
        this.customerTransactions = response.allCount.customerTransactions;
      } catch (error) {}
    },
  },

  created() {
    this.getCountAll();
  },
};
</script>
<style scoped>
</style>