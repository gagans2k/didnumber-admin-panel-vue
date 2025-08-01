<template>
  <v-container>
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
    <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div>
    <!-- <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row> -->
    <!--DIALOG CONFIRMATION BOX -->
    <v-dialog v-model="confirmationBox" max-width="400px">
      <ConfirmationBox
        @confirmed="
          () => {
            confirmationBox = false;
            creditDebitBalanceWallets();
          }
        "
        @closeConfirmation="confirmationBox = false"
        :confirmationMessage="confirmationMessage"
      ></ConfirmationBox>
    </v-dialog>

    <!-- DIALOG BOX CREDIT OR DEBIT -->
    <v-dialog v-model="dialog" max-width="440px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ creditOrDebit }}</span>
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>
          <v-layout>
            <v-flex xs12 class="pa-2">
              <label></label>
              <v-icon
                style="float: right"
                class="right"
                @click="
                  () => {
                    this.$refs.form.reset();
                    dialog = false;
                  }
                "
                >cancel</v-icon
              >
            </v-flex>
          </v-layout>

          <!-- <v-row>
           <v-btn  class="justify-right"
           color="blue darken-1" 
           text 
           @click="()=>{this.$refs.form.reset();dialog = false}"><v-icon>
            mdi-close</v-icon>
          </v-btn>
          </v-row> -->
        </v-card-title>
        <!-- <v-devider></v-devider> -->
        <hr />
        <v-card-text>
          <v-container>
            <v-row>
              <v-form ref="form">
                <!-- AMOUNT -->
                <v-col cols="12">
                  <v-text-field
                    v-model="amount"
                    label="Amount"
                    append-icon="description"
                    :rules="hasToBeNumericValue"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <!-- select payment method -->
                <v-col cols="12" v-if="this.message == 'CREDIT'">
                  <v-autocomplete
                    :rules="cantBeEmpty"
                    v-model="paymentMethodTypeId"
                    :items="paymentMethodList"
                    item-text="description"
                    item-value="paymentMethodTypeId"
                    label="Select payment method"
                    append-icon="list"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary darken-1"
                    dark
                    block
                    :loading="submitLoader"
                    @click="submitFormData()"
                  >
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-tabs v-model="active" color="primary" background-color="grey lighten-2">
      <!-- <v-tabs-slider></v-tabs-slider> -->
      <v-tab v-for="(tab, index) in tabs" :key="index">
        <div class="subheading">{{ tab.name }}</div>
      </v-tab>

      <!-- WALLET BALANCE DETAILS-->
      <v-tab-item>
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <!-- <span class="title text-weight-bold"> -->
                <span class="title"> Wallet Balance </span>
              </v-col>
              <v-spacer></v-spacer>
              <v-toolbar elevation="0">
                <v-spacer></v-spacer>
                <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
              </v-toolbar>
            </v-row>
            <!-- Available wallet balance -->
            <v-row>
              <v-col xs="12" sm="12" md="6"
                ><v-text-field
                  label="Available Wallet Balance"
                  outlined
                  dense
                  v-model="walletBalance"
                ></v-text-field> </v-col
            ></v-row>
            <!-- credit balance debit balance buttons -->
            <v-row>
              <v-col xs="12" sm="1" md="2">
                <v-btn
                  block
                  dark
                  color="primary"
                  @click="
                    () => {
                      getPaymentMethod();
                      creditOrDebit = 'Credit';
                      dialog = true;
                      this.message = 'CREDIT';
                    }
                  "
                  >CREDIT BALANCE</v-btn
                >
              </v-col>
              <v-spacer></v-spacer>
              <v-col xs="12" sm="12" md="2">
                <v-btn
                  block
                  dark
                  color="primary"
                  @click="
                    () => {
                      creditOrDebit = 'Debit';
                      dialog = true;
                      this.message = 'DEBIT';
                    }
                  "
                  >DEBIT BALANCE</v-btn
                ></v-col
              >
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>

      <!-- PSTN BALANCE DETAILS -->
      <v-tab-item>
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <span class="title text-weight-bold"> PSTN Balance </span>
              </v-col>
              <v-spacer></v-spacer>
              <v-toolbar elevation="0">
                <v-spacer></v-spacer>
                <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
              </v-toolbar>
            </v-row>
            <!-- Available PSTN balance -->
            <v-row>
              <v-col xs="12" sm="12" md="6"
                ><v-text-field
                  label="Available PSTN Balance"
                  v-model="pstnBal"
                  outlined
                  dense
                ></v-text-field> </v-col
            ></v-row>
          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import dashboardAPI from "@/services/dashboardAPI.js";
