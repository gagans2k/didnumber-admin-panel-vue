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
    <!-- <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div> -->
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>


    <!-- <v-container fluid> -->
    <!-- SEARCH -->
    <v-row>
      <v-col xs="12" sm="6" md="4">
        <v-autocomplete 
          v-model="didStatus"
          :items="didStatusList"
          label="Search By DID Number Status"
          item-text="key"
          item-value="value"
          outlined
          dense
          @change="searchOnServer(didStatus)"
        ></v-autocomplete>
      </v-col>
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
            <span>{{ (options.page * 10) - (10 - (items.indexOf(item) + 1) ) }}</span>
          </template>
          <!-- Order Date -->
          <template v-slot:[`item.orderDate`]="{ item }">
            {{ moment(item.orderDate).format("MMMM DD, YYYY") }}
          </template>

          <template v-slot:[`item.statusId`]="{ item }">
            <span v-if="item.statusId == 'ORDER_APPROVED'">Approved</span>
            <span v-if="item.statusId == 'ORDER_CREATED'">Created</span>
            <span v-if="item.statusId == 'ORDER_CANCELLED'">Cancel</span>
          </template>
          <template v-slot:[`item.orderType`]="{ item }">
            <span v-if="item.orderType == 'DID Purchase'">Purchase</span>
          </template>

          <template v-slot:[`item.documentInfoId`]="{ item }">
                <a href="javascript:void(0)" @click="getDocumentData(item)">{{
                  item.documentInfoId
                }}</a>
              </template>

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
        </v-data-table>
      </v-col>
    </v-row>

    <!-- view user identity data -->
    <v-dialog v-model="viewUserDocumentList" max-width="90%">
      <uploadDocumentsVue
        :userDocumentInfo="userDocumentInfo"
        @close-user-modal="closeUserModal"
      />
    </v-dialog>
  </v-container>
  </v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
import moment from "moment";
import uploadDocumentsVue from "../../components/uploadDocuments.vue";

export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
    uploadDocumentsVue,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      moment: moment,
      items: [],
      headers: [
        { text: "S.No",value: "indexNo",sortable: false},
        { text: "Party ID",value: "partyId",sortable: false},
        { text: "Identity Verified", value: "isIdentityVerified",width: "5%",sortable: false},
        { text: "Email", value: "emailAddress",sortable: false},
        { text: "Order Type", value: "orderType", width: "8%",sortable: false},
        { text: "Status", value: "statusId",sortable: false},
        { text: "Order ID", value: "orderId",sortable: false},
        { text: "Created", value: "orderDate" , width: "10%",sortable: false},
        { text: "Cost", value: "grandTotal",sortable: false},
        { text: "Identity", value: "documentInfoId",sortable: false},
        { text: "Detail",value: "viewDetails",width:"5%" ,sortable: false},
      ],
      totalItems: 0,
      //loading: false,
      options: {},
      didStatus: "",
      didStatusList: [
        { key: "ACTIVATED", value: "DID_ACTIVATED" },
        { key: "INACTIVE", value: "DID_INACTIVE" },
        { key: "PENDING", value: "DID_PENDING_ALLOCA" },
        { key: "SUSPENDED", value: "DID_SUSPENDED" },
        { key: "TERMINATED", value: "DID_TERMINATED" },
        { key: "ALL", value: "DID_ALL" },
      ],
      userDocumentInfo: {},
      viewUserDocumentList: false,
    };
  },

  // mounted(){
  //   this.getMethod();
  // },

  watch: {
     dialogEdit(val) {
      val || this.closeEdit();
    },
    options: {
      async handler() {
        this.isLoading = true;
        //this.loader = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getOrderList", {
          viewIndex: page,
          viewSize: itemsPerPage,
          didStatus: this.didStatus,
        });
        this.items = response.orderList;
        this.totalItems = response.listSize;
        this.isLoading = false;
       // this.searchOnServer();
      },
      deep: true,
    },
  },

  methods: {
    async searchOnServer(didStatus) {
      if (didStatus == 'DID_ALL') {
          return new Promise(async (resolve, reject) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;
          let response = await this.getMethod("getOrderList", {
            viewIndex: page,
            viewSize: itemsPerPage,
          });
          this.items = response.orderList;
          this.totalItems = response.listSize;
          setTimeout(() => {
            this.isLoading = false;
            resolve({
              // items,
              //total,
            });
          }, 0);
        });
      }else{
        this.isLoading = true;
        return new Promise(async (resolve, reject) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;
          let response = await this.getMethod("getOrderList", {
            didStatus: didStatus,
            viewIndex: page,
            viewSize: itemsPerPage,
          });
          this.items = response.orderList;
          this.totalItems = response.listSize;
          setTimeout(() => {
            this.isLoading = false;
            resolve({
              // items,
              //total,
            });
          }, 0);
        });
      }
      
    },
        //  get Document Info
    async getDocumentData(getIdentity) {
      this.isLoading = true;
      let payloadApproveIdentity = {
        partyId: getIdentity.partyId,
        documentInfoId: getIdentity.documentInfoId,
      };
      try {
        let response = await this.getMethod(
          "getDocumentInfoForAdmin",
          payloadApproveIdentity
        );
        
        let username = {
          name: response.name,
        };

        this.userDocumentInfo = {
          ...response.documentInfoResult,
          ...username,
          ...response.outList[0],
        };
        this.viewUserDocumentList = true;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("====error===", error);
      }
    },
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