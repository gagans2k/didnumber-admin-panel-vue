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
        v-model="selectOption.forwardType"
        @change="clickOnSwitchServer()"
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
        <v-radio value="SIP_URI">
          <template v-slot:label>
            <div class="black--text">Our Own Softswitch</div>
          </template>
        </v-radio>
        <v-radio value="SIP">
          <template v-slot:label>
            <div class="black--text">SIPSETTING</div>
          </template>
        </v-radio>
        <v-radio value="FAX2EMAIL">
          <template v-slot:label>
            <div class="black--text">Fax2Email</div>
          </template>
        </v-radio>
      </v-radio-group>
      <!-- Assigning Regular Numbers type Options -->
      <span v-if="selectOption.forwardType == 'CELL_PHONE'">
        <v-radio-group v-model="selectAssigningTypeOption" class="mt-0 py-3">
          <v-radio value="new">
            <template v-slot:label>
              <div class="black--text">New</div>
            </template>
          </v-radio>
        </v-radio-group>
        <v-text-field
          v-model="selectOption.sipName"
          label="Regular phone"
          type="text"
          disabled
          append-icon="call"
          outlined
          rounded
          dense
        ></v-text-field>
        <v-divider></v-divider>
        <!-- <v-card-actions class="py-3">
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
        </v-card-actions> -->
      </span>
    </v-card-text>

    <!-- Soft switch Input -->
    <v-card-text v-if="selectOption.forwardType == 'SIP_URI'">
      <v-col cols="12" lg="11">
        <v-text-field
          v-model="selectOption.forwardType"
          label="Server Name"
          append-icon="person"
          disabled
          outlined
          rounded
          dense
        ></v-text-field>
        <v-text-field
          v-model="selectOption.forwardTo"
          label="Ip"
          append-icon="person"
          outlined
          disabled
          rounded
          dense
        ></v-text-field>
      </v-col>
    </v-card-text>

    <!-- Sip Setting Input -->
    <v-card-text v-if="selectOption.forwardType == 'SIP'">
      <v-col cols="12" lg="11">
        <v-text-field
          v-model="selectOption.forwardTo"
          label="Device Nickname"
          append-icon="person"
          disabled
          outlined
          rounded
          dense
        ></v-text-field>
        <v-text-field
          v-model="selectOption.userName"
          label="Device Nickname"
          append-icon="person"
          disabled
          outlined
          rounded
          dense
        ></v-text-field>
        <v-col cols="12">
          <v-row>
            <v-text-field
              v-model="selectOption.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              label="Device Nickname"
              outlined
              rounded
              dense
            ></v-text-field>
            <v-btn
              v-clipboard:copy="userDetail.realm"
              v-clipboard:success="handleCopyStatus(true)"
              v-clipboard:error="handleCopyStatus(false)"
              icon
            >
              <v-icon class="mt-2 pl-2"> content_copy </v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-text-field
              v-model="userDetail.realm"
              label="Realm"
              append-icon="person"
              disabled
              outlined
              rounded
              dense
            ></v-text-field>
            <v-btn
              v-clipboard:copy="userDetail.realm"
              v-clipboard:success="handleCopyStatus(true)"
              v-clipboard:error="handleCopyStatus(false)"
              icon
            >
              <v-icon class="mt-2 pl-2"> content_copy </v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-col>
    </v-card-text>
    <!-- Assigning Fax2 Email -->
    <v-card-text class="pt-0" v-show="selectOption.forwardType == 'FAX2EMAIL'">
      <v-row>
        <v-col class="pt-0" cols="12" lg="11">
          <v-text-field
            v-model="selectOption.faxboxName"
            label="email"
            outlined
            rounded
            dense
            append-icon="email"
            disabled
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
            <!-- <v-btn class="px-4 ml-4 primary-btn" outlined @click="assignNumber">
              Assign
            </v-btn> -->
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions v-show="hideBtn">
      <v-btn color="info" class="mx-auto px-4" dark> Renew </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import numberManagerAPI from "@/services/numberManagerAPI.js";

export default {
  props: [
    "assigningNumberData",
    "cellPhoneDeviceData",
    "sipUriDeviceData",
    "softPhoneDeviceData",
    "faxBoxList",
    "selectOption",
  ],
  data() {
    return {
      getSelectedOption: "",
      hideBtn: false,
      showPassword: false,
      selectAssigningTypeOption: "new",
      selectSoftSwitchInput: "",
      userDetail: {},
    };
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    // this.getSelectedOption = this.selectOption;
  },
  methods: {
    clickOnSwitchServer() {
      this.$emit("switchServerModal");
    },
    closeAssignNumberModal() {
      this.$emit("closeModal");
    },
    // async assignNumber() {
    //   var asignNumberData = {
    //     accountId: this.userDetail.accountId,
    //     authToken: this.userDetail.authToken,
    //     callflowId: this.selectOption.callflowId,
    //     cellPhone: this.selectOption.name,
    //     inventoryItemId: this.selectOption.inventoryItemId,
    //     didNumber: this.selectOption.didNumber,
    //   };
    //   try {
    //     let response = await numberManagerAPI.assignCellPhone(asignNumberData);
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
    handleCopyStatus(status) {
    },
  },
};
</script>