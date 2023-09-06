<template>
  <div>
    <v-data-table :headers="debitHeader" :items="debitDetails">
      <template v-slot:[`item.indexNo`]="{ item }">
        {{ debitDetails.indexOf(item) + 1 }}
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ moment(item.date).format("MMMM Do YYYY, h:mm:ss a") }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "debitDetailsTable",
  props: ["debitDetails"],
  data() {
    return {
      moment: moment,
      debitHeader: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "Reference Id	",
          value: "referenceId",
          align: "center",
          sortable: true,
        },
        {
          text: "Order Payment Preference Id",
          value: "orderPaymentPreferenceId",
          align: "center",
          sortable: true,
        },
        {
          text: "Amount",
          value: "maxAmount",
          align: "center",
          sortable: true,
        },
        {
          text: "Transaction Date",
          value: "date",
          align: "center",
          sortable: true,
        },
      ],
    };
  },
};
</script>