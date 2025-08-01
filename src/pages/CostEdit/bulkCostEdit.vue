<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      >{{ snackbarMessage }}</v-snackbar
    >
    <!-- LOADER -->
    <v-card elevation="1">
      <v-card-actions class="py-1">
        <v-spacer></v-spacer>
        <v-col lg="3" md="2">
          <v-autocomplete
            label="Country"
            :items="countryDataList"
            item-text="name"
            item-value="code"
            append-icon="place"
            clearable
            outlined
            dense
            v-model="bulkEdit.facilityName"
            @change="getCountryCities(bulkEdit.facilityName)"
          ></v-autocomplete>
        </v-col>
        <v-col lg="2" md="2">
          <v-autocomplete
            label="City"
            :items="cityDataList"
            item-text="name"
            item-value="code"
            append-icon="location_city"
            clearable
            outlined
            dense
            v-model="bulkEdit.geoName"
            @change="getCities(bulkEdit.geoName)"
          ></v-autocomplete>
        </v-col>
        <v-col lg="2" md="2">
          <v-btn
            style="margin: -25px 0px 0px 15px"
            width="85%"
            height="40px"
            color="primary"
            dense
            dark
            large
            @click="findData()"
            >Search</v-btn
          > </v-col
        ><br />
        <v-col lg="3" md="2">
          <v-text-field
            v-model="unitCost"
            label="Enter Amount"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col lg="3" md="2">
          <v-btn
            style="margin: -25px 0px 0px 15px"
            color="primary"
            height="40px"
            dense
            dark
            large
            @click="editUnitCostBulk(unitCost)"
            >BULK COST EDIT</v-btn
          >
        </v-col>
      </v-card-actions>
      <v-dialog v-model="dialogEdit" max-width="400px">
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title>Edit Price</v-card-title>
            <v-card-text>
              <!-- <v-container> -->
              <v-row>
                <!-- name -->
                <v-col cols="12">
                  <v-text-field
                    label="Price"
                    v-model="edit.unitCost"
                    :rules="nameRules"
                    append-icon="attach_money"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- </v-container> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancelCost">
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="!valid"
                @click="updateCost()"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <loading :active="isLoading" :loader="loader" />
      <v-data-table
        :headers="headers"
        :items="costListData"
        :sort-by="['prefix', 'description', 'cost']"
        :options.sync="options"
        :footer-props="{
          'items-per-page-options': [10, 20, 30],
        }"
      >
        <template v-slot:[`item.indexNo`]="{ item }">
          {{ costListData.indexOf(item) + 1 }}
        </template>
        <template v-slot:[`item.viewAction`]="{ item }">
          <v-btn
            color="secondary"
            outlined
            medium
            dense
            @click="updateInventory(item, countryDataList.facilityGeoId)"
            >Edit</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import "@/assets/vue-loading.css";
