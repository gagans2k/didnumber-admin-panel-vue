<template>
  <div>
    <v-card elevation="0">
      <v-card-actions class="py-1">
        <v-row>
          <v-col md="3" sm="12" class="pb-1">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              hide-details
              outlined
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-divider class="py-0 my-0"></v-divider>
      <v-dialog v-model="dialogEdit" max-width="500px">
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title>
              <span class="headline">Limits</span>
              <v-spacer></v-spacer>
              <v-layout>
                <v-flex xs12 class="pa-2">
                  <label></label>
                  <v-icon style="float: right" class="right" @click="closeEdit"
                    >cancel</v-icon
                  >
                </v-flex>
              </v-layout>
            </v-card-title>
            <hr />
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      color="success"
                      cursor="pointer"
                      v-model="editData.accountLimitsdetails.inbound_trunks"
                      label="inbound"
                      append-icon="south_west"
                      placeholder="No of inbound calls"
                      :rules="inboundRules"
                      outlined
                      dense
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="editData.accountLimitsdetails.twoway_trunks"
                  label="outbound"
                  append-icon="north_east"
                  placeholder="No of outbound calls"
                  :rules="outboundRules"
                  outlined
                  dense
                  required
                >
                </v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <!-- <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closeEdit"
                  >
                  Cancel
                </v-btn> -->
              <v-spacer></v-spacer>
              <v-col>
                <v-btn
                  class=""
                  color="blue darken-1"
                  text
                  dark
                  block
                  elevation="2"
                  :disabled="!valid"
                  @click="updateEditData()"
                >
                  Update
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="headers"
        :items="getAccountList"
        :search="search"
        :options.sync="options"
        :footer-props="{
          'items-per-page-options': [10, 20, 30],
        }"
      >
        <template v-slot:[`item.indexNo`]="{ item }">
          {{ getAccountList.indexOf(item) + 1 }}
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
        </template>
      </v-data-table>
    </v-card>
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
  </div>
</template>

<script>
import ChannelAPI from "../../services/ChannelAPI";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      valid: true,
      inboundRules: [
        (v) => !!v || "This field is required",
        (v) => /^[0-9\-\s- ]{0,9}$/.test(v) || "This field only accept numbers",
      ],
      outboundRules: [
        (v) => !!v || "This field is required",
        (v) => /^[0-9\-\s- ]{0,9}$/.test(v) || "This field only accept numbers",
      ],
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
          text: "Account Name",
          value: "name",
          align: "center",
          filterable: true,
          sortable: false,
        },
        {
          text: "Account id",
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: "Account realm",
          value: "realm",
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
      getAccountList: [],
    };
  },

  watch: {
    dialogEdit(val) {
      val || this.closeEdit();
    },
    options: {
      handler() {
        this.getAccountListData();
      },
      deep: true,
    },
  },

  methods: {
    async getAccountListData() {
      var getById = JSON.parse(localStorage.getItem("userDetail"));
      this.isLoading = true;
      var accountID = {
        accId: getById.accountId,
      };
      try {
        let response = await ChannelAPI.getAccountList(accountID);
        if (response.responseMessage == "success") {
          this.getAccountList = response.accountList;
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
      }
    },

    async editItem(item) {
      this.dialogEdit = true;
      this.isLoading = true;
      this.edit.authToken = localStorage.getItem("authNew");
      this.edit.accountId = item.id;
      try {
        let response = await ChannelAPI.getAccountLimitsDetails(this.edit);
        if (response.responseMessage == "success") {
          if (response.accountLimitsdetails.inbound_trunks) {
            this.editData.accountLimitsdetails.inbound_trunks =
              response.accountLimitsdetails.inbound_trunks;
            //  this.getallow_prepay = response.accountLimitsdetails.allow_prepay;
          } else {
            this.editData.accountLimitsdetails.inbound_trunks = 0;
          }
          if (response.accountLimitsdetails.twoway_trunks) {
            this.editData.accountLimitsdetails.twoway_trunks =
              response.accountLimitsdetails.twoway_trunks;
          } else {
            this.editData.accountLimitsdetails.twoway_trunks = 0;
          }
          this.editData.accountLimitsdetails.allow_prepay =
            response.accountLimitsdetails.allow_prepay;
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
      }
    },

    async updateEditData() {
      this.dialogEdit = true;
      this.isLoading = true;
      this.edit.editData = {
        data: {
          inbound_trunks: this.editData.accountLimitsdetails.inbound_trunks,
          twoway_trunks: this.editData.accountLimitsdetails.twoway_trunks,
          allow_prepay: this.editData.accountLimitsdetails.allow_prepay,
          id: "limits",
        },
      };
      try {
        let response = await ChannelAPI.editAccountLimits(this.edit);
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Channel Updated Successfully",
            color: "success",
          });
          this.isLoading = false;
          this.dialogEdit = false;
          this.getAccountListData();
        }
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: error.responseMessage.errorMessage,
          color: "error",
        });
      }
    },

    closeEdit() {
      this.dialogEdit = false;
    },
  },
};
</script>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}
</style>