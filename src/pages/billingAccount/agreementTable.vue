<template>
  <div>
    <v-card class="elevation-1">
      <v-data-table
        :headers="header"
        :items="agreementData"
        :hide-default-footer="true"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "debitDetailsTable",
  props: ["agreementData"],
  data() {
    return {
      header: [
        {
          text: "Agreement Id",
          value: "agreementId",
          align: "center",
          sortable: false,
        },
        {
          text: "Threshold Amt",
          value: "thresholdAmt",
          align: "center",
          sortable: true,
        },
        {
          text: "Refill Amt ",
          value: "refillAmt",
          align: "center",
          sortable: true,
        },
      ],
    };
  },
};
</script>