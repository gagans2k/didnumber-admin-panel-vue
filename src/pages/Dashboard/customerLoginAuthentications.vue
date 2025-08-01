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
      <!-- Party Id-->
       <v-col xs="12" sm="5" md="3">
        <v-text-field
          v-model="partyId"
          append-icon="mdi-magnify"
          label="Search by Account Id"
          outlined
          dense
          hide-details
          v-on:keyup.enter="getDataFromApi(search)"
          @click:append="getDataFromApi(search)"
        ></v-text-field>
      </v-col>
      <v-col xs="12" sm="6" md="4">
        <v-autocomplete 
          v-model="authenticationTypes"
          :items="authenticationTypeList"
          label="Search By Authentication Type"
          item-text="key"
          item-value="value"
          outlined
          dense
          @change="searchOnServer(authenticationTypes)"
        ></v-autocomplete>
      </v-col>
       <!-- Buttton -->
      <v-spacer></v-spacer>
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
            {{ item.indexNo }}
          </template>

          <!-- SWITCH enable disable status -->
          <template v-slot:[`item.enabledTwoFactor`]="{ item }">
            <v-switch
              v-if="item.enabledTwoFactor == 'Y'"
              :input-value="true"
              color="primary"
              @click="enableDisable('disabled', item)"
              :readonly="true"
            ></v-switch>
          </template>

          <template v-slot:[`item.accountDetails`]="{ item }">
              <!-- {{item}} -->
              <router-link
                :to="{
                  name: 'AccountDetails',
                  query: {
                    accountId: item.accountId,
                    userId: item.userId,
                    partyId: item.partyId,
                  },
                }"
                
              >
                <v-btn 
                class="mr-1"
                color="info" 
                outlined 
                small 
                fab
                >
                <v-icon>subject</v-icon>
                </v-btn>
              </router-link>
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
import "@/assets/vue-loading.css";
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
      search: "",
      copyOfSearch: "",
      headers: [
        {text: "S.No", align: "start", value: "indexNo", sortable: false},  
        { text: "Authentication Id",value: "authenticationId",sortable: false},
        { text: "Account Id", value: "partyId",sortable: false},
        { text: "User Login Id", value: "userLoginId",sortable: false},
        { text: "Action", value: "enabledTwoFactor", sortable: false  },
        { text: "Start Date Time", value: "fromDate", sortable: false},
        { text: "Authentication Type", value: "authenticationTypeLabel",sortable: false},
        { text: "Account Detail's", value: "accountDetails", sortable: false }
      ],
      totalItems: 0,
      options: {},
      authenticationTypes: "",
      authenticationTypeList: [
        { key: "Google Authentication", value: "GOOGLE_AUTH" },
        { key: "Email Authentication", value: "EMAIL_AUTH" },
        { key: "ALL", value: "AUTH_ALL" },
      ],
      userDocumentInfo: {},
      viewUserDocumentList: false,
      partyId: "",
      copyOfPartyId: ""
    };
  },
  computed: {
    transformedItems() {
      return this.items.map((item, index) => ({
        ...item,
        indexNo: index + 1, // Assign index during transformation
        authenticationTypeLabel:
          item.authenticationType === "EMAIL_AUTH"
            ? "Email Authentication"
            : item.authenticationType === "GOOGLE_AUTH"
            ? "Google Authentication"
            : "Unknown Authentication",
      }));
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
    async search(val) {
      if (val.length > 0) {
        this.copyOfSearch = val;
      }
      if (this.search.length == 0) {
        if (this.copyOfSearch.length > 0) {
          // const { items, total } = await this.getDataFromApi();
          // this.items = items;
          // this.totalItems = total;
         // this.getDataFromApi();
          this.copyOfSearch = null;
        }
      }
    },

    async partyId(val) {
      if (this.partyId.length > 0) {
        this.copyOfPartyId = this.partyId;
      }
      if (this.partyId.length == 0) {
        if (this.copyOfPartyId.length > 0) {
          this.copyOfPartyId = null;
        }
      }
    }
  },

  methods: {
    closeUserModal() {
      this.viewUserDocumentList = false;
    },

    async searchOnServer(statusidGet) {
      this.isLoading = true;
      this.getstatusidbySelect = statusidGet;
      this.options.page = 1;
      this.getDataFromApi();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },

    async enableDisable(message, item) {
      this.isLoading = true;
      try {
        let response = await this.postMethod("disabledAuthenticationByAdmin", {
          username: item.userLoginId,
          authenticationId: item.authenticationId,
        });
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: response.messageDetail || "Two Factor Authentication APP Disabled.",
            color: "success",
          });
          await this.getDataFromApi();
          this.isLoading = false;
        }
      } catch (error) {
        // Safely retrieve the error message from the API response
        let errorMessage = "You cannot disable this authentication because at least one authentication method is required for security purposes.";
        this.$root.$emit("SHOW_SNACKBAR", {
          text: errorMessage,
          color: "error",
        });
        this.isLoading = false;
      }
    },

    async getDataFromApi() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc} = this.options;
        let response = await this.getMethod("getPartyAuthentications", {
          partyId: this.partyId,
          authenticationType: this.getstatusidbySelect
        });
        this.items = response.partyAuthentications;
        this.totalItems = response.listSize;
        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]];
            const sortB = b[sortBy[0]];

            if (sortDesc[0]) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }

        // if (itemsPerPage > 0) {
        //   var items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        // }
        setTimeout(() => {
          resolve({
            // items,
            //total,
          });
        }, 0);
      });
    }

  },
};
</script>
<style scoped>
table.v-table tbody td {
  font-size: 10px !important;
}
</style>