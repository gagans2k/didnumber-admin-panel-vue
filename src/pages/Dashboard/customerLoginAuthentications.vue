<template>
    <v-card>
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
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>


    <!-- <v-container fluid> -->
    <!-- SEARCH -->
    <v-row>
      <v-col xs="12" sm="2" md="1" class="mt-3">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'Dashboard',
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
          :items="transformedItems"
          :options.sync="options"
          :server-items-length="totalItems"
          :footer-props="{
            'items-per-page-options': [10, 20, 30]
          }"
          :loading="loading"
          class="elevation-1"
        >
          <!-- INDEX NO -->
          <template v-slot:[`item.indexNo`]="{ item }">
            <span>{{ (options.page * 10) - (10 - (items.indexOf(item) + 1) ) }}</span>
          </template>

          <!-- fromDate -->
          <template v-slot:[`item.fromDate`]="{ item }">
            {{ item.fromDate ? moment(item.fromDate).format("MMMM DD, YYYY, HH:mm") : '......................' }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  </v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import moment from "moment";

export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      moment: moment,
      items: [],
      headers: [
        { text: "S.No",value: "indexNo",sortable: false},
        { text: "Authentication Id",value: "authenticationId",sortable: false},
        { text: "Login Id", value: "userLoginId",sortable: false},
        { text: "Account Id", value: "partyId",sortable: false},
        { text: "Start Date Time", value: "fromDate", sortable: false},
        { text: "Authentication Type", value: "authenticationTypeLabel",sortable: false},
      ],
      totalItems: 0,
      options: {},
      jobStatus: "",
      serviceStatusList: [
        { key: "Failed", value: "SERVICE_FAILED" },
        { key: "Finished", value: "SERVICE_FINISHED" },
        { key: "Pending", value: "SERVICE_PENDING" },
        { key: "Running", value: "SERVICE_RUNNING" },
        { key: "All", value: "SERVICE_ALL" },
      ],
      userDocumentInfo: {},
      viewUserDocumentList: false,
    };
  },
  computed: {
    transformedItems() {
      const transformed = this.items.map((item) => ({
        ...item,
        authenticationTypeLabel:
          item.authenticationType === "EMAIL_AUTH"
            ? "Email Authentication"
            : item.authenticationType === "GOOGLE_AUTH"
            ? "Google Authentication"
            : "Unknown Authentication",
      }));

      console.log("Transformed Items:", transformed); // Debugging log
      return transformed;
    },
  },

  watch: {
     dialogEdit(val) {
      val || this.closeEdit();
    },
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getPartyAuthentications", {
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        this.items = response.partyAuthentications;
        this.totalItems = response.listSize;
        this.isLoading = false;
      },
      deep: true,
    },
  },

  methods: {
    closeUserModal() {
      this.viewUserDocumentList = false;
    },

  },
};
</script>
<style scoped>
table.v-table tbody td {
  font-size: 10px !important;
}
</style>