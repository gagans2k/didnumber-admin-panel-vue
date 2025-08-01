<template>
  <div>
    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      >{{ snackbarMessage }}</v-snackbar
    >
    <v-card>
      <v-row justify="end">
        <v-btn color="primary" class="ma-2" dark @click="dialog = true">
          BULK RECEIVE
        </v-btn>
        <v-dialog
          @click:outside="closeDialog"
          :value="dialog"
          max-width="450px"
        >
          <v-card
            @drop.prevent="onDrop($event)"
            @dragover.prevent="dragover = true"
            @dragenter.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
            :class="{ 'grey lighten-2': dragover }"
          >
            <v-card-text>
              <v-row
                class="d-flex flex-column"
                dense
                align="center"
                justify="center"
              >
                <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
                  mdi-cloud-upload
                </v-icon>
                <p>Drop your file(s) here, or click to select them.</p>
              </v-row>
              <v-virtual-scroll
                v-if="uploadedFiles.length > 0"
                :items="uploadedFiles"
                height="150"
                item-height="50"
              >
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.name">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                        <span class="ml-3 text--secondary">
                          {{ item.size }} bytes</span
                        >
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn @click.stop="removeFile(item.name)" icon>
                        <v-icon> mdi-close-circle </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>

                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn @click="closeDialog" icon>
                <v-icon id="close-button">mdi-close</v-icon>
              </v-btn>

              <v-btn icon @click.stop="submit">
                <v-icon id="upload-button">mdi-upload</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <v-form ref="form" v-model="valid" lazy-validation>
        <loading :active="isLoading" :loader="loader" />
        <v-row>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :items="countryDataList"
              v-model="profileData.countryDataList"
              @change="getCityList(profileData.countryDataList)"
              label="Country"
              placeholder="select country"
              item-text="name"
              item-value="code"
              append-icon="place"
              :rules="countryRule"
              outlined
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              :items="cityDataList"
              v-model="profileData.cityDataList"
              label="City"
              item-text="geoName"
              item-value="geoId"
              append-icon="location_city"
              :rules="cityRule"
              placeholder="select city"
              @change="getProvinceCode(profileData.cityDataList)"
              outlined
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="profileData.type"
              :items="type"
              item-text="name"
              :rules="typeRule"
              item-value="id"
              menu-props="auto"
              label="Type"
              hide-details
              outlined
              dense
              append-icon="format_list_numbered"
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.noOfChannels"
              label="Channel Number"
              :rules="channelNumberRule"
              append-icon="dialer_sip"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.didNumber"
              label="Did Number"
              :rules="didNumberRule"
              append-icon="dialer_sip"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="supplierList"
              item-text="supplierName"
              item-value="supplierId"
              v-model="profileData.supplierList"
              label="Supplier List"
              :rules="SupplierRule"
              append-icon="format_list_numbered"
              outlined
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="profileData.UnitCost"
              :rules="UnitCostRules"
              label="Unit Cost"
              placeholder="Enter cost for number"
              append-icon="attach_money"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="profileData.PerMinuteCharge"
              :rules="PerMinuteChargeRules"
              label="Per Minute Charge"
              append-icon="attach_money"
              placeholder="Enter Per Minute Charge"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="profileData.SetupCost"
              :rules="SetupCostRules"
              :counter="20"
              placeholder="Enter Per Minute Charge"
              label="Setup Cost"
              append-icon="attach_money"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>

          <v-col cols="6" md="4">
            <v-text-field
              v-model="profileData.areaCode"
              :counter="9"
              placeholder="Enter Area Code"
              label="Pin Code"
              :rules="areaCodeRules"
              append-icon="pin_drop"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>

          <v-col cols="6" md="4">
            <v-text-field
              v-model="profileData.QuantityAccepted"
              label="Quantity Accepted"
              placeholder="Enter quantity of number"
              append-icon="mdi-format-list-numbers"
              :rules="quantityRules"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- form button -->
        <div class="update-button">
          <v-btn class="mr-4" @click="reset"> Reset Form </v-btn>

          <v-btn
            :disabled="!valid"
            color="primary"
            margin-rleft="30%"
            class="mr-4"
            @click="receiveDataUpdate"
          >
            Recieve
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
// import Security from "./security.vue";
// import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
import AllApiCalls from "@/services/AllApiCalls";
import { loading } from "../../App.vue";
export default {
  mixins: [AllApiCalls],
  components: {
    loading,
  },
  data: () => ({
    //loading: false,
    name: "Upload",
    dragover: false,
    uploadedFiles: [],
    valid: true,
    type: [
      {
        id: "TOLL_FREE",
        name: "Toll Free",
      },
      {
        id: "LOCAL",
        name: "Local",
      },
      {
        id: "NATIONAL",
        name: "National",
      },
      {
        id: "VIRTUAL_PRI",
        name: "Virtual Pri",
      },
      {
        id: "SHARED_COST",
        name: "Shared Cost",
      },
      {
        id: "MOBILE",
        name: "Mobile",
      },
    ],
    supplierList: [],
    // dialog: {
    //   type: Boolean,
    //   required: false
    // },
    dialog: false,
    multiple: {
      type: Boolean,
      default: false,
    },
    isoCountryCode: "",
    geoId: "",
    isoCityDataList: "",
    cityGeoName: "",
    countryDataList: [],
    cityDataList: [],
    isLoading: false,
    profileCardLoading: false,
    //loader: "bars",
    areaCodeRules: [(v) => !!v || "Area code is required"],
    countryRule: [(v) => !!v || "Country is required"],
    quantityRules: [(v) => !!v || "Quantity of number is required"],
    cityRule: [(v) => !!v || "City is required"],
    typeRule: [(v) => !!v || "Type is required"],
    SetupCostRules: [(v) => !!v || "Setup cost is required"],
    PerMinuteChargeRules: [(v) => !!v || "Minute charge is required"],
    SupplierRule: [(v) => !!v || "Supplier list is required"],
    UnitCostRules: [(v) => !!v || "Unit cost is required"],
    didNumberRule: [(v) => !!v || "Did number is required"],
    channelNumberRule: [(v) => !!v || "Channel number is required"],
    tab: null,
    profileData: {},
    countryGeoId: "",
    userDetail: {},
    base64result: "",
    showStateField: Boolean,
  }),
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getCountryList();
    this.supplyApi();
  },
  methods: {
    // ************************ csv code start *******************
    closeDialog() {
      // Remove all the uploaded files
      this.uploadedFiles = [];
      // Close the dialog box
      //this.$emit("update:dialog", false);
      this.dialog = false;
    },
    removeFile(fileName) {
      // Find the index of the
      const index = this.uploadedFiles.findIndex(
        (file) => file.name === fileName
      );
      // If file is in uploaded files remove it
      if (index > -1) this.uploadedFiles.splice(index, 1);
    },
    onDrop(e) {
      this.dragover = false;
      // If there are already uploaded files remove them
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      // If user has uploaded multiple files but the component is not multiple throw error
      if (!this.multiple && e.dataTransfer.files.length > 1) {
        this.seeSnackbar("Only one file can be uploaded at a time..", "error");
        // this.$store.dispatch("addNotification", {
        //   message: "Only one file can be uploaded at a time..",
        //   colour: "error"
        // });
      }
      // Add each file to the array of uploaded files
      else var reader = new FileReader();
      reader.readAsDataURL(e.dataTransfer.files[0]);
      reader.onload = () => {
        this.base64result = reader.result.split(";base64,")[1];
        // this.base64result = reader.result.split(',').pop();
        this.uploadedFiles.push(this.base64result);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    },

    async submit() {
      // If there aren't any files to be uploaded throw error
      if (!this.uploadedFiles.length > 0) {
        this.seeSnackbar("There are no files to upload", "error");
      } else {
        // Send uploaded files to parent component
        var encodedStringBtoA = btoa(this.base64result);
        await this.postMethod("receiveDidCsv", {
          uploadedFile: encodedStringBtoA,
        });
        // Close the dialog box
      }
    },

    // async submit() {
    //   if (!this.uploadedFiles.length > 0) {
    //     this.seeSnackbar("There are no files to upload","error")
    //   } else {
    //     try {
    //        var response = await countryStateAPI.receiveDidCsv({
    //         uploadedFile:this.base64result,
    //       });
    //       this.closeDialog();
    //     } catch (err) {
    //       // this.$root.$emit("SHOW_SNACKBAR", {
    //       //   text: err.data.messageDetail,
    //       //   color: "error",
    //       // });
    //       this.seeSnackbar("There are no files to upload","error")
    //       if (response.responseMessage == "success") {
    //         this.closeDialog();
    //       }
    //     }
    //   }
    // },
    // ************************ csv code end *******************

    checkCountry(countryGeoId) {
      return this.countryData.filter((item) => {
        let arr = item.split(": ");
        if (arr[1] === countryGeoId) {
          return item;
        }
      });
    },

    reset() {
      this.$refs.form.reset();
    },

    checkState(stateProvinceGeoId) {
      return this.stateData.filter((item) => {
        let arr = item.split(": ");
        if (arr[1] === stateProvinceGeoId) {
          return item;
        }
      });
    },

    async supplyApi() {
      let response = await this.getMethod("getSupplierList", {
        authToken: localStorage.getItem("authNew"),
      });
      response.supplier.forEach((supplylistData) => {
        this.supplierList.push(supplylistData);
      });
    },

    async getCountryList() {
      let response = await this.getMethod("getFacilityGeoList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.isoCountryCode = response.countryList;
      response.countryList.forEach((currentValue) => {
        this.countryDataList.push(currentValue.facilityGeoId);
      });
    },

    async getCityList(cityGeoId) {
      this.countryGeoId = cityGeoId;
      let response = await this.getMethod("getCountryCities", {
        countryGeoId: cityGeoId,
      });
      this.isoCountryCode.forEach((checkCountryData) => {
        if (cityGeoId == checkCountryData.facilityGeoId) {
          this.facilityGeoId = cityGeoId;
          this.facilityId = checkCountryData.facilityId;
        }
      });
      response.cityList.forEach((cityListJson) => {
        this.cityDataList.push(cityListJson);
      });
      this.isoCityDataList = response.cityList;
    },

    getProvinceCode(cityGeoName) {
      this.isoCityDataList.forEach((el) => {
        this.geoId = el.geoId;
        if (el.geoId === cityGeoName) {
          this.profileData.noOfChannels = el.noOfChannels;
          this.profileData.SetupCost = el.setupCost;
          this.profileData.UnitCost = el.price;
          this.profileData.areaCode = el.prefix;
        }
      });
    },

    async receiveDataUpdate() {
      if (this.$refs.form.validate() == true) {
        this.isLoading = true;
        let response = await this.postMethod("receiveSerialInventoryProduct", {
          areaCode: this.profileData.areaCode,
          cityGeoId: this.geoId,
          didNumber: this.profileData.didNumber,
          didType: this.profileData.type,
          facilityGeoId: this.facilityGeoId,
          facilityId: this.facilityId,
          inventoryItemTypeId: "SERIALIZED_INV_ITEM",
          noOfChannels: this.profileData.noOfChannels,
          perMinCharge: this.profileData.PerMinuteCharge,
          productId: "GEOGRAPHIC_DID",
          quantityAccepted: this.profileData.QuantityAccepted,
          quantityRejected: "0",
          setupCost: this.profileData.SetupCost,
          stateGeoId: this.profileData.cityDataList,
          supplierId: this.profileData.supplierList,
          unitCost: this.profileData.UnitCost,
        });
        if (response.responseMessage === "success") {
          this.seeSnackbar("SIP successfully created", "success");
          this.isLoading = false;
          this.$refs.form.reset();
          //this.$router.go(this.$router.currentRoute)
        }
      } else {
        this.$refs.form.validate();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.update-button {
  padding-left: 40%;
  padding-top: inherit;
}

.bulkButton {
  float: right;
}

.dropbox {
  outline: 2px dashed grey;
  /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px;
  /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue;
  /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
