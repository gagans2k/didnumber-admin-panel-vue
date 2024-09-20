<template>
  <div>
    <v-card elevation="1" :loading="filterCardLoader">
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="3">
            <v-autocomplete
              :items="facilityGeoList"
              v-model.trim="purchaseDidData.facility"
              item-text="facilityName"
              item-value="facilityGeoId"
              label="Country"
              return-object
              @change="getStateList(), getDidTypeCount(true)"
              outlined
              dense
              required
              class="pb-0 mb-0"
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" lg="3">
            <v-text-field
              append-icon="search"
              label="City/Prefix"
              v-if="showCity"
              v-model="searchText"
              @keyup="searchByText"
              outlined
              class="pb-0 mb-0"
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" lg="3">
            <v-select
              :items="stateData"
              v-model.trim="purchaseDidData.state"
              item-text="geoName"
              item-value="geoId"
              label="State"
              v-if="showState"
              @change="getDidTypeCount(false)"
              outlined
              dense
              class="pb-0 mb-0"
            ></v-select
          ></v-col>
        </v-row>
        <v-col cols="12" class="pt-0 mt-0" v-if="showCity">
          <v-row>
            <v-checkbox
              v-model="selectedType"
              label="Toll Free"
              value="TOLL_FREE"
              class="pt-2 mt-0"
            ></v-checkbox>
            <v-checkbox
              v-model="selectedType"
              label="National"
              value="NATIONAL_DID"
              class="pl-3 pt-2 mt-0"
            ></v-checkbox>
            <v-checkbox
              v-model="selectedType"
              label="Local"
              value="LOCAL_DID"
              class="pl-3 pt-2 mt-0"
            ></v-checkbox>
            <v-checkbox
              v-model="selectedType"
              label="Shared Cost"
              value="SHARED_COST"
              class="pl-3 pt-2 mt-0"
            ></v-checkbox>
            <v-checkbox
              v-model="selectedType"
              label="Mobile Did"
              value="MOBILE_DID"
              class="pl-3 pt-2 mt-0"
            ></v-checkbox>
            <v-checkbox
              v-model="selectedType"
              label="Virtual Pri"
              value="VIRTUAL_PRI"
              class="pl-3 pt-2 mt-0"
            ></v-checkbox>
            <v-btn
              outlined
              color="info"
              @click="getDidTypeCount(true)"
              dark
              class="ml-md-3 pt-0 mt-0"
              >Filter</v-btn
            >
            <v-spacer></v-spacer>
            <div>
              <v-btn
                class="mt-1 myTitle text-capitalize"
                color="green"
                outlined
                dark
                @click="checkJsonData"
              >
                <v-icon light class="mr-2">cloud_download</v-icon>
                Download
              </v-btn>
            </div>
          </v-row>
        </v-col>
      </v-container>
    </v-card>
    <loading :active="isLoading" :loader="loader" />
    <!-- v-if="tollFreeDIDList.length > 0" -->
    <div v-for="[type, item] of Object.entries(tollFreeData)" :key="type">
      <tollfree-grid
        :tollFreeDIDList="item.data"
        :getData="getCountryTollfreeListFuc"
        :headers="headers"
        :type="type"
        :totalItem="item.size"
        :addToCart="addToCart"
        :enableDisableStatus="enableDisableStatus"
      ></tollfree-grid>
    </div>

    <div v-for="[type, item] of Object.entries(DIDData)" :key="type">
      <did-grid
        :didList="item.data"
        :getData="getCountryCityListFuc"
        :headers="headers"
        :type="type"
        :totalItem="item.size"
        :addToCart="addToCart"
        :enableDisableStatus="enableDisableStatus"
      ></did-grid>
    </div>
  </div>
</template>

