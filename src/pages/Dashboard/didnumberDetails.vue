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
    <!-- LOADER -->
    <!-- <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div> -->
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-form ref="form" v-model="validDiDNumber" lazy-validation>
          <v-card-title>
            <span class="headline">Did Number</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="updateNewNumber"
                label="Number"
                append-icon="south_west"
                placeholder="Number"
                required
                outlined
                dense
              >
              </v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeEdit($route.query.item.didNumber)"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="!validDiDNumber"
              @click="updateDidNumber($route.query.item)"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- per min charge dialog -->
    <v-dialog v-model="dialogPerMinChargeEdit" max-width="500px">
      <v-card>
        <v-form ref="form" v-model="validPerMin" lazy-validation>
          <v-card-title>
            <span class="headline">Edit Cost</span>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelEdit()"
              ><v-icon> mdi-close </v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="$route.query.item.cost"
                label="Cost"
                append-icon="south_west"
                outlined
                dense
                required
              >
              </v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn
                  color="blue darken-1"
                  text
                  @click="cancelEdit()"
                  >
                  Cancel
                </v-btn> -->
            <v-btn
              color="blue darken-1"
              text
              :disabled="!validPerMin"
              :loading="editLoader"
              @click="updatePerMinute($route.query.item)"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- Supplier Details -->
    <v-dialog v-model="dialogSupplier" max-width="500px">
      <v-card>
        <v-form ref="form" v-model="validSp" lazy-validation>
          <v-card-title>
            <span class="headline">Supplier Details</span>
            <!-- button -->
            <v-spacer></v-spacer>
            <v-btn text color="blue darken-1" @click="cancelSpEdit()"
              ><v-icon> mdi-close </v-icon>
            </v-btn>
          </v-card-title>
          <v-devider></v-devider>
          <v-card-text>
            <v-container>
              <!-- Area Code -->
              <v-text-field
                v-model="$route.query.item.areaCode"
                label="Area Code"
                append-icon="pin_drop"
                placeholder="Number"
                :rules="areaRules"
                required
                outlined
                dense
              >
              </v-text-field>
              <!-- Setup Cost -->
              <v-text-field
                v-model="$route.query.item.setupCost"
                label="Setup Cost"
                append-icon="attach_money"
                placeholder="Number"
                :rules="supRules"
                required
                outlined
                dense
              >
              </v-text-field>
              <!-- Unit Cost -->
              <v-text-field
                v-model="$route.query.item.unitCost"
                label="Unit Cost"
                append-icon="attach_money"
                placeholder="Number"
                :rules="supRules"
                required
                outlined
                dense
              >
              </v-text-field>
              <!-- Number of Channels -->
              <v-text-field
                v-model="$route.query.item.noOfChannels"
                label="Number of Channels"
                append-icon="dialer_sip"
                placeholder="Number"
                :rules="supRules"
                required
                outlined
                dense
              >
              </v-text-field>
              <!-- Supplier -->
              <v-select
                item-text="supplierName"
                item-value="supplierId"
                v-model="supplierValue"
                :items="supplierList"
                label="Supplier List"
                :rules="SupplierFieldRule"
                append-icon="format_list_numbered"
                required
                outlined
                dense
              ></v-select>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue darken-1"
              text
              :disabled="!validSp"
              @click="updateSupplierDetails($route.query.item, supplierValue)"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="hasSmsDialog" max-width="500px">
      <v-card>
        <v-form ref="form" lazy-validation>
          <v-card-title>
            <span class="headline">Has SMS</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-select
                :items="['Y', 'N']"
                v-model="$route.query.item.hasSms"
                label="Has SMS"
                append-icon="format_list_numbered"
                required
                outlined
                dense
                :value="defaultHasSMSValue"
              ></v-select>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelHasSms()">
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateHasSMS($route.query.item)"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!--------------------------------------------------------------------------------------->
    <v-card>
      <v-container fluid>
        <v-form>
          <v-row>
            <v-col cols="6">
              <!-- <v-toolbar> -->
              <v-toolbar-title class="font">Number Details</v-toolbar-title>
              <!-- </v-toolbar> -->
            </v-col>
            <v-spacer></v-spacer>

            <!-- Back button -->
            <!-- <v-row justify="left"> -->
            <v-col cols="4" md="1"
              ><v-btn
                class="bbtn"
                color="rgb(231,87,83)"
                dark
                block
                :to="{ name: 'Did Numbers' }"
                >Back</v-btn
              ></v-col
            >
          </v-row>
          <v-divider></v-divider>
          <v-container>
            <!-- Number -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold">Number:</span></v-col
              >
              <v-col cols="6" class="text-left">
                <span class="subtitle-1 font-weight-regular">
                  {{ updateNewNumber }}
                </span>
              </v-col>
              <!-- button edit -->
              <v-col
                cols="4"
                v-if="$route.query.item.statusId == 'INV_PROMISED'"
              >
                <v-btn
                  class="ma-2"
                  outlined
                  dense
                  color="indigo"
                  @click="openDialog()"
                >
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Name -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold">Name:</span></v-col
              >
              <v-col cols="6">
                <span class="subtitle-1 font-weight-regular">
                  {{ $route.query.item.firstName
                  }}{{ $route.query.item.lastName }}
                </span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Did Status -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Did Status:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didStatus == 'DID_PENDING_ALLOCA'"
                >
                  PENDING ALLOCATION
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didStatus == 'DID_ACTIVATED'"
                >
                  Activated
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didStatus == 'DID_INACTIVE'"
                >
                  INACTIVE
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didStatus == null"
                >
                  ----
                </span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- UNIT PRICE -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Per Min Charge:</span
                ></v-col
              >

              <v-col cols="1">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.perMinCharge == null"
                >
                  ----
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.perMinCharge != null"
                >
                  {{ $route.query.item.perMinCharge }}
                </span>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="ma-2"
                  outlined
                  dense
                  color="indigo"
                  @click="oepnPerMinute('perMinCharge')"
                >
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold">Has SMS:</span></v-col
              >

              <v-col cols="1">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.hasSms == null"
                >
                  ----
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.hasSms != null"
                >
                  {{ $route.query.item.hasSms }}
                </span>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="ma-2"
                  outlined
                  dense
                  color="indigo"
                  @click="openHasSms('hasSms')"
                >
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Location -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Location:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.countryName == null"
                >
                  {{ $route.query.item.didNumber }}
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.countryName != null"
                >
                  {{ $route.query.item.countryName }}
                  <span v-if="$route.query.item.stateName != null">
                    State: {{ $route.query.item.stateName }}</span
                  >
                  <span v-if="$route.query.item.cityName != null">
                    City: {{ $route.query.item.cityName }}</span
                  >
                </span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Customer ID -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Customer ID:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.partyId == null"
                  >----</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.partyId != null"
                  >{{ $route.query.item.partyId }}</span
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Did Type -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Did Type:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'LOCAL_MULTI'"
                  >LOCAL</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'SHARED_COST'"
                  >Shared Cost</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'TOLL_FREE'"
                  >Tollfree</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'LOCAL_DID'"
                  >LOCAL</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'NATIONAL_DID'"
                  >NATIONAL</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'MOBILE_DID'"
                  >MOBILE</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == 'VIRTUAL_PRI_DID'"
                  >VIRTUAL PRI</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.didType == null"
                  >----</span
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Area Code -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Area Code:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.areaCode == null"
                  >----</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.areaCode != null"
                  >{{ $route.query.item.areaCode }}</span
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Setup Cost -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Setup Cost:</span
                ></v-col
              >
              <!-- <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.setupCost == null"
                  >----</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.setupCost != null"
                  >{{ $route.query.item.c }}</span
                >
              </v-col> -->

              <v-col cols="1">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.setupCost == null"
                >
                  ----
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.setupCost != null"
                >
                  {{ $route.query.item.setupCost }}
                </span>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="ma-2"
                  outlined
                  dense
                  color="indigo"
                  @click="oepnPerMinute('setupCost')"
                >
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Unit Cost -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Unit Cost:</span
                ></v-col
              >
              <!-- <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.unitCost == null"
                  >----</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.unitCost != null"
                  >{{ $route.query.item.unitCost }}</span
                >
              </v-col> -->
              <v-col cols="1">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.unitCost == null"
                >
                  ----
                </span>
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.unitCost != null"
                >
                  {{ $route.query.item.unitCost }}
                </span>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="ma-2"
                  outlined
                  dense
                  color="indigo"
                  @click="oepnPerMinute('unitCost')"
                >
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Number of Channels -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Number of Channels:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.noOfChannels == null"
                  >----</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.noOfChannels != null"
                  >{{ $route.query.item.noOfChannels }}</span
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Number of Channels -->
            <v-row v-if="$route.query.item.comments">
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Comments:</span
                ></v-col
              >
              <v-col cols="6">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.noOfChannels != null"
                  >{{ $route.query.item.comments }}</span
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Supplier -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >Supplier:</span
                ></v-col
              >
              <v-col cols="1">
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.supplierName == null"
                  >----</span
                >
                <span
                  class="subtitle-1 font-weight-regular"
                  v-if="$route.query.item.supplierName != null"
                  >{{ $route.query.item.supplierName }}</span
                >
              </v-col>
              <v-col cols="4">
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="opendialogSupplier()"
                >
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- StatusId -->
            <v-row>
              <v-col cols="2">
                <span class="subtitle-1 font-weight-bold"
                  >StatusId:</span
                ></v-col
              >
              <v-col cols="6">
                <!-- <span class="subtitle-1 font-weight-regular">{{$route.query.item.statusId}}</span> -->
                <span class="subtitle-1 font-weight-regular">{{
                  $route.query.item.statusId
                }}</span>
              </v-col>
              <v-col cols="4">
                <span
                  class="subtitle-1 font-weight-bold"
                  v-if="
                    $route.query.item.statusId == 'INV_AVAILABLE' ||
                      $route.query.item.statusId == 'INV_TERMINATED' ||
                      $route.query.item.statusId == 'INV_DISABLED'
                  "
                >
                  <v-btn
                    class="ma-2"
                    outlined
                    color="indigo"
                    @click="editNumber()"
                  >
                    Set as dummy
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="4" v-if="showInput">
                <v-textarea
                  label="Set Did Dummy"
                  outlined
                  name="input-7-4"
                  v-model="sendCommentData"
                ></v-textarea>
                <v-btn
                  @click="saveSetDummyData($route.query.item)"
                  :loading="saveButtonLoader"
                  >Save</v-btn
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Number -->
            <!-- <v-row>
            <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">Number:</span></v-col
            >
            <v-col cols="6">
            <span class="font-weight-regular"
                ><table style="width: 100%">
                <tr>
                    <th>Status</th>
                    <th>Number</th>
                    <th>View Detail</th>
                    <th>Require Document</th>
                </tr>
                <tr v-for='statusData in orderDetails.orderItemList' :key='statusData'> 
                    <td v-if="statusData.didStatus=='DID_ACTIVATED'"><i class="material-icons" style="color:green;" >check_circle</i>Activated</td>
                    <td>{{ statusData.number }}</td>
                    <td>
                    <v-icon medium @click="getOrderNumberDetail(statusData)"
                        >visibility</v-icon
                    >
                    </td>
                    <td>{{ statusData.requireDocument }}</td>
                </tr>
                </table></span
            >
            </v-col>
        </v-row> -->
            <!-- Grand total -->
            <v-divider></v-divider>
          </v-container>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import countryStateAPI from "@/services/countryStateAPI.js";
