<template>
  <div>
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
    <div>
      <loading :active="isLoading" :loader="loader" />
    </div>
    <div class="text-center">
      <v-overlay :value="imageUrl">
        <div class="modal" style="display: block">
          <v-icon class="close" @click="imageUrl = false"> mdi-close </v-icon>
          <img v-bind:src="imageUrl" width="500px;" />
        </div>
      </v-overlay>
    </div>
    <v-card elevation="1">
      <v-card-actions class="py-0">
        <v-spacer></v-spacer>
        <!-- number list -->
        <v-col sm="3" class="d-flex" v-if="numberDetailStatus" >
          <v-select
            v-bind:items="items"
            menu-props="auto"
            label="Number List"
            item-text="didNumber"
            item-value="inventoryItemId"
            append-icon="format_list_numbered"
            @change="changeValue($event)"
            return-object
          ></v-select>
        </v-col>
         <!-- Assign Number button @change="assignNumber($event)"-->
        <v-col sm="3" class="d-flex" v-if="asgnStatus" >
          <v-btn
            color="blue darken-1"
            text
            outlined
           @click="selectedNumberid()"
          >
            Assign Number
          </v-btn>
        </v-col>
        <!-- activate number button -->
        <v-col
          md="3"
          class="d-flex"
          v-if="actvStatus"
        >
          <v-btn
            color="blue darken-1"
            text
            outlined
            @click="approveNumber(column)"
          >
            Activate Number
          </v-btn>
        </v-col>
      </v-card-actions>
      <v-divider class="py-0 my-0"></v-divider>
      <v-dialog v-model="dialogEdit" max-width="500px">
        <v-card>
          <v-form ref="form"  lazy-validation>
            <v-card-title>
              <span class="title">View</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row v-if="getInventoryItemDocInfoData"> 
                <v-col sm="12" xs="12" class="pt-0">
                  <v-card-subtitle class="pl-0 pb-3"
                    ><b>Personal Information:-</b>
                  </v-card-subtitle>
                </v-col>
                <v-col cols="12" sm="6" xs="12" class="d-flex py-0" v-if="getInventoryItemDocInfoData.firstName">
                  <label><b>First Name:</b> </label>
                  <p class="pl-1">
                    {{ getInventoryItemDocInfoData.firstName }}
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  xs="12"
                  v-if="getInventoryItemDocInfoData.middleName"
                  class="d-flex py-0"
                >
                  <label><b>Middle Name:</b></label>
                  <p class="pl-1">
                    {{ getInventoryItemDocInfoData.middleName }}
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  xs="12"
                  v-if="getInventoryItemDocInfoData.lastName"
                  class="d-flex py-0"
                >
                  <label><b>Last Name:</b></label>
                  <p class="pl-1">{{ getInventoryItemDocInfoData.lastName }}</p>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  xs="12"
                  v-if="getInventoryItemDocInfoData.dateOfBirth"
                  class="d-flex py-0"
                >
                  <label><b>Date Of Birth:</b></label>
                  <p class="pl-1">
                    {{
                      getInventoryItemDocInfoData.dateOfBirth
                        ? getInventoryItemDocInfoData.dateOfBirth
                        : "-"
                    }}
                  </p>
                </v-col>
                <!-- <v-col
                  cols="12"
                  sm="6"
                  xs="12"
                  v-if="getInventoryItemDocInfoData.dateOfBirth"
                  class="d-flex py-0"
                >
                  <label><b>Date Of Birth:</b></label>
                  <p class="pl-1">
                    {{
                      getInventoryItemDocInfoData.dateOfBirth
                        ? getInventoryItemDocInfoData.dateOfBirth
                        : "-"
                    }}
                  </p>
                </v-col> -->
                <v-col cols="12" sm="6" xs="12" class="d-flex py-0" v-if="getInventoryItemDocInfoData.countryOfBirth">
                  <label><b>City:</b></label>
                  <p class="pl-1">
                    {{ getInventoryItemDocInfoData.countryOfBirth }}
                  </p>
                </v-col>
                <v-col cols="12" sm="6" xs="12" class="d-flex py-0" v-if="getInventoryItemDocInfoData.postalCode">
                  <label><b>ZIP/Postal Code:</b></label>
                  <p class="pl-1">
                    {{ getInventoryItemDocInfoData.postalCode }}
                  </p>
                </v-col>
                <v-col cols="12" sm="6" xs="12" class="d-flex py-0" v-if="getInventoryItemDocInfoData.countryOfBirth">
                  <label><b>Country Of Birth:</b></label>
                  <p class="pl-1">
                    {{
                      getInventoryItemDocInfoData.countryOfBirth
                        ? getInventoryItemDocInfoData.countryOfBirth
                        : "-"
                    }}
                  </p>
                </v-col>
              </v-row>
              <v-col sm="12" xs="12" class="py-0 pl-0">
                <v-card-subtitle class="pl-0 pb-3"
                  ><b>Action:-</b>
                </v-card-subtitle>
              </v-col>
              <v-radio-group
                v-model="column"
                v-on:change="changeRoute($event)"
                column
                hide-details
              >
                <v-radio label="Approved" value="DOC_APPROVED"></v-radio>
                <v-radio label="Dispproved" value="DOC_DISAPPROVED"></v-radio>
              </v-radio-group>
              <v-col
                cols="12"
                sm="6"
                xs="12"
                class="d-flex pa-0"
                v-if="showField"
              >
                <v-select
                  v-bind:items="items"
                  menu-props="auto"
                  label="Number List"
                  append-icon="format_list_numbered"
                  item-text="didNumber"
                  v-model="valid"
                  return-object
                  filled
                ></v-select>
              </v-col>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeEdit()">
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="!valid"
                @click="updateEditData(column)"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="headers"
        :items="getdocList"
        :search="search"
        :footer-props="{
          'items-per-page-options': [10, 20, 30],
        }"
        :options.sync="options"
      >
        <template v-slot:[`item.indexNo`]="{ item }">
          {{
            (options.page - 1) * options.itemsPerPage +
            (getdocList.indexOf(item) + 1)
          }}
        </template>
        <template v-slot:[`item.fromDate`]="{ item }">
          {{ moment(item.fromDate).format("MMMM Do YYYY, h:mm:ss a") }}
        </template>
        <template v-slot:[`item.imageData`]="{ item }">
          <img
            :src="'data:image/jpeg;base64,' + item.imageData"
            style="width: 50px; height: 50px; cursor: pointer"
            @click="overlayOpen(item)"
          />
        </template>
        <template v-slot:[`item.statusId`]="{ item }">
          <span v-if="item.statusId == 'DOC_APPROVED'">Approved</span>
          <span v-if="item.statusId == 'DOC_UNAPPROVED'">Unapproved</span>
          <span v-if="item.statusId == 'DOC_DISAPPROVED'">Disapproved</span>
        </template>
        <template v-slot:[`item.viewAction`]="{ item }">
          <!-- <v-btn
              class="ma-2"
              outlined
              color="indigo"
              @click="ActionTap(item)"
            >
              Action
            </v-btn> -->
          <v-btn x-small outlined fab @click="ActionTap(item)" color="indigo">
            <v-icon small> visibility</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
  </div>
</template>

<script>
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
      items:[],
      numberDetailStatus: false,
      actvStatus: false,
      asgnStatus: false,
      inventoryItemIdSend: "",
      inventoryItemId:"",
      selectedNumberData:{},
      datasend: "",
      showField: true,
      approved: "",
      disapproved: "",
      column: "DOC_APPROVED",
      row: null,
      imagedialog: false,
      imageUrl: "",
      overlay: false,
      valid: false,
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
          sortable: false
        },
        {
          text: "Party",
          value: "partyId",
          align: "center",
          sortable: false
        },
        {
          text: "Status",
          value: "statusId",
          align: "center",
          sortable: false
        },
        {
          text: "Image",
          value: "imageData",
          align: "center",
          sortable: false
        },
        {
          text: "Content Id",
          value: "contentId",
          align: "center",
          sortable: false
        },
        {
          text: "From Date",
          value: "fromDate",
          align: "center",
          sortable: false
        },
        {
          text: "Action",
          value: "viewAction",
          align: "center",
          sortable: false
        },
      ],
      getdocList: [],
      actionValue: "",
      getInventoryItemDocInfoData: {},
    };
  },

  watch: {
    dialogEdit(val) {
      val || this.closeEdit();
    },
    options: {
      handler() {},
      deep: true,
    },
  },

  created() {
    this.actvStatus = false;
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    this.getDocumentsByOrder(this.$route.query.orderId);
    this.updateAction(this.$route.query.orderId);
    // this.setInventoryItemDocStatus(params.get("orderId"));
  },

  methods: {
    changeRoute(item) {
      
      if (item == "DOC_APPROVED") {
        this.showField = true;
      } else {
        this.showField = true;
      }
    },

    

    changeValue(value){
      this.selectedNumberData = value
      this.inventoryItemId = value.inventoryItemId

      for (let i = 0; i < value.didNumber.length; i++) {
        if (value.didNumber.indexOf('X',0)) {
          this.actvStatus = true;
          this.asgnStatus = false;
        }else {
          this.asgnStatus = true;
          this.actvStatus = false;
        }
      }
    },

    async approveNumber() {
      this.isLoading = true;
      try {
      let response = await this.postMethod("activateNumber", {
        authToken: localStorage.getItem("authNew"),
        inventoryItemId: this.inventoryItemId,
      });
      if (response.responseMessage = "success") {
         this.seeSnackbar("Updated Successfully", response.responseMessage);
          this.isLoading = false;
          this.actvStatus = false;
          this.numberDetailStatus = false;
          // this.getDocumentsByOrder(this.$route.query.orderId);
          }
      }
      catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "error",
          color: "error",
        });
        
      }
    },

    async selectedNumberid(){
      this.$router.push({ path: 'ViewOrderCustomerDetail', query: { orderId: this.selectedNumberData.orderId, Item_Id: this.selectedNumberData.orderItemSeqId }})
  },


    async init(){
       // const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let response = await this.getMethod("docList", {
        orderId: orderIdGet,
      });
      if (response.responseMessage == "success") {
         this.isLoading = false;
         for (let i = 0; i < response.numberDetail.length; i++) {
           this.items = response.numberDetail[i].didNumber;
         }
      }
    },

    async getInventoryItemDocInfo() {

      var getInventoryItemDocInfoData = {
        orderId: this.datasend.orderId,
        inventoryItemId: this.datasend.inventoryItemId,
        geoId: this.datasend.geoId,
      };
      let response = await this.getMethod(
        "getInventoryItemDocInfo",
        getInventoryItemDocInfoData
      );
      if (response.responseMessage == "success") {
        this.getInventoryItemDocInfoData = response.documentInfo;
        this.isLoading = false;
      }
    },
    async setInventoryItemDocStatus(data) {
      let response = await this.getMethod("setInventoryItemDocStatus", {
        orderId: this.datasend.orderId,
        documentInfoId: this.getInventoryItemDocInfoData.documentInfoId,
        inventoryItemId: this.datasend.inventoryItemId,
        statusId: this.actionValue,
      });
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
    },

    async updateAction(orderIdGet){
     
      // const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let response = await this.getMethod("getNumberForDocumentRequest", {
        orderId: orderIdGet,
      });
      if (response.responseMessage == "success") {
         this.isLoading = false;
          this.items = response.numberDetail
          this.inventoryItemId = response.numberDetail[0].inventoryItemId;
          // console.log("response.numberDetail---",response.numberDetail[0].inventoryItemId)
        //  for (let i = 0; i < response.numberDetail.length; i++) {
          //  this.items = response.numberDetail[0].inventoryItemId;
          //  console.log("ddd-----------",response.numberDetail[0].inventoryItemId)
           if (this.items.indexOf('X')) {
            //  console.log("this.items----====", this.items[0].inventoryItemId)
            this.numberDetailStatus = true;
            // this.actvStatus = true;
            // this.asgnStatus = false;
           } else {
            //  this.actvStatus = false;
            //   this.asgnStatus = true;
             this.numberDetailStatus = false;
             
           }
        //  }
      }
    },

    async ActionTap(getData) {
      this.datasend = getData;
      this.getInventoryItemDocInfo();
      this.dialogEdit = true;
      let response = await this.getMethod("getNumberForDocumentRequest", {
        orderId: getData.orderId,
      });
      if (response.responseMessage == "success") {
        this.isLoading = false;
        // var DataRetrive = response.numberDetail;
        // for (let g = 0; g < response.numberDetail.length; g++) {
        //   this.items.push(response.numberDetail[g].didNumber);
        //   this.inventoryItemIdSend = response.numberDetail[g].inventoryItemId;
        // }
        // DataRetrive.forEach(element => {

        // });
      }
    },

   

    async updateEditData(statusValue) {

      this.actionValue = statusValue;
      this.setInventoryItemDocStatus();
      this.dialogEdit = true;
      if (statusValue == "DOC_APPROVED") {
        if (this.datasend) {
          let response = await this.postMethod("setDocStatus", {
            contentId: this.datasend.contentId,
            partyId: this.datasend.partyId,
            statusId: statusValue,
            inventoryItemId: this.inventoryItemId,
          });
          if (response.responseMessage == "success") {
            this.valid = null;
            this.getDocumentsByOrder(this.datasend.orderId);
            this.isLoading = false;
            this.dialogEdit = false;
            this.showField = true;
          }
        }
      } else {
        if (this.datasend) {
          let response = await this.postMethod("setDocStatus", {
            contentId: this.datasend.contentId,
            partyId: this.datasend.partyId,
            inventoryItemId: this.inventoryItemId,
            statusId: "DOC_UNAPPROVED",
          });
          if (response.responseMessage == "success") {
            this.valid = null;
            this.getDocumentsByOrder(this.datasend.orderId);
            this.isLoading = false;
            this.dialogEdit = false;
            this.showField = true;
          }
        }
      }
    },

    overlayOpen(val) {
      this.imagedialog = true;
      this.imageUrl = "data:image/jpeg;base64," + val.imageData;
    },

    overlayCloseDialog() {
      this.overlay = false;
    },

    async getDocumentsByOrder(orderid) {
      this.isLoading = true;
      let response = await this.getMethod("getDocumentsByOrder", {
        orderId: orderid,
      });
      this.getdocList = response.documentList;
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
    },

    closeEdit() {
      this.dialogEdit = false;
      //this.column = {};
    },
  },
};
</script>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}

#container {
  width: 80%;
  /*border-radius: 25px;*/
  border: 2px solid Black;
  padding: 15px 15px 15px 15px;
  margin: 20px 20px 20px 20px;
  background: #a4d3ee;
  overflow: visible;
  box-shadow: 5px 5px 2px #888888;
  position: relative;
}

.modal {
  display: none;
  position: fixed;
  z-index: 0;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.close {
  position: absolute;
  right: 30px;
  color: #f1f1f1;
  font-size: 23px;
  font-weight: bold;
  transition: 6.3s;
}
</style>