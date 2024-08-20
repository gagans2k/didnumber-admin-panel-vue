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
              label="Search by party id"
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

              <template v-slot:[`item.isIdentityVerified`]="{ item }">
                <!-- Button to trigger the dialog -->
                <v-btn
                  :color="getStatusColor(item.isIdentityVerified)"
                  dark
                  class="mr-2"
                  @click="openStatusDialog(item)"
                >
                  {{ getStatusText(item.isIdentityVerified) }}
                </v-btn>

                <!-- Dialog for changing status and adding a message -->
                <v-dialog v-model="statusDialog" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Change Status</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="statusForm" @submit.prevent="saveStatus(item)">
                        <!-- Status Dropdown -->
                        <v-select
                          v-model="selectedStatus"
                          :items="statusOptions"
                          label="Change Status"
                          dense
                          required
                          @change="updateMessageValidation"
                        ></v-select>

                        <!-- Message Textbox (required if status is 'Rejected') -->
                        <v-textarea
                          v-model="statusMessage"
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
                      <v-btn color="green darken-1" text @click="$refs.statusForm.submit()">Save</v-btn>
                      <v-btn color="red darken-1" text @click="closeStatusDialog">Cancel</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <!-- <template v-slot:[`item.isIdentityVerified`]="{ item }">
                <v-select
                  v-model="item.isIdentityVerified"
                  :items="statusOptions"
                  label="Status"
                  dense
                  class="mr-1"
                  @change="approveIdentity(item)"
                ></v-select>
             </template> -->

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
        { text: "Party ID", value: "partyId", sortable: false },
        { text: "Created Date", value: "createdStamp", sortable: false },
        { text: "Identity", value: "documentInfoId", sortable: false },
        { text: "User Login", value: "emailAddress", sortable: false },
        { text: "Action", value: "isIdentityVerified", sortable: false },
        // {
        //   text: "Actions",
        //   value: "viewAction",
        //   sortable: false,
        // },
        { text: "Account Detail's", value: "accountDetails", sortable: false },
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
            statusDialog: false,
      selectedStatus: '',
      statusMessage: '',
      statusOptions: [
        { value: 'R', text: 'Rejected' },
        { value: 'S', text: 'Submitted' },
        { value: 'Y', text: 'Approved' }
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
      let response = await this.getMethod("verifyDocs", {
        partyId: searchCode,
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
        console.log("====error===", error);
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
      this.selectedStatus = item.isIdentityVerified;
      this.statusMessage = ''; // Reset the message field
      this.statusDialog = true;
    },
    closeStatusDialog() {
      this.statusDialog = false;
    },
     updateMessageValidation() {
      this.messageRules = this.selectedStatus === 'R'
        ? [v => !!v || 'Message is required for Rejected status']
        : [];
    },
    saveStatus(item) {
      if (this.selectedStatus === 'R' && !this.statusMessage) {
        this.$refs.statusForm.validate(); // Trigger validation if the status is Rejected
        return;
      }

      // Update the status
      item.isIdentityVerified = this.selectedStatus;

      // Additional logic for saving the status and message can be added here

      this.closeStatusDialog();
    }
  }
};
</script>
<style scoped>
table.v-table tbody td {
  font-size: 10px !important;
}
</style>
