<template>
  <v-card class="mx-auto mt-5" max-width="700">
    <v-toolbar color="#3e6b96" dark>
      <v-toolbar-title>Order Details</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list
      subheader
      v-for="orderDetail in orderDetails"
      :key="orderDetail.itemId"
    >
      <v-list-item class="grey lighten-4">
        <v-list-item-content>
          <v-list-item-title>Name :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="orderDetail.itemId"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Quantity :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="orderDetail.quantity"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="grey lighten-4">
        <v-list-item-content>
          <v-list-item-title>Status :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="orderDetail.statusId"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Amount :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="orderDetail.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="error px-6 mt-4 mb-2" dark to="/billingAcc">Back</v-btn>
    </v-card-actions>
    <loading :active="isLoading" :loader="loader" />
  </v-card>
</template>

<script>
import billingAccountAPI from "@/services/billingAccountAPI.js";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";

export default {
  name: "orderCancel",
  components: {
    Loading,
  },
  data: () => ({
    orderDetails: [],
    loader: "bars",
    isLoading: false,
  }),
  mounted() {
    this.getCancelOrder();
  },
  methods: {
    async getCancelOrder() {
      this.isLoading = true;

      var getOrderId = localStorage.getItem("orderId");
      let odercancelData = {
        orderId: getOrderId,
      };
      try {
        let response = await billingAccountAPI.cancelPaypalOrder(
          odercancelData
        );
        if (response) {
          try {
            let response = await billingAccountAPI.getOrderDetails(
              odercancelData
            );
            this.isLoading = false;

            this.orderDetails = response.orderDetails.orderItemList;
          } catch (err) {
            this.isLoading = false;
          }
        }
      } catch (err) {
        this.isLoading = false;
      }
    },
  },
};
</script>