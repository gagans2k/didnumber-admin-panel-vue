<template>
  <v-data-table
    :headers="headers"
    :items="deviceListArray"
    :server-items-length="totalDeviceItem"
    :options.sync="options"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Device</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <!-- basic setting for adding device New -->
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">BASIC SETTINGS</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-select :items="optionSelectValues"
                item-text="text"
                item-value="value"
                v-model="AddDeviceDataJson.device_type"
                v-on:change="onChange(AddDeviceDataJson.device_type)"
                label="Authentication Method"
                outlined
                dense
                >
                </v-select>
                <v-text-field
                  v-model="AddDeviceDataJson.sipDeviceName"
                  outlined
                  dense
                  label="Device Name"
                ></v-text-field>
                <v-text-field v-if="userpasswordShow"
                  v-model="AddDeviceDataJson.userName"
                  label="Username"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field v-if="userpasswordShow"
                  v-model="AddDeviceDataJson.password"
                  label="Password"
                  outlined
                  dense
                ></v-text-field>
              <!-- sip:user//extension -->
                <div v-if="sipUrlShow">
              <v-text-field
                  v-model="AddDeviceDataJson.ip"
                  label="sip:"
                  hint="user//extension"
                  outlined
                  dense
                ></v-text-field>
                <!-- IP//SIP URI -->
                <v-text-field
                  v-model="AddDeviceDataJson.domain"
                  label="IP//SIP URI"
                  hint=" Url must be like this sip:support@company.com"
                  outlined
                  dense
                ></v-text-field>
                <!-- port -->
                <v-text-field
                  v-model="AddDeviceDataJson.port"
                  label="Port"
                  hint="Default port is 5060"
                  outlined
                  dense
                ></v-text-field>
              </div>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="addDevice()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- sip settings for edit device -->
        <v-dialog
          v-model="dialogEdit"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-text-field
                v-model="deviceDetail.device_type"
                label="Authentication Method"
                outlined
                readonly
                dense
                >
                </v-text-field>
                <v-text-field v-if="userpasswordShowOnEdit"
                  v-model="deviceDetail.realm"
                  label="Realm"
                  outlined
                  readonly
                  dense 
                ></v-text-field>
                <v-text-field
                  v-model="deviceDetail.name"
                   outlined
                  dense
                  label="Device Name"
                ></v-text-field>
                <v-text-field v-if="userpasswordShowOnEdit"
                  v-model="deviceDetail.sip.username"
                  label="Username"
                  readonly
                  outlined
                  dense
                ></v-text-field>
                <v-text-field v-if="userpasswordShowOnEdit"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  v-model="deviceDetail.sip.password"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-2"
                  label="Visible"
                  hint="At least 8 characters"
                  value="wqfasds"
                  class="input-group--focused"
                  @click:append="show2 = !show2"
                  outlined
                  dense
                  readonly
                ></v-text-field>
              <!-- Route:sip:user//extension -->
                <v-text-field v-if="sipUrlShowOnEdit"
                  v-model="deviceDetail.sip.route"
                  label="sip:support@company.com"
                  outlined
                  dense
                ></v-text-field>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeEdit"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="editDeviceData()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Would you like to delete the Device?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- <template>
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template> -->
    <template v-slot:[`item.indexNo`]="{ item }">
          {{
            (options.page - 1) * options.itemsPerPage +
            (deviceListArray.indexOf(item) + 1)
          }}
    </template>
    <template v-slot:[`item.viewAction`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import deviceAPI from "@/services/deviceAPI.js";
export default {
  data() {
    return {
      editData:{},
      show2: true,
      deviceDetail: {},
      AddDeviceDataJson:{},
      route:"",
      sipDeviceName: "",
      sipIp: "",
      itemidDelete:"",
      uri: "",
      sipPort: "",
      device_type: "",
      deviceIdEdit:"",
      dialog: false,
      dialogEdit:false,
      dialogDelete: false,
      optionSelectValues: [
        { text: "SIP URL", value: "sip_uri" },
        { text: "Password", value: "softphone" },
      ],
      editedItem: "abc",
      valueNew: "",
      e1: true,
      Realm: "",
      devicename: "",
      sipUrlShow: false,
      sipUrlShowOnEdit: false,
      userpasswordShowOnEdit:false,
      userpasswordShow: false,
      totalDeviceItem: 0,
      options: {},
      headers: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "Device Name	",
          align: "start",
          //sortable: false,
          value: "name",
        },
        {
          text: "Status",
          value: "enabled",
        },
        {
          text: "Type",
          value: "device_type",
        },
        {
          text: "Actions",
          value: "viewAction",
          //sortable: false,
        },
      ],
      deviceListArray: [],
      // editedIndex: -1,
      // editedItem: {
      //   name: '',
      //   calories: 0,
      //   fat: 0,
      //   carbs: 0,
      //   protein: 0,
      // },
      // defaultItem: {
      //   name: '',
      //   calories: 0,
      //   fat: 0,
      //   carbs: 0,
      //   protein: 0,
      // },
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "SIP SETTINGS";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogEdit(val){
      val || this.closeEdit();
    },
    options: {
      handler() {
        this.getDeviceList();
      },
      deep: true,
    },
  },

  created() {
    this.getDeviceList();
    this.getUsernameForDevice();
    //this.getAccountDetail();
  },

  methods: {
    onChange(value) {
      if (value == "sip_uri") {
        this.sipUrlShow = true;
        this.userpasswordShow = false;
      } else {
        this.sipUrlShow = false;
        this.userpasswordShow = true;
      }
    },

    async getDeviceList() {
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var deviceDataJson = {
        accountId: this.userDetail.accountId,
      };
      this.isLoading = true;
      // const { page, itemsPerPage } = this.options;
      try {
        let response = await deviceAPI.getDeviceList(deviceDataJson);
        this.isLoading = false;
        this.deviceListArray = response.deviceList.reverse();
        this.totalDeviceItem = response.deviceList.length;
      } catch (error) {
        this.isLoading = false;
      }
    },

    async getAccountsDetails() {
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var deviceDataJson = {
        accountId: this.userDetail.accountId,
      };
      this.isLoading = true;
      try {
        let response = await deviceAPI.getAccountsDetails(deviceDataJson);
        this.isLoading = false;
      //this.deviceListArray = response.deviceList;
      } catch (error) {
        this.isLoading = false;
      }
    },

    async getUsernameForDevice() {
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var UsernameForDevice = {
        accountId: this.userDetail.accountId,
      };
      try {
        let response = await deviceAPI.getUsernameForDevice(UsernameForDevice);
        if (response.usernameDetails) {
          this.AddDeviceDataJson = response.usernameDetails;
          this.AddDeviceDataJson.userName = this.AddDeviceDataJson.userName;
          this.AddDeviceDataJson.password = this.AddDeviceDataJson.password;
        } else {
        }
      } catch (error) {
        this.isLoading = false;
      }
    },

    async editItem(item){  
      this.deviceIdEdit = item.id;     
      if (item.device_type == "sip_uri") {
        this.sipUrlShowOnEdit = true;
        this.userpasswordShowOnEdit = false;
      } else {
        this.sipUrlShowOnEdit = false;
        this.userpasswordShowOnEdit = true;
      }
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var getDeviceDetailsDataJson = {
        accountId: this.userDetail.accountId,
        deviceId: item.id,
      };
      this.getAccountDetail();
      try {
          let response = await deviceAPI.getDeviceDetails(getDeviceDetailsDataJson);
          if (response.responseMessage === "success") {
            this.deviceDetail = response.deviceDetails;
            if( this.deviceDetail.name == undefined){
                //toaster.error("Device name is required.");
            }else{
                this.editData.accountId = this.userDetails.partyDetail.accountId;
                this.editData.authToken = this.userDetails.partyDetail.authToken;
                this.editData.deviceId = item.id;
                this.editData.sipUriName = this.deviceDetail.name;
                if(this.deviceDetail.device_type == "sip_uri"){
                    this.editData.route = this.deviceDetail.sip.route;
                    this.editData.userName = this.deviceDetail.sip.username;
                    this.editData.password = this.deviceDetail.sip.password;
                }else{
                    this.editData.userName = this.deviceDetail.sip.username;
                    this.editData.password = this.deviceDetail.sip.password;
                }
            }
          } 
        } catch (error) {
          this.isLoading = false;
      }
      this.dialogEdit = true;     
    },

    async getAccountDetail(){
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var getDeviceDetailsDataJson = {
        accountId: this.userDetail.accountId,
      };
      try {
          let response = await deviceAPI.getAccountDetail(getDeviceDetailsDataJson);
          if (response.responseMessage === "success") {
            this.deviceDetail.realm = response.accountdetails.realm;
          } 
        } catch (error) {
          this.isLoading = false;
      }
    },

    async editDeviceData(){
      // this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      // var getDeviceDetailsDataJson = {
      //   accountId: this.userDetail.accountId,
      //   deviceId: this.deviceIdEdit,
      // };
      // try {
      //     let response = await deviceAPI.getDeviceDetails(getDeviceDetailsDataJson);
      //     if (response.responseMessage === "success") {
      //       this.deviceDetail = response.deviceDetails;
      //       if( this.deviceDetail.name == undefined){
      //           setTimeout(() => {
      //             this.$root.$emit("SHOW_SNACKBAR", {
      //               text: "Device name is required.",
      //               color: "error",
      //             });
      //           }, 0);
      //       }else{
      //           this.editData.accountId = this.userDetails.partyDetail.accountId;
      //           this.editData.authToken = this.userDetails.partyDetail.authToken;
      //           this.editData.deviceId = item.id;
      //           this.editData.sipUriName = this.deviceDetail.name;
      //           if(this.deviceDetail.device_type == "sip_uri"){
      //               this.editData.route = this.deviceDetail.sip.route;
      //               this.editData.userName = this.deviceDetail.sip.username;
      //               this.editData.password = this.deviceDetail.sip.password;
      //           }else{
      //               this.editData.userName = this.deviceDetail.sip.username;

      //               this.editData.password = this.deviceDetail.sip.password;
      //           }
      //       }
      //     } 
        
      try {
        let response = await deviceAPI.editDeviceDetails(this.editData);
        setTimeout(() => {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: response.messageDetail,
            color: "success",
          });
        }, 0);
        this.dialogEdit = false;
      } catch (error) {
          this.isLoading = false;
      }
    },

    closeEdit(){
     this.dialogEdit = false;
    },

    async addDevice(device_type, sipIp, uri, sipPort) {
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      this.AddDeviceDataJson.accountId = this.userDetail.accountId;
      this.AddDeviceDataJson.authToken = this.userDetail.authToken;

      if(this.AddDeviceDataJson.sipDeviceName == undefined){
          setTimeout(() => {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "sipUri Name is required.",
              color: "error",
            });
          }, 1000);
        } else {
            if(this.AddDeviceDataJson.device_type == "sip_uri"){
                if(sipIp != null && sipPort == null){
                    this.AddDeviceDataJson.route = "sip:"+sipIp+"@"+uri+":"+"5060"; 
                } else if(sipIp == null && sipPort != null){
                    this.AddDeviceDataJson.route = "sip:"+sipIp+"@"+uri+":"+sipPort;
                } else{
                    this.AddDeviceDataJson.route = "sip:"+sipIp+"@"+uri+":"+sipPort;
                }
            }else{
                  
            }
            try {
              let response = await deviceAPI.addDevice(this.AddDeviceDataJson);
              
              if (response.responseMessage ==  "success") {
                setTimeout(() => {
                  this.$root.$emit("SHOW_SNACKBAR", {
                    text: response.messageDetail,
                    color: "success",
                  });
                }, 500);
                this.close();
                this.AddDeviceDataJson = {};
                this.sipUrlShow = false;
                this.userpasswordShow = false;
                this.getDeviceList();
              }
            } catch (error) {
              this.isLoading = false;
            }
          }
    },

    async deleteItem(item) {
      this.dialogDelete = true;
      this.itemidDelete = item.id
    },

    initialize(){

    },

    click(){

    },

     async deleteItemConfirm() {
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      var deviceDataJson = {
        accountId: this.userDetail.accountId,
        deviceId:this.itemidDelete
      };
      this.isLoading = true;
      try {
        let response = await deviceAPI.deleteDeviceDetails(deviceDataJson);
        if (response.responseMessage == 'success') {
          this.dialogDelete = false;
          setTimeout(() => {
              this.$root.$emit("SHOW_SNACKBAR", {
                text: response.messageDetail,
                color: "success",
              });
            }, 0);
            this.getDeviceList();
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },

    close() { 
      this.dialog = false;
      // this.AddDeviceDataJson = {};
      // this.sipUrlShow = false;
      // this.userpasswordShow = false;
      // this.getUsernameForDevice();
    },

    closeDelete() {
      this.dialogDelete = false;
    },
  }
}

</script>
