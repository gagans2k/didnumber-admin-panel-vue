<template>
  <v-card>
    <v-toolbar color="white">
      <v-col xs="12" sm="5" md="4">
        <v-text-field
          class=""
          flat
          hide-details
          label="Search"
          v-model="search"
          append-icon="mdi-magnify"
          outlined
          dense
        >
        </v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <div>
        <download-csv :data="getCsvData" name="callLogs.csv">
          <v-btn
            class="mt-1 myTitle text-capitalize"
            color="green"
            outlined
            dark
            @click="checkJsonData()"
          >
            <v-icon light class="mr-2">cloud_download</v-icon>
            Download
          </v-btn>
        </download-csv>
      </div>
      <!-- <v-spacer></v-spacer> -->
      <div class="ml-2 mt-1">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'AccountDetails',
            query: $route.query,
          }"
          >Back</v-btn
        >
      </div>
      <hr />

      <template v-slot:extension>
        <v-col cols="12" class="w-100">
          <v-tabs v-model="selectedTab" left>
            <v-tab
              v-for="(item, box) in tabs"
              :key="box"
              @change="createDate(item.route)"
            >
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-col>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="selectedTab">
      <v-tab-item>
        <!-- Today Data -->
        <v-card flat>
          <v-data-table
            :headers="headers"
            :items="callRecordsData"
            :search="search"
          >
            <template v-slot:[`item.indexNo`]="{ item }">
              <!-- {{ callRecordsData.indexOf(item) + 1 }} -->
              <v-tooltip bottom v-if="item.direction == 'inbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="green" dark v-bind="attrs" v-on="on">
                    phone_callback
                  </v-icon>
                </template>
                <span>Inbound</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.direction == 'outbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="orange" dark v-bind="attrs" v-on="on">
                    phone_forwarded
                  </v-icon>
                </template>
                <span>Outbound</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.caller_id_number`]="{ item }">
              {{ item.caller_id_number }} ({{ item.caller_id_name }})
            </template>
            <template v-slot:[`item.dialed_number`]="{ item }">
              {{ item.dialed_number }}
              <span v-if="item.callee_id_name">
                ({{ item.callee_id_name }})
              </span>
            </template>
            <template v-slot:[`item.cost`]="{ item }">
              {{ formatDollarValue(item.cost) }} +
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <!-- Last Week Data -->
      <v-tab-item>
        <v-card flat>
          <v-data-table
            :headers="headers"
            :items="callRecordsData"
            :search="search"
          >
            <template v-slot:[`item.indexNo`]="{ item }">
              <!-- {{ callRecordsData.indexOf(item) + 1 }} -->
              <v-tooltip bottom v-if="item.direction == 'inbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="green" dark v-bind="attrs" v-on="on">
                    phone_callback
                  </v-icon>
                </template>
                <span>Inbound</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.direction == 'outbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="orange" dark v-bind="attrs" v-on="on">
                    phone_forwarded
                  </v-icon>
                </template>
                <span>Outbound</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.caller_id_number`]="{ item }">
              {{ item.caller_id_number }} ({{ item.caller_id_name }})
            </template>
            <template v-slot:[`item.dialed_number`]="{ item }">
              {{ item.dialed_number }}
              <span v-if="item.callee_id_name">
                ({{ item.callee_id_name }})
              </span>
            </template>
            <template v-slot:[`item.cost`]="{ item }">
              {{ formatDollarValue(item.cost) }} +
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <!-- Last Month Data  -->
      <v-tab-item>
        <v-card flat>
          <v-data-table
            :headers="headers"
            :items="callRecordsData"
            :search="search"
          >
            <template v-slot:[`item.indexNo`]="{ item }">
              <!-- {{ callRecordsData.indexOf(item) + 1 }} -->
              <v-tooltip bottom v-if="item.direction == 'inbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="green" dark v-bind="attrs" v-on="on">
                    phone_callback
                  </v-icon>
                </template>
                <span>Inbound</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.direction == 'outbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="orange" dark v-bind="attrs" v-on="on">
                    phone_forwarded
                  </v-icon>
                </template>
                <span>Outbound</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.caller_id_number`]="{ item }">
              {{ item.caller_id_number }} ({{ item.caller_id_name }})
            </template>
            <template v-slot:[`item.dialed_number`]="{ item }">
              {{ item.dialed_number }}
              <span v-if="item.callee_id_name">
                ({{ item.callee_id_name }})
              </span>
            </template>
            <template v-slot:[`item.cost`]="{ item }">
              {{ formatDollarValue(item.cost) }} +
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <!-- Custom Data  -->
      <v-tab-item>
        <v-card flat class="px-5">
          <v-container fluid>
            <v-row v-if="showCustomDate" class="mx-0">
              <v-col cols="12" class="py-0">
                <p class="red--text caption mb-1">
                  *Note: Only 30 Days Call Detail Record will be available.
                </p>
              </v-col>
              <!-- from date picker -->
              <v-col cols="12" lg="2" md="3" sm="12">
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
                      v-model="date.to"
                      label="From Date"
                      persistent-hint
                      append-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date.to"
                    no-title
                    :max="maxDate"
                    v-on:change="fromDateChange"
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- to date picker -->
              <v-col cols="12" lg="2" md="3" sm="12">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date.from"
                      label="To Date"
                      persistent-hint
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date.from"
                    no-title
                    :min="minToDate"
                    :max="maxToDate"
                    @input="menu2 = false"
                    :disabled="disabledToDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" lg="2" md="3" sm="12">
                <v-btn
                  class="myTitle text-capitalize"
                  color="primary"
                  outlined
                  dense
                  dark
                  @click="getCallDetailList()"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-data-table
            :headers="headers"
            :items="callRecordsData"
            :search="search"
          >
            <template v-slot:[`item.indexNo`]="{ item }">
              <!-- {{ callRecordsData.indexOf(item) + 1 }} -->
              <v-tooltip bottom v-if="item.direction == 'inbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="green" dark v-bind="attrs" v-on="on">
                    phone_callback
                  </v-icon>
                </template>
                <span>Inbound</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.direction == 'outbound'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="orange" dark v-bind="attrs" v-on="on">
                    phone_forwarded
                  </v-icon>
                </template>
                <span>Outbound</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.caller_id_number`]="{ item }">
              {{ item.caller_id_number }} ({{ item.caller_id_name }})
            </template>
            <template v-slot:[`item.dialed_number`]="{ item }">
              {{ item.dialed_number }}
              <span v-if="item.callee_id_name">
                ({{ item.callee_id_name }})
              </span>
            </template>
            <template v-slot:[`item.cost`]="{ item }">
              {{ formatDollarValue(item.cost) }} +
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <loading :active="isLoading" :loader="loader" />
  </v-card>
