<template>
  <v-card elevation="1">
    <v-container fluid>
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
        <v-toolbar elevation="0">
          <v-spacer></v-spacer>
          <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
        </v-toolbar>      </v-row>
      <!-- DATA TABLE-->
      <v-row>
        <v-col xs="12">
          <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
            }"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:[`item.loginDate`]="{ item }">{{
              moment(item.loginDate).format("DD MMMM YYYY")
            }}</template>
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
import "vue-loading-overlay/dist/vue-loading.css";
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
      items: [],
      headers: [
        {
          text: "Client Ip Address",
          value: "clientIpAddress",
          sortable: false,
        },
        {
          text: "Client Ip Country GeoId",
          value: "clientIpCountryGeoId",
          sortable: false,
        },
        { text: "Country Name", value: "countryName", sortable: false },
        { text: "login Date", value: "loginDate", sortable: false },
      ],
      totalItems: 0,
      options: {},
      userDetail: {},
    };
  },
  watch: {
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getUserIPsLocation", {
          createdBy: this.$route.query.createdBy,
          viewIndex: page,
          viewSize: itemsPerPage,
          partyId: this.$route.query.partyId,
        });
        this.isLoading = false;
        this.items = response.ipsLocationList;
        this.totalItems = response.listSize;
      },
      deep: true,
    },
  },
  mounted() {
    // this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
};
</script>