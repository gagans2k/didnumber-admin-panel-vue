<template>
  <div>
    <v-card elevation="0">
      <v-container fluid>
        <!-- <v-card-actions class="py-1"> -->
        <v-row>
          <v-col xs="12" sm="6" md="3">
            <v-text-field
              color="success"
              v-model="search"
              append-icon="search"
              label="Search"
              hide-details
              outlined
              dense
            >
            </v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col xs="12" sm="6" md="2" class="add-carrier">
            <v-btn
              color="blue darken-1"
              text
              outlined
              dense
              append-icon="format_list_numbered"
              @click="addCarrier()"
              margin-bottom="20px"
            >
              Add Carrier
            </v-btn>
          </v-col>
        </v-row>
        <!-- </v-card-actions> -->
        <!-- remove carrier dialog -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Would you like to remove the carrier?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- dialog edit -->
        <v-divider class="py-0 my-0">Edit Carrier</v-divider>
        <v-dialog v-model="dialogEdit" max-width="700px">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- <v-card-text> -->
              <!-- <v-container> -->
              <!-- <v-layout> -->
              <v-flex xs12 class="pa-4">
                <label>Edit Carrier</label>
                <v-icon
                  style="float: right"
                  class="right"
                  @click="cancelCarrier"
                  >cancel</v-icon
                >
              </v-flex>
              <!-- </v-layout> -->
              <!-- <v-row>
                        <v-btn  class="justify-right" 
                        color="blue darken-1"
                        text
                        @click="cancelCarrier"
                        ><v-icon>
                         mdi-close
                        </v-icon>
                     </v-btn>
                     </v-row> -->
              <hr />
              <!-- name -->
              <v-flex xs12 class="mt-4">
                <v-row class="ma-0">
                  <v-col cols="6">
                    <v-text-field
                      color="success"
                      label="Name"
                      :rules="nameRules"
                      v-model="editCarrier.name"
                      append-icon="person"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- server -->
                  <v-col cols="6">
                    <v-text-field
                      label="Server"
                      :rules="serverRule"
                      v-model="editCarrier.server"
                      append-icon="settings_input_antenna"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- username -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Username"
                      v-model="editCarrier.username"
                      append-icon="person"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- password -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      :append-icon-cb="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      placeholder="Password"
                      required
                      v-model="editCarrier.password"
                      append-icon="remove_red_eye"
                      outlined
                      dense
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <!-- slider button  -->
                  <v-col cols="12" sm="6">
                    <v-slider
                      v-model="editCarrier.weight_cost"
                      max="100"
                      min="-0"
                      :label="editCarrier.label"
                      :thumb-color="editCarrier.color"
                      thumb-label="always"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-checkbox
                      v-model="editCarrier.enabled"
                      label="enabled"
                      color="success"
                      class="mt-0"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-flex>
              <!-- </v-container> -->
              <!-- </v-card-text> -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-col cols="12" md="4">
                  <v-btn
                    class="update"
                    color="primary"
                    text
                    dark
                    block
                    elevation="2"
                    :disabled="!valid"
                    @click="updateCarrier()"
                  >
                    Update
                  </v-btn>
                </v-col>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <!-- add carrier  -->
        <v-divider class="py-0 my-0">Add Carrier</v-divider>
        <v-dialog v-model="addCarrierDialog" max-width="700px">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- <v-card-text> -->
              <!-- <v-layout> -->
              <v-flex xs12 class="pa-4">
                <label>Create Carrier</label>
                <v-icon
                  style="float: right"
                  class="right"
                  @click="closeAddCarrier"
                  >cancel</v-icon
                >
              </v-flex>
              <!-- </v-layout> -->

              <hr />
              <!-- name -->
              <v-flex xs12 class="mt-4">
                <v-row class="ma-0">
                  <v-col cols="6">
                    <v-text-field
                      color="error"
                      cursor="pointer"
                      label="Name"
                      :rules="nameRules"
                      v-model="adding.name"
                      append-icon="person"
                      required
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <!-- server -->
                  <v-col cols="6">
                    <v-text-field
                      color="error"
                      label="Server"
                      :rules="serverRule"
                      v-model="adding.server"
                      append-icon="settings_input_antenna"
                      required
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <!-- username -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Username"
                      v-model="adding.username"
                      append-icon="person"
                      required
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <!-- password -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      :append-icon-cb="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'"
                      placeholder="Password"
                      required
                      v-model="adding.password"
                      append-icon="remove_red_eye"
                      autocomplete="off"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <!-- slider button  -->
                  <v-col cols="12" sm="12">
                    <v-slider
                      v-model="adding.weight_cost"
                      max="100"
                      min="-0"
                      :label="adding.label"
                      :thumb-color="adding.color"
                      thumb-label="always"
                    ></v-slider>
                  </v-col>
                  <!-- enable -->
                  <v-col>
                    <!-- <v-row> -->
                    <v-card-actions class="pa-0">
                      <v-checkbox
                        v-model="adding.enabled"
                        label="enabled"
                        color="success"
                        true-value="true"
                        false-value="false"
                      ></v-checkbox>
                      <v-spacer></v-spacer>
                      <v-btn
                        class=""
                        color="blue darken-1"
                        text
                        :disabled="!valid"
                        @click="createCarrier()"
                      >
                        Add
                      </v-btn>
                    </v-card-actions>
                    <!-- </v-row> -->
                  </v-col>
                </v-row>
              </v-flex>
            </v-form>
          </v-card>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :items="getCarrierList"
          :search="search"
          :options.sync="options"
          :footer-props="{ 'items-per-page-options': [10, 20, 30] }"
          :items-per-page="10"
        >
          <template v-slot:[`item.indexNo`]="{ item }">
            {{ getCarrierList.indexOf(item) + 1 }}
          </template>
          <template v-slot:[`item.orderDate`]="{ item }">
            {{ moment(item.orderDate).format("MMMM Do YYYY, h:mm:ss a") }}
          </template>

          <template v-slot:[`item.viewAction`]="{ item }">
            <v-btn
              x-small
              outlined
              fab
              class="mr-2"
              color="info"
              @click="editItem(item)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-btn
              x-small
              outlined
              fab
              class="mr-2"
              @click="openDialogDaleteCarrier(item)"
              color="red"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </template></v-data-table
        >
      </v-container>
    </v-card>
    <loading :active="isLoading" :loader="loader" />
  </div>
</template>

<script>
import ChannelAPI from "../../services/ChannelAPI";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import AllApiCalls from "@/services/AllApiCalls";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      dialogDelete: false,
      e1: true,
      tab: null,
      addCarrierDialog: false,
      tabsArray: [
        { tab: "BASIC", content: "Tab 1 Content" },
        { tab: "OPTIONS", content: "Tab 2 Content" },
        { tab: "GATEWAY CODECS", content: "Tab 3 Content" },
      ],
      // adding parameters
      adding: {
        server: "",
        name: "",
        username: "",
        password: "",
        enabled: "",
        val: "",
        label: "Priority:",
        weight_cost: 0,
        color: "blue",
      },
      valid: true,
      // edit parameters
      editCarrier: {
        server: "",
        name: "",
        username: "",
        password: "",
        enabled: "",
        val: "",
        label: "Priority:",
        weight_cost: 0,
        color: "blue",
      },
      nameRules: [(v) => !!v || "Name is required"],
      // inboundRules: [
      // v => !!v || 'This field is required',
      // (v) => /^[0-9\-\s- ]{0,9}$/.test(v) || "This field only accept numbers",
      // ],
      // outboundRules: [
      // v => !!v || 'This field is required',
      // (v) => /^[0-9\-\s- ]{0,9}$/.test(v) || "This field only accept numbers",
      // ],
      serverRule: [(v) => !!v || "Name is required"],
      carrierId: "",
      getallow_prepay: "",
      dialogEdit: false,
      isLoading: false,
      loader: "bars",
      moment: moment,
      search: "",
      options: {},
      channelListDetails: "",
      edit: {},
      editData: {
        accountLimitsdetails: {
          inbound_trunks: 0,
          twoway_trunks: 0,
        },
      },
      headers: [
        {
          text: "S.No",
          value: "indexNo",
          sortable: false,
        },
        {
          text: "Carrier Name",
          value: "name",
          align: "center",
          sortable: false,
        },
        {
          text: "Actions",
          value: "viewAction",
          align: "center",
          sortable: false,
        },
      ],
      getCarrierList: [],
    };
  },

  watch: {
    dialogEdit(val) {
      val || this.closeEdit();
    },
    addCarrierDialog(val) {
      val || this.closeAddCarrier();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.getCarriers();
      },
      deep: true,
    },
  },

  methods: {
    closeEdit() {
      this.dialogEdit = false;
    },
    cancelCarrier() {
      this.dialogEdit = false;
      this.$refs.form.reset();
    },

    changeChecked(valuwe) {},

    addCarrier() {
      this.addCarrierDialog = true;
    },

    closeAddCarrier() {
      this.addCarrierDialog = false;
      this.$refs.form.reset();
    },

    async getCarriers() {
      var getById = JSON.parse(localStorage.getItem("userDetail"));
      this.isLoading = true;
      let response = await ChannelAPI.getCarriers({
        accountId: getById.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      if ((response.responseMessage = "success")) {
        this.isLoading = false;
        this.getCarrierList = response.carrierList.data;
      }
    },

    async createCarrier() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        var getById = JSON.parse(localStorage.getItem("userDetail"));
        var addCarrier = {
          carrierData: {
            data: {
              gateways: [
                {
                  server: this.adding.server,
                  username: this.adding.username,
                  password: this.adding.password,
                  enabled: this.adding.enabled,
                },
              ],
              name: this.adding.name,
              weight_cost: this.adding.weight_cost,
              id: this.adding.name,
            },
          },
          authToken: localStorage.getItem("authNew"),
          accountId: getById.accountId,
        };
        try {
          let response = await ChannelAPI.insertCarrier(addCarrier);
          if (response.responseMessage == "success") {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "Carrier adding successfully",
              color: "success",
            });
            this.isLoading = false;
            this.addCarrierDialog = false;
            this.getCarriers();
          }
        } catch (error) {
          this.isLoading = false;
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.responseMessage.errorMessage,
            color: "error",
          });
        }
      }
    },
    // Open remove carrrier dialog
    openDialogDaleteCarrier(item) {
      this.carrierId = item.id;
      this.dialogDelete = true;
    },
    // Close remove carrier dialog
    closeDelete() {
      this.dialogDelete = false;
    },
    // remove carrier api
    async deleteItemConfirm() {
      this.isLoading = true;
      var getById = JSON.parse(localStorage.getItem("userDetail"));
      var deleteCarrierData = {
        authToken: localStorage.getItem("authNew"),
        accountId: getById.accountId,
        carrierId: this.carrierId,
      };
      try {
        let response = await ChannelAPI.removeCarrier(deleteCarrierData);
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Carrier removed successfully",
            color: "success",
          });
          this.isLoading = false;
          this.dialogDelete = false;
          this.getCarriers();
        }
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: error.responseMessage.errorMessage,
          color: "error",
        });
      }
    },

    async editItem(item) {
      // console.log("item", item);
      this.dialogEdit = true;
      this.isLoading = true;
      var getById = JSON.parse(localStorage.getItem("userDetail"));
      var dataCarrierGet = {
        accountId: getById.accountId,
        authToken: localStorage.getItem("authNew"),
        carrierId: item.id,
      };
      try {
        let response = await ChannelAPI.getCarrierDetail(dataCarrierGet);
        if (response.responseMessage == "success") {
          if (response.carrierDetails.data) {
            this.carrierDetails = response.carrierDetails.data;
            this.editCarrier.name = response.carrierDetails.data.name;
            this.editCarrier.weight_cost =
              response.carrierDetails.data.weight_cost;
            response.carrierDetails.data.gateways.forEach((carrierDetails) => {
              this.editCarrier.server = carrierDetails.server;
              this.editCarrier.username = carrierDetails.username;
              this.editCarrier.password = carrierDetails.password;
              this.editCarrier.enabled = carrierDetails.enabled;
            });
            this.editCarrier.name = response.carrierDetails.data.name;
          } else {
            this.editCarrier.accountLimitsdetails.inbound_trunks = 0;
          }
          if (response.accountLimitsdetails.twoway_trunks) {
            this.editCarrier.accountLimitsdetails.twoway_trunks =
              response.accountLimitsdetails.twoway_trunks;
          } else {
            this.editCarrier.accountLimitsdetails.twoway_trunks = 0;
          }
          this.editCarrier.accountLimitsdetails.allow_prepay =
            response.accountLimitsdetails.allow_prepay;
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
      }
    },

    async updateCarrier() {
      console.log("gggg");
      this.dialogEdit = true;
      this.isLoading = true;
      var getById = JSON.parse(localStorage.getItem("userDetail"));
      var upadateCarrier = {
        carrierName: this.carrierDetails.id,
        carrierData: {
          data: {
            gateways: [
              {
                _id: this.carrierDetails.id,
                server: this.editCarrier.server,
                username: this.editCarrier.username,
                password: this.editCarrier.password,
                enabled: this.editCarrier.enabled,
              },
            ],
            name: this.editCarrier.name,
            weight_cost: this.editCarrier.weight_cost,
          },
        },
        authToken: localStorage.getItem("authNew"),
        accountId: getById.accountId,
      };
      try {
        let response = await ChannelAPI.updateCarrier(upadateCarrier);
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Carrier Updated Successfully",
            color: "success",
          });
          this.isLoading = false;
          this.dialogEdit = false;
          this.getCarriers();
        }
      } catch (error) {
        this.isLoading = false;
      }
      // } catch (error) {
      //   this.isLoading = false;
      //   this.$root.$emit("SHOW_SNACKBAR", {
      //     text: error.responseMessage.errorMessage,
      //     color: "error",
      //   });
      // }
    },
  },
};
</script>
<style scoped>
.text-capitalize {
  text-transform: capitalize;
}
.d-flex {
  justify-items: end;
  justify-content: right;
  flex-flow: row wrap;
  float: right;
  justify-content: space-between;
}

.right {
  padding-bottom: 2%;
}
.add-carrier {
  float: right;
  justify-content: flex-end;
  display: flex;
  flex-flow: row wrap;
}
</style>