<template>
  <v-card elevation="0">
    <v-container fluid>
      <!-- SNACKBAR -->
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :right="x === 'right'"
        :timeout="timeout"
        :top="y === 'top'"
        >{{ snackbarMessage }}</v-snackbar
      >
      <!-- LOADER -->
      <!-- <div class="loader" v-if="showLoader">
            <v-progress-circular indeterminate color="white"></v-progress-circular>
        </div> -->
      <v-row>
        <loading :active="isLoading" :loader="loader" />
      </v-row>
      <v-row>
        <v-col lg="3" md="3" sm="3" class="pb-0">
          <v-select
            v-model="bulkEdit.facilityGeoId"
            label="Select Country"
            :items="countryDataList"
            item-text="name"
            item-value="code"
            append-icon="place"
            clearable
            outlined
            dense
            @change="getCountryCities(bulkEdit.facilityGeoId)"
          ></v-select>
        </v-col>
        <v-col lg="3" md="3" sm="3" class="pb-0">
          <v-text-field
            v-model="bulkEdit.geoName"
            label="City"
            append-icon="location_city"
            clearable
            outlined
            dense
            :items="cityDataList"
            item-text="geoName"
            item-value="geoId"
            @change="
              getCities(bulkEdit.geoName);
              getReceivedDidList();
            "
          ></v-text-field>
        </v-col>
        <v-col lg="3" md="3" sm="3" class="pb-0">
          <v-text-field
            v-model="didNumber"
            label="Did Number"
            append-icon="dialer_sip"
            clearable
            outlined
            dense
            @keypress="didNumberUpdate(didNumber)"
            @keyup.enter="getReceivedDidList()"
          ></v-text-field>
        </v-col>
        <v-col lg="3" md="3" sm="3" class="pb-0">
          <v-autocomplete
            v-model="didStatusValue"
            :items="didStatusList"
            label="Search By Status"
            item-text="value"
            item-value="statusId"
            clearable
            outlined
            dense
            @change="searchOnServer(didStatusValue)"
          ></v-autocomplete>
        </v-col>
        <v-col sm="1" class="bttn">
          <v-btn color="primary" block @click="getReceivedDidList()"
            >Search</v-btn
          >
        </v-col>
      </v-row>
      <v-dialog v-model="enableDialog" max-width="500px">
        <v-card>
          <v-form ref="form" lazy-validation>
            <v-card-title>
              <span class="headline">Number Status</span>
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6"> Enable Number </v-col>
              </v-row>
            </v-card-text>
            <!-- button -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="disableClose()">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="enableDidNumber()">
                Enable
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- activate number  -->
      <v-dialog v-model="openActivateDialog" max-width="500px">
        <v-card>
          <v-form ref="form" lazy-validation>
            <v-card-title>
              <span class="headline">Inactive User</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  Are you sure you want activate this number ?
                </v-col>
              </v-row>
            </v-card-text>
            <!-- button -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="activateClose()">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="activateDidNumber()">
                Activate
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogPencil" max-width="500px">
        <v-card>
          <v-form ref="form" lazy-validation>
            <v-card-title>
              <span class="headline">Number Status</span>
              <!-- <v-spacer></v-spacer> -->

              <!-- button -->
              <v-spacer></v-spacer>
              <v-btn text @click="cancelEdit()" icon>
                <v-icon @click="closeEdit()">mdi-close</v-icon>
              </v-btn>
              <!-- <v-btn
                  color="blue darken-1"
                  text
                  @click="closeEdit()"
                  >
                  Cancel
                </v-btn> -->
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" v-if="showDeactivateActivateBoth">
                  <v-container>
                    <v-radio-group
                      v-model="selectIdNumber"
                      v-on:change="changeRoute($event)"
                      selectIdNumber
                    >
                      <v-radio
                        label="Deactivate"
                        name="INV_DEACTIVATED"
                        value="INV_DEACTIVATED"
                      >
                      </v-radio>
                      <v-radio
                        label="Activated"
                        name="INV_AVAILABLE"
                        value="INV_AVAILABLE"
                      ></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-col>
                <v-col cols="12" md="6" v-if="showActivate">
                  <v-container>
                    <v-radio-group
                      v-model="selectIdNumber"
                      v-on:change="changeRoute($event)"
                      selectIdNumber
                    >
                      <v-radio
                        name="INV_AVAILABLE"
                        label="Activated"
                        value="INV_AVAILABLE"
                      ></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-col>
                <v-col cols="12" md="6" v-if="showDeactivate">
                  <v-container>
                    <v-radio-group
                      v-model="selectIdNumber"
                      v-on:change="changeRoute($event)"
                      selectIdNumber
                    >
                      <v-radio
                        name="INV_DEACTIVATED"
                        label="Deactivated"
                        value="INV_DEACTIVATED"
                      ></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-col>
                <!-- month select -->
                <v-col md="12">
                  <v-select
                    max-width="43px"
                    label="Month"
                    item-text="name"
                    item-value="value"
                    outlined
                    dense
                    append-icon="calendar_view_month"
                    v-model="MonthSelected"
                    :items="deactivateNumber"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-card-text>
            <!-- button -->
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="blue darken-1"
                text
                @click="updateDidNumber(selectIdNumber, MonthSelected)"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- dialog suspended and terminated -->
      <v-dialog v-model="dialogApproveNumber" max-width="500px">
        <v-card>
          <v-form ref="form" lazy-validation>
            <v-card-title>
              <span class="headline">Number Status</span>
              <!-- button -->
              <v-spacer></v-spacer>
              <v-btn text @click="cancelEdit()" icon>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              </v-btn>
              <!-- </v-toolbar> -->
            </v-card-title>
            <v-card-text>
              <v-row>
                <!-- for Terminate and Suspend -->
                <v-col cols="12" md="6" v-if="showSuspendedTerminate">
                  <v-container>
                    <v-radio-group v-model="approveId">
                      <v-radio label="Suspend" value="DID_SUSPENDED"></v-radio>
                      <v-radio
                        label="Terminate"
                        value="DID_TERMINATED"
                      ></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-col>
                <v-col cols="12" md="6" v-if="showINV_TERMINATED">
                  <v-container>
                    <v-radio-group v-model="approveId">
                      <v-radio label="Suspend" value="DID_SUSPENDED"></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-col>
                <v-col cols="12" md="6" v-if="showINV_SUSPENDED">
                  <v-container>
                    <v-radio-group v-model="approveId">
                      <v-radio
                        label="Terminate"
                        value="DID_TERMINATED"
                      ></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-col>
                <!-- datepicker -->
                <v-col
                  md="6"
                  v-if="
                    showSuspendedTerminate ||
                    showINV_SUSPENDED ||
                    showINV_TERMINATED
                  "
                >
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        color="primary"
                        block
                        v-model="statusDate"
                        label="Select Date"
                        persistent-hint
                        outlined
                        dense
                        append-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="statusDate"
                      no-title
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col md="6" v-if="showDidNumberMessage">
                  <span>Number is not allocated</span>
                </v-col>
              </v-row>
            </v-card-text>
            <!-- button -->
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                v-if="buttonUpdateshow"
                color="blue darken-1"
                text
                @click="updateSusTer(approveId, statusDate)"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-row>
        <v-col xs="12">
          <v-data-table
            :headers="headers"
            :items="didNumbersItems"
            :options.sync="options"
            :server-items-length="totalItems"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
            }"
            :loading="loading"
            class="elevation-1"
          >
            <!-- INDEX NO -->
            <template v-slot:[`item.indexNo`]="{ item }">
              {{
                (options.page - 1) * options.itemsPerPage +
                (didNumbersItems.indexOf(item) + 1)
              }}
            </template>
            <!-- <template v-slot:[`item.didNumber`]="{ item }">
                        <span v-if="items.didNumber">{{"XXXXXX"}}</span>
                    </template> -->
            <!-- EDIT DELETE BUTTONS -->
            <template v-slot:[`item.statusId`]="{ item }">
              <span v-if="item.statusId == 'INV_PROMISED'">Purchased</span>
              <span v-if="item.statusId == 'INV_AVAILABLE'">Available</span>
              <span v-if="item.statusId == 'INV_DELIVERED'">Delivered</span>
              <span v-if="item.statusId == 'INV_SUSPENDED'">Suspended</span>
              <span v-if="item.statusId == 'INV_DEACTIVATED'">Deactivated</span>
              <span v-if="item.statusId == 'INV_TERMINATED'">Terminated</span>
              <span v-if="item.statusId == 'INV_EXPIRED'">Expired</span>
              <span v-if="item.statusId == null"> Pending Allocation</span>
              <span v-if="item.statusId == 'INV_DUMMY'">Dummy</span>
              <span v-if="item.statusId == 'INV_ALLO_CANCELLED'"
                >Allocation Cancelled</span
              >
            </template>
            <template v-slot:[`item.didNumber`]="{ item }">
              <span v-if="item.didNumber == null">XXXXXX</span>
              <span v-if="item.didNumber"> {{ item.didNumber }}</span>
            </template>
            <template v-slot:[`item.ViewDetail`]="{ item }">
              <v-btn color="info" class="mx-2" fab outlined small>
                <router-link
                  :to="{
                    name: 'didnumberDetails',
                    query: { item },
                  }"
                >
                  <v-icon color="info">visibility</v-icon>
                </router-link>
              </v-btn>
              <v-btn
                v-if="item.didStatus != 'DID_INACTIVE'"
                color="teal"
                class="mx-2"
                fab
                outlined
                small
              >
                <v-icon color="teal" @click="updateEdit(item)">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                v-if="
                  item.didStatus == 'DID_SUSPENDED' ||
                  item.didStatus == 'DID_TERMINATED'
                "
                color="blue"
                class="mx-2"
                fab
                outlined
                small
                @click="enableUser(item)"
              >
                <v-icon color="blue"> settings_phone </v-icon>
              </v-btn>
              <v-btn
                v-if="item.didStatus == 'DID_INACTIVE'"
                color="red"
                class="mx-2"
                fab
                outlined
                small
                @click="activateNumber(item)"
              >
                <v-icon color="red"> phone </v-icon>
              </v-btn>
              <!-- <v-btn
                            v-if="item.statusId == 'INV_AVAILABLE'"
                            color="pink"
                            class="mx-2"
                            fab
                            outlined
                            small
                            @click="deleteItem(item)"
                            >
                        <v-icon color="pink"> mdi-delete </v-icon>
                        </v-btn> -->
            </template>
            <template v-slot:[`item.viewAction`]="{ item }">
              <!-- {{item}} -->
              <router-link
                :to="{
                  name: 'User List',
                  query: { serialNumber: item.didNumber },
                }"
              >
                <v-btn class="mx-2" fab outlined small color="info"
                  ><v-icon>visibility</v-icon></v-btn
                >
              </router-link>
            </template>
            <!-- DIALOG BOX -DELETE ITEM -->
            <template v-slot:top>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteItemConfirm()"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import productStore from "../../services/productStore";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      didNumbersItems: [],
      statusDate: "",
      activateNumberItemId: "",
      isLoading: false,
      loader: "bars",
      switch1: false,
      openActivateDialog: false,
      costListData: [],
      countryDataList: [],
      cityDataList: [],
      bulkEdit: {
        costEditUpdate: "",
      },
      status: "",
      deactivateNumber: [
        {
          name: "1",
          value: "1",
        },
        {
          name: "2",
          value: "2",
        },
        {
          name: "3",
          value: "3",
        },
        {
          name: "6",
          value: "6",
        },
      ],
      menu1: "",
      didStatusList: [
        {
          key: "Av",
          value: "Available",
          statusId: "INV_AVAILABLE",
        },
        {
          key: "pur",
          value: "Purchased",
          statusId: "INV_PROMISED",
        },
        {
          key: "dilver",
          value: "Delivered",
          statusId: "INV_DELIVERED",
        },
        {
          key: "suspen",
          value: "Suspended",
          statusId: "INV_SUSPENDED",
        },
        {
          key: "deactive",
          value: "Deactivated",
          statusId: "INV_DEACTIVATED",
        },
        {
          key: "terminate",
          value: "Terminated",
          statusId: "INV_TERMINATED",
        },
      ],
      INV_DEACTIVATED: "",
      INV_AVAILABLE: "",
      INV_PROMISED: "",
      INV_TERMINATED: "",
      INV_SUSPENDED: "",
      INV_EXPIRED: "",
      DID_TERMINATED: "",
      DID_SUSPENDED: "",
      MonthSelected: "",
      totalLiveCalls: "",
      didStatusValue: "",
      didNumber: "",
      valid: true,
      dialogPencil: false,
      dialogApproveNumber: false,
      dialogLiveCall: false,
      showAllTime: false,
      date: "",
      approveId: "",
      selectIdNumber: {
        name: "dad",
        value: "dsadasd",
      },
      dialogDelete: false,
      headers: [
        {
          text: "S.No",
          align: "start",
          sortable: false,
          value: "indexNo",
        },
        {
          text: "Country",
          align: "start",
          sortable: false,
          value: "countryName",
        },
        {
          text: "State",
          align: "start",
          sortable: false,
          value: "stateName",
        },
        {
          text: "City",
          align: "start",
          sortable: false,
          value: "cityName",
        },
        {
          text: "City ID",
          align: "start",
          sortable: false,
          value: "cityGeoId",
        },
        {
          text: "Did Number",
          align: "start",
          sortable: false,
          value: "didNumber",
        },
        {
          text: "Status",
          align: "start",
          sortable: false,
          value: "statusId",
        },
        {
          text: "View Detail",
          align: "start",
          sortable: false,
          value: "ViewDetail",
        },
        {
          text: "Disable Date",
          align: "start",
          sortable: false,
          value: "disableTime",
        },
        {
          text: "History",
          value: "viewAction",
          sortable: false,
        },
      ],
      pageIndex: "",
      facilityGetNewId: "",
      NewData: {},
      totalItems: 0,
      loading: false,
      enableDialog: false,
      options: {},
      showDeactivate: false,
      showDeactivateActivateBoth: false,
      showActivate: false,
      showSuspendedTerminate: false,
      showDidNumberMessage: false,
      buttonUpdateshow: false,
      showINV_SUSPENDED: false,
      showINV_TERMINATED: false,
    };
  },
  watch: {
    dialogPencil(val) {
      val || this.closeEdit();
    },
    dialogApproveNumber(val) {
      val || this.cancelEdit();
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogEdit(val) {
      val || this.closeEdit();
    },
    enableDialog(val) {
      val || this.closefacilityIdCodeEdit();
    },
    openActivateDialog(val) {
      val || this.activateClose();
    },

    options: {
      async handler() {
        this.getReceivedDidList();
      },
      deep: true,
    },
    dialogLiveCall(val) {
      val || this.cancelDialog();
    },
  },

  methods: {
    async getDataDidNumber() {
      this.isLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let response = await this.getMethod("getReceivedDidList", {
        viewIndex: page,
        viewSize: itemsPerPage,
      });
      if ((response.responseMessage = "success")) {
        this.isLoading = false;
        this.didNumbersItems = response.didNumberList;
        this.totalItems = response.listSize;
        this.isLoading = false;
      }
    },

    async getFacilityGeoList() {
      this.isLoading = true;
      let response = await this.getMethod("getFacilityGeoList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.isoCountryCode = response.countryList;
      response.countryList.forEach((currentValue, index, arr) => {
        this.countryDataList.push(currentValue.facilityName);
        this.isLoading = false;
      });
    },

    async getSearchData() {
      this.isLoading = true;
      let response = await this.getMethod("getFacilityGeoList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.isoCountryCode = response.countryList;
      response.countryList.forEach((currentValue, index, arr) => {
        this.countryDataList.push(currentValue.facilityName);
        this.isLoading = false;
      });
    },

    async getCountryCities(cityGeoId) {
      this.isLoading = true;
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
        this.options.page = 1;
        if (cityGeoId == getGeoId) {
          this.facilityIdCode = currentValue.facilityGeoId;
          this.facilityGetNewId = currentValue.facilityId;
        } else if (cityGeoId == undefined) {
          this.bulkEdit.facilityGeoId = null;
          this.cityGeoId = null;
          this.bulkEdit.geoName = null;
          this.facilityGetNewId = null;
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        }
      });
      let response = await this.getMethod("getCountryCities", {
        countryGeoId: this.facilityIdCode,
      });
      this.getReceivedDidList();
      this.cityDataList = [];
      this.cityDataList = response.cityList;
      this.isoCityGeoData = response.cityList;
      this.isoCountryCode.forEach((checkCountryData, index, arr) => {
        var facilityGeoIdName = JSON.stringify(
          checkCountryData.facilityName
        ).replace(/['"]+/g, "");
        this.isLoading = false;
      });
      // response.cityList.forEach((currentValue, index, arr) => {
      //     this.cityDataList.push(currentValue.geoName);
      //     this.isLoading = false;
      //     // console.log(currentValue)
      // });
    },

    getCities(cityGeoId) {
      console.log(cityGeoId);
      console.log(this.isoCityGeoData);
      this.geoIDName = cityGeoId;
      this.isoCityGeoData.forEach((checkCityData, index, arr) => {
        console.log(checkCityData);
        if (cityGeoId == checkCityData.geoId) {
          this.cityGeoId = checkCityData.geoId;
          this.productId = "GEOGRAPHIC_DID";
          this.options.page = 1;
        } else if (cityGeoId == undefined) {
          this.cityGeoId = null;
          // setTimeout
          this.isLoading = true;
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      });
    },

    async searchOnServer(statusidGet) {
      this.isLoading = true;
      this.getstatusidbySelect = statusidGet;
      this.options.page = 1;
      this.getReceivedDidList();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },

    async didNumberUpdate(didNumber) {
      if (didNumber) {
        this.isLoading = true;
        if (didNumber == undefined || didNumber == "") {
          this.didNumber = null;
        } else {
          this.didNumber = didNumber;
        }
        this.options.page = 1;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },

    // ***************** Search Data ***********************
    async getReceivedDidList() {
      this.isLoading = true;
      if (this.options.page || this.cityGeoId) {
        var jsonData = {
          viewIndex: this.options.page,
          viewSize: this.options.itemsPerPage,
        };
      } else {
        var jsonData = {
          viewIndex: this.options.page,
          viewSize: itemsPerPage,
        };
      }
      if (this.getstatusidbySelect) {
        jsonData.statusId = this.getstatusidbySelect;
      }
      if (this.didNumber) {
        jsonData.didNumber = this.didNumber;
      }
      if (this.cityGeoId) {
        jsonData.cityGeoId = this.cityGeoId;
      }

      if (this.bulkEdit.facilityGeoId) {
        if (this.facilityGetNewId) {
          jsonData.facilityId = this.facilityGetNewId;
        }
      } else {
        delete jsonData.facilityId;
      }

      let response = await this.getMethod("getReceivedDidList", jsonData);
      if ((response.responseMessage = "success")) {
        this.isLoading = false;
        this.didNumbersItems = response.didNumberList;
        this.totalItems = response.listSize;
        this.isLoading = false;
      }
    },

    updateEdit(data) {
      this.NewData = data;
      console.log(this.NewData);
      if (data.statusId == "INV_AVAILABLE") {
        this.dialogPencil = true;
        this.dialogApproveNumber = false;
        this.showDeactivateActivateBoth = false;
        this.showActivate = false;
        this.showDeactivate = true;
        this.showDidNumberMessage = false;
      } else if (data.statusId == "INV_EXPIRED") {
        this.dialogApproveNumber = false;
        this.dialogPencil = false;
        this.showDidNumberMessage = false;
        this.showSuspendedTerminate = false;
        this.buttonUpdateshow = false;
        this.showINV_TERMINATED = false;
        this.showINV_SUSPENDED = false;
      } else if (data.statusId == "INV_DEACTIVATED") {
        this.dialogPencil = true;
        this.dialogApproveNumber = false;
        this.showActivate = true;
        this.showDeactivate = false;
        this.showDeactivateActivateBoth = false;
      } else if (data.statusId == "INV_PROMISED") {
        if (data.didNumber == null) {
          this.dialogApproveNumber = true;
          this.dialogPencil = false;
          this.showDidNumberMessage = false;
          this.showSuspendedTerminate = false;
          this.buttonUpdateshow = false;
          this.showINV_TERMINATED = false;
          this.showINV_SUSPENDED = false;
          this.showDidNumberMessage = true;
        } else {
          this.showINV_TERMINATED = false;
          this.showINV_SUSPENDED = false;
          this.dialogApproveNumber = true;
          this.dialogPencil = false;
          this.showDidNumberMessage = false;
          this.showSuspendedTerminate = true;
          this.buttonUpdateshow = true;
        }
      } else if (data.statusId == "INV_SUSPENDED") {
        this.dialogApproveNumber = true;
        this.dialogPencil = false;
        this.showDidNumberMessage = false;
        this.showSuspendedTerminate = false;
        this.showINV_SUSPENDED = true;
        this.showINV_TERMINATED = false;
        this.buttonUpdateshow = true;
      } else if (data.statusId == "INV_TERMINATED") {
        this.dialogApproveNumber = false;
        this.dialogPencil = false;
        this.showSuspendedTerminate = false;
        this.buttonUpdateshow = false;
        this.showINV_TERMINATED = false;
        this.showINV_SUSPENDED = false;
      } else if (data.didNumber == null) {
        this.showDidNumberMessage = true;
        this.showSuspendedTerminate = false;
        this.buttonUpdateshow = false;
        this.dialogApproveNumber = true;
      }
    },

    changeRoute(event) {},

    async updateDidNumber(data, month) {
      console.log(data, month);
      try {
        var cancelAllocationId = {
          disableDays: month,
          inventoryItemId: this.NewData.inventoryItemId,
          statusId: data,
        };
        let response = await productStore.disableDID(cancelAllocationId);
        if (response.responseMessage == "success") {
          this.seeSnackbar("Success", "success");
          this.dialogPencil = false;
          this.getDataDidNumber();
        } else if (responseMessage == "error") {
          this.seeSnackbar(response.messageDetail, "error");
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
          this.dialogPencil = false;
        }
      }
    },

    //   let response = await this.postMethod("disableDID", {
    //     // disableDays: 60
    //     // inventoryItemId: "10030"
    //     // statusId: "INV_DEACTIVATED"
    //   });
    // },

    async updateSusTer(value, date) {
      this.deleteDialog = true;
      try {
        var d = new Date();
        var abc = new Date(d.setMonth(d.getMonth() + 1));
        var datetime =
          abc.getHours() + ":" + abc.getMinutes() + ":" + abc.getSeconds();
        this.activateStatus = {};
        var newDate = "" + date;
        var day = newDate.slice(0, 15);
        var timezone = newDate.slice(25, 40);
        var Finaltime = day + " " + datetime + " " + timezone;
        var dateDisableTime = Date.parse(Finaltime);
        var cancelAllocationId = {
          didNumber: this.NewData.didNumber,
          didStatus: value, //"DID_SUSPENDED"
          disableTime: dateDisableTime,
          inventoryItemId: this.NewData.inventoryItemId,
          orderId: this.NewData.orderId,
          partyId: this.NewData.partyId,
        };
        let response = await productStore.disableDID(cancelAllocationId);
        if (response.responseMessage == "success") {
          this.seeSnackbar("Success", "success");
          this.approveId = {};
          this.statusDate = [];
          this.dialogApproveNumber = false;
          this.getDataDidNumber();
        } else if (responseMessage == "error") {
          this.seeSnackbar(response.messageDetail, "error");
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
          this.dialogApproveNumber = false;
        }
      }
    },

    async enableDidNumber() {
      try {
        var enableNumberJson = {
          inventoryItemId: this.numberdata.inventoryItemId,
          didNumber: this.numberdata.didNumber,
          orderId: this.numberdata.orderId,
          partyId: this.numberdata.partyId,
        };
        let response = await productStore.enableDID(enableNumberJson);
        if (response.responseMessage == "success") {
          this.getDataDidNumber();
          this.enableDialog = false;
          // windows.history.go()
          this.seeSnackbar("Success", "success");
        } else if (responseMessage == "error") {
          this.seeSnackbar(response.messageDetail, "error");
        }
        this.enableDialog = false;
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
          this.enableDialog = false;
        }
      }
    },

    enableUser(data) {
      this.enableDialog = true;
      this.numberdata = data;
    },

    async activateNumber(data) {
      this.openActivateDialog = true;
      this.activateNumberItemId = data.inventoryItemId;
    },

    async activateDidNumber(data) {
      try {
        var activateItemId = {
          inventoryItemId: this.activateNumberItemId,
          authToken: localStorage.getItem("authNew"),
        };
        let response = await productStore.activateNumber(activateItemId);
        if (response.responseMessage == "success") {
          this.seeSnackbar(response.responseMessage, "success");
          this.openActivateDialog = false;
          this.getDataDidNumber();
          windows.history.go();
        } else if (responseMessage == "error") {
          this.seeSnackbar(response.messageDetail, "error");
          this.openActivateDialog = false;
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
          this.openActivateDialog = false;
        }
      }
    },

    async activateClose() {
      this.openActivateDialog = false;
    },

    closeEdit() {
      this.dialogPencil = false;
      this.selectedNumber = {};
      this.MonthSelected = {};
    },

    cancelEdit() {
      this.dialogApproveNumber = false;
      this.approveId = {};
      this.statusDate = [];
    },

    viewHistory(item) {},

    viewNumberDetails(item) {},

    closeDelete() {
      this.dialogDelete = false;
    },

    disableClose() {
      this.enableDialog = false;
    },

    deleteItem(value) {
      this.dialogDelete = true;
      this.deleteDidNumberInventory = value.inventoryItemId;
    },

    async deleteItemConfirm() {
      try {
        var deleteId = {
          inventoryItemId: this.deleteDidNumberInventory,
        };
        let response = await productStore.deleteDidNumber(deleteId);
        if (response.responseMessage == "success") {
          this.seeSnackbar(
            "Did number inventory deleted successfully",
            "success"
          );
          this.dialogDelete = false;
          this.getDataDidNumber();
          windows.history.go();
        } else if (responseMessage == "error") {
          this.seeSnackbar(response.messageDetail, "error");
          this.dialogDelete = false;
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
          this.dialogDelete = false;
        }
      }
    },
  },
  async created() {
    this.getFacilityGeoList();
  },
};
</script>
<style scoped>
.bttn {
  text-align: right;
}
</style>