<script>
import purchasedidAPI from "@/services/purchasedidAPI.js";
import orderAPI from "@/services/orderAPI.js";
import tollfreeGird from "./tollFreeGrid";
import didGrid from "./didGrid";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import AllApiCalls from "../../services/AllApiCalls";
export default {
  mixins: [AllApiCalls],
  components: {
    tollfreeGrid: tollfreeGird,
    didGrid: didGrid,
    Loading,
  },
  data() {
    return {
      purchaseDidData: {},
      stateData: [],
      facilityGeoList: [],
      DIDTypes: [],
      tollFreeDIDList: [],
      tollFreeTotalItem: 0,
      tollFreeData: {},
      DIDData: {},
      showState: false,
      showCity: false,
      searchText: "",
      searchType: "",
      isLoading: false,
      //fullPage: false,
      loader: "bars",
      // loading: false,
      selectedType: [],
      isAdminUser: "",
      getCsvData: [],
      headers: [
        {
          text: "Prefix",
          value: "prefix",
          sortable: false,
        },
        {
          text: "Name",
          value: "name",
          align: "center",
          sortable: false,
        },
        {
          text: "Registration",
          value: "endUserRegistration",
          align: "center",
          sortable: false,
        },
        {
          text: "Voice",
          value: "voiceIn",
          align: "center",
          sortable: false,
        },
        {
          text: "T.38",
          value: "t38Fax",
          align: "center",
          sortable: false,
        },
        {
          text: "SMS IN",
          value: "smsIn",
          align: "center",
          sortable: false,
        },
        {
          text: "SMS OUT",
          value: "smsOutP2P",
          align: "center",
          sortable: false,
        },
        {
          text: "Emergency",
          value: "emergency",
          align: "center",
          sortable: false,
        },
        {
          text: "CNAM OUT",
          value: "cnamOut",
          align: "center",
          sortable: false,
        },
        {
          text: "Rate Per Minute",
          value: "perMinCharge",
          align: "center",
          sortable: false,
        },
        {
          text: "Setup",
          value: "setupCost",
          align: "center",
          sortable: false,
        },
        {
          text: "Monthly",
          value: "price",
          align: "center",
          sortable: false,
        },
        {
          text: "Action",
          value: "enable",
          align: "center",
          sortable: false,
        },
        {
          text: "Created",
          value: "createdStamp",
          align: "center",
          sortable: false,
        },
        {
          text: "Last Updated",
          value: "lastUpdatedStamp",
          align: "center",
          sortable: false,
        },
      ],
      filterCardLoader: false,
    };
  },

  watch: {
    tollFreeOptions: {
      handler() {
        this.getOrderList();
      },
      deep: true,
    },
  },

  methods: {
    async getFacilityGeoList() {
      this.isLoading = true;
      try {
        let response = await purchasedidAPI.getFacilityGeoList();
        this.isLoading = false;
        this.facilityGeoList = response.countryList;
        // console.log("this.facilityGeoList", this.facilityGeoList);
      } catch (error) {
        this.isLoading = true;
        console.log("====error===", error);
      }
    },

    async getStateList() {
      this.isLoading = true;
      try {
        this.showState = false;
        this.showCity = true;
        let selectedCountry = this.purchaseDidData.facility;
        if (selectedCountry.requireState === "N") return;
        this.showState = true;
        let response = await purchasedidAPI.getStateList(
          selectedCountry.facilityGeoId
        );
        this.stateData = response.stateList;
        this.isLoading = false;
      } catch (error) {
        console.log("===error===", error);
        this.isLoading = false;
      }
    },

    async getDidTypeCount(check) {
      this.isLoading = true;
      try {
        let data = {
          ...(check
            ? { countryGeoId: this.purchaseDidData.facility.facilityGeoId }
            : { stateGeoId: this.purchaseDidData.state }),
          requireState: this.purchaseDidData.facility.requireState,
        };
        let response = await purchasedidAPI.getDidTypeCount(data);
        this.isLoading = false;
        if (this.selectedType.length === 0) {
          this.DIDTypes = response.availableDidType;
        } else {
          this.DIDTypes = this.selectedType;
        }
        this.getAllDIDs();
      } catch (error) {
        this.isLoading = false;
        console.log("===error===", error);
      }
    },

    async getAllDIDs() {
      this.filterCardLoader = true;
      this.DIDData = {};
      this.tollFreeDIDList = [];
      this.tollFreeTotalItem = 0;
      this.tollFreeData = {};
      for (let DIDType of this.DIDTypes) {
        if (DIDType === "TOLL_FREE") {
          this.getCountryTollfreeListFuc("TOLL_FREE");
        } else if (DIDType === "SHARED_COST") {
          this.getCountryTollfreeListFuc("SHARED_COST");
        } else {
          this.getCountryCityListFuc(DIDType);
        }
      }
    },

    async getCountryCityListFuc(
      type,
      options = { page: 1, itemsPerPage: 10 },
      totalItem
    ) {
      const { page, itemsPerPage } = options;
      let size = itemsPerPage;
      if (size === -1) size = totalItem;
      try {
        let data = {
          countryGeoId: this.purchaseDidData.facility.facilityGeoId,
          didType: type,
          searchText: this.searchText,
          searchType: this.searchType,
          isAdminUser: "true",
        };
        let response = {};
        response = await purchasedidAPI.getCountryCityListAPi(data, page, size);
        this.DIDData[type] = {
          size: response.listSize,
          data: response.cityList,
        };
        this.filterCardLoader = false;
        this.DIDData[type].data = this.DIDData[type].data.map((item) => {
          item.quantity = 1;
          return item;
        });
        this.$forceUpdate();
      } catch (error) {
        console.log("===error===", error);
      }
    },

    async getCountryTollfreeListFuc(
      type,
      options = { page: 1, itemsPerPage: 10 }
    ) {
      const { page, itemsPerPage } = options;
      let size = itemsPerPage;
      if (size === -1) size = totalItem;
      try {
        let tollFreeData = {
          didType: type,
          facilityGeoId: this.purchaseDidData.facility.facilityGeoId,
          searchText: this.searchText,
          searchType: this.searchType,
          isAdminUser: "true",
        };
        let response = {};
        response = await purchasedidAPI.getCountryTollfreeListApi(
          tollFreeData,
          page,
          size
        );
        response.tollFreeList.forEach((element) => {
          localStorage.setItem("selectedGeoID", element.geoId);
        });
        this.filterCardLoader = false;
        // this.tollFreeDIDList = response.tollFreeList;
        // this.tollFreeDIDList = this.tollFreeDIDList.map((item) => {
        //   item.quantity = 1;
        //   return item;
        // });
        this.tollFreeData[type] = {
          size: response.listSize,
          data: response.tollFreeList,
        };
        this.filterCardLoader = false;
        this.tollFreeData[type].data = this.tollFreeData[type].data.map(
          (item) => {
            item.quantity = 1;
            return item;
          }
        );
        // console.log("this.tollFreeData[", this.tollFreeData);
        this.$forceUpdate();
        // this.tollFreeTotalItem = response.listSize;
      } catch (error) {
        console.log("===error===", error);
      }
    },

    async addToCart(item) {
      // For Date start
      var currentdate = new Date();
      // for reservEnd
      var datetime =
        currentdate.getFullYear() +
        1 +
        "-" +
        (currentdate.getMonth() + 1, 1) +
        "-" +
        currentdate.getDate() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      // for reservStart date
      var reservEnd =
        currentdate.getFullYear() +
        "-" +
        (currentdate.getMonth() + 1) +
        "-" +
        currentdate.getDate() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      // console.log("datetime",datetime)
      // console.log("reservEnd",reservEnd)
      this.isLoading = true;
      let cartData = {
        quantity: item.quantity,
        productId: "GEOGRAPHIC_DID",
        stateGeoId: this.purchaseDidData.state || null,
        areaCode: item.prefix,
        noOfChannels: item.noOfChannels,
        countryName: this.purchaseDidData.facility.facilityName,
        perMinCharge: item.perMinChargeFixed,
        regionGeoId: { ...this.purchaseDidData.facility },
        facilityId: this.purchaseDidData.facility.facilityId,
        facilityGeoId: this.purchaseDidData.facility.facilityGeoId,
        productStoreId: "DIDNPBX",
        reservStart: reservEnd,
        reservEnd: datetime,
        cityGeoId: this.getModifyDIDType(item.didType) ? item.geoId : null,
        didType: this.getModifyDIDType(item.didType)
          ? this.getModifyDIDType(item.didType)
          : item.didType,
        setupCost: item.setupCost,
        unitCost: item.price,
      };
      let userDetail = JSON.parse(localStorage.getItem("userDetail"));
      let paramsData = {
        sessionId: localStorage.getItem("sessionId"),
        accountId: userDetail.accountId,
      };
      this.isLoading = false;
      try {
        await purchasedidAPI.addToCart(cartData, paramsData);
        this.$root.$emit("MODIFY_CART", {
          quantity: item.quantity,
        });
        this.$router.push("/shoppingcart");
      } catch (err) {
        this.isLoading = false;
        console.log("===err===", err);
      }
    },

    async enableDisableStatus(message, item) {
      this.isLoading = true; // Start loading indicator
      let response;
      console.log("message: " + message);

      if (message === "disabled") {
        response = await this.postMethod("disableStatus", {
          enable: "N",
          geoId: item.geoId,
          geoCode: item.prefix,
          didType: item.didType,
        });
      } else if (message === "enabled") {
        response = await this.postMethod("disableStatus", {
          enable: "Y",
          geoId: item.geoId,
          geoCode: item.prefix,
          didType: item.didType,
        });
      }
      // Handle API response and stop loading indicator
      if (response && response.responseMessage === "success") {
        await this.getDidTypeCount(true);
      }
      this.isLoading = false;
    },

    async checkJsonData() {
      // Await the exportLog to ensure the data is fetched before proceeding
      await this.exportLog();

      console.log("this.getCsvData", this.getCsvData.length);

      if (this.getCsvData.length === 0) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "No Data Available!",
          color: "warning",
        });
      } else {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Data Available. Preparing download...",
          color: "success",
        });
        this.downloadCSV();
      }
    },

    downloadCSV() {
      const csvData = this.getCsvData;
      const csvContent = [
        Object.keys(csvData[0]).join(","), // headers
        ...csvData.map((row) => Object.values(row).join(",")), // rows
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "country.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async exportLog() {
      try {
        this.isLoading = true;
        this.getCsvData = []; // Clear previous data
        const data = {
          countryGeoId: this.purchaseDidData.facility.facilityGeoId,
          stateGeoId: this.purchaseDidData.state,
          requireState: this.purchaseDidData.facility.requireState,
        };

        const response = await purchasedidAPI.getCountryExportLogData(data);

        if (response) {
          const lines = response.split("\n");
          const headers = lines[0].split(",");

          // Iterate over the lines and construct the CSV data
          for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
            }

            // Only push valid entries into getCsvData
            if (obj.countryGeoId) {
              this.getCsvData.push(obj);
              this.getCsvData = [...this.getCsvData]; // Force Vue.js to rebind
            }
          }

          console.log("this.getCsvData", this.getCsvData);
          console.log("CSV Data length:", this.getCsvData.length);

          if (!this.getCsvData.length) {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "No valid data available for download.",
              color: "warning",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching CSV data:", error);
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Failed to download data!",
          color: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },

    getModifyDIDType(didType) {
      let nonModifyDIDs = ["TOLL_FREE", "SHARED_COST"];
      if (!nonModifyDIDs.includes(didType)) {
        return `${didType}_DID`;
      }
      return null;
    },

    formatDate(date, shouldIncreamentMonth) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (!shouldIncreamentMonth) {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      date.setMonth(month + 1);
      month = date.getMonth();
      if (month === 0) month = 12;
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    searchByText() {
      if (/^[a-zA-Z]+$/.test(this.searchText)) {
        this.searchType = "cityName";
      } else {
        this.searchType = "prefix";
      }
      this.getAllDIDs();
    },
  },

  mounted() {
    this.getFacilityGeoList();
  },
};
</script>

<style scoped></style>