import ConfirmationBox from "@/pages/common/ConfirmationBox.vue";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  components: {
    ConfirmationBox: ConfirmationBox,
  },
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      // CONFIRMATION BOX
      isLoading: false,
      loader: "bars",
      confirmationMessage: "Are you sure",
      confirmationBox: false,
      submitLoader: false,
      dialog: "",
      active: 0,
      tabs: [
        { name: "WALLET BALANCE DETAILS" },
        { name: "PSTN BALANCE DETAILS" },
      ],
      message: "",
      amount: "",
      paymentMethodList: [],
      walletBalance: "",
      pstnBal: "",
      billingAccDetails: {},
      paymentMethodTypeId: "",
      creditOrDebit: "",
    };
  },

  methods: {
    async getBillingAccDetails() {
      this.isLoading = true;
      let response = await this.getMethod("getBillingAccDetails", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        partyId: this.$route.query.partyId,
      });
      this.billingAccDetails = response.billingAccountList[0];
      var currency_symbols = {
        USD: "$", // US Dollar
        EUR: "€", // Euro
        CRC: "₡", // Costa Rican Colón
        GBP: "£", // British Pound Sterling
        ILS: "₪", // Israeli New Sheqel
        INR: "₹", // Indian Rupee
        JPY: "¥", // Japanese Yen
        KRW: "₩", // South Korean Won
        NGN: "₦", // Nigerian Naira
        PHP: "₱", // Philippine Peso
        PLN: "zł", // Polish Zloty
        PYG: "₲", // Paraguayan Guarani
        THB: "฿", // Thai Baht
        UAH: "₴", // Ukrainian Hryvnia
        VND: "₫", // Vietnamese Dong
      };
      var currency_name = response.billingAccountList[0].accountCurrencyUomId;
      if (currency_symbols[currency_name] !== undefined) {
        this.walletBalance =
          this.pstnBal = `${currency_symbols[currency_name]}  ${response.billingAccountList[0].balance}`;
      }
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
    },

    async submitFormData() {
      this.submitLoader = true;
      if (this.$refs.form.validate()) {
        if (this.message == "CREDIT") {
          try {
            let response = await dashboardAPI.creditDebitBalanceWallets({
              accountId: this.$route.query.accountId,
              amount: this.amount,
              authToken: localStorage.getItem("authNew"),
              billingAccountId: this.billingAccDetails.billingAccountId,
              partyId: this.$route.query.partyId,
              paymentMethodTypeId: this.paymentMethodTypeId,
              paymentStatus: this.message,
            });
            // console.log("success",response.responseMessage)
            if (response.responseMessage == "success") {
              this.submitLoader = false;
              this.dialog = false;
              await this.getBillingAccDetails();
              this.$refs.form.reset();
              this.seeSnackbar("Successfully Credited", "success");
              // }else if(response.responseMessage == "error"){
              //   console.log("error")
              //   this.seeSnackbar(response.messageDetail, "error");
              //   // this.$router.push("/login");
              // }
            }
          } catch (error) {
            this.submitLoader = false;
            if (error.data.messageDetail == "{message=invalid credentials}") {
              localStorage.clear();
              this.$router.push("/login");
            } else {
              this.$root.$emit("SHOW_SNACKBAR", {
                text: error.data.messageDetail,
                color: "error",
              });
            }
          }
        }
        if (this.message == "DEBIT") {
          this.submitLoader = true;
          try {
            let response = await dashboardAPI.creditDebitBalanceWallets({
              accountId: this.$route.query.accountId,
              amount: this.amount,
              authToken: localStorage.getItem("authNew"),
              billingAccountId: this.billingAccDetails.billingAccountId,
              partyId: this.$route.query.partyId,
              // paymentMethodTypeId: this.paymentMethodTypeId,
              paymentStatus: this.message,
            });
            if (response.responseMessage == "success") {
              this.submitLoader = false;
              await this.getBillingAccDetails();
              this.$refs.form.reset();
              this.dialog = false;
              this.seeSnackbar("Successfully Debited", "success");
            }
            // }else if(response.responseMessage == "error"){
            //   this.seeSnackbar(response.messageDetail, "error");
            //   // this.$router.push("/login");
            // }
          } catch (error) {
            this.submitLoader = false;
            if (error.data.messageDetail == "{message=invalid credentials}") {
              localStorage.clear();
              this.$router.push("/login");
            } else {
              this.$root.$emit("SHOW_SNACKBAR", {
                text: error.data.messageDetail,
                color: "error",
              });
            }
          }
        }
      } else {
        this.seeSnackbar("Correct the highlighted fields", "warning");
        this.submitLoader = false;
      }
    },

    back() {
      this.$router.go(-1);
    },

    async getPaymentMethod() {
      let response = await this.getMethod("getPaymentMethod");
      this.paymentMethodList = response.paymentMethodTypeList;
    },

    async creditDebitBalanceWallets() {},
  },
  async created() {
    await this.getBillingAccDetails();
    // await this.getMediaList();
  },
};
</script>
<style scoped>
.title {
  font-style: title text-weight-bold;
  text-align: center;
}
</style>