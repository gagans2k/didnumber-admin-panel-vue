<template>
  <div>
    <v-card elevation="1">
      <v-data-table :headers="headers" :items="rateDetail">
        <template v-slot:[`item.direction`]="{ item }">
          <span v-for="(direction, i) in item.direction" :key="i">{{
            direction
          }}</span>
        </template>
      </v-data-table>
      <loading :active="isLoading" :loader="loader" />
    </v-card>
  </div>
</template>

<script>
import rateAPI from "@/services/rateAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      moment: moment,
      rateDetail: [],
      imformatoryText: "",
      inventoryItemId: "",
      isLoading: false,
      //fullPage: false,
      loader: "bars",
      headers: [
        {
          text: "Description",
          value: "description",
          align: "center",
          sortable: false,
        },
        {
          text: "Direction",
          value: "direction",
          align: "center",
          sortable: false,
        },
        {
          text: "Id",
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: "ISO Code",
          value: "iso_country_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Prefix",
          value: "prefix",
          align: "center",
          sortable: false,
        },
        {
          text: "Rate Cost",
          value: "rate_cost",
          align: "center",
          sortable: false,
        },
        {
          text: "Rate Increment",
          value: "rate_increment",
          align: "center",
          sortable: false,
        },
        {
          text: "Rate Minimum",
          value: "rate_minimum",
          align: "center",
          sortable: false,
        },
      ],

      showDialog: false,

      imageName: "",
      imageUrl: "",
      imageFile: "",
      type: "",
    };
  },

  methods: {
    async getRateDetail() {
      this.isLoading = true;
      try {
        let response = await rateAPI.getRateDetail(this.$route.params.rateId);
        this.isLoading = false;
        this.rateDetail.push(response.rateDetails.data);
      } catch (error) {
        this.isLoading = false;
      }
    },

    capitalizeText(str) {
      str = str.replace("_", " ").toLowerCase();
      str = str.split(" ");
      let newStr = "";
      for (let text of str) {
        text = text.charAt(0).toUpperCase() + text.slice(1);
        newStr += ` ${text}`;
      }

      return newStr;
    },
  },

  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getRateDetail();
  },
};
</script>