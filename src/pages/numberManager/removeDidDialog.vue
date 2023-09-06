<template>
  <v-card elevation="1">
    <v-card-text class="px-3">
      <v-card-title class="black--text px-0"
        >Are you sure you want to remove slected services(s)?
      </v-card-title>
      <v-divider></v-divider>
      <!--number manager perticular data -->
      <v-card class="elevation-1" dense>
        <v-data-table
          :items="particularAssigningNumber"
          :headers="headers"
          hide-default-footer
        >
        </v-data-table>
      </v-card>

      <!-- Assigning Numbers Options -->
      <v-radio-group
        v-model="selectOption"
        @change="getSelectOption"
        class="mt-4 py-3"
      >
        <v-radio value="Immediate">
          <template v-slot:label>
            <div class="black--text">Immediate service removal</div>
          </template>
        </v-radio>
        <v-radio value="Duckduckgo">
          <template v-slot:label>
            <div class="black--text">Delayed Service removal</div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-spacer></v-spacer>
      <v-btn color="error lighten-2" outlined class="px-4" dark> Close </v-btn>
      <v-btn class="px-4 ml-4 primary-btn" outlined dark> Submit </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["particularAssigningNumber"],
  data() {
    return {
      userDetail: {
        showAssigningNumberDialog: false,
      },
      selectOption: "Immediate",
      headers: [
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
          text: "Order Id",
          value: "orderId",
          align: "center",
          sortable: true,
        },
      ],
    };
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
    getSelectOption() {},
  },
};
</script>