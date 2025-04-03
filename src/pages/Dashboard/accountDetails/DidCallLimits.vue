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
      <v-toolbar elevation="0">
        <v-spacer></v-spacer>
        <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
      </v-toolbar>
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
          <template v-slot:[`item.actions`]="{ item }">
            <!-- edit button -->
            <router-link
              :to="{
                name: 'Outbound Inbound Edit',
                query: {partyId: item.id},
              }"
              style="text-decoration: none !important"
            >
            </router-link>
            <!-- delete button -->
          </template>

          <!-- DIALOG BOX -DELETE ITEM -->
          <template v-slot:top>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      dialogDelete:false,
      search: "",
      copyOfSearch: "",
      items: [],
      headers: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false
        },
        {
          text: "Number",
          value: "didNumber",
          sortable: false
        },
        { text: "Call Limit	", value: "enabled",sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      totalItems: 0,
      options: {},
    };
  },

  watch: {
    dialogDelete(val){
      val || this.closeEdit();
    },
    closeDelete(val){
      val || this.cancelEdit();
    },
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getDidNumberDetailSubscriptionNew", {
        partyId: this.$route.query.partyId,        
        viewIndex: page,
        viewSize: itemsPerPage
      });
      this.items = response.numberList;
      this.totalItems = response.listSize;
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
      },
      deep: true,
    },
  },

  methods: {
    async getDidNumberDetailSubscriptionNew() {
      this.isLoading = true;
      let response = await this.getMethod("getDidNumberDetailSubscriptionNew", {
        partyId: this.$route.query.partyId,        
        viewIndex: page,
        viewSize: itemsPerPage
      });
      this.items = response.numberList;
      this.totalItems = response.listSize;
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
    },

    async getAccountLimit() {
      ///this.isLoading = true;
      let response = await this.getMethod("getAccountLimit", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.items = response.numberList;
      this.totalItems = response.listSize;
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }else if(response.responseMessage == "error"){
        //this.isLoading = false;
      }
      //this.isLoading = false;
    },
    back() {
      this.$router.go(-1);
    },

    deleteItemConfirm(){},
    closeDelete(){},
  },
  
  async created() {
    // await this.getDidNumberDetailSubscriptionNew();
    // await this.getAccountLimit();
    this.getDidNumberDetailSubscriptionNew();
    this.getAccountLimit();
  },
};
</script>