<template>
  <v-card>
    <v-toolbar elevation="0"
      ><v-card-title class="px-0"> Assigning Number </v-card-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeAssignNumberModal">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pb-0">
      <p class="pt-2 pb-0">
        <b>Choose one of the following forward Options:</b>
      </p>
      <!-- Assigning Numbers Options -->
      <v-radio-group
        v-model="selectOption"
        @change="getSelectOption(selectOption)"
        class="pt-0 pb-2"
      >
        <v-radio value="CELL_PHONE">
          <template v-slot:label>
            <div class="black--text">Regular phone</div>
          </template>
        </v-radio>
        <v-radio value="Duckduckgo">
          <template v-slot:label>
            <div class="black--text">
              DIDnPBX <small> (Our Free Fully Hosted PBX)</small>
            </div>
          </template>
        </v-radio>
        <v-radio value="Softswitch">
          <template v-slot:label>
            <div class="black--text">Our Own Softswitch</div>
          </template>
        </v-radio>
        <v-radio value="SIPSETTING">
          <template v-slot:label>
            <div class="black--text">SIPSETTING</div>
          </template>
        </v-radio>
        <v-radio value="Fax2Email">
          <template v-slot:label>
            <div class="black--text">Fax2Email</div>
          </template>
        </v-radio>
      </v-radio-group>
      <!-- Assigning Regular Numbers type Options -->
      <v-radio-group
        v-show="showRegularPhone"
        v-model="selectAssigningTypeOption"
        @change="getSelectAssigningType"
        class="mt-0 py-3"
      >
        <v-radio value="new">
          <template v-slot:label>
            <div class="black--text">New</div>
          </template>
        </v-radio>
        <v-radio value="existing">
          <template v-slot:label>
            <div class="black--text">Existing</div>
          </template>
        </v-radio>
      </v-radio-group>
      <span v-show="showRegularPhoneInput">
        <v-text-field
          v-model="cellPhoneNumber.name"
          label="Regular phone"
          type="number"
          append-icon="call"
          outlined
          rounded
          dense
        ></v-text-field>
        <v-divider></v-divider>
        <v-card-actions class="py-3">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            class="px-4"
            outlined
            @click="closeAssignNumberModal"
          >
            Cancel
          </v-btn>
          <v-btn class="px-4 ml-4 primary-btn" outlined @click="assignNumber">
            Assign
          </v-btn>
        </v-card-actions>
      </span>
    </v-card-text>
    <v-card-text class="pb-0" v-show="showRegularPhoneSelectList">
      <v-select
        :items="cellPhoneDeviceData"
        v-model="cellPhoneNumber"
        label="Regular phone"
        append-icon="call"
        outlined
        rounded
        dense
      >
        <template v-slot:item="{ item }">
          <span color="black"> {{ item.name }}</span>
        </template>
        <template v-slot:selection="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          class="px-4"
          outlined
          @click="closeAssignNumberModal"
          dark
        >
          Cancel
        </v-btn>
        <v-btn class="px-4 ml-4 primary-btn" outlined @click="assignNumber">
          Assign
        </v-btn>
      </v-card-actions>
    </v-card-text>

    <!-- Our Own Softswitch-->
    <v-col class="pt-0" v-show="showSoftswitch">
      <v-card-title class="pt-0">
        No Server Available, Try to create New Server.
      </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          class="px-4"
          outlined
          @click="closeAssignNumberModal"
        >
          Cancel
        </v-btn>
        <v-btn class="px-6 mx-4 primary-btn" outlined @click="editSoftSwitch">
          Edit Server
        </v-btn>
      </v-card-actions>
    </v-col>
    <!-- Soft switch Input -->
    <v-card-text v-show="showSoftswitchRadio">
      <v-col cols="12" lg="11">
        <v-radio-group
          v-model="selectSoftSwitchInput"
          @change="getSoftswitchType"
          class="mt-0 py-3"
        >
          <v-radio value="new">
            <template v-slot:label>
              <div class="black--text">New</div>
            </template>
          </v-radio>
          <v-radio value="existing">
            <template v-slot:label>
              <div class="black--text">Existing</div>
            </template>
          </v-radio>
        </v-radio-group>
        <span v-show="showSoftswitchInput">
          <v-text-field
            v-model="getSelectSoftSwitchData.server_name"
            label="Server Name"
            append-icon="person"
            outlined
            rounded
            dense
          ></v-text-field>
          <v-text-field
            v-model="getSelectSoftSwitchData.ip"
            label="Ip"
            append-icon="person"
            outlined
            rounded
            dense
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              class="px-4"
              dark
              @click="closeAssignNumberModal"
              outlined
            >
              Cancel
            </v-btn>
            <v-btn
              class="px-4 ml-4 primary-btn"
              outlined
              @click="addConnectivityServersData"
            >
              Assign
            </v-btn>
          </v-card-actions>
        </span>
        <span v-show="showSoftswitchList">
          <v-select
            :items="sipUriDeviceData"
            v-model="softSwitchData"
            label="Select Softswitch"
            @change="getSelectSoftSwitch"
            append-icon="person"
            outlined
            rounded
            dense
          >
            <template v-slot:item="{ item }">
              <span color="black"> {{ item.server_name }}</span>
            </template>
            <template v-slot:selection="{ item }">
              {{ item.server_name }}
            </template>
          </v-select>
          <v-text-field
            v-model="getSelectSoftSwitchData.server_name"
            label="Server Name"
            append-icon="person"
            outlined
            rounded
            disabled
            dense
          ></v-text-field>
          <v-text-field
            v-model="getSelectSoftSwitchData.ip"
            label="Ip"
            append-icon="person"
            outlined
            rounded
            disabled
            dense
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              class="px-4"
              outlined
              @click="closeAssignNumberModal"
              dark
            >
              Cancel
            </v-btn>
            <v-btn
              class="px-4 ml-4 primary-btn"
              outlined
              @click="assignDidToServersData"
            >
              Assign
            </v-btn>
          </v-card-actions>
        </span>
      </v-col>
    </v-card-text>

    <!-- Assigning Fax2 Email -->
    <v-card-text class="pt-0" v-show="showFaxEmail">
      <v-row>
        <v-col class="pt-0" cols="12" lg="11">
          <v-radio-group
            v-model="selectFaxEmailOption"
            @change="getFaxEmailType()"
            class="mt-0"
          >
            <v-radio value="new">
              <template v-slot:label>
                <div class="black--text">New</div>
              </template>
            </v-radio>
            <v-radio value="existing">
              <template v-slot:label>
                <div class="black--text">Existing</div>
              </template>
            </v-radio>
          </v-radio-group>
          <span v-show="showFaxEmailInput">
            <v-text-field
              v-model="faxEmail"
              label="email"
              outlined
              rounded
              dense
              append-icon="email"
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                class="px-4"
                outlined
                dark
                @click="closeAssignNumberModal"
              >
                Cancel
              </v-btn>
              <v-btn
                outlined
                class="px-4 ml-4 primary-btn"
                dark
                @click="assignFaxEmail"
              >
                Assign
              </v-btn>
            </v-card-actions>
          </span>
          <span v-show="showFaxEmailSelectList">
            <v-select
              :items="faxBoxList"
              item-text="name"
              item-value="name"
              v-model="faxEmail"
              label="Select Email"
              append-icon="call"
              outlined
              rounded
              dense
            ></v-select>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                class="px-4"
                outlined
                @click="closeAssignNumberModal"
                dark
              >
                Cancel
              </v-btn>
              <v-btn
                class="px-4 ml-4 primary-btn"
                outlined
                @click="assignFaxEmail"
              >
                Assign
              </v-btn>
            </v-card-actions>
          </span>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Sip Settting Option-->
    <v-col class="pt-0" v-show="showSipSetting">
      <v-card-title class="pt-0">
        No device Available, Try to create New device.
      </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          class="px-4"
          outlined
          @click="closeAssignNumberModal"
        >
          Cancel
        </v-btn>
        <v-btn class="px-6 mx-4 primary-btn" outlined @click="newSipSetting">
          New
        </v-btn>
      </v-card-actions>
    </v-col>
    <!-- Sip Setting Input -->
    <v-card-text class="pb-0" v-show="showSipSettingInput">
      <v-col cols="12" lg="11">
        <v-radio-group
          v-model="selectSipSettingInput"
          @change="getSelectSipSettingType"
          class="mt-0 py-3"
        >
          <v-radio value="new">
            <template v-slot:label>
              <div class="black--text">New</div>
            </template>
          </v-radio>
          <v-radio value="existing">
            <template v-slot:label>
              <div class="black--text">Existing</div>
            </template>
          </v-radio>
        </v-radio-group>
        <span v-show="showSipSettingPhoneInput">
          <v-text-field
            v-model="getPhoneDevideData"
            label="Device Nickname"
            append-icon="person"
            outlined
            rounded
            dense
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              class="px-4"
              dark
              @click="closeAssignNumberModal"
              outlined
            >
              Cancel
            </v-btn>
            <v-btn
              class="px-4 ml-4 primary-btn"
              outlined
              @click="assignSipSetting"
            >
              Assign
            </v-btn>
          </v-card-actions>
        </span>
      </v-col>
    </v-card-text>
    <v-card-text class="pb-0" v-show="showSipSettingSelectList">
      <v-select
        :items="softPhoneDeviceData"
        item-text="name"
        item-value="name"
        v-model="getPhoneDevideData"
        label="Regular phone"
        append-icon="call"
        outlined
        rounded
        dense
      ></v-select>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          class="px-4"
          outlined
          @click="closeAssignNumberModal"
          dark
        >
          Cancel
        </v-btn>
        <v-btn class="px-4 ml-4 primary-btn" outlined @click="assignSipSetting">
          Assign
        </v-btn>
      </v-card-actions>
    </v-card-text>

    <!-- <v-card-actions v-show="hideBtn">
      <v-btn color="info" class="mx-auto px-4" dark> Renew </v-btn>
    </v-card-actions> -->
    <loading :active="isLoading" :loader="loader" />
  </v-card>
