<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title> Registration Details </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="5" lg="5" md="5" xs="5">
              <v-card-subtitle> <b>Realm :</b> </v-card-subtitle>
              <v-card-subtitle> <b>Account Name :</b> </v-card-subtitle>
              <v-card-subtitle> <b>User :</b> </v-card-subtitle>
            </v-col>

            <v-col cols="7" lg="7" md="7" xs="7">
              <v-card-subtitle>{{
                registrationDetail.account_realm
              }}</v-card-subtitle>
              <v-card-subtitle>{{
                registrationDetail.account_name
              }}</v-card-subtitle>
              <v-card-subtitle>{{
                registrationDetail.from_user
              }}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card elevation="2">
      <v-tabs
        v-model="selectedTab"
        background-color="transparent"
        color="basil"
        grow
      >
        <v-tab
          v-for="(tab, box) in items"
          :key="box"
          @change="tabClickHandler(box)"
        >
          {{ tab }}
        </v-tab>
        <!-- <v-tab>LIVE CALL</v-tab>
        <v-tab>CURRENT REGISTRATION</v-tab> -->
      </v-tabs>
      <v-tabs-items v-model="selectedTab">
        <v-tab-item>
          <loading :active="isLoading" :loader="loader" />
          <v-card color="basil" flat>
            <v-card-text>
              <v-data-table :headers="liveCallHeaders" :items="liveCallList">
                <template v-slot:[`item.indexNo`]="{ item }">
                  <!-- {{
                    (options.page - 1) * options.itemsPerPage +
                    (liveCallList.indexOf(item) + 1)
                  }} -->
                  {{ liveCallList.indexOf(item) + 1 }}
                </template>
                <!-- <template v-slot:[`item.orderId`]="{ item }">
                  {{ item.orderId }}
                </template>
                <template v-slot:[`item.orderType`]="{ item }">
                  {{ item.orderType }}
                </template> -->
                <template v-slot:[`item.statusId`]="{ item }">
                  {{
                    capitalizeText(
                      item.statusId == true ? "Connected" : "Connecting"
                    )
                  }}
                </template>
                <!-- <template v-slot:[`item.orderDate`]="{ item }">
                  {{ moment(item.orderDate).format("MMMM Do YYYY, h:mm:ss a") }}
                </template>
                <template v-slot:[`item.grandTotal`]="{ item }">
                  ${{ item.grandTotal }}
                </template>
                <template v-slot:[`item.viewAction`]="{ item }">
                  <v-icon @click="viewOrder(item)" color="info"
                    >visibility</v-icon
                  >
                </template> -->
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <loading :active="isLoading" :loader="loader" />
          <v-card color="basil" flat>
            <v-card-text>
              <v-data-table
                :headers="currentHeaders"
                :items="currentList"
                :server-items-length="totalRegistrationItem"
                :options.sync="options"
              >
                <template v-slot:[`item.indexNo`]="{ item }">
                  {{
                    (options.page - 1) * options.itemsPerPage +
                    (currentList.indexOf(item) + 1)
                  }}</template
                >
                <template v-slot:[`item.orderId`]="{ item }">
                  {{ item.orderId }}
                </template>
                <template v-slot:[`item.orderType`]="{ item }">
                  {{ item.orderType }}
                </template>
                <template v-slot:[`item.statusId`]="{ item }">
                  {{ capitalizeText(item.statusId) }}
                </template>
                <template v-slot:[`item.orderDate`]="{ item }">
                  {{ moment(item.orderDate).format("MMMM Do YYYY, h:mm:ss a") }}
                </template>
                <template v-slot:[`item.grandTotal`]="{ item }">
                  ${{ item.grandTotal }}
                </template>
                <template v-slot:[`item.viewAction`]="{ item }">
                  <v-icon @click.stop="openDialog(item)" color="info"
                    >visibility</v-icon
                  >
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import liveCallList from "@/services/liveCallAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      socket: "",
      dialog: false,
      selectedTab: null,
      items: ["LIVE CALL", "CURRENT REGISTRATION"],
      // items2: [
      //   'CURRENT REGISTRATION'
      // ],
      registrationDetail: {},
      isLoading: false,
      //fullPage: false,
      loader: "bars",
      moment: moment,
      options: {},
      totalCallItem: 0,
      totalRegistrationItem: 0,
      liveCallHeaders: [
        {
          text: "#",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "Caller Number",
          value: "callee_id_number",
          align: "center",
          sortable: false,
        },
        {
          text: "Destination",
          value: "destination",
          align: "center",
          sortable: false,
        },
        {
          text: "Status",
          value: "answered",
          align: "center",
          sortable: false,
        },
        {
          text: "Time Elapsed In Second ",
          value: "elapsed_s",
          align: "center",
          sortable: false,
        },
      ],
      liveCallList: [],
      currentHeaders: [
        {
          text: "#",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "User Name",
          value: "username",
          align: "center",
          sortable: false,
        },
        {
          text: "User Agent",
          value: "user_agent",
          align: "center",
          sortable: false,
        },
        {
          text: "Contact IP",
          value: "contact_ip",
          align: "center",
          sortable: false,
        },
        {
          text: "Details",
          value: "viewAction",
          align: "center",
          sortable: false,
        },
      ],
      currentList: [],
    };
  },
  watch: {
    options: {
      handler() {
        // this.getLiveCallDetails();
        //  this.getRegistrationsData();
      },
      deep: true,
    },
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getLiveCallDetails();

    // var socket = new WebSocket(process.env.VUE_APP_SOCKET_URL);
    // let $scope = this;
    // function send(data) {
    //   socket.send(JSON.stringify(data));
    // }
    // socket.onopen = function () {
    //   send({
    //     action: "subscribe",
    //     auth_token: localStorage.getItem("authToken"),//autNew
    //     request_id: this.userDetail.accountId,
    //     data: {
    //       account_id: this.userDetail.accountId,
    //       binding: "call.CHANNEL_CREATE.*",
    //     },
    //   });
    //   send({
    //     action: "subscribe",
    //     auth_token: localStorage.getItem("authToken"),
    //     request_id: this.userDetail.accountId,
    //     data: {
    //       account_id: this.userDetail.accountId,
    //       binding: "call.CHANNEL_ANSWER.*",
    //     },
    //   });
    //   send({
    //     action: "subscribe",
    //     auth_token: localStorage.getItem("authToken"),
    //     request_id: this.userDetail.accountId,
    //     data: {
    //       account_id: this.userDetail.accountId,
    //       binding: "call.CHANNEL_DESTROY.*",
    //     },
    //   });
    //   send({
    //     action: "subscribe",
    //     auth_token: localStorage.getItem("authToken"),
    //     request_id: this.userDetail.accountId,
    //     data: {
    //       account_id: this.userDetail.accountId,
    //       bindings: ["doc_created.*.user.*", "doc_edited.*.user.*"],
    //     },
    //   });
    // };
    // socket.onmessage = function (raw_message) {
    //   var json_data = JSON.parse(raw_message.data);
    //   if (
    //     json_data.name == "CHANNEL_CREATE" &&
    //     json_data.data.call_direction == "outbound"
    //   ) {
    //     $scope.liveCallList = [];
    //     $scope.$apply(function () {
    //       $scope.liveCallList.push(json_data);
    //     });
    //   } else if (
    //     json_data.name == "CHANNEL_ANSWER" &&
    //     json_data.data.call_direction == "outbound"
    //   ) {
    //     $scope.liveCallList = [];
    //     $scope.$apply(function () {
    //       $scope.liveCallList.push(json_data);
    //     });
    //   } else if (json_data.name == "CHANNEL_DESTROY") {
    //     $scope.$apply(function () {
    //       $scope.liveCallList = [];
    //     });
    //   }
    // };
  },

  methods: {
    tabClickHandler(indexValue) {
      if (indexValue == 1) {
        this.getRegistrationsData();
      } else {
        // this.getLiveCallDetails();
      }
    },
    openDialog(item) {
      // console.log(item);
      this.registrationDetail = item;
      this.dialog = true;
    },
    async getLiveCallDetails() {
      this.isLoading = true;
      var liveCallJson = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
      };
      try {
        let response = await liveCallList.getLiveCallDetails(liveCallJson);
        // console.log("response=======>?", response);
        this.liveCallList = response.liveCallsList;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        //console.log("====error===", error);
      }
    },

    async getRegistrationsData() {
      this.isLoading = true;
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var currentRegistrationListJoson = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
      };
      try {
        let response = await liveCallList.getRegistrationsData(
          currentRegistrationListJoson
        );
        if (response.responseMessage == "success") {
          this.isLoading = false;
        }
        this.totalRegistrationItem = response.registrations.length;
        this.currentList = response.registrations;
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