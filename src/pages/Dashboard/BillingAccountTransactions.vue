<template>
  <v-container fluid fill-height>
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
    <!--DIALOG CONFIRMATION BOX -->
    <v-dialog v-model="confirmationDialogBox" max-width="400px">
      <ConfirmationBox
        @confirmed="
          () => {
            confirmationDialogBox = false;
            approveDisapproveApi();
          }
        "
        @closeConfirmation="confirmationDialogBox = false"
        :confirmationMessage="confirmationMessage"
      />
    </v-dialog>

    <!-- DIALOG BOX CUSTOMER DETAILS -->
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Customer Details</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <!-- CUSTOMER NAME -->
          <v-row>
            <v-col cols="4">
              <span class="subtitle-1 font-weight-bold"
                >Customer Name:</span
              ></v-col
            >
            <v-col cols="6" class="text-left">
              <span class="subtitle-1 font-weight-regular"
                >{{ selectedItem.firstName }} {{ selectedItem.lastName }}</span
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <!-- WALLET BALANCE -->
          <v-row>
            <v-col cols="4">
              <span class="subtitle-1 font-weight-bold"
                >Wallet Balance:</span
              ></v-col
            >
            <v-col cols="6">
              <span class="subtitle-1 font-weight-regular">{{
                selectedItem.customerBalance
              }}</span>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <!-- CUSTOMER ID -->
          <v-row>
            <v-col cols="4">
              <span class="subtitle-1 font-weight-bold"
                >Customer Id:</span
              ></v-col
            >
            <v-col cols="6">
              <span class="subtitle-1 font-weight-regular">{{
                selectedItem.partyId
              }}</span>
            </v-col>
          </v-row>
           <v-divider></v-divider>
          <!-- CURRENT BALANCE -->
          <v-row>
            <v-col cols="4">
              <span class="subtitle-1 font-weight-bold"
                >Balance After Approval:</span
              ></v-col
            >
            <v-col cols="6">
              <span class="subtitle-1 font-weight-regular">{{
                selectedItem.currentAmount
              }}</span>
            </v-col>
          </v-row>
          <v-divider></v-divider>

          <v-divider></v-divider>
          <!-- OLD BALANCE -->
          <v-row>
            <v-col cols="4">
              <span class="subtitle-1 font-weight-bold"
                >Old Balance:</span
              ></v-col
            >
            <v-col cols="6">
              <span class="subtitle-1 font-weight-regular">{{
                selectedItem.oldAmount
              }}</span>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-divider></v-divider>
          <!-- PAYMENT GATEWAY ID -->
          <v-row v-if="dialogType == 'paypalTransactionDetails'">
            <v-col cols="4">
              <span class="subtitle-1 font-weight-bold"
                >Payment Gateway Id:</span
              ></v-col
            >
            <v-col cols="6">
              <span class="subtitle-1 font-weight-regular">{{
                selectedItem.transactionDetails.paymentGatewayResponseId
              }}</span>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-card-text>
        <!-- 
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="dialog = false"> Close </v-btn>
        </v-card-actions>-->
      </v-card>
    </v-dialog>
    <!------------------------------------------------------------------------------------------------->
    <v-tabs v-model="active" color="primary" background-color="grey lighten-2">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(tab, index) in tabs" :key="index">
        <div class="subheading">{{ tab.name }}</div>
      </v-tab>

      <!-- PAYPAL TRANSACTION DETAILS DETAILS-->
      <v-tab-item>
        <v-card>
          <v-container fluid fill-height>
            <!-- DATA TABLE-->
            <v-row>
              <v-col xs="12">
                <v-data-table
                  :headers="headers"
                  :items="items"
                  :options.sync="options"
                  :server-items-length="totalItems"
                  :footer-props="{
                    'items-per-page-options': [10, 20, 30],
                  }"
                  :loading="loading"
                >
                  <!-- INDEX NO -->
                  <template v-slot:[`item.indexNo`]="{ item }">
                    <span>{{
                      options.page * 10 - (10 - (items.indexOf(item) + 1))
                    }}</span>
                  </template>
                  <!-- AMOUNT -->
                  <template v-slot:[`item.amount`]="{ item }">
                    {{ item.transactionDetails.amount }}
                  </template>
                  <!-- PAYMENT METHOD -->
                  <template v-slot:[`item.paymentMethodTypeId`]="{ item }">
                    {{
                      paymentMethodCode[
                        item.transactionDetails.paymentMethodTypeId
                      ]
                    }}
                  </template>
                  <!-- TRANSACTION DATE -->
                  <template v-slot:[`item.transactionDate`]="{ item }">
                    {{
                      moment(item.transactionDetails.transactionDate).format(
                        "MMMM DD, YYYY"
                      )
                    }}
                  </template>
                  <!-- GATEWAY CODE -->
                  <template v-slot:[`item.gatewayCode`]="{ item }">
                    {{ item.transactionDetails.gatewayCode }}
                  </template>
                  <!-- REFERENCE NUMBER -->
                  <template v-slot:[`item.referenceNum`]="{ item }">
                    {{ item.transactionDetails.referenceNum }}
                  </template>
                  <!-- PAYMENT STATUS -->
                  <template v-slot:[`item.paymentStatus`]="{ item }">
                    <v-icon
                      v-if="
                        item.transactionDetails.paymentStatusId ==
                        'PAYMENT_APPROVED'
                      "
                      color="success"
                      >done</v-icon
                    >
                    <v-icon
                      v-if="
                        item.transactionDetails.paymentStatusId ==
                        'PAYMENT_DISAPPROVED'
                      "
                      color="error"
                      >mdi-close</v-icon
                    >
                    <span
                      v-if="
                        item.transactionDetails.paymentStatusId ==
                        'PENDING_APPROVAL'
                      "
                    >
                      <v-btn
                        icon
                        color="success"
                        @click="approveDisapprove(item, 'Approve Order')"
                      >
                        <v-icon>done</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        color="error"
                        @click="approveDisapprove(item, 'Disapprove Order')"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </span>
                  </template>
                  <!-- VIEW DETAILS -->
                  <template v-slot:[`item.viewDetail`]="{ item }">
                    <v-btn
                      small
                      outlined
                      fab
                      color="info"
                      @click="seeDetails(item, 'paypalTransactionDetails')"
                    >
                      <v-icon>visibility</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>

      <!-- USERS CREDIT/DEBIT DETAILS DETAILS -->
      <v-tab-item>
        <v-card>
          <v-container fluid fill-height>
            <!-- DATA TABLE-->
            <v-row>
              <v-col xs="12">
                <v-data-table
                  :headers="creditDebitHeaders"
                  :items="creditDebitItems"
                  :options.sync="creditDebitOptions"
                  :server-items-length="creditDebitTotalItems"
                  :footer-props="{
                    'items-per-page-options': [10, 20, 30],
                  }"
                  :loading="creditDebitLoading"
                >
                  <!-- INDEX NO -->
                  <template v-slot:[`item.indexNo`]="{ item }">
                    <span>{{
                      creditDebitOptions.page * 10 -
                      (10 - (creditDebitItems.indexOf(item) + 1))
                    }}</span>
                  </template>
                  <!-- AMOUNT -->
                  <template v-slot:[`item.amount`]="{ item }">
                    {{ item.transactionDetails.amount }}
                  </template>
                  <!-- PAYMENT METHOD -->
                  <template v-slot:[`item.paymentMethodTypeId`]="{ item }">
                    {{
                      paymentMethodCode[
                        item.transactionDetails.paymentMethodTypeId
                      ]
                    }}
                  </template>
                  <!-- TRANSACTION DATE -->
                  <template v-slot:[`item.effectiveDate`]="{ item }">
                    {{
                      moment(item.transactionDetails.effectiveDate).format(
                        "MMMM DD, YYYY"
                      )
                    }}
                  </template>
                  <!-- COMMENTS -->
                  <template v-slot:[`item.comments`]="{ item }">
                    {{ item.transactionDetails.comments }}
                  </template>
                  <!-- PAYMENT ID -->
                  <template v-slot:[`item.paymentId`]="{ item }">
                    {{ item.transactionDetails.paymentId }}
                  </template>

                  <!-- VIEW DETAILS -->
                  <template v-slot:[`item.viewDetail`]="{ item }">
                    <v-btn
                      small
                      outlined
                      fab
                      color="info"
                      @click="seeDetails(item, 'creditDebitDetails')"
                    >
                      <v-icon>visibility</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-spacer></v-spacer>
      <div class="mt-1">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'Dashboard',
          }"
          >Back</v-btn
        >
      </div>
    </v-tabs>
  </v-container>