</template>

<script>
import numberManagerAPI from "@/services/numberManagerAPI.js";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";

export default {
  components: {
    Loading,
  },
  props: [
    "assigningNumberData",
    "cellPhoneDeviceData",
    "sipUriDeviceData",
    "softPhoneDeviceData",
    "faxBoxList",
  ],
  data() {
    return {
      getSelectedOption: "",
      hideBtn: false,
      selectAssigningTypeOption: "new",
      showRegularPhone: false,
      showRegularPhoneInput: false,
      cellPhoneNumber: "",
      getPhoneDevideData: "",
      selectSoftSwitchInput: "existing",
      userDetail: {},
      showRegularPhoneSelectList: false,
      showSipSettingInput: false,
      showFaxEmail: false,
      showSipSetting: false,
      showSipSettingPhoneInput: false,
      showSipSettingSelectList: false,
      showFaxEmailInput: false,
      showFaxEmailSelectList: false,
      showSoftswitch: false,
      showSoftswitchInput: false,
      showSoftswitchRadio: false,
      showSoftswitchList: false,
      selectFaxEmailOption: "new",
      selectSipSettingInput: "new",
      faxToMail: "",
      faxEmail: "",
      selectOption: "Duckduckgo",
      softSwitchData: {},
      getSelectSoftSwitchData: {},
      isLoading: false,
      loader: "bars",
    };
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
    getSelectOption() {
      if (this.selectOption == "CELL_PHONE") {
        this.showRegularPhone = true;
        this.showRegularPhoneInput = true;
        this.showFaxEmail = false;
        this.showSipSetting = false;
        this.showSipSettingInput = false;
        this.showSipSettingPhoneInput = false;
        this.showSipSettingSelectList = false;
        this.showFaxEmailSelectList = false;
        this.showFaxEmailInput = false;
        this.showSoftswitch = false;
        this.showSoftswitchRadio = false;
      } else if (this.selectOption == "Fax2Email") {
        this.showFaxEmail = true;
        this.showRegularPhone = false;
        this.showRegularPhoneInput = false;
        this.showRegularPhoneSelectList = false;
        this.showSipSettingInput = false;
        this.showSipSetting = false;
        this.showSipSettingPhoneInput = false;
        this.showSipSettingSelectList = false;
        this.showFaxEmailSelectList = false;
        this.showFaxEmailInput = true;
        this.showSoftswitchRadio = false;
        this.showSoftswitch = false;
      } else if (this.selectOption == "SIPSETTING") {
        this.showSipSetting = true;
        this.showSipSettingPhoneInput = true;
        this.showSipSettingSelectList = false;
        this.showRegularPhone = false;
        this.showFaxEmail = false;
        this.showRegularPhoneInput = false;
        this.showRegularPhoneSelectList = false;
        this.showSipSettingInput = false;
        this.showFaxEmailSelectList = false;
        this.showFaxEmailInput = false;
        this.showSoftswitch = false;
        this.showSoftswitchRadio = false;
      } else if (this.selectOption == "Softswitch") {
        this.showSoftswitch = true;
        this.showSoftswitchRadio = false;
        this.showSipSetting = false;
        this.showSipSettingPhoneInput = false;
        this.showSipSettingSelectList = false;
        this.showRegularPhone = false;
        this.showFaxEmail = false;
        this.showRegularPhoneInput = false;
        this.showRegularPhoneSelectList = false;
        this.showSipSettingInput = false;
        this.showFaxEmailSelectList = false;
        this.showFaxEmailInput = false;
        this.showSoftswitchInput = false;
      } else if (this.selectOption == "Duckduckgo") {
        this.showSoftswitch = false;
        this.showSoftswitchRadio = false;
        this.showSipSetting = false;
        this.showSipSettingPhoneInput = false;
        this.showSipSettingSelectList = false;
        this.showRegularPhone = false;
        this.showFaxEmail = false;
        this.showRegularPhoneInput = false;
        this.showRegularPhoneSelectList = false;
        this.showSipSettingInput = false;
        this.showFaxEmailSelectList = false;
        this.showFaxEmailInput = false;
        this.showSoftswitchInput = false;
      }
    },
    getSelectAssigningType() {
      //   "this.selectAssigningTypeOption",
      //   this.selectAssigningTypeOption
      // );
      if (this.selectAssigningTypeOption == "new") {
        this.showRegularPhoneInput = true;
        this.showRegularPhoneSelectList = false;
      }
      if (this.selectAssigningTypeOption == "existing") {
        this.showRegularPhoneSelectList = true;
        this.showRegularPhoneInput = false;
      }
    },
    getSelectSipSettingType() {
      if (this.selectSipSettingInput == "new") {
        this.showSipSettingPhoneInput = true;
        this.showSipSettingSelectList = false;
      }
      if (this.selectSipSettingInput == "existing") {
        this.showSipSettingPhoneInput = false;
        this.showSipSettingSelectList = true;
      }
    },
    getFaxEmailType() {
      // this.showFaxEmail = true;
      if (this.selectFaxEmailOption == "new") {
        this.showFaxEmailInput = true;
        this.showFaxEmailSelectList = false;
      }
      if (this.selectFaxEmailOption == "existing") {
        this.showFaxEmailInput = false;
        this.showFaxEmailSelectList = true;
      }
    },
    getSoftswitchType() {
      if (this.selectSoftSwitchInput == "new") {
        this.showSoftswitchInput = true;
        this.showSoftswitchList = false;
      }
      if (this.selectSoftSwitchInput == "existing") {
        this.showSoftswitchInput = false;
        this.showSoftswitchList = true;
      }
    },
    newSipSetting() {
      this.showSipSettingInput = true;
    },
    editSoftSwitch() {
      this.showSoftswitchRadio = true;
      this.showSoftswitchList = true;
    },
    getSelectSoftSwitch() {
      this.getSelectSoftSwitchData = {
        server_name: this.softSwitchData.server_name,
        ip: this.softSwitchData.auth.ip,
      };
    },
    closeAssignNumberModal() {
      this.$emit("closeModal");
    },
    async assignNumber() {
      this.isLoading = true;
      var asignNumberData = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
        callflowId: this.userDetail.callflowId,
        cellPhone: this.cellPhoneNumber.name,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
        didNumber: this.assigningNumberData.didNumber,
      };
      if (this.cellPhoneNumber.id) {
        asignNumberData.deviceId = this.cellPhoneNumber.id;
      }
      try {
        let response = await numberManagerAPI.assignCellPhone(asignNumberData);
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.$emit("closedAssignedModal");
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
      }
    },
    async assignDidToServersData() {
      this.isLoading = true;
      var didToServerObj = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
        ip: this.getSelectSoftSwitchData.server_name,
        serverName: this.getSelectSoftSwitchData.ip,
      };
      try {
        let response = await numberManagerAPI.assignDidToServers(
          didToServerObj
        );
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.$emit("closedAssignedModal");

        this.isLoading = false;
      } catch (error) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
        this.isLoading = false;
      }
    },
    async addConnectivityServersData() {
      this.isLoading = true;
      var didToServerObj = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
        ip: this.getSelectSoftSwitchData.server_name,
        serverName: this.getSelectSoftSwitchData.ip,
      };
      try {
        let response = await numberManagerAPI.addConnectivityServers(
          didToServerObj
        );
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.$emit("closedAssignedModal");

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
      }
    },
    async assignSipSetting() {
      this.isLoading = true;
      var didToServerObj = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
        callflowId: this.userDetail.callflowId,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
        didNumber: this.assigningNumberData.didNumber,
        sipName: this.getPhoneDevideData,
      };
      if (this.cellPhoneNumber.id) {
        didToServerObj.deviceId = this.cellPhoneNumber.id;
      }
      try {
        let response = await numberManagerAPI.assignSip(didToServerObj);
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.$emit("closedAssignedModal");

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
      }
    },
    async assignFaxEmail() {
      this.isLoading = true;
      var assignFaxBox2EmailObj = {
        accountId: this.userDetail.accountId,
        authToken: this.userDetail.authToken,
        callflowId: this.userDetail.callflowId,
        deviceId: this.cellPhoneNumber.id,
        inventoryItemId: this.assigningNumberData.inventoryItemId,
        didNumber: this.assigningNumberData.didNumber,
        email: this.faxEmail,
      };
      try {
        let response = await numberManagerAPI.assignFaxBox2Email(
          assignFaxBox2EmailObj
        );
        this.$root.$emit("SHOW_SNACKBAR", {
          text: response.responseMessage,
          color: "success",
        });
        this.$emit("closedAssignedModal");

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong!",
          color: "error",
        });
      }
    },
    // if already assign number but now chnage the another server
    // async deleteCallFlow() {
    //   // deleteCallFlow
    //   var deleteCallFlowData = {
    //     accountId: this.userDetail.accountId,
    //     callflowId: this.userDetail.callflowId,
    //     didNumber: this.cellPhoneNumber,
    //     inventoryItemId: this.assigningNumberData.inventoryItemId,
    //   };
    //   try {
    //     let response = await numberManagerAPI.deleteCallFlow(
    //       deleteCallFlowData
    //     );
    //     this.$root.$emit("SHOW_SNACKBAR", {
    //       text: response.responseMessage,
    //       color: "success",
    //     });
    //   } catch (error) {
    //     this.$root.$emit("SHOW_SNACKBAR", {
    //       text: "something wrong!",
    //       color: "error",
    //     });
    //   }
    // },
    // async assignFaxNumber() {
    // try {
    //   let response = await numberManagerAPI.assignCellPhone(asignNumberData);
    //   this.$root.$emit("SHOW_SNACKBAR", {
    //     text: response.responseMessage,
    //     color: "success",
    //   });
    // } catch (error) {
    //   this.$root.$emit("SHOW_SNACKBAR", {
    //     text: "something wrong!",
    //     color: "error",
    //   });
    // }
    // },
  },
};
</script>