</template>
<script>
//import cdrAPI from "@/services/cdrAPI.js";
import "@/assets/vue-loading.css";
import AllApiCalls from "@/services/AllApiCalls";
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
      showCustomDate: Boolean,
      selectedTab: null,
      tabs: [
        {
          name: "Today",
          route: "today",
        },
        {
          name: "This Week",
          route: "lastweek",
        },
        {
          name: "This Month",
          route: "lastmonth",
        },
        {
          name: "Custom",
          route: "custom",
        },
      ],
      datePicker: { From: "", To: "" },
      date: {},
      minDate: "",
      maxDate: "",
      minToDate: "",
      maxToDate: "",
      getFromDate: "",
      getToDate: "",
      menu1: "",
      menu2: "",
      search: "",
      disabledToDate: true,
      cdr: true,
      callDetail: [],
      getCsvData: [],
      callDetailRecordsJson: {},
      moment: moment,
      options: {},
      totalCallRecords: 0,
      headers: [
        {
          //text: "Direction",
          value: "indexNo",
          sortable: false,
          icon: "phone",
        },
        {
          text: "Date/Time",
          value: "datetime",
          align: "center",
          sortable: false,
        },
        {
          text: "From (Caller Id) ",
          value: "caller_id_number",
          align: "center",
          sortable: false,
        },
        {
          text: "To (Dialled Numbers)",
          value: "dialed_number",
          align: "center",
          sortable: false,
        },
        // {
        //   text: "Direction",
        //   value: "direction",
        //   align: "center",
        //   sortable: false,
        // },
        {
          text: "Duration",
          value: "duration_seconds",
          sortable: false,
        },
        {
          text: "Hangup Cause ",
          value: "hangup_cause",
          align: "center",
          sortable: false,
        },
        {
          text: "Cost(USD)",
          value: "cost",
          align: "center",
          sortable: false,
        },
      ],
      callRecordsData: [],
    };
  },
  // mounted() {
  //   this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
  //   this.date.to = new Date().toISOString().substr(0, 10);
  //   this.date.from = new Date().toISOString().substr(0, 10);
  //   this.maxDate = new Date().toISOString().substr(0, 10);
  //   var dateType = "today";
  //   this.createDate(dateType);
  // },
  filters: {
    getDollarValue(cost) {
      var getDollarCost = cost / 10000;
      return parseFloat(getDollarCost.toFixed(4));
    },
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    var getFirstDateBeforeThirtyDay = moment()
      .subtract(29, "days")
      .toISOString()
      .substr(0, 10);
    var today = new Date().toISOString().substr(0, 10);
    this.date.to = getFirstDateBeforeThirtyDay;
    this.date.from = today;
    this.maxDate = new Date().toISOString().substr(0, 10);
    var dateType = "today";
    this.createDate(dateType);
  },

  methods: {
    formatDollarValue(cost) {
      var getDollarCost = cost / 10000;
      return parseFloat(getDollarCost.toFixed(4));
    },
    createDate(dateType) {
      this.datePicker.To = new Date();
      this.datePicker.From = new Date();
      switch (dateType) {
        case "today":
          this.datePicker.From = new Date(
            this.datePicker.From.getFullYear(),
            this.datePicker.From.getMonth(),
            this.datePicker.From.getDate()
          );
          this.selectionByTabs();
          this.exportLog();
          break;
        case "lastweek":
          this.datePicker.From = new Date(
            this.datePicker.From.setDate(
              this.datePicker.From.getDate() - this.datePicker.From.getDay() + 1
            )
          );
          this.selectionByTabs();
          this.exportLog();
          break;
        case "lastmonth":
          this.datePicker.From = new Date(
            this.datePicker.From.getFullYear(),
            this.datePicker.From.getMonth(),
            1
          );
          this.selectionByTabs();
          this.exportLog();
          break;
        case "custom":
          this.getFromDate = new Date(
            this.datePicker.From.getFullYear(),
            this.datePicker.From.getMonth() + 1,
            this.datePicker.From.getDate()
          );
          break;
      }
    },

    fromDateChange() {
      this.disabledToDate = false;
      let currentTodayDate = new Date().toISOString().substr(0, 10);
      this.minToDate = this.date.to;
      this.date.from = this.date.to;
      //add thirty day select to from date
      var today = new Date();
      let todayDate = today.getDate();
      const thirtyDay = new Date(
        new Date(this.minToDate).setDate(
          new Date(this.minToDate).getDate() + 29
        )
      )
        .toISOString()
        .slice(0, 10);
      //get current month and year
      let currentMonthYear =
        today.getFullYear() +
        "-" +
        (today.getMonth() < 9 ? "0" : "") +
        (today.getMonth() + 1);
      let currentSelectDate = this.date.to.slice(0, 7);
      //if current month and year
      if (currentMonthYear == currentSelectDate) {
        if (todayDate == 31) {
          let firstDate = this.date.to.slice(8, 10);
          if (firstDate === "01") {
            this.maxToDate = thirtyDay;
          } else {
            this.maxToDate = currentTodayDate;
          }
        } else {
          this.maxToDate = currentTodayDate;
        }
      } else {
        //if previous month and year
        let checkCurrentMonth = thirtyDay.slice(0, 7);
        if (checkCurrentMonth == currentMonthYear) {
          this.maxToDate = currentTodayDate;
        } else {
          this.maxToDate = thirtyDay;
        }
      }
    },

    toDateChange() {
      this.getCallDetailList();
    },

    // get list of call details
    async getCallDetailList() {
      this.isLoading = true;
      var fromdate = "";
      var todate = "";
      var currentTime = new Date().toISOString().substr(10);
      if (this.date.from) {
        let date = {};
        date.to = this.date.to + currentTime;
        date.from = this.date.from + currentTime;
        var fromdatewithzero = new Date(date.to);
        var todatewithfivenine = new Date(date.from);
        this.getFromDate =
          new Date(
            fromdatewithzero.getFullYear(),
            fromdatewithzero.getMonth(),
            fromdatewithzero.getDate(),
            0,
            0,
            0,
            0
          ) /
            1000 +
          62167219200;
        this.getToDate =
          new Date(
            todatewithfivenine.getFullYear(),
            todatewithfivenine.getMonth(),
            todatewithfivenine.getDate(),
            23,
            59,
            59,
            999
          ) /
            1000 +
          62167219200;
      } else {
        let previousDate = (this.getFromDate = new Date(
          this.datePicker.From.getFullYear(),
          this.datePicker.From.getMonth(),
          this.datePicker.From.getDate()
        ));
        this.getFromDate =
          new Date(
            this.getFromDate.getFullYear(),
            this.getFromDate.getMonth(),
            this.getFromDate.getDate(),
            0,
            0,
            0,
            0
          ) /
            1000 +
          62167219200;
        var newToDate = new Date();
        this.getToDate =
          new Date(
            newToDate.getFullYear(),
            newToDate.getMonth(),
            newToDate.getDate(),
            23,
            59,
            59,
            999
          ) /
            1000 +
          62167219200;
      }
      this.exportLog();
      let response = await this.getMethod("getCallHistoryList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        createdfrom: this.getFromDate,
        createdto: this.getToDate,
      });
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
      this.callRecordsData = response.chList;
      this.dateGeneratorFromDownload();
    },

    async dateGenerator(datePicker) {
      var dateObj = { From: null, To: null };
      dateObj.From =
        new Date(
          datePicker.From.getFullYear(),
          datePicker.From.getMonth(),
          datePicker.From.getDate(),
          0,
          0,
          0,
          0
        ) /
          1000 +
        62167219200;
      dateObj.To =
        new Date(
          datePicker.To.getFullYear(),
          datePicker.To.getMonth(),
          datePicker.To.getDate(),
          23,
          59,
          59,
          999
        ) /
          1000 +
        62167219200;
      return dateObj;
    },

    async dateGeneratorFromDownload() {
      var currentTime = new Date().toISOString().substr(10);
      let date = {};
      date.to = this.date.to + currentTime;
      date.from = this.date.from + currentTime;
      var fromdatewithzero = new Date(date.to);
      var todatewithfivenine = new Date(date.from);
      this.getFromDate =
        new Date(
          fromdatewithzero.getFullYear(),
          fromdatewithzero.getMonth(),
          fromdatewithzero.getDate(),
          0,
          0,
          0,
          0
        ) /
          1000 +
        62167219200;
      this.getToDate =
        new Date(
          todatewithfivenine.getFullYear(),
          todatewithfivenine.getMonth(),
          todatewithfivenine.getDate(),
          23,
          59,
          59,
          999
        ) /
          1000 +
        62167219200;
      if (this.getToDate) {
        this.exportLog();
      }
    },

    async selectionByTabs() {
      var date = null;
      date = await this.dateGenerator(this.datePicker);
      this.isLoading = true;
      let response = await this.getMethod("getCallHistoryList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        createdfrom: date.From,
        createdto: date.To,
      });
      this.callRecordsData = response.chList;
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
    },

    checkJsonData() {
      if (this.callRecordsData.length == 0) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "No Data Available!",
          color: "success",
        });
      }
    },

    async exportLog() {
      var date = null;
      date = await this.dateGenerator(this.datePicker);
      this.isLoading = true;
      let response = await this.getMethod("exportLog", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        createdfrom: date.From,
        createdto: date.To,
      });
      try {
        this.getCsvData = [];
        // let response = await cdrAPI.getExportLogData(callDetailPassData);
        var lines = response.split("\n");
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
          if (obj.caller_id_number != undefined) {
            this.getCsvData.push(obj);
          }
          if (response) {
            this.isLoading = false;
          }
        }
        // console.log("this.getCsvData", this.getCsvDat                      a);
      } catch (error) {
        this.isLoading = false;
      }
    },
  },
};
</script>
// ********* Call Detail CSS ***************
<style scoped>
.myExportXls {
  margin: -5px 0px 0px 300px;
}
</style>
