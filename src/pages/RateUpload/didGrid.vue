<template>
  <v-card elevation="1" class="mt-10">
    <v-card-title style="text-transform: capitalize">{{
      type.replace("_", " ").toLowerCase()
    }}</v-card-title>
    <v-data-table
      :headers="headers"
      :items="didList"
      :options.sync="options"
      :server-items-length="totalItem"
    >
      <template v-slot:[`item.prefix`]="{ item }">
        {{ item.prefix }}
      </template>
      <template v-slot:[`item.name`]="{ item }">
        {{ item.geoName }}
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
        ${{ item.perMinCharge }}
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
      <!-- <tbody>
        <tr class="v-data-table__empty-wrapper">
          <td class="" colspan="6">No matching records found</td>
        </tr>
      </tbody> -->
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["didList", "getData", "type", "headers", "totalItem", "addToCart"],
  data() {
    return {
      options: {},
    };
  },
  watch: {
    options: {
      handler() {
        this.getData(this.type, this.options, this.totalItem);
      },
      deep: true,
    },
  },
};
</script>