import AllApiCalls from "@/services/AllApiCalls";
import rateAPI from "@/services/rateAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      //fullPage: false,
      loader: "bars",
      facilityGetId: "",
      valid: true,
      bulkEdit: {
        costEditUpdate: "",
      },
      edit: {
        unitCost: "",
        facilityId: "",
        inventoryItemId: "",
        serialNumber: "",
      },
      nameRules: [(v) => !!v || "Price is required"],
      unitCost: "",
      dialogEdit: false,
      costListData: [],
      countryDataList: [],
      cityDataList: [],
      facilityId: "",
      facilityGeoId: "",
      productId: "",
      cityGeoId: "",
      search: "",
      searchText: "",
      searchType: "",
      searchCountry: "",
      searchCont: "",
      isoCountryCode: "",
      isoCityGeoData: "",
      geoIDName: "",
      city: "",
      moment: moment,
      options: {},
      totalRateList: 0,
      headers: [
        {
          text: "S.No",
          value: "indexNo",
        },
        {
          text: "DID Number	",
          value: "didNumber",
          align: "center",
          sortable: true,
        },
        {
          text: "Price($)",
          value: "price",
          align: "center",
          sortable: true,
        },
        {
          text: "Action",
          value: "viewAction",
          align: "center",
        },
      ],
      rateList: [],
    };
  },

  watch: {
    options: {
      handler() {
        this.getFacilityGeoList();
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    async getFacilityGeoList() {
      let response = await this.getMethod("getFacilityGeoList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.isoCountryCode = response.countryList;
      response.countryList.forEach((currentValue, index, arr) => {
        this.countryDataList.push(currentValue.facilityName);
      });
    },

    async getCountryCities(cityGeoId) {
      let result = await this.getMethod("getFacilityGeoList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.isoCountryCode = result.countryList;
      result.countryList.forEach((currentValue, index, arr) => {
        var getGeoId = JSON.stringify(currentValue.facilityName).replace(
          /['"]+/g,
          ""
        );
        if (cityGeoId == getGeoId) {
          this.facilityGetId = currentValue.facilityGeoId;
        } else if (cityGeoId == undefined) {
          this.cityGeoId = "";
          this.facilityGetId = "";
        }
      });
      let response = await this.getMethod("getCountryCities", {
        countryGeoId: this.facilityGetId,
      });
      this.findData();
      this.isoCityGeoData = response.cityList;
      this.isoCountryCode.forEach((checkCountryData, index, arr) => {
        var facilityGeoIdName = JSON.stringify(
          checkCountryData.facilityName
        ).replace(/['"]+/g, "");
        // console.log(cityGeoId,facilityGeoIdName)
        if (cityGeoId == facilityGeoIdName) {
          this.facilityGeoId = this.facilityGetId;
          this.facilityId = checkCountryData.facilityId;
        }
      });
      response.cityList.forEach((currentValue, index, arr) => {
        this.cityDataList.push(currentValue.geoName);
      });
    },

    getCities(cityGeoId) {
      this.geoIDName = cityGeoId;
      this.isoCityGeoData.forEach((checkCityData, index, arr) => {
        if (cityGeoId == checkCityData.geoName) {
          this.cityGeoId = checkCityData.geoId;
          // this.productId = 'GEOGRAPHIC_DID';
        } else if (cityGeoId == undefined) {
          this.cityGeoId = "";
        }
      });
      this.findData();
    },

    async findData() {
      this.isLoading = true;
      var jsonData = {
        productId: "GEOGRAPHIC_DID",
      };

      if (this.cityGeoId) {
        jsonData.cityGeoId = this.cityGeoId;
        jsonData.facilityId = this.facilityId;
      } else {
        delete jsonData.facilityId;
      }

      if (this.facilityGetId) {
        jsonData.facilityGeoId = this.facilityGetId;
      } else {
        this.bulkEdit.geoName = "";
      }

      let response = await this.getMethod("getNumberList", jsonData);
      if (response.responseMessage === "success") {
        this.costListData = response.numberList;
        this.isLoading = false;
      }
    },

    searchByText() {
      if (/^[a-zA-Z]+$/.test(this.searchText)) {
      } else {
        this.searchType = "prefix";
      }
      //this.getRateList();
    },

    async editUnitCostBulk(unitCost) {
      if (!unitCost) {
        this.seeSnackbar("Please add the amount", "error");
      } else {
        this.isLoading = true;
        let response = await this.getMethod("editUnitCostBulk", {
          facilityId: this.facilityId,
          cityGeoId: this.cityGeoId,
          unitCost: unitCost,
        });
        if (response.responseMessage === "success") {
          this.isLoading = false;
          this.unitCost = "";
          this.seeSnackbar("Price updated successfully", "success");
          this.findData();
        }
      }
    },

    async updateInventory(item, countryID) {
      this.dialogEdit = true;
      this.edit.unitCost = item.price;
      this.edit.inventoryItemId = item.inventoryItemId;
      this.edit.didNumber = item.didNumber;
    },

    cancelCost() {
      this.dialogEdit = false;
    },

    async updateCost() {
      var updateCost = {
        facilityId: this.facilityId,
        productId: "GEOGRAPHIC_DID",
        inventoryItemId: this.edit.inventoryItemId,
        inventoryItemTypeId: "SERIALIZED_INV_ITEM",
        serialNumber: this.edit.didNumber,
        unitCost: this.edit.unitCost,
        statusId: "INV_AVAILABLE",
      };
      try {
        // console.log(updateCost)
        let response = await rateAPI.updateInventory(updateCost);
        if (response.responseMessage === "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Price updated successfully",
            color: "success",
          });
          // this.seeSnackbar("Price updated successfully","success")
          this.isLoading = false;
          this.dialogEdit = false;
          this.findData();
        }
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
};
</script>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}
</style>
