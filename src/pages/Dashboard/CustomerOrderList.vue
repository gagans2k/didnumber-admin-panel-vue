<template>
 <v-card elevation="1">
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
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div> -->
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
    <!-- SEARCH -->
    <v-row>
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
      <v-spacer></v-spacer>
       <v-col xs="12" sm="1" md="1">
        <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
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
          class="elevation-1"
        >
          <template v-slot:[`item.orderDate`]="{ item }">{{
            moment(item.orderDate).format("MMMM DD, YYYY")
          }}</template>
          <!-- View Order Detail -->
          <template v-slot:[`item.viewDetails`]="{ item }">
            <router-link
              :to="{
                name: 'Order Detail',
                query: { orderId: item.orderId,partyId: item.partyId},
              }"
              style="text-decoration: none !important"
            >
              <v-btn outlined fab small color="info" size="25"><v-icon >visibility</v-icon></v-btn>
            </router-link>
          </template>
           <template v-slot:[`item.statusId`]="{ item }">
            <span v-if="item.statusId == 'ORDER_APPROVED'">Approved</span>
            <span v-if="item.statusId == 'ORDER_CREATED'">Created</span>
            <span v-if="item.statusId == 'ORDER_CANCELLED'">Cancel</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      moment: moment,
      search: "",
      isLoading: false,
      loader: "bars",
      copyOfSearch: "",
      email: "",
      copyOfEmail: "",
      items: [],
      headers: [
        { text: "Email", value: "emailAddress",sortable: false},
        { text: "Identity Verified", value: "isIdentityVerified",width: "5%",sortable: false},
        { text: "Order Type",value: "orderType",sortable: false},
        { text: "Status", value: "statusId",sortable: false },
        { text: "Order Id", value: "orderId",sortable: false },
        { text: "created Date", value: "orderDate",sortable: false },
        { text: "Grand Total", value: "grandTotal",sortable: false },
        { text: "Identity", value: "documentInfoId",sortable: false},
        { text: "Detail",value: "viewDetails",width:"5%" ,sortable: false}
      ],
      totalItems: 0,
      options: {},
      switchValue: "",
    };
  },
  watch: {
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getOrderList", {
          createdBy: this.$route.query.createdBy,
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        this.isLoading = false;
        this.items = response.orderList;
        this.totalItems = response.listSize;
      },
      deep: true,
    },
  },
  
  methods: {
    async getOrderList() {
      this.isLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let response = await this.getMethod("getOrderList", {
        createdBy: this.$route.query.createdBy,
        viewIndex: page,
        viewSize: itemsPerPage,
      });
      this.items = response.orderList;
      this.totalItems = response.listSize;
      this.isLoading = false;
    },
    back() {
      this.$router.go(-1);
    }
  },
};
</script>