<template>
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
    <loading :active="isLoading" :loader="loader" />

    <v-dialog
      eager
      :value="shown"
      max-width="500px"
      @click:outside="onCancel"
      scrollable
    >
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">Did Number</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-col cols="12" md="12">
                <v-select
                  :items="supplierList"
                  item-text="supplierName"
                  item-value="supplierId"
                  :rules="rules.supplierNameList"
                  v-model="user.supplierNameList"
                  label="Supplier List"
                  append-icon="format_list_numbered"
                ></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="user.UpdateDidNumber"
                  label="Did Number"
                  :rules="rules.UpdateDidNumber"
                  append-icon="dialer_sip"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
              <v-select
                :items="['Y', 'N']"
                v-model="user.hasSMS"
                label="Has SMS"
                append-icon="format_list_numbered"
              ></v-select>
            </v-col>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="onCancel"> Cancel </v-btn>
            <v-btn color="blue darken-1" text @click="onSave"> Update </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog
      eager
      :value="deleteDialog"
      max-width="500px"
      @click:outside="closeDelete"
      scrollable
    >
      <v-card>
        <v-card-title class="headline">Would you like to cancel?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="cancelAllocation()"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-----------------------------------Number Details---------------------------------------------------->
    <!-- <v-row>
      <v-col cols="12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Number Details</v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row> -->

    <v-card elevation="2">
      <v-container>
        <!-- Back button -->
        <v-toolbar elevation="0">
          <v-spacer></v-spacer>
          <v-btn
            @click="$router.go(-1)"
            outlined
            class="error mt-2"
            dark
            >BACK</v-btn
          >
        </v-toolbar>
        <!-- NAME -->
        <v-row>
          <v-col cols="12" sm="4">
            <span class="subtitle-1 font-weight-bold">Number:</span>
          </v-col>
          <v-col
            cols="4"
            class="text-left"
            v-if="
              itemDetails.didStatus == 'DID_PENDING_ALLOCA' &&
              itemDetails.number == null
            "
          >
            <span
              style="cursor: pointer"
              @click="
                supplyApi(itemDetails.orderId, itemDetails.orderItemSeqId)
              "
            >
              <v-icon left style="color: blue"> format_list_numbered </v-icon
              >Assign Number
            </span>
          </v-col>
          <v-col
            cols="4"
            class="text-left"
            v-if="
              itemDetails.didStatus == 'DID_PENDING_ALLOCA' &&
              itemDetails.number == null
            "
          >
            <span @click="cancelAllocationDialog" style="cursor: pointer">
              <v-icon left style="color: red"> clear </v-icon>Cancel Allocation
            </span>
          </v-col>
          <v-col
            cols="4"
            class="text-left"
            v-if="itemDetails.didStatus != 'DID_PENDING_ALLOCA'"
          >
            <span>{{ itemDetails.number }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!--Did Status  -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold">Did Status:</span></v-col
          >
          <v-col cols="12" sm="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'DID_PENDING_ALLOCA'"
              >PENDING ALLOCATION</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'DID_ALLO_CANCELLED'"
              >Cancel Allocation</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'DID_ACTIVATED'"
              >Activated</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'DID_INACTIVE'"
              >INACTIVE</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'DID_SUSPENDED'"
              >SUSPENDED</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'DID_TERMINATED'"
              >TERMINATED</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didStatus == 'Cancelled'"
              >Cancelled</span
            >
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Country Name -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold"
              >Country Name:</span
            ></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="!itemDetails.countryName"
              >---</span
            >
            <span class="subtitle-1 font-weight-regular">{{
              itemDetails.countryName
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- State -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold">State:</span></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="!itemDetails.stateName"
              >---</span
            >
            <span class="subtitle-1 font-weight-regular">{{
              itemDetails.stateName
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- cityName -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold">City:</span></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="!itemDetails.cityName"
              >---</span
            >
            <span class="subtitle-1 font-weight-regular">{{
              itemDetails.cityName
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Did Type -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold">Did Type:</span></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="!itemDetails.didType"
              >---</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'TOLL_FREE'"
              >TOLL FREE</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'SHARED_COST'"
              >SHARED COST</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'LOCAL_DID'"
              >LOCAL</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'LOCAL_MULTI'"
              >LOCAL</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'NATIONAL_DID'"
              >NATIONAL</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'NATIONAL_MULTI'"
              >NATIONAL</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'MOBILE_DID'"
              >MOBILE</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'MOBILE_MULTI'"
              >MOBILE</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'VIRTUAL_PRI_DID'"
              >VIRTUAL</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="itemDetails.didType == 'VIRTUAL_PRI_MULTI'"
              >VIRTUAL</span
            >
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Area Code -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold">Area Code:</span></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="!itemDetails.areaCode"
              >---</span
            >
            <span class="subtitle-1 font-weight-regular">{{
              itemDetails.areaCode
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="subtitle-1 font-weight-bold">Has SMS/SMS IN</span></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="!itemDetails.hasSms"
              >---</span
            >
            <span class="subtitle-1 font-weight-regular">{{
              itemDetails.hasSms
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import productStore from "../../services/productStore";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  mixins: [AllApiCalls],
  name: "VeutifyValidationFix",
  components: {
    Loading,
  },
  data() {
    return {
      user: {
        supplierNameList: "",
        UpdateDidNumber: "",
      },
      rules: {},
      //empty!
      supplierList: [],
      shown: false,
      deleteDialog: false,
      loader: "bars",
      isLoading: false,
      orderDetailsArray: [],
      moment: moment,
      orderDetails: {
        orderItemList: [{}],
      },
      //dialogEdit: false,
      itemDetails: "",
      didStatusList: {
        DID_ACTIVATED: "ACTIVATED",
        DID_INACTIVE: "INACTIVE",
        DID_PENDING: "PENDING",
        DID_SUSPENDED: "SUSPENDED",
        DID_TERMINATED: "TERMINATED",
        DID_ALL: "ALL",
      },
    };
  },

  watch: {
    // dialogEdit(val){
    //   val || this.closeEdit();
    // },
    shown() {
      //when dialog visibility changed
      this.rules = {}; //clear rules
      this.$refs.form.reset(); //reset the form (requires ‘eager’)
    },
    options: {
      handler() {
        //this.supplyApi();
      },
      deep: true,
    },
  },

  async mounted() {
    await this.getOrderDetail();
    this.getOrderNumberDetail();
  },

  computed: {
    dirty() {
      return this.user.firstName && this.user.lastName;
    },
  },

  methods: {
    async supplyApi() {
      this.shown = true;
      this.isLoading = true;
      let response = await this.getMethod("getSupplierList", {
        authToken: localStorage.getItem("authNew"),
      });
      response.supplier.forEach((supplylistData, index, arr) => {
        this.supplierList.push(supplylistData);
      });
      this.isLoading = false;
    },

    onCancel() {
      this.rules = {}; //clear rules
      this.$refs.form.reset(); //reset the form (requires ‘eager’)
      this.shown = false;
    },

    async onSave() {
      this.isLoading = true;
      try {
        this.rules = {
          supplierNameList: [(v) => !!v || "Select a suppier of your choice"],
          UpdateDidNumber: [
            (v) => !!v || "Enter a phone number of your choice to continue!",
          ],
        };
        if (this.$refs.form.validate()) {
          //do work, then...
          var orderDatajson = {
            didNumber: this.user.UpdateDidNumber,
            orderId: this.$route.query.orderId,
            orderItemSeqId: this.$route.query.orderItemSeqId,
            supplierId: this.user.supplierNameList,
            hasSMS: this.user.hasSMS,
          };
          let response = await productStore.assignDidToOrder(orderDatajson);
          if (response.responseMessage == "success") {
            this.getOrderNumberDetail();
            this.seeSnackbar("Number Updated successfully", "success");
          } else if (responseMessage == "error") {
            this.seeSnackbar(response.messageDetail, "error");
          }
          this.onCancel();
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
        }
      }
    },

    closeDelete() {
      this.deleteDialog = false;
    },

    cancelAllocationDialog() {
      this.deleteDialog = true;
    },

    async cancelAllocation() {
      this.isLoading = true;
      this.deleteDialog = true;
      try {
        var cancelAllocationId = {
          orderId: this.$route.query.orderId,
          orderItemSeqId: this.$route.query.orderItemSeqId,
        };
        let response = await productStore.cancelDIDAllocation(
          cancelAllocationId
        );
        if (response.responseMessage == "success") {
          this.getOrderNumberDetail();
          this.getOrderDetail();
          this.seeSnackbar("Number Updated successfully", "success");
          window.history.go(-1);
        } else if (responseMessage == "error") {
          this.seeSnackbar(response.messageDetail, "error");
        }
        this.isLoading = false;
        this.closeDelete();
      } catch (error) {
        this.isLoading = false;
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
        } else {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Something is wrong!",
            color: "error",
          });
        }
      }
    },

    async getOrderDetail() {
      this.isLoading = true;
      let response = await this.getMethod("getOrderDetail", {
        orderId: this.$route.query.orderId,
      });

      this.orderDetails = JSON.parse(JSON.stringify(response.orderDetails));
      this.orderDetails.orderItemList.forEach((element) => {
        this.orderDetailsArray.push(element);
      });
      this.isLoading = false;
    },

    async getOrderNumberDetail() {
      this.isLoading = true;
      let response = await this.getMethod("getOrderNumberDetail", {
        orderId: this.$route.query.orderId,
        orderItemSeqId: this.$route.query.orderItemSeqId,
      });
      this.itemDetails = response.itemDetails;
      this.dialog = true;
      this.isLoading = false;
    },
  },
};
</script>
<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
th,
td {
  padding: 5px;
  text-align: left;
  text-align: center;
}
.right {
  margin-left: 545px;
}
</style>