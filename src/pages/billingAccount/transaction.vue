<template>
  <v-card elevation="1">
    <v-tabs>
      <v-tab> Debit details </v-tab>
      <v-tab @click="getUserCreditTransactions"> Credit details </v-tab>
      <v-tab @click="getpendingTransaction"> On hold </v-tab>
      <v-tab-item>
        <debitDetailsTable :debitDetails="debitDetails" />
      </v-tab-item>
      <v-tab-item>
        <creditDetailsTable :creditDetails="creditDetails" />
      </v-tab-item>
      <v-tab-item>
        <onHoldTable :onHoldData="onHoldData" />
      </v-tab-item>
    </v-tabs>
    <loading :active="isLoading" :loader="loader" />
  </v-card>
</template>


<script>
import shoppingCartAPI from "@/services/shoppingCartAPI.js";
import billingAccountAPI from "@/services/billingAccountAPI.js";
import debitDetailsTable from "./debitDetailsTable";
import creditDetailsTable from "./creditDetailsTable";
import onHoldTable from "./onHoldTable";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";

export default {
  name: "billingAcc",
  components: {
    Loading,
    debitDetailsTable,
    creditDetailsTable,
    onHoldTable,
  },
  data() {
    return {
      notification: true,
      topUp: false,
      showTopUp: false,
      isLoading: false,
      loader: "bars",
      moment: moment,
      debitDetails: [],
      creditDetails: [],
      onHoldData: [],
      userDetail: {},
      billingAccountId: "",
    };
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getBilling();
  },
  methods: {
    async getBilling() {
      try {
        let response = await shoppingCartAPI.getBilling({
          accountId: this.userDetail.accountId,
          partyId: this.userDetail.partyId,
        });
        this.accountBilling = response.billingAccountList[0].balance;
        this.billingAccountId = response.billingAccountList[0].billingAccountId;
        this.getDebitTransactions();
        // localStorage.setItem("getBalance", this.accountBilling);
      } catch (error) {
      }
    },
    async getDebitTransactions() {
      this.isLoading = true;
      try {
        let response = await billingAccountAPI.getDebitTransactions({
          billingAccountId: this.billingAccountId,
        });
        this.debitDetails = response.debitList;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async getUserCreditTransactions() {
      this.isLoading = true;

      try {
        let response = await billingAccountAPI.getUserCreditTransactions({
          partyId: this.userDetail.partyId,
        });
        this.creditDetails = response.creditTransactionList;
        this.isLoading = false;
      } catch (error) {
      }
    },
    async getpendingTransaction() {
      this.isLoading = true;

      try {
        let response = await billingAccountAPI.getPendingTransaction({
          partyId: this.userDetail.partyId,
        });
        this.onHoldData = response.pendingDetails;
        this.isLoading = false;
      } catch (error) {
      }
    },
  },
};
</script>