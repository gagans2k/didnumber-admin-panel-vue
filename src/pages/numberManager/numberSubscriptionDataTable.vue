<template>
  <div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="primary-btn text-capitalize mr-2"
        to="purchasedid"
        outlined
        rounded
        >Order New Dids</v-btn
      >
    </v-card-actions>

    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
        <v-data-table
          :headers="header"
          :items="numberSubscriptionData"
          :server-items-length="totalNumberSubscription"
          :options.sync="options"
        >
          <template v-slot:[`item.indexNo`]="{ item }">
            {{ numberSubscriptionData.indexOf(item) + 1 }}
          </template>
          <template v-slot:[`item.country`]="{ item }">
            {{ item.country ? item.country : "-" }} <br />
            {{ item.city ? item.city : "-" }}
          </template>
          <template v-slot:[`item.billingTenurePeriod`]="{ item }">
            <v-select
              :items="billingTenurePeriodList"
              v-model="item.billingTenurePeriod"
              placeholder="Select Option"
              @change="openModal(item)"
              class="pt-3"
              filled
              dense
            ></v-select>
          </template>
          <template v-slot:[`item.daysRemaining`]="{ item }">
            <v-avatar class="light-green mb-1" size="18"></v-avatar>
            {{ item.daysRemaining }}
          </template>
          <template v-slot:[`item.callForwarding`]="{ item }">
            <!-- <v-row> -->
            <!-- <v-col cols="12" md="6" class="mx-auto py-0">
                <v-switch
                  v-model="item.autoRenew"
                  value="Y"
                  @change="autoRenewSubscription(item)"
                ></v-switch>
              </v-col> -->
            <!-- </v-row> -->
            <v-icon @click="openAssigningNumberDialog(item)" color="info"
              >forward</v-icon
            >
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-select
              :items="actionsOptions"
              v-model="item.actions"
              item-text="title"
              item-value="value"
              label="Select batch action"
              @change="selectBatch(item, item.actions)"
              class="pt-3"
              filled
              dense
            >
            </v-select>
            <!-- <div
              v-if="
                item.didStatus != 'DID_INACTIVE' &&
                item.didStatus != 'DID_SUSPENDED'
              "
            >
              <v-icon @click="getDeviceItem(item)" color="black"
                >delete_sweep</v-icon
              >
              /
              <v-icon @click="openAssigningNumberDialog(item)" color="info"
                >forward</v-icon
              >
              /
            </div>
            <div v-if="item.didStatus === 'DID_INACTIVE'">
              <v-icon color="black">not_interested</v-icon>
            </div>
            <div v-if="item.didStatus === 'DID_SUSPENDED'">
              <v-icon color="info" @click="openSubscriptionRenewDialog(item)"
                >autorenew</v-icon
              > 
            </div>-->
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- Billing Tenure Dialog -->
    <v-dialog v-model="confirmActionDialog" persistent max-width="380">
      <v-card>
        <v-card-title class="title">
          <span v-if="showSetBillingTenureBtn">
            Would you like to set billing tenure?</span
          >
          <span v-if="!showSetBillingTenureBtn && !showRenew"
            >Would you like to delete?</span
          >
          <span v-if="showRenew">Are you sure,you want to Renew?</span>
          <br /><br />
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="closeConfirmActionDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="setBillingTenure"
            v-show="showSetBillingTenureBtn"
          >
            Ok
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteDeviceDetails"
            v-show="showdDeleteDeviceBtn"
          >
            Ok
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteFaxboxesDetails"
            v-show="showdFaxboxesBtn"
          >
            Ok
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="subscriptionRenew"
            v-show="showRenew"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Device Dialog -->
    <v-dialog v-model="deleteDeviceDialog" persistent max-width="440">
      <v-card>
        <v-toolbar color="primary" dark
          >Delete Device
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDeleteDeviceDialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <v-select
                  :items="deviceList"
                  append-icon="call"
                  v-model="deleteDevice.deviceList"
                  label="Sip details/ regular phn"
                  item-text="name"
                  item-value="id"
                  @change="confirmDeleteDeviceDialog(deleteDevice.deviceList)"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="12">
                <v-select
                  :items="faxBoxList"
                  append-icon="mail"
                  label="Faxtoemail"
                  v-model="deleteDevice.faxBoxList"
                  item-text="name"
                  item-value="id"
                  @change="confirmFaxBoxListeDialog(deleteDevice.faxBoxList)"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error darken-1"
            text
            @click="deleteDeviceDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Subscription RenewDialog -->
    <v-dialog v-model="showSubscriptionRenewDialog" persistent max-width="700">
      <v-card>
        <v-toolbar color="primary" dark
          ><v-card-title class="px-0">
            Subscription Renew Details
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showSubscriptionRenewDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-0">
          <v-list subheader two-line>
            <v-list-item class="grey lighten-3">
              <v-list-item-content>
                <v-list-item-title
                  ><b>Suspended Period Rental :</b>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-title class="subtitle-1">
                  {{ subscriptionRenewData.expireDayCost }}
                </v-list-item-title>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><b>Renew Charge :</b> </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-title class="subtitle-1">
                  {{ subscriptionRenewData.unitPrice }}
                </v-list-item-title>
              </v-list-item-action>
            </v-list-item>
            <v-list-item class="grey lighten-3">
              <v-list-item-content>
                <v-list-item-title><b>Total Cost :</b> </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-title class="subtitle-1">
                  {{ subscriptionRenewData.totalPrice }}
                </v-list-item-title>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="info"
            class="mx-auto px-4"
            dark
            @click="openshowRenewModal"
          >
            Renew
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Assigning Number Dialog-->
    <v-dialog v-model="showAssigningNumberDialog" max-width="700">
      <assigningNumber
        :assigningNumberData="assigningNumberData"
        :cellPhoneDeviceData="cellPhoneDeviceData"
        :sipUriDeviceData="sipUriDeviceData"
        :softPhoneDeviceData="softPhoneDeviceData"
        :faxBoxList="faxBoxList"
        @closeModal="closeAssignNumberModal"
        @closedAssignedModal="closeOnAssigned"
        v-if="getForwardDetails.forwardType == 'NONE'"
      />
      <editAssigningNumberDilaog
        :assigningNumberData="assigningNumberData"
        :cellPhoneDeviceData="cellPhoneDeviceData"
        :sipUriDeviceData="sipUriDeviceData"
        :softPhoneDeviceData="softPhoneDeviceData"
        :faxBoxList="faxBoxList"
        :selectOption="selectOption"
        @closeModal="closeAssignNumberModal"
        @switchServerModal="showSwitchServerModal"
        v-if="getForwardDetails.forwardType != 'NONE'"
      />
    </v-dialog>
    <!-- Remove Number Dialog-->
    <v-dialog v-model="showRemoveDid" max-width="700">
      <showRemoveDidDialog
        :particularAssigningNumber="particularAssigningNumberData"
      />
    </v-dialog>
    <!-- show Switch Server Modal Box -->
    <v-dialog v-model="showSwitchServerModalBox" max-width="400">
      <showSwitchServerDialog
        @closeSwitchServer="closeSwitchServerModal"
        @removeServer="removeCurrentServer"
      />
    </v-dialog>
    <loading :active="isLoading" :loader="loader" />
  </div>