</template>

<script>
import AllApiCalls from "@/services/AllApiCalls";
import ConfirmationBox from "@/pages/common/ConfirmationBox.vue";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
    ConfirmationBox: ConfirmationBox,
  },
  data() {
    return {
      moment: moment,
      // CONFIRMATION BOX
      confirmationMessage: "Are you sure",
      confirmationDialogBox: false,
      isLoading: false,
      loader: "bars",
      // TABS
      active: 0,
      tabs: [
        {
          name: "PAYPAL TRANSACTION DETAILS",
        },
        {
          name: "USERS CREDIT/DEBIT DETAILS",
        },
      ],

      /* PAYPAL TRANSACTION DETAILS */
      // DATA TABLE
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
          text: "Account ID", 
          value: "partyId", 
          sortable: false 
        },
        {
          text: "Verified",
          value: "isVerified",
          sortable: false,
        },
        {
          text: "Amount",
          align: "start",
          sortable: false,
          value: "amount",
        },
        {
          text: "Payment Method",
          value: "paymentMethodTypeId",
          sortable: false,
        },
        {
          text: "Transaction Date",
          value: "transactionDate",
          sortable: false,
        },
        {
          text: "Gateway Code",
          value: "gatewayCode",
          sortable: false,
        },
        {
          text: "Reference Number",
          value: "referenceNum",
          sortable: false,
        },
        {
          text: "Payment Status",
          value: "paymentStatus",
          sortable: false,
        },
        {
          text: "View Detail",
          value: "viewDetail",
          sortable: false,
        },
      ],
      totalItems: 0,
      ///loading: false,
      options: {},
      selectedItem: {
        transactionDetails: {},
      },
      dialog: "",
      dialogType: "",
      userDetails: {},
      /* USERS CREDIT/DEBIT DETAILS */
      creditDebitItems: [],
      creditDebitHeaders: [
        {
          text: "S.No",
          align: "start",
          sortable: false,
          value: "indexNo",
          width: "5%",
        },
        {
          text: "Amount",
          align: "start",
          sortable: false,
          value: "amount",
        },
        {
          text: "Payment Method",
          value: "paymentMethodTypeId",
          sortable: false,
        },
        {
          text: "Transaction Date",
          value: "effectiveDate",
          sortable: false,
        },
        {
          text: "Comments",
          value: "comments",
          sortable: false,
        },
        {
          text: "Payment Id",
          value: "paymentId",
          sortable: false,
        },
        {
          text: "View Detail",
          value: "viewDetail",
          sortable: false,
        },
      ],
      creditDebitTotalItems: 0,
      creditDebitLoading: false,
      creditDebitOptions: {},
      paymentMethodCode: {
        EFT_ACCOUNT: "Electronic Funds Transfer",
        COMPANY_CHECK: "Company Check",
        GIFT_CARD: "Gift Card",
        PERSONAL_CHECK: "Personal Check",
        CASH: "Cash",
        EXT_GOOGLE_CHECKOUT: "Google Checkout",
        EXT_PAYPAL: "Paypal",
        CREDIT: "Credit Card",
        EXT_IDEAL: "iDEAL",
        EXT_STRIPE: "Stripe",
        GIFT_CERTIFICATE: "Gift Certificate",
        EXT_OFFLINE: "Offline Payment",
        MONEY_ORDER: "Money Order"
      },
    };
  },

  watch: {
    options: {
      async handler() {
        this.loading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getCreditTransaction", {
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        this.items = response.creditDetails;
        this.totalItems = response.listSize;
        this.loading = false;
      },
      deep: true,
    },
    creditDebitOptions: {
      async handler() {
        this.creditDebitLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } =
          this.creditDebitOptions;
        let response = await this.getMethod("getAdminCreditDebitTransactions", {
          viewIndex: page,
          viewSize: itemsPerPage,
        });
        this.creditDebitItems = response.creditDebitList;
        this.creditDebitTotalItems = response.listSize;
        this.creditDebitLoading = false;
      },
      deep: true,
    },
  },
  mounted() {
    this.userDetails = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
    seeDetails(item, message) {
      if (message == "creditDebitDetails") {
        this.dialogType = "creditDebitDetails";
      }
      if (message == "paypalTransactionDetails") {
        this.dialogType = "paypalTransactionDetails";
      }
      this.dialog = true;
      this.selectedItem = JSON.parse(JSON.stringify(item));
    },
    approveDisapprove(item, message) {
      this.selectedItem = JSON.parse(JSON.stringify(item));
      this.confirmationMessage = message;
      this.confirmationDialogBox = true;
    },
    async approveDisapproveApi() {
      let api = "";
      if (this.confirmationMessage == "Approve Order") {
        api = "approvePayment";
      }
      if (this.confirmationMessage == "Disapprove Order") {
        api = "disApprovePayment";
      }
      let response = await this.postMethod(api, {
        accountId: this.selectedItem.accountId,
        authToken: this.userDetails.authToken,
        partyId: this.selectedItem.partyId,
        paymentAmount: this.selectedItem.transactionDetails.amount,
        paymentGatewayResponseId:
          this.selectedItem.transactionDetails.paymentGatewayResponseId,
      });
      if (this.confirmationMessage == "Approve Order") {
        this.seeSnackbar("Approved", "success");
      }
      if (this.confirmationMessage == "Disapprove Order") {
        this.seeSnackbar("Disapproved", "success");
      }
      /* refresh the page */
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let refreshResponse = await this.getMethod("getCreditTransaction", {
        viewIndex: page,
        viewSize: itemsPerPage,
      });
      this.items = refreshResponse.creditDetails;
      this.totalItems = refreshResponse.listSize;
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
