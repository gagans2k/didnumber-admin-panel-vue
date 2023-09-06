<template>
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
    <div>
      <loading :active="isLoading" :loader="loader" />
    </div>

    <!-- SEARCH -->
    <v-card elevation="0">
      <v-container fluid>
        <v-row>
          <v-col lg="3" md="3" sm="12" class="pb-1">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search by order id"
              @keyup.native="searchOnServer(search)"
              hide-details
              outlined
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
        <!-- DATA TABLE-->
        <v-dialog v-model="dialogEdit" max-width="500px">
          <v-card>
            <v-form ref="form" lazy-validation>
              <v-card-title>
                <span class="headline">Action</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-radio-group
                    v-model="column"
                    v-on:change="changeRoute($event)"
                    column
                  >
                    <v-radio label="Approved" value="DOC_APPROVED"></v-radio>
                    <v-radio
                      label="Dispproved"
                      value="DOC_DISAPPROVED"
                    ></v-radio>
                  </v-radio-group>
                  <v-col cols="12" sm="6" class="d-flex" v-if="showField">
                    <v-select
                      :items="items"
                      menu-props="auto"
                      label="Number List"
                      append-icon="format_list_numbered"
                    ></v-select>
                  </v-col>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeEdit()">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="updateEditData(column)"
                >
                  Update
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="itemsReqestArray"
              :options.sync="options"
              :loading="loading"
              :search="search"
              :server-items-length="totalItems"
              :footer-props="{
                'items-per-page-options': [10, 20, 30],
              }"
              :items-per-page="10"
            >
              <!-- INDEX NO -->
              <template v-slot:[`item.indexNo`]="{ item }">
                {{
                  (options.page - 1) * options.itemsPerPage +
                  (itemsReqestArray.indexOf(item) + 1)
                }}
              </template>
              <!-- Order Date -->
              <template v-slot:[`item.createdStamp`]="{ item }">
                <!-- {{ moment(item.orderDate).format("MMMM DD, YYYY") }} -->
                {{ new Date(item.createdStamp).toLocaleDateString() }}
              </template>
              <!-- View Order Detail -->
              <template v-slot:[`item.viewOrderDetail`]="{ item }">
                <router-link
                  :to="{
                    name: 'Order Detail',
                    query: { orderId: item.orderId, partyId: item.partyId },
                  }"
                  style="text-decoration: none !important"
                >
                  <v-btn
                    x-small
                    outlined
                    fab
                    class="mr-2"
                    color="green"
                    size="25"
                    ><v-icon>visibility</v-icon></v-btn
                  >
                </router-link>
              </template>
              <!-- <template v-slot:[`item.viewAction`]="{ item }">
                <router-link
                  :to="{
                    name: 'Doc list',
                    query: {
                      orderId: item.orderId,
                      Item_Id: item.inventoryItemId,
                    },
                  }"
                  style="text-decoration: none !important"
                >
                  <v-btn outlined fab class="mr-2" color="red" x-small
                    ><v-icon>call_to_action</v-icon></v-btn
                  >
                </router-link>
              </template> -->

              <template v-slot:[`item.documentInfoId`]="{ item }">
                <a href="javascript:void(0)" @click="getDocumentData(item)">{{
                  item.documentInfoId
                }}</a>
              </template>

              <template v-slot:[`item.statusId`]="{ item }">
                <v-switch
                  v-model="item.statusId"
                  value="DOC_APPROVED"
                  v-if="item.documentInfoId"
                  inset
                  class="mr-2"
                  @change="approveIdentity(item)"
                ></v-switch>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- view user identity data -->
    <v-dialog v-model="viewUserDocumentList" max-width="90%">
      <uploadDocumentsVue
        :userDocumentInfo="userDocumentInfo"
        @close-user-modal="closeUserModal"
      />
    </v-dialog>
  </v-container>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import moment from "moment";
import uploadDocumentsVue from "../../components/uploadDocuments.vue";

export default {
  components: {
    Loading,
    uploadDocumentsVue,
  },
  props: {},
  mixins: [AllApiCalls],
  data() {
    return {
      dialogEdit: false,
      column: "",
      showField: false,
      isLoading: false,
      //fullPage: false,
      loader: "bars",
      moment: moment,
      rowsPerPageItems: [10, 20, 30],
      itemsReqestArray: [],
      search: "",
      headers: [
        {
          text: "S.No",
          align: "start",
          value: "indexNo",
          sortable: false,
        },
        { text: "order ID", value: "orderId", sortable: false },
        { text: "Created Date", value: "createdStamp", sortable: false },
        { text: "Identity", value: "documentInfoId", sortable: false },
        { text: "Action", value: "statusId", sortable: false },
        // {
        //   text: "Actions",
        //   value: "viewAction",
        //   sortable: false,
        // },
        {
          text: "View Order Detail",
          value: "viewOrderDetail",
          sortable: false,
        },
      ],
      totalItems: 0,
      options: {},
      // didStatus: "",
      didStatusList: [
        { key: "ACTIVATED", value: "DID_ACTIVATED" },
        { key: "INACTIVE", value: "DID_INACTIVE" },
        { key: "PENDING", value: "DID_PENDING" },
        { key: "SUSPENDED", value: "DID_SUSPENDED" },
        { key: "TERMINATED", value: "DID_TERMINATED" },
        { key: "ALL", value: "DID_ALL" },
      ],
      userDocumentInfo: {},
      viewUserDocumentList: false,
    };
  },
  watch: {
    dialogEdit(val) {
      val || this.closeEdit();
    },
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getDocOrderList", {
          // didStatus: this.didStatus,
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        this.itemsReqestArray = response.orderList;
        this.totalItems = response.listSize;
        this.isLoading = false;
      },
      deep: true,
    },
  },

  methods: {
    async searchOnServer(searchCode) {
      this.isLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let response = await this.getMethod("getDocOrderList", {
        orderId: searchCode,
      });
      this.itemsReqestArray = response.orderList;
      this.totalItems = response.listSize;
      this.isLoading = false;
    },

    closeEdit() {
      this.dialogEdit = false;
      this.column = {};
    },
    //  approve identity
    async approveIdentity(aproveIndentity) {
      this.isLoading = true;
      let payloadApproveIdentity = {
        partyId: aproveIndentity.partyId,
        documentInfoId: aproveIndentity.documentInfoId,
        statusId: aproveIndentity.statusId == "DOC_APPROVED" ? true : false,
      };
      try {
        let response = await this.postMethod(
          "approveIdentity",
          payloadApproveIdentity
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("====error===", error);
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