</template>

<script>
import moment from "moment";
import numberManagerAPI from "@/services/numberManagerAPI.js";
import assigningNumber from "./assigningNumberDilaog";
import editAssigningNumberDilaog from "./editAssigningNumberDilaog";
import showRemoveDidDialog from "./removeDidDialog";
import showSwitchServerDialog from "./switchServerDialog";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "debitDetailsTable",
  props: ["status"],
  components: {
    Loading,
    assigningNumber,
    editAssigningNumberDilaog,
    showRemoveDidDialog,
    showSwitchServerDialog,
  },
  data() {
    return {
      moment: moment,
      confirmActionDialog: false,
      deleteDeviceDialog: false,
      showdDeleteDeviceBtn: false,
      showSetBillingTenureBtn: false,
      showSubscriptionRenewDialog: false,
      showAssigningNumberDialog: false,
      showdFaxboxesBtn: false,
      showRenew: false,
      showRemoveDid: false,
      showSwitchServerModalBox: false,
      model: "1",
      isLoading: false,
      loader: "bars",
      billingTenurePeriodList: [1, 3, 6, 12, 24],
      particularAssigningNumberData: [],
      userDetail: {},
      selectedBilingTenureData: {},
      selectNumberManagerData: {},
      subscriptionRenewData: {},
      assigningNumberData: {},
      getForwardDetails: {},
      selectOption: {},
      selectbatchData: "",
      deleteDeviceId: "",
      deleteFaxboxesId: "",
      deleteDevice: {},
      faxBoxList: [],
      deviceList: [],
      cellPhoneDeviceData: [],
      sipUriDeviceData: [],
      softPhoneDeviceData: [],
      getFaxboxesData: {},
      options: {},
      numberSubscriptionData: [],
      totalNumberSubscription: 0,
      actionsOptions: [
        {
          title: "Order Details",
          value: "orderDetails",
        },
        {
          title: "Remove DID's",
          value: "removeDid",
        },
        { title: "Call Logs", value: "callLogs" },
      ],
      header: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "Country / City",
          value: "country",
          align: "center",
          sortable: true,
        },
        {
          text: "DID Number ",
          value: "didNumber",
          align: "center",
          sortable: true,
        },
        {
          text: "Billing Tenure",
          value: "billingTenurePeriod",
          align: "center",
          sortable: true,
          width: "14%",
        },
        {
          text: "Status / Time left ",
          value: "daysRemaining",
          align: "center",
          sortable: true,
        },
        {
          text: "Order Id",
          value: "orderId",
          align: "center",
          sortable: true,
        },
        {
          text: "Call Forwarding",
          value: "callForwarding",
          align: "center",
          sortable: false,
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: true,
          width: "16%",
        },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getSubscriptionNew();
      },
      deep: true,
    },
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
    async getSubscriptionNew() {
      this.isLoading = true;
      const { page, itemsPerPage } = this.options;

      try {
        let response = await numberManagerAPI.getDidNumberDetailSubscriptionNew(
          {
            viewIndex: page,
            viewSize: itemsPerPage,
            partyId: this.userDetail.partyId,
            didStatus: this.status,
          }
        );
        this.totalNumberSubscription = response.listSize;
        this.numberSubscriptionData = response.numberList;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    // async autoRenewSubscription(item) {
    //   this.isLoading = true;
    //   var autoRenuData = {
    //     subscriptionId: item.subscriptionId,
    //   };
    //   if (item.autoRenew == "Y") {
    //     autoRenuData.autoRenew = "Y";
    //   } else {
    //     autoRenuData.autoRenew = "N";
    //   }
    //   try {
    //     let response = await numberManagerAPI.autoRenewSubscription(
    //       autoRenuData
    //     );
    //     this.isLoading = false;
    //     this.$root.$emit("SHOW_SNACKBAR", {
    //       text: response.responseMessage,
    //       color: "success",
    //     });
    //   } catch (error) {
    //     this.isLoading = false;
    //     this.$root.$emit("SHOW_SNACKBAR", {
    //       text: "something wrong!",
    //       color: "error",
    //     });
    //   }
    // },
    openModal(item) {
      this.selectedBilingTenureData = item;
      this.confirmActionDialog = true;
      this.showdDeleteDeviceBtn = false;
      this.showSetBillingTenureBtn = true;
      this.showdFaxboxesBtn = false;
    },
    showSwitchServerModal() {
      this.isLoading = true;
      this.showAssigningNumberDialog = false;
      setTimeout(() => {
        this.showSwitchServerModalBox = true;
        this.isLoading = false;
      }, 1000);
    },
    async setBillingTenure() {
      var setBillingTenureData = {
        subscriptionId: this.selectedBilingTenureData.subscriptionId,
        billingTenurePeriod: this.selectedBilingTenureData.billingTenurePeriod.toString(),
        inventoryItemId: this.selectedBilingTenureData.inventoryItemId,
        orderId: this.selectedBilingTenureData.orderId,
        partyId: this.userDetail.partyId,
      };
      this.isLoading = true;
      try {
        let response = await numberManagerAPI.setBillingTenure(
          setBillingTenureData
        );
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.confirmActionDialog = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
        this.confirmActionDialog = false;
      }
    },
    async removeCurrentServer() {
      var removeServerData = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
      };
      this.isLoading = true;
      try {
        let response = await numberManagerAPI.removeServerForward(
          removeServerData
        );
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.showSwitchServerModalBox = false;
        setTimeout(() => {
          // this.openNonAssigningNumberDialog();
          this.openAssigningNumberDialog(this.assigningNumberData);
          this.isLoading = false;
        }, 1000);
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
      }
    },
    async getDeviceItem(item) {
      this.deleteDeviceDialog = true;
      this.isLoading = true;
      this.getFaxboxesData = {
        accountId: this.userDetail.accountId,
      };
      try {
        let response = await numberManagerAPI.getDeviceList(
          this.getFaxboxesData
        );
        this.deviceList = response.deviceList;
        this.isLoading = false;
        this.getFaxboxes();
      } catch (error) {
        this.isLoading = false;
      }
    },

    async getFaxboxes() {
      try {
        let responseFaxboxes = await numberManagerAPI.getFaxboxesList(
          this.getFaxboxesData
        );
        this.faxBoxList = responseFaxboxes.faxboxesList;
      } catch (error) {
      }
    },
    confirmDeleteDeviceDialog(id) {
      this.deleteDeviceDialog = false;
      this.showdDeleteDeviceBtn = true;
      this.showSetBillingTenureBtn = false;
      this.showdFaxboxesBtn = false;
      this.deleteDeviceId = id;
      this.confirmActionDialog = true;
    },
    confirmFaxBoxListeDialog(id) {
      this.deleteDeviceDialog = false;
      this.showdDeleteDeviceBtn = false;
      this.showdFaxboxesBtn = true;
      this.showSetBillingTenureBtn = false;
      this.deleteFaxboxesId = id;
      this.confirmActionDialog = true;
    },
    closeConfirmActionDialog() {
      this.confirmActionDialog = false;
      this.deleteDevice = {};
      this.deviceList = [];
    },
    closeDeleteDeviceDialog() {
      this.deleteDeviceDialog = false;
      this.deleteDevice = {};
      this.deviceList = [];
    },
    closeAssignNumberModal() {
      this.showAssigningNumberDialog = false;
    },
    closeOnAssigned() {
      this.openAssigningNumberDialog(this.assigningNumberData);
    },
    closeSwitchServerModal() {
      this.showSwitchServerModalBox = false;
      setTimeout(() => {
        // this.openNonAssigningNumberDialog();
        this.openAssigningNumberDialog(this.assigningNumberData);
      }, 1000);
    },
    async deleteDeviceDetails() {
      this.isLoading = true;
      var getFaxboxesData = {
        accountId: this.userDetail.accountId,
        deviceId: this.deleteDeviceId,
      };
      try {
        let response = await numberManagerAPI.deleteDeviceDetails(
          getFaxboxesData
        );
        this.deviceList = response.deviceList;
        this.isLoading = false;
        this.confirmActionDialog = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
      } catch (error) {
        this.isLoading = false;
        this.confirmActionDialog = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Something wrong!",
          color: "error",
        });
      }
    },
    async deleteFaxboxesDetails() {
      this.isLoading = true;
      var getFaxboxesData = {
        accountId: this.userDetail.accountId,
        faxboxesId: this.deleteFaxboxesId,
      };
      try {
        let response = await numberManagerAPI.deleteFaxboxesDetails(
          getFaxboxesData
        );
        this.deviceList = response.deviceList;
        this.isLoading = false;
        this.confirmActionDialog = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
      } catch (error) {
        this.isLoading = false;
        this.confirmActionDialog = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Something wrong!",
          color: "error",
        });
      }
    },
    openSubscriptionRenewDialog(item) {
      this.selectNumberManagerData = item;
      this.showSubscriptionRenewDialog = true;
      this.getDidRenewTotalCost();
    },
    async getDidRenewTotalCost() {
      this.isLoading = true;
      var getDIDRenewData = {
        inventoryItemId: this.selectNumberManagerData.inventoryItemId,
        orderId: this.selectNumberManagerData.orderId,
      };
      try {
        let response = await numberManagerAPI.getDIDRenewTotalCost(
          getDIDRenewData
        );
        this.subscriptionRenewData = response.outMap;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    openshowRenewModal() {
      this.confirmActionDialog = true;
      this.showRenew = true;
      this.showSubscriptionRenewDialog = false;
    },
    async subscriptionRenew() {
      this.isLoading = true;
      try {
        let response = await numberManagerAPI.runSubscriptionExpired({
          subscriptionId: this.selectNumberManagerData.subscriptionId,
        });
        this.isLoading = false;
        this.confirmActionDialog = false;
        this.$router.go(this.$router.currentRoute);
      } catch (error) {
        this.isLoading = false;
        this.confirmActionDialog = false;
      }
    },
    async openAssigningNumberDialog(item) {
      this.isLoading = true;
      this.assigningNumberData = item;
      this.getFaxboxesData = {
        accountId: this.userDetail.accountId,
      };
      this.showAssigningNumberDialog = true;
      var ForwardDetailsData = {
        accountId: this.userDetail.accountId,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
      };
      try {
        let response = await numberManagerAPI.getForwardDetails(
          ForwardDetailsData
        );
        this.getForwardDetails = response.forwardDetails;
        if (this.getForwardDetails.forwardType != "NONE") {
          this.selectOption = this.getForwardDetails;
        } else if (this.getForwardDetails.forwardType == "NONE") {
          this.selectOption = "Duckduckgo";
        }
        // this.isLoading = false;
        this.getFaxboxes();
        this.getCellPhoneDeviceList();
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        // this.isLoading = false;
      }
    },
    openNonAssigningNumberDialog() {
      this.getForwardDetails.forwardType = "NONE";
      if (this.getForwardDetails.forwardType == "NONE") {
        this.selectOption = "Duckduckgo";
        this.showAssigningNumberDialog = true;
      }
    },
    async getCellPhoneDeviceList() {
      var getFilteredDeviceData = {
        accountId: this.userDetail.accountId,
        forwardType: "CELLPHONE",
      };
      try {
        let response = await numberManagerAPI.getFilteredDeviceList(
          getFilteredDeviceData
        );
        this.cellPhoneDeviceData = response.deviceList;
        // this.isLoading = false;
        this.getSipUriDeviceList();
      } catch (error) {
        // this.isLoading = false;
      }
    },
    async getSipUriDeviceList() {
      var getFilteredDeviceData = {
        accountId: this.userDetail.accountId,
        forwardType: "SIP_URI",
      };
      try {
        let response = await numberManagerAPI.getFilteredDeviceList(
          getFilteredDeviceData
        );
        this.sipUriDeviceData = response.serverList;
        // this.isLoading = false;
        this.getSoftPhoneDeviceList();
      } catch (error) {
        // this.isLoading = false;
      }
    },
    async getSoftPhoneDeviceList() {
      var getFilteredDeviceData = {
        accountId: this.userDetail.accountId,
        forwardType: "SOFTPHONE",
      };
      try {
        let response = await numberManagerAPI.getFilteredDeviceList(
          getFilteredDeviceData
        );
        this.softPhoneDeviceData = response.deviceList;

        // this.isLoading = false;
      } catch (error) {
        // this.isLoading = false;
      }
    },
    selectBatch(item, selectedOption) {
      if (selectedOption == "orderDetails") {
        this.$router.push("/order/" + item.orderId);
      } else if (selectedOption == "removeDid") {
        this.showRemoveDid = true;
        this.particularAssigningNumberData.push(item);
      } else if (selectedOption == "callLogs") {
        this.$router.push("/cdr");
      }
    },
  },
};
</script>