import dashboardAPI from "../../services/dashboardAPI";
import AllApiCalls from "@/services/AllApiCalls";
import moment from "moment";

export default {
  mixins: [AllApiCalls],
  data() {
    return {
      supplierList: [],
      newNumber: "",
      updateNewNumber: "",
      item: {},
      validDiDNumber: true,
      hasSmsDialog: false,
      validPerMin: true,
      validSp: true,
      oldNumber: "",
      supplierValue: "",
      saveButtonLoader: false,
      moment: moment,
      orderDetails: {
        orderItemList: [{}],
      },
      dialog: false,
      dialogEdit: false,
      dialogPerMinChargeEdit: false,
      dialogSupplier: false,
      editLoader: false,
      itemDetails: "",
      showInput: false,
      sendCommentData: "",
      selectedUpdateCost: "",
      supRules: [
        (v) => !!v || "This field is required",
        (v) => /^\d+(\.\d+)*$/.test(v) || " Use only Numbers and One dot",
      ],
      areaRules: [
        (v) => !!v || "This field is required",
        (v) =>
          /^[a-zA-Z0-9 ]+$/.test(v) ||
          " Use only Numbers and letters for Area Code",
      ],
      SupplierFieldRule: [(v) => !!v || "Supplier list is required"],
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
    dialogEdit(val) {
      val || this.closeEdit();
    },
    dialogPerMinChargeEdit(val) {
      val || this.cancelEdit();
    },
    dialogSupplier(val) {
      val || this.cancelSpEdit();
    },
    options: {
      handler() {
        //this.getAccountListData();
      },
      deep: true,
    },
  },

  computed: {
    defaulthasSMSValue() {
      return this.$route.query.item.hasSms || "Y";
    },
  },

  mounted() {
    this.supplyApi();
    this.oldNumber = this.$route.query.item.didNumber;
    this.updateNewNumber = this.oldNumber;
  },

  methods: {
    async supplyApi() {
      let response = await this.getMethod("getSupplierList", {
        authToken: localStorage.getItem("authNew"),
      });
      response.supplier.forEach((supplylistData, index, arr) => {
        this.supplierList.push(supplylistData);
        this.supplierValue = this.$route.query.item.supplierName;
      });
    },

    async updateEditData() {},

    // ******************* Did numbers *****************
    openDialog() {
      this.dialogEdit = true;
    },

    closeEdit(didnumner) {
      this.dialogEdit = false;
      this.$route.query.item.didNumber = null;
    },

    reset() {
      this.changeNumber = 0;
    },

    // changeDIdNumber(newNumberget){
    //   this.newNumber = newNumberget;
    // },

    async updateDidNumber(didNumberDetail) {
      try {
        let response = await this.postMethod("editDidNumber", {
          inventoryItemId: didNumberDetail.inventoryItemId,
          newDidNumber: this.updateNewNumber,
          oldDidNumber: this.oldNumber,
          partyId: didNumberDetail.partyId,
          statusId: didNumberDetail.statusId,
        });
        if (response.responseMessage == "success") {
          this.dialogEdit = false;
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Number Updated Successfully",
            color: "success",
          });
        }
      } catch (error) {
        // if(error.config.errorHandle === false ) {
        //     return Promise.reject(error);
        // }
        // if (error.response) {
        // }
      }
    },

    // ************* Per minute charge *****************
    oepnPerMinute(value) {
      this.selectedUpdateCost = value;
      this.dialogPerMinChargeEdit = true;
    },

    cancelEdit() {
      this.dialogPerMinChargeEdit = false;
    },

    async updatePerMinute(didNumberDetail) {
      let ApiUrl = "";
      var payload = {
        didNumber: didNumberDetail.didNumber,
        facilityGeoId: didNumberDetail.facilityGeoId,
        inventoryItemId: didNumberDetail.inventoryItemId,
      };
      this.editLoader = true;
      if (this.selectedUpdateCost == "perMinCharge") {
        ApiUrl = "editPerMinCharge";
        payload.perMinCharge = didNumberDetail.cost;
        this.$route.query.item.perMinCharge = payload.perMinCharge;
      } else if (this.selectedUpdateCost == "setupCost") {
        ApiUrl = "editSetupCost";
        payload.setupCost = didNumberDetail.cost;
        this.$route.query.item.setupCost = payload.setupCost;
      } else if (this.selectedUpdateCost == "unitCost") {
        ApiUrl = "editUnitCost";
        payload.unitCost = didNumberDetail.cost;
        this.$route.query.item.unitCost = payload.setupCost;
      }
      try {
        let response = await this.postMethod(ApiUrl, payload);
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Updated Sucessfully",
            color: "success",
          });
          this.dialogPerMinChargeEdit = false;
          this.editLoader = false;
        }
      } catch (error) {
        this.editLoader = false;
        // this.$root.$emit("SHOW_SNACKBAR", {
        //   text: error.responseMessage.errorMessage,
        //   color: "error",
        // });
      }
    },

    //open sms dialoag
    openHasSms() {
      this.hasSmsDialog = true;
    },

    cancelHasSms() {
      this.hasSmsDialog = false;
    },

    async updateHasSMS(hasSmsDetail) {
      try {
        let response = await this.postMethod("editHasSMS", {
          inventoryItemId: hasSmsDetail.inventoryItemId,
          hasSms: hasSmsDetail.hasSms,
        });
        if (response.responseMessage == "success") {
          this.hasSmsDialog = false;
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Data Updated Successfully",
            color: "success",
          });
        }
      } catch (error) {
        // if(error.config.errorHandle === false ) {
        //     return Promise.reject(error);
        // }
        // if (error.response) {
        // }
      }
    },

    // ************* Supplier detail *******************f
    opendialogSupplier() {
      this.dialogSupplier = true;
    },

    cancelSpEdit() {
      this.dialogSupplier = false;
    },

    async updateSupplierDetails(didNumberDetail, supplierValue) {
      try {
        let response = await this.postMethod("editInventoryItem", {
          areaCode: didNumberDetail.areaCode,
          inventoryItemId: didNumberDetail.inventoryItemId,
          noOfChannels: didNumberDetail.noOfChannels,
          setupCost: didNumberDetail.setupCost,
          supplierId: supplierValue,
          unitCost: didNumberDetail.unitCost,
        });
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Data Updated Sucessfully",
            color: "success",
          });
          this.dialogSupplier = false;
        }
      } catch (error) {
        // this.$root.$emit("SHOW_SNACKBAR", {
        //   text: error.responseMessage.errorMessage,
        //   color: "error",
        // });
      }
    },

    // async getOrderDetail() {
    //   let response = await this.getMethod("getOrderDetail", {
    //     orderId: this.$route.query.orderId,
    //   });

    //   this.orderDetails = JSON.parse(
    //     JSON.stringify(response.orderDetails)
    //   );
    // },

    // async getOrderNumberDetail(data) {
    //   let response = await this.getMethod("getOrderNumberDetail", {
    //     orderId: this.$route.query.orderId,
    //     orderItemSeqId: data.orderItemSeqId,
    //   });
    //   this.itemDetails = response.itemDetails;
    //   this.dialog = true;
    // },
    editNumber() {
      this.showInput = true;
      this.sendCommentData = "";
    },
    async saveSetDummyData(didNumberDetail) {
      if (this.sendCommentData) {
        this.saveButtonLoader = true;
        try {
          let response = await this.postMethod("setDidDummy", {
            inventoryItemId: didNumberDetail.inventoryItemId,
            orderId: didNumberDetail.orderId,
            comments: this.sendCommentData,
          });
          if (response.responseMessage == "success") {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "Data Updated Sucessfully",
              color: "success",
            });
            this.showInput = false;
            this.saveButtonLoader = false;
            location.href = "didnumber";
          }
        } catch (error) {
          this.saveButtonLoader = false;
          if (
            error &&
            error.responseMessage &&
            error.responseMessage.errorMessage
          ) {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: error.responseMessage.errorMessage,
              color: "error",
            });
          } else {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "Some thing wrong!",
              color: "error",
            });
          }
        }
      } else {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Please fill the field!",
          color: "error",
        });
      }
    },
  },

  async created() {
    //await this.getOrderDetail();
    // if (this.$$router.query) {
    // } else {
    //     this.$router.push("didnumber");
    // }
    // this.numberValues = this.itemDetails
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
.font {
  margin-left: 25px;
  font-size-adjust: inherit;
}
.bbtn {
  margin-right: 40px !important;
}
</style>
