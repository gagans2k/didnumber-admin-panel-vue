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
            <v-autocomplete 
              v-model="statusId"
              :items="statusIds"
              label="Search By Status"
              item-text="key"
              item-value="value"
              outlined
              dense
              @change="searchOnServer(statusId)"
            ></v-autocomplete>
          </v-col> 
        </v-row>
        <!-- DATA TABLE-->
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
            
              <template v-slot:[`item.documentInfoId`]="{ item }">
                <a href="javascript:void(0)" @click="getDocumentData(item)">{{
                  item.documentInfoId
                }}</a>
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


              <template v-slot:[`item.orderDetails`]="{ item }">
                <!-- {{item}} -->
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

              <template v-slot:[`item.isIdentityVerified`]="{ item }">
                <!-- Button to trigger the dialog -->
                <v-btn
                  :color="getStatusColor(item.isIdentityVerified)"
                  dark
                  class="mr-2"
                  @click="['Y', 'A', 'R'].includes(item.isIdentityVerified) ? null : openStatusDialog(item)"
                >
                  {{ getStatusText(item.isIdentityVerified) }}
                </v-btn>

                <!-- Dialog for changing status and adding a message -->
                <v-dialog v-model="statusDialog" max-width="500px" :key="statusDialog">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Change Status</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="statusForm" lazy-validation>
                        <!-- Status Dropdown -->
                      <v-select
                        v-model="selectedStatus"
                        :items="[
                          { value: 'Y', text: 'Approved' },
                          { value: 'R', text: 'Rejected' }
                        ]"
                        label="Change Status"
                        dense
                        required
                        @change="updateMessageValidation"
                      />

                        <!-- Message Textbox (required if status is 'Rejected') -->
                        <v-textarea
                          v-model="smsText"
                          label="Message"
                          rows="3"
                          outlined
                          :rules="messageRules"
                          :required="selectedStatus === 'R'"
                        ></v-textarea>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="saveStatus(selectedItem)"
                        :disabled="!selectedStatus">
                        Update
                      </v-btn>                      
                      <v-btn color="red darken-1" text @click="closeStatusDialog">Cancel</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
      isIdentityVerified:"",
      smsText:"",
      selectedItem: null, // This should be defined here
      headers: [
        { text: "S.No", align: "start", value: "indexNo", sortable: false },
        { text: "Party ID", value: "partyId", sortable: false },
        { text: "Created Date", value: "createdStamp", sortable: false },
        { text: "Identity", value: "documentInfoId", sortable: false },
        { text: "User Login", value: "emailAddress", sortable: false },
        { text: "Action", value: "isIdentityVerified", sortable: false },
        { text: "Account Detail's", value: "accountDetails", sortable: false },
        { text: "Order Detail's", value: "orderDetails", sortable: false },
      ],
      totalItems: 0,
      options: {},
      statusId: "",
      statusIds: [
        { value: "S", key: "Submitted"},
        { value: "Y", key: "Approved" },
        { value: "R", key: "Rejected" },
        { key: "ALL", value: "VERIFY_ALL" },
      ],
      statusDialog: false,
      selectedStatus: '',
      statusMessage: '',
      statusOptions: [
        { value: 'Y', text: 'Approved' },
        { value: 'R', text: 'Rejected' }
      ],
      messageRules: [
        v => !!v || 'Message is required for Rejected status'
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
        console.log("Options changed:", this.options);
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getVerifyDocs", {
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        this.itemsReqestArray = response.verifyDocs;
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
      let response = await this.getMethod("getVerifyDocs", {
        isIdentityVerified: searchCode,
      });
      this.itemsReqestArray = response.verifyDocs;
      this.totalItems = response.listSize;
      this.isLoading = false;
    },

    closeEdit() {
      this.dialogEdit = false;
      this.column = {};
    },
    //  approve identity
    async saveStatus(selectedItem) {
      console.log("item: ",selectedItem);
      if (this.selectedStatus === "R" && !this.smsText) {
        this.$refs.statusForm.validate(); // Trigger validation if status is Rejected
        return;
      }

      // Prepare payload and call API
      const payloadApproveIdentity = {
        partyId: this.selectedItem.partyId,
        documentInfoId: selectedItem.documentInfoId,
        isIdentityVerified: this.selectedStatus,
        smsText: this.smsText,
      };

      try {
        this.isLoading = true;
        await this.postMethod("updateVerifyIdentity", payloadApproveIdentity);
        this.seeSnackbar("Status Updated Successfully", "success");
        this.statusDialog = false;
        this.isLoading = false;
        this.searchOnServer(this.search); // Refresh the table data
      } catch (error) {
        this.seeSnackbar("Server Error", "error");
        this.isLoading = false;
        console.error("Error updating status:", error);
      }
    },

    //  get Document Info
    async getDocumentData(getIdentity) {
      this.isLoading = true;
      let payloadApproveIdentity = {
        partyId: getIdentity.partyId,
        documentInfoId: getIdentity.documentInfoId,
        documentType: 'VERIFICATION',

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
      }
    },
    closeUserModal() {
      this.viewUserDocumentList = false;
    },
    getStatusText(status) {
      switch (status) {
        case 'R':
          return 'Rejected';
        case 'S':
          return 'Submitted';
        case 'A':
        case 'Y':
          return 'Approved';
        default:
          return 'Unknown Status';
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 'R':
          return 'red';
        case 'S':
          return 'blue';
        case 'A':
        case 'Y':
          return 'green';
        default:
          return 'grey';
      }
    },
    openStatusDialog(item) {
      console.log('Opening dialog with item:', item);
      this.selectedStatus = item.isIdentityVerified;
      this.smsText = ''; // Reset the message field
      this.statusDialog = true;
      this.selectedItem = item; // Bind the item to a local variable
      this.$nextTick(() => {
      this.$refs.statusForm.reset(); // Ensure the form is reset
      });
    },
    closeStatusDialog() {
      this.statusDialog = false;
      this.$nextTick(() => {
        if (this.$refs.statusForm) {
          this.$refs.statusForm.reset(); // Ensure form is reset
        } else {
          console.warn("Form reference is not available.");
        }
      });

    },
     updateMessageValidation() {
      this.messageRules = this.selectedStatus === 'R'
        ? [v => !!v || 'Message is required for Rejected status']
        : [];
    },
  }
};
</script>
<style scoped>
table.v-table tbody td {
  font-size: 10px !important;
}
</style>
