<template>
  <div>
    <v-data-table :headers="onHoldHeader" :items="onHoldData">
      <template v-slot:[`item.indexNo`]="{ item }">
        {{ onHoldData.indexOf(item) + 1 }}
      </template>
      <template v-slot:[`item.transactionDate`]="{ item }">
        {{ moment(item.transactionDate).format("MMMM Do YYYY, h:mm:ss a") }}
      </template>
      <template v-slot:[`item.paymentMethodId`]="{ item }">
        {{ item.paymentMethodId ? item.paymentMethodId : "PayPal" }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "onHoldDataTable",
  props: ["onHoldData"],
  data() {
    return {
      moment: moment,
      onHoldHeader: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "Reference Id",
          value: "referenceNum",
          align: "center",
          sortable: true,
        },
        {
          text: "Amount",
          value: "amount",
          align: "center",
          sortable: true,
        },
        {
          text: "Payment Method",
          value: "paymentMethodId",
          align: "center",
          sortable: true,
        },
        {
          text: "Payment Status",
          value: "paymentStatusId",
          align: "center",
          sortable: true,
        },
        {
          text: "Gateway Code",
          value: "gatewayCode",
          align: "center",
          sortable: true,
        },

        {
          text: "Transaction Date",
          value: "transactionDate",
          align: "center",
          sortable: true,
        },
      ],
    };
  },
};
</script>