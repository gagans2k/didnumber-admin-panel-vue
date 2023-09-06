<template>
  <div>
    <v-tabs>
      <v-tab>
        <v-icon left> monetization_on </v-icon>
        WALLET BALANCE DETAILS
      </v-tab>
      <v-tab>
        <v-icon left> account_balance_wallet </v-icon>
        Low Balance Settings
      </v-tab>
      <v-tab-item>
        <v-divider></v-divider>
        <v-card flat class="pa-12">
          <v-col cols="12" lg="12">
            <v-form
              ref="formLowBalance"
              v-model="validLowBalance"
              lazy-validation
            >
              <v-row>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    append-icon="monetization_on"
                    label="Available wallet Balance"
                    type="text"
                    disabled
                    outlined
                    dense
                    v-model="accountBilling"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="8" md="8">
                  <v-btn
                    class="mt-2 myTitle text-capitalize primary-btn"
                    to="payment"
                    outlined
                    dense
                    large
                    dark
                  >
                    Add Balance
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-divider></v-divider>
        <v-card flat class="px-8 py-10">
          <v-col cols="12" lg="12">
            <v-row>
              <v-col cols="12" lg="3" md="4">
                <v-text-field
                  append-icon="monetization_on"
                  label="Minimum Account"
                  :rules="minimumAmountRules"
                  v-model="lowBalance.lowBalanceLimit"
                  outlined
                  dense
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" md="4" class="pl-4">
                <v-switch
                  v-model="notification"
                  append-icon="notifications_active"
                  :label="
                    notification == true
                      ? 'Notification is Enabled'
                      : 'Notification is Disabled'
                  "
                ></v-switch>
              </v-col>
              <v-col cols="12" lg="2" md="2">
                <v-card-actions class="py-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mt-3 myTitle text-capitalize primary-btn"
                    @click="changeLowBalance"
                    :loading="saveLoader"
                    block
                    outlined
                    large
                    dark
                  >
                    Save
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-col>
            </v-row>
            <v-row>
              <v-card-title
                >Auto Balance top up
                <v-switch
                  class="pl-3"
                  v-model="topUp"
                  @click="showOnCondition()"
                ></v-switch
              ></v-card-title>
            </v-row>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row v-show="showTopUp">
                <v-col cols="12" lg="3" md="4">
                  <v-text-field
                    append-icon="monetization_on"
                    label="Threshold Amount"
                    :rules="thresholdAmtRules"
                    v-model="setAutoPayBalance.thresholdAmt"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="3" md="4">
                  <v-text-field
                    append-icon="monetization_on"
                    label="Refill Amount"
                    :rules="refillAmountRules"
                    v-model="setAutoPayBalance.refillAmt"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="2" md="2">
                  <v-card-actions class="py-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      class="mt-3 myTitle text-capitalize"
                      color="green"
                      @click="updateAutoBalance"
                      block
                      dark
                    >
                      Update
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-form>
            <v-row v-show="showAgreementDataTable">
              <v-col cols="12">
                <agreementDataTable :agreementData="agreementData" />
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <loading :active="isLoading" :loader="loader" />
  </div>
</template>


<script>
import shoppingCartAPI from "@/services/shoppingCartAPI.js";
import billingAccountAPI from "@/services/billingAccountAPI.js";
import agreementDataTable from "./agreementTable";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "billingAcc",
  components: {
    agreementDataTable,
    Loading,
  },
  data() {
    return {
      valid: true,
      validLowBalance: true,
      topUp: false,
      showTopUp: false,
      saveLoader: false,
      updateLoader: false,
      notification: null,
      accountBilling: "",
      lowBalance: {},
      userDetail: {},
      setAutoPayBalance: {},
      agreementData: [],
      showAgreementDataTable: false,
      routeAgreementData: {},
      autoBalance: {},
      loader: "bars",
      isLoading: false,
      minimumAmountRules: [(v) => !!v || "Minimum Amount is required"],
      thresholdAmtRules: [(v) => !!v || "Threshold Amount is required"],
      refillAmountRules: [(v) => !!v || "Refill Amount is required"],
    };
  },
  mounted() {
    this.routeAgreementData = this.$route.query;
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    if (this.routeAgreementData.token) {
      this.getAgreement();
    }
    this.getBilling();
    this.getLowBalance();
    this.getAutoLowBalance();
  },
  methods: {
    // if success payement
    showOnCondition() {
      if (this.topUp === false) {
        this.showTopUp = false;
        this.showAgreementDataTable = false;
        this.cancelAgreement();
      } else if (this.topUp == true) {
        this.showTopUp = true;
        this.showAgreementDataTable = false;
      }
    },
    async getAgreement() {
      try {
        let response = await billingAccountAPI.getAgreementId({
          partyId: this.routeAgreementData.partyId,
          id: this.routeAgreementData.id,
          token: this.routeAgreementData.token,
        });
      } catch (error) {
      }
    },
    async getBilling() {
      this.isLoading = true;
      try {
        let response = await shoppingCartAPI.getBilling({
          accountId: this.userDetail.accountId,
          partyId: this.userDetail.partyId,
        });
        this.accountBilling = response.billingAccountList[0].balance;
        this.isLoading = false;
        localStorage.setItem("getBalance", this.accountBilling);
      } catch (error) {
        this.isLoading = false;
      }
    },
    async getLowBalance() {
      try {
        let response = await billingAccountAPI.getLowBalance({
          partyId: this.userDetail.partyId,
        });
        this.lowBalance = response.lowBalanceNotifyStatus;
        if (this.lowBalance.notifyLowBalance === "Y") {
          this.notification = true;
        } else {
          this.notification = false;
        }
      } catch (error) {
      }
    },
    async getAutoLowBalance() {
      try {
        let response = await billingAccountAPI.getAutoLowBalance({
          partyId: this.userDetail.partyId,
        });
        if (response && response.autoBalance) {
          this.autoBalance = response.autoBalance;
          this.showAgreementDataTable = true;
          this.agreementData.push(response.autoBalance);
          if (response.autoBalance.agreementStatus === "ACTIVE") {
            this.topUp = true;
          }
        } else {
          this.cancelAgreement();
        }
      } catch (error) {
      }
    },
    async cancelAgreement() {
      if (this.autoBalance.id) {
        var cancelPaymentData = {
          id: this.autoBalance.id,
          agreementId: this.autoBalance.agreementId,
        };
      } else if (this.routeAgreementData.partyId) {
        var cancelPaymentData = {
          partyId: this.routeAgreementData.partyId,
          id: this.routeAgreementData.id,
          token: this.routeAgreementData.token,
        };
      }
      try {
        let responseCancelPayment = await billingAccountAPI.cancelAgreement(
          cancelPaymentData
        );
        if (responseCancelPayment) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: responseCancelPayment.responseMessage,
            color: "success",
          });
        }
      } catch (error) {
      }
    },
    async changeLowBalance() {
      this.lowBalance.partyId = this.userDetail.partyId;
      if (this.notification == true) {
        this.lowBalance.notifyLowBalance = "Y";
      } else {
        this.lowBalance.notifyLowBalance = "N";
      }
      if (this.$refs.validLowBalance.validate()) {
        this.saveLoader = true;
        try {
          let response = await billingAccountAPI.changeLowBalanceStatus(
            this.lowBalance
          );
          this.saveLoader = false;
          this.getLowBalance();
          this.$root.$emit("SHOW_SNACKBAR", {
            text: response.responseMessage,
            color: "success",
          });
        } catch (err) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Something wrong!",
            color: "error",
          });
          this.saveLoader = false;
        }
      }
    },
    async updateAutoBalance() {
      this.updateLoader = true;
      this.setAutoPayBalance.partyId = this.userDetail.partyId;
      this.setAutoPayBalance.agreementStatus = "ACTIVE";
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        try {
          let response = await billingAccountAPI.createPaypalAgreement(
            this.setAutoPayBalance
          );
          location.href = response.paypalRedirectUrl;
          this.getLowBalance();
          this.isLoading = true;

          this.$root.$emit("SHOW_SNACKBAR", {
            text: response.responseMessage,
            color: "success",
          });
          // this.updateLoader = false;
        } catch (error) {
          this.isLoading = false;
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
        }
        // this.updateLoader = false;
      }
    },
  },
};
</script>