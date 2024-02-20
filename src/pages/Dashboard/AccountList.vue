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

     <!-- SEARCH BY NAME AND EMAIL -->
     <v-row>
      <!-- NAME-->
      <v-col xs="12" sm="5" md="3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search by name"
          outlined
          dense
          hide-details
          v-on:keyup.enter="getDataFromApi(search)"
          @click:append="getDataFromApi(search)"
        ></v-text-field>
      </v-col>
      <!-- EMAIL -->
      <v-col xs="12" sm="5" md="3">
        <v-text-field
          v-model="email"
          append-icon="mdi-magnify"
          label="Email by gmail"
          outlined
          dense
          hide-details
          v-on:keyup.enter="getDataFromApi()"
          @click:append="getDataFromApi()"
        ></v-text-field>
      </v-col>
      <!-- Buttton -->
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
          class="elevation-1"
        >
           <template v-slot:[`item.indexNo`]="{ item }">
            {{
              (options.page - 1) * options.itemsPerPage +
              (items.indexOf(item) + 1)
            }}
          </template>
          <!-- STATUS -->
          <template v-slot:[`item.status`]="{ item }">
            <span v-if="item.enabled == 'Y'">Enabled</span>
            <span v-else>Disabled</span>
          </template>
          <!-- SWITCH enable disable status -->
          <template v-slot:[`item.enabled`]="{ item }">
            <v-switch
              v-if="item.enabled == 'Y'"
              :input-value="true"
              color="primary"
              @click="enableDisable('disabled', item)"
              :readonly="true"
            ></v-switch>
            <v-switch
              v-else
              :input-value="false"
              @click="enableDisable('enabled', item)"
              :readonly="true"
            ></v-switch>
          </template>
          <!-- TO CustomerDidDetails -->
          <template v-slot:[`item.viewNumber`]="{ item }">
            <!-- edit button -->
            <router-link
              :to="{
                name: 'Customer DID Details',
                query: {partyId: item.partyId},
              }"
             
            >
           <v-btn class="mr-1" color="green" outlined small fab >
           <v-icon>list</v-icon>
           </v-btn>
            </router-link>
            <!-- delete button -->
          </template>
          <!-- TO CustomerOrderList -->
          <template v-slot:[`item.viewOrders`]="{ item }">
            <router-link
              :to="{
                name: 'Customer Order List',
                query: { createdBy: item.emailAddress },
              }"
              
            >
              <v-btn class="mr-1" color="red"  outlined small fab>
              <v-icon> description</v-icon>
              </v-btn>
            </router-link>
          </template>
          <!-- TO AccountDetails -->
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
          <!-- SWITCH enable disable status -->
          <template v-slot:[`item.isVerified`]="{ item }">
            <v-switch
              v-if="item.isVerified == 'Y'"
              :input-value="true"
              color="primary"
              @click="verifiedAccountForPayment('disabled', item)"
              :readonly="true"
            ></v-switch>
            <v-switch
              v-else
              :input-value="false"
              @click="verifiedAccountForPayment('enabled', item)"
              :readonly="true"
            ></v-switch>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
  </v-container>
</v-card>
</template>
<script>
import AllApiCalls from "../../services/AllApiCalls";
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
      search: "",
      copyOfSearch: "",
      email: "",
      copyOfEmail: "",
      items: [],
      headers: [
        {
          text: "S.No",
          align: "start",
          value: "indexNo",
          sortable: false 
        },
        {
          text: "First Name",
          align: "start",
          value: "firstName",
          sortable: false 
        },
        { text: "Last Name", value: "lastName", width: "10%", sortable: false  },
        { text: "Email", value: "emailAddress", width: "10%", sortable: false  },
        { text: "status", value: "status", sortable: false  },
        { text: "Action", value: "enabled", sortable: false  },
        { text: "Number's", value: "viewNumber", sortable: false },
        { text: "Order's", value: "viewOrders", sortable: false },
        { text: "Current Amount", value: "currentAmount", width: "10%", sortable: false  },
        { text: "Account Detail's", value: "accountDetails", sortable: false },
        { text: "Verified", value: "isVerified", sortable: false }

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
        let response = await this.getMethod("getPartyandPersonList", {
          viewIndex: page,
          viewSize: itemsPerPage,
          customerName: this.search,
          emailAddress: this.email,
        });
        this.items = response.accountList;
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
    async email(val) {
      if (this.email.length > 0) {
        this.copyOfEmail = this.email;
      }
      if (this.email.length == 0) {
        if (this.copyOfEmail.length > 0) {
          // const { items, total } = await this.getDataFromApi();
          // this.items = items;
          // this.totalItems = total;
         // this.getDataFromApi();
          this.copyOfEmail = null;
        }
      }
    },
  },
  // async mounted() {
  //   const { items, total } = await this.getDataFromApi();
  //   this.items = items;
  //   this.totalItems = total;
  // },
  methods: {
    async getDataFromApi() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc} = this.options;
        let response = await this.getMethod("getPartyandPersonList", {
          customerName: this.search,
          emailAddress: this.email,
          // viewIndex: page,
          // viewSize: itemsPerPage,
        });
        this.items = response.accountList;
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
    },

    async enableDisable(message, item) {
      if (message == "disabled") {
       this.isLoading = true;
       let response = await this.postMethod("disableUser", {
          emailAddress: item.emailAddress,
          accountId: item.accountId,
        });
        if (response.responseMessage == "success") {
          await this.getDataFromApi();
          this.isLoading = false;
        }
      }
      else if (message == "enabled") {
        this.isLoading = true;
         let response = await this.postMethod("enableUser", {
          emailAddress: item.emailAddress,
          accountId: item.accountId,
        });
         if (response.responseMessage == "success") {
          await this.getDataFromApi();
          this.isLoading = false;
        }
      }
    },

    async verifiedAccountForPayment(message, item) {
      if (message == "disabled") {
       this.isLoading = true;
       let response = await this.postMethod("verifiedAccountForPayment", {
          isVerified: 'N',
          partyId: item.partyId,
        });
        if (response.responseMessage == "success") {
          await this.getDataFromApi();
          this.isLoading = false;
        }
      }
      else if (message == "enabled") {
        this.isLoading = true;
         let response = await this.postMethod("verifiedAccountForPayment", {
          isVerified: 'Y',
          partyId: item.partyId,
        });
         if (response.responseMessage == "success") {
          await this.getDataFromApi();
          this.isLoading = false;
        }
      }
    },

    // async getDataFromServer(sortBy, sortDesc, page, itemsPerPage) {
    //   let response = await this.getMethod("getPartyandPersonList", {
    //     viewIndex: page,
    //     viewSize: itemsPerPage,
    //     customerName: this.search,
    //     emailAddress: this.email,
    //   });
    //           setTimeout(() => {


    //     }, 3000);
    //   this.items = response.data.accountList;
    //   this.totalItems = response.data.listSize;
    // },
  },
};
</script>
<style scoped>


</style>
