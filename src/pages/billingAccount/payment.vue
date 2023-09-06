<template>
  <div>
    <v-card flat>
      <v-col cols="12" lg="12" class="pl-12">
        <v-row>
          <v-radio-group v-model="radios" mandatory>
            <v-radio color="success" value="radio-1"></v-radio>
          </v-radio-group>
          <img
            src="@/assets/images/paypal-icon.png"
            width="120"
            height="50"
            class="mt-2"
            alt="paypal"
          />
        </v-row>
      </v-col>
      <v-col cols="12" lg="12" class="pa-12">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" lg="3" md="4">
              <v-text-field
                append-icon="monetization_on"
                label="Available wallet Balance"
                v-model="payment.balance"
                type="text"
                outlined
                dense
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="3" md="4">
              <v-text-field
                append-icon="account_balance_wallet"
                label="Enter Amount"
                v-model="payment.price"
                :rules="amountRules"
                outlined
                dense
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="2" md="2">
              <v-card-actions class="py-0">
                <v-spacer></v-spacer>
                <v-btn
                  @click="submitAmount"
                  class="mt-2 myTitle text-capitalize primary-btn"
                  block
                  outlined
                  large
                  dark
                >
                  Make Payment
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-card>
    <loading :active="isLoading" :loader="loader" />
  </div>
</template>


<script>
import billingAccountAPI from "@/services/billingAccountAPI.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "billingAcc",
  components: {
    Loading,
  },
  data() {
    return {
      valid: true,
      notification: true,
      topUp: false,
      showTopUp: false,
      payment: {},
      radios: null,
      loader: "bars",
      isLoading: false,
      amountRules: [(v) => !!v || "Amount is required"],
    };
  },
  mounted() {
    // this.getBilling();
    this.payment.balance = localStorage.getItem("getBalance");
  },
  methods: {
    async submitAmount() {
      if (this.payment.price < 5) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Add more than 5",
          color: "error",
        });
      } else {
        if (this.$refs.form.validate()) {
          this.isLoading = true;
          let paymentData = {
            checkOutPaymentId: "EXT_PAYPAL",
            price: this.payment.price,
            shippingMethod: "NO_SHIPPING@_NA_",
          };
          try {
            let response = await billingAccountAPI.addAmountToCart(paymentData);
            if (response.orderId) {
              localStorage.setItem("orderId", response.orderId);
              var orderIdData = {
                orderId: response.orderId,
              };
              let responseCallPayPalData = await billingAccountAPI.callPayPalEvent(
                orderIdData
              );
              if (responseCallPayPalData.redirectString) {
                this.isLoading = true;
                location.href = responseCallPayPalData.redirectString;
              }
            }
          } catch (err) {
            this.isLoading = false;
          }
        }
      }
    },
  },
};
</script>