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
      <v-col xs="12" sm="6" md="1">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'AccountDetails',
            query: $route.query,
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
          :loading="loading"
          :footer-props="{
          'items-per-page-options': [10, 20, 30]
        }"
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
                query: {accountId: $route.query.accountId,deviceId: item.id},
              }"
              style="text-decoration: none !important"
            >
              <v-icon small class="mr-2">
                mdi-pencil
              </v-icon>
            </router-link>
            <!-- delete button -->
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
      dialog: false,
      dialogDelete: false,
      deviceList:[],
      editedIndex: -1,
      search: "",
      copyOfSearch: "",
      items: [],
      headers: [
        {
          text: "S.No",
          align: "start",
          sortable: false,
          value: "indexNo",
          width: "5%",
        },
        {
          text: "Device Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Status", value: "enabled",sortable: false },
        { text: "Type", value: "device_type",sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedItem: {
        device_type: "",
        enabled: "",
        flags: [],
        id: "",
        mac_address: "",
        name: "",
        username: "",
      },
      defaultItem: {
        device_type: "",
        enabled: "",
        flags: [],
        id: "",
        mac_address: "",
        name: "",
        username: "",
      },
      totalItems: 0,
      options: {},
      switchValue: "",
    };
  },
  watch: {
    options: {
      async handler() {
        //this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        // let response = await this.getMethod("getPartyandPersonList", {
        //   customerName: this.search,
        //   emailAddress: this.email,
        //   viewIndex: page,
        //   viewSize: itemsPerPage,
        // });
        // this.items = response.data.accountList;
        // this.totalItems = response.data.listSize;
        //this.isLoading = false;
      },
      deep: true,
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    async search(val) {
      if (this.search.length > 0) {
        this.copyOfSearch = this.search;
      }
      if (this.search.length == 0) {
        if (this.copyOfSearch.length > 0) {
          // const { items, total } = await this.getDataFromApi();
          // this.items = items;
          // this.totalItems = total;
          this.getDeviceList();
          this.copyOfSearch = null;
        }
      }
    },
  },
  methods: {
    async getDeviceList() {
      this.isLoading = true;
      let response = await this.getMethod("getDeviceList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      if (response.responseMessage == "success") {
        this.isLoading = false;
        this.items = response.deviceList;
      }
      //this.totalItems = this.deviceList;// the pagination length array is not defind into the api 
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      /* deviceId used here is of the particular item in the list and 
      not the one in query */
      this.isLoading = true;
      let response = await this.postMethod("deleteDeviceDetails", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        deviceId: this.editedItem.id,
      });
      if (response.responseMessage == "success") {
        this.isLoading = false;
        await this.getDeviceList();
        this.seeSnackbar("Deleted Successfully","success")
        this.closeDelete();
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
  async created() {
    await this.getDeviceList();
  },
};
</script>