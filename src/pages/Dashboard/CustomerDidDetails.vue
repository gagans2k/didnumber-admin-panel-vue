<template>
   <v-card elevation="1">
   <div> 
     <v-container fluid>
    <!-- LOADER -->
    <!-- <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div> -->
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
    <!-- SEARCH -->
      <!-- <v-col xs="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          outlined
          dense
          hide-details
          v-on:keyup.enter="searchOnServer()"
          @click:append="searchOnServer()"
        ></v-text-field>
      </v-col> -->
      <!-- Button -->
    <v-row>
      <v-spacer></v-spacer>
        <v-col xs="12" sm="2" md="1">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'AccountList',
          }"
          >Back</v-btn
        >
      </v-col>
    </v-row>
    <!-- DATA TABLE-->
    <v-row>
      <v-col xs="12">
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          :footer-props="{
            'items-per-page-options': [10, 20, 30]
          }"
          :loading="loading"
        >
          <template v-slot:[`item.indexNo`]="{ item }">
            <span>{{ (options.page * 10) - (10 - (items.indexOf(item) + 1) ) }}</span>
          </template>
          <template v-slot:[`item.didStatus`]="{ item }">
            <span v-if="item.didStatus == 'DID_PENDING_ALLOCA'">Pending Allocation</span>
            <span v-if="item.didStatus == 'DID_ACTIVATED'">Activated</span>
            <span v-if="item.didStatus == 'DID_INACTIVE'">Inactivated</span>
            <span v-if="item.didStatus == 'DID_SUSPENDED'">Suspended</span>
            <span v-if="item.didStatus == 'DID_EXPIRED'">Expired</span>
            <span v-if="item.didStatus == 'DID_TERMINATED'">Terminated</span>
            <span v-if="item.didStatus == null">-</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  </div>
    </v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      items: [],
      headers: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false
        },
        {
          text: "Country",
          value: "country",
          sortable: false
        },
        { text: "State", value: "state" ,sortable: false},
        { text: "City", value: "city" , sortable: false},
        { text: "DID Number", value: "didNumber" , sortable: false},
        { text: "Billing Tenure", value: "billingTenurePeriod",sortable: false },
        { text: "DID Status", value: "didStatus",sortable: false },
        { text: "Order Id", value: "orderId",sortable: false },
        { text: "Auto Renewal", value: "autoRenew",sortable: false },
      ],
      totalItems: 0,
     // loading: false,
      options: {},
    };
  },

  watch: {
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getDidNumberDetailSubscriptionNew", {
          partyId: this.$route.query.partyId,
        });
        this.items = response.numberList;
        this.totalItems = response.listSize;
        this.isLoading = false;
      },
      deep: true,
    },
  },

  methods: {
    async getCustomerDids() {
      this.isLoading = true;
      let response = await this.getMethod("getDidNumberDetailSubscriptionNew", {
        partyId: this.$route.query.partyId,
      });
      // const { items, total } = await this.getDataFromApi();
      this.items = response.numberList;
      this.totalItems = response.listSize;
      this.isLoading = false;
    },
  },
  created() {
   // this.getCustomerDids()
  },
};
</script>