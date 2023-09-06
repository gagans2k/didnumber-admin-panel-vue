<template>
  <v-card elevation="0">
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
  <!-- <v-card> -->
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
        ></v-text-field>
      </v-col> -->
      <v-spacer></v-spacer>
      <v-col xs="12" sm="2" md="1">
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
          :items="items"
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
            <span>{{ items.indexOf(item) + 1 }}</span>
          </template>
          <!-- EDIT DELETE BUTTONS -->
          <template v-slot:[`item.firstName`]="{ item }">
              {{ item.firstName }} {{ item.lastName }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
                class="ma-2"
                outlined
                color="indigo"
                @click="getLiveCalls(item)"
                >
                LIVE CALL
            </v-btn>
          </template>

          <!-- DIALOG BOX -DELETE ITEM -->
          <template v-slot:top>
            <v-dialog v-model="dialogLiveCall" max-width="500px">
              <v-card>
                <v-card-title class="headline" v-if="totalLiveCalls">
                    Total number of live calls:0
                </v-card-title>
                <v-card-title class="headline" v-if="!totalLiveCalls">
                    {{totalLiveCalls}}
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancelDialog"
                    >Cancel</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
      </v-col>`
    </v-row>
    <!-- </v-card> -->
  </v-container>
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
      totalLiveCalls:'',
      dialogLiveCall:false,
      items: [],
      isLoading: false,
      loader: "bars",
      headers: [
        {
          text: "S.No",
          align: "start",
          value: "indexNo",
          width: "5%",
          sortable: false
        },
        {
          text: "User Name",
          align: "start",
          value: "firstName",
          sortable: false
        },
        { text: "ID", value: "accountId",sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      totalItems: 0,
      loading: false,
      options: {},
    };
  },
   watch: {
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getPartyandPersonList", {
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        if (response.responseMessage ="success") {
            this.isLoading = false;
        }
        this.items = response.accountList;
        this.totalItems = response.listSize;
      },
      deep: true,
    },
    dialogLiveCall(val) {
      val || this.cancelDialog();
    },
  },
  methods: {
    async getLiveCalls(item) {
      this.isLoading = true;
      this.dialogLiveCall = true;
      let response = await this.getMethod("getLiveCalls", {
        accountId: item.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      if (response.responseMessage ="success") {
        this.isLoading = false;
      }
      if (response.liveCallsList.length > 0) {
        this.totalLiveCalls = response.liveCallsList;
      } else {
        this.totalLiveCalls = response.liveCallsList;
      }
    },
    cancelDialog(){
        this.dialogLiveCall = false;
    }
  },
  async created() {},
};
</script>