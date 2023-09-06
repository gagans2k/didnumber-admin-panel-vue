<template>
  <v-card elevation="1" class="mt-5">
    <v-card-title>Toll Free</v-card-title>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="tollFreeDIDList"
      :options.sync="options"
      :server-items-length="totalItem"
    >
      <template v-slot:[`item.prefix`]="{ item }">
        {{ item.prefix }}
      </template>
      <template v-slot:[`item.name`]="{ item }">
        {{ item.didType ? "Toll Free" : item.didType }}
      </template>
      <template v-slot:[`item.endUserRegistration`]="{ item }">
        {{ item.wellKnownText ? "Required" : "Not Required" }}
        <v-tooltip top v-if="item.wellKnownText" max-width="400">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="black"> info </v-icon>
            </v-btn>
          </template>
          <span v-html="item.wellKnownText"></span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.voice`]>
        <v-avatar color="success" size="20"></v-avatar>
      </template>
      <template v-slot:[`item.noOfChannels`]="{ item }">
        {{ item.noOfChannels }}
      </template>
      <template v-slot:[`item.perMinCharge`]="{ item }">
        ${{ item.perMinChargeMobile }}
        <v-tooltip top class="px-0 mx-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="black"> info </v-icon>
            </v-btn>
          </template>
          <table id="myTable" class="white black--text">
            <tr>
              <th>Source</th>
              <th>Cost</th>
            </tr>
            <tr>
              <td>Fixed</td>
              <td>$ {{ item.perMinChargeFixed }}</td>
            </tr>
            <tr>
              <td>Mobile</td>
              <td>$ {{ item.perMinChargeMobile }}</td>
            </tr>
            <tr>
              <td>Payphone</td>
              <td>$ {{ item.perMinChargePayphone }}</td>
            </tr>
          </table>
        </v-tooltip>
      </template>
      <template v-slot:[`item.setupCost`]="{ item }">
        ${{ item.setupCost }}
      </template>
      <template v-slot:[`item.price`]="{ item }"> ${{ item.price }} </template>
      <template v-slot:[`item.quantity`]="{ item }">
        <v-text-field
          type="number"
          v-model="item.quantity"
          min="1"
          autocomplete="off"
          filled
          class="pt-3"
        ></v-text-field>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          @click="addToCart(item)"
          :disabled="!item.quantity"
          color="black"
          >shopping_cart</v-icon
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["tollFreeDIDList", "getData", "headers", "totalItem", "addToCart"],
  data() {
    return {
      options: {},
    };
  },
  watch: {
    options: {
      handler() {
        this.getData("TOLL_FREE", this.options);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#myTable {
  border: 1px solid black;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
}
#myTable td {
  border: 1px solid black;
  padding: 5px;
}
</style>