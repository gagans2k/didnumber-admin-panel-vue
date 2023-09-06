<template>
  <div>
    <v-data-table :headers="creditHeader" :items="creditDetails">
      <template v-slot:[`item.indexNo`]="{ item }">
        {{ creditDetails.indexOf(item) + 1 }}
      </template>
      <template v-slot:[`item.effectiveDate`]="{ item }">
        {{ moment(item.effectiveDate).format("MMMM Do YYYY, h:mm:ss a") }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "creditDetailsTable",
  props: ["creditDetails"],
  data() {
    return {
      moment: moment,
      creditHeader: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false,
        },

        {
          text: "Reference Id",
          value: "paymentId",
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
          value: "description",
          align: "center",
          sortable: true,
        },
        {
          text: "Transaction Date",
          value: "effectiveDate",
          align: "center",
          sortable: true,
        },
      ],
    };
  },
};
</script>