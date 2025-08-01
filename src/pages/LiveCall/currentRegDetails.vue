<template>
  <div>
    <v-dialog v-model="showDialog" max-width="2000px" persistent> </v-dialog>

    <div>
      <v-row>
        <v-col lg="2" md="4" sm="12" cols="12">
          <v-btn class="mx-2" fab small dark color="blue" to="/ratelist">
            <v-icon> keyboard_backspace </v-icon>
          </v-btn>
          <loading :active="isLoading" :loader="loader" />
        </v-col>
        <v-col lg="8" md="8" sm="12" cols="12">
          <v-card>
            <v-card-title style="background-color: blue; color: white"
              >Rate List Details</v-card-title
            >
            <v-row>
              <v-col lg="6" md="6" sm="12">
                <v-card-subtitle> <b>Description :</b> </v-card-subtitle>
                <v-card-subtitle> <b>Direction :</b> </v-card-subtitle>
                <v-card-subtitle> <b>Id :</b> </v-card-subtitle>
                <v-card-subtitle> <b>ISO Code:</b> </v-card-subtitle>
                <v-card-subtitle> <b>Prefix :</b> </v-card-subtitle>
                <v-card-subtitle> <b>Rate Cost :</b> </v-card-subtitle>
                <v-card-subtitle> <b>Rate Increment :</b> </v-card-subtitle>
                <v-card-subtitle> <b>Rate Minimum :</b> </v-card-subtitle>
              </v-col>

              <v-col lg="6" md="6" sm="12">
                <v-card-subtitle>
                  {{ rateDetail.description }}
                </v-card-subtitle>
                <v-card-subtitle
                  v-for="DynamicValue in rateDetail.direction"
                  :key="DynamicValue"
                >
                  {{ DynamicValue }}
                </v-card-subtitle>
                <v-card-subtitle>
                  {{ rateDetail.id }}
                </v-card-subtitle>
                <v-card-subtitle>
                  {{ rateDetail.iso_country_code }}
                </v-card-subtitle>
                <v-card-subtitle>
                  {{ rateDetail.prefix }}
                </v-card-subtitle>
                <v-card-subtitle>
                  {{ rateDetail.rate_cost }}
                </v-card-subtitle>
                <v-card-subtitle>
                  {{ rateDetail.rate_increment }}
                </v-card-subtitle>
                <v-card-subtitle>
                  {{ rateDetail.rate_minimum }}
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import rateAPI from "@/services/rateAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      moment: moment,
      rateDetail: {},
      rateDetailList: [],
      imformatoryText: "",
      inventoryItemId: "",
      isLoading: false,
      //fullPage: false,
      loader: "bars",
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
        this.rateDetail = response.rateDetails.data;
        this.rateDetailList = response.rateDetails.data;
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


