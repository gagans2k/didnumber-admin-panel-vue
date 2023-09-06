<template>
  <div>
    <v-card elevation="4">
      <v-card-actions class="py-0">
        <!-- <v-col lg="3" md="3" sm="12" class="pb-0">
          <v-text-field 
            v-model="search" 
            append-icon="search" 
            label="Search" 
            outlined
            dense
            hide-details
            >
          </v-text-field>
        </v-col> -->
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
              <!-- <v-btn  class="justify-right"
                        color="blue darken-1"
                         text 
                         @click="closeEdit">
                         <v-icon>
                         mdi-close
                         </v-icon>
                        </v-btn> -->
            </v-card-title>
            <hr />
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="data.contactNumber"
                      outlined
                      dense
                      label="Phone Number"
                      append-icon="phone"
                      :rules="phoneRules"
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="data.email"
                  outlined
                  dense
                  label="Email"
                  append-icon="email"
                  :rules="emailRules"
                  required
                >
                </v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-col cols="12" md="4">
                <v-btn
                  color="blue darken-1"
                  text
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
      <!-- <v-data-table
        :headers="headers"
        :items="getProductList"
        class="elevation-1"
      >
        <template v-slot:[items]="{ item }">
          <td class="text-xs-right">{{item.text}}</td>
        </template>
        <template>
          <td class="text-xs-right">dsfdsfs</td>
        </template>
    </v-data-table> -->
      <v-data-table
        :headers="headers"
        :items="getProductList"
        :search="search"
        hide-default-footer
        disable-pagination
        hide-default-header
      >
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:[`item.contactNumber`]="{ item }">
          {{ item.contactNumber }}
        </template>
        <template v-slot:[`item.email`]="{ item }">
          {{ item.email }}
        </template>
        <template v-slot:[`item.viewAction`]="{ item }">
          <!-- <v-icon @click="viewOrder(item)">mode_edit</v-icon> -->
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
import productStore from "../../services/productStore";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data: () => ({
    createUpdate: {},
    productUpdate: {},
    contactMechPurposeTypeIdEmail: "",
    contactMechPurposeTypeIdPhone: "",
    search: "",
    data: {
      contactNumber: "",
      email: "",
    },
    em: "",
    ph: "",
    updateProductJson: {},
    nameNew: "",
    contactNumberNew: "",
    emailNew: "",
    valid: true,
    dialogEdit: false,
    isLoading: false,
    loader: "bars",
    emailRules: [
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "This value should be a valid email",
    ],
    phoneRules: [
      (v) => /^[0-9\-\s- ]{8,16}$/.test(v) || "This field only accept numbers",
    ],
    headers: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Email",
        value: "email",
      },
      {
        text: "Phone",
        value: "contactNumber",
      },
      {
        text: "Action",
        value: "viewAction",
      },
    ],
    dataList: [],
    getProductList: [],
  }),

  watch: {
    dialogEdit(val) {
      val || this.closeEdit();
    },
  },

  mounted() {
    this.getProductStoreDetailsApi();
  },

  methods: {
    async getProductStoreDetailsApi() {
      this.isLoading = true;
      try {
        let response = await productStore.getProductStoreDetails();
        if (response.responseMessage == "success") {
          for (let i = 0; i < response.partyAndContactMechDetails.length; i++) {
            if (response.partyAndContactMechDetails[i].CUSTOMER_CARE) {
              this.nameNew = "CUSTOMER CARE :";
              this.contactMechPurposeTypeIdEmail = "CUSTOMER_CARE_EMAIL";
              this.contactMechPurposeTypeIdPhone = "PHONE_CUSTOMER_CARE";
              this.contactNumberNew =
                response.partyAndContactMechDetails[
                  i
                ].CUSTOMER_CARE.contactNumber;
              this.emailNew =
                response.partyAndContactMechDetails[i].CUSTOMER_CARE.email;
              this.emailContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].CUSTOMER_CARE.emailContactMechId;
              this.telecomeContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].CUSTOMER_CARE.telecomeContactMechId;
            }
            if (response.partyAndContactMechDetails[i].SALES_CARE) {
              this.nameNew = "SALES CARE :";
              this.contactMechPurposeTypeIdEmail = "SALES_CARE_EMAIL";
              this.contactMechPurposeTypeIdPhone = "PHONE_SALES_CARE";
              (this.contactNumberNew =
                response.partyAndContactMechDetails[
                  i
                ].SALES_CARE.contactNumber),
                (this.emailNew =
                  response.partyAndContactMechDetails[i].SALES_CARE.email);
              this.emailContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].SALES_CARE.emailContactMechId;
              this.telecomeContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].SALES_CARE.telecomeContactMechId;
            }
            if (response.partyAndContactMechDetails[i].TECH_SUPP) {
              this.nameNew = "TECHNICAL SUPPORT :";
              this.contactMechPurposeTypeIdEmail = "TECH_SUPP_EMAIL";
              this.contactMechPurposeTypeIdPhone = "PHONE_TECH_SUPP";
              this.contactNumberNew =
                response.partyAndContactMechDetails[i].TECH_SUPP.contactNumber;
              this.emailNew =
                response.partyAndContactMechDetails[i].TECH_SUPP.email;
              this.emailContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].TECH_SUPP.emailContactMechId;
              this.telecomeContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].TECH_SUPP.telecomeContactMechId;
            }
            if (response.partyAndContactMechDetails[i].ACC_MGR) {
              this.nameNew = "ACCOUNT MANAGER :";
              this.contactMechPurposeTypeIdEmail = "ACC_MGR_EMAIL";
              this.contactMechPurposeTypeIdPhone = "PHONE_ACC_MGR";
              this.contactNumberNew =
                response.partyAndContactMechDetails[i].ACC_MGR.contactNumber;
              this.emailNew =
                response.partyAndContactMechDetails[i].ACC_MGR.email;
              this.emailContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].ACC_MGR.emailContactMechId;
              this.telecomeContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].ACC_MGR.telecomeContactMechId;
            }
            if (response.partyAndContactMechDetails[i].PROVISIONING) {
              this.nameNew = "PROVISIONING :";
              this.contactMechPurposeTypeIdEmail = "PROVISIONING_EMAIL";
              this.contactMechPurposeTypeIdPhone = "PHONE_PROVISIONING";
              this.contactNumberNew =
                response.partyAndContactMechDetails[
                  i
                ].PROVISIONING.contactNumber;
              this.emailNew =
                response.partyAndContactMechDetails[i].PROVISIONING.email;
              this.emailContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].PROVISIONING.emailContactMechId;
              this.telecomeContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].PROVISIONING.telecomeContactMechId;
            }
            if (response.partyAndContactMechDetails[i].LNP) {
              this.nameNew = "LNP :";
              this.contactMechPurposeTypeIdEmail = "LNP_EMAIL";
              this.contactMechPurposeTypeIdPhone = "PHONE_LNP";
              this.contactNumberNew =
                response.partyAndContactMechDetails[i].LNP.contactNumber;
              this.emailNew = response.partyAndContactMechDetails[i].LNP.email;
              this.emailContactMechId =
                response.partyAndContactMechDetails[i].LNP.emailContactMechId;
              this.telecomeContactMechId =
                response.partyAndContactMechDetails[
                  i
                ].LNP.telecomeContactMechId;
            }
            this.getProductList.push({
              name: this.nameNew,
              email: this.emailNew,
              emailContactMechId: this.emailContactMechId,
              contactNumber: this.contactNumberNew,
              telecomeContactMechId: this.telecomeContactMechId,
              contactMechPurposeTypeIdEmail: this.contactMechPurposeTypeIdEmail,
              contactMechPurposeTypeIdPhone: this.contactMechPurposeTypeIdPhone,
            });
            this.isLoading = false;
          }
        }
      } catch (error) {
        this.isLoading = false;
      }
    },

    editItem(item) {
      this.dialogEdit = true;
      this.data.contactNumber = item.contactNumber;
      this.data.email = item.email;
      this.data.telecomeContactMechId = item.telecomeContactMechId;
      this.data.emailContactMechId = item.emailContactMechId;
      this.data.contactMechPurposeTypeIdEmail =
        item.contactMechPurposeTypeIdEmail;
      this.data.contactMechPurposeTypeIdPhone =
        item.contactMechPurposeTypeIdPhone;
      this.em = this.data.email;
      this.ph = this.data.contactNumber;
    },
    // ************ Update Api ***************
    async updateEditData() {
      this.isLoading = true;
      if (this.data.contactNumber !== this.ph && this.data.email !== this.em) {
        if (this.ph == undefined && this.em == undefined) {
          this.createUpdate.email = this.data.email;
          this.createUpdate.contactMechPurposeTypeIdEmail =
            this.data.contactMechPurposeTypeIdEmail;
          this.createUpdate.contactNumber = this.data.contactNumber;
          this.createUpdate.contactMechPurposeTypeIdPhone =
            this.data.contactMechPurposeTypeIdPhone;
          try {
            let resultData = await productStore.createProductStoreDetails(
              this.createUpdate
            );
            if (resultData.responseMessage == "success") {
              this.dialogEdit = false;
              this.isLoading = false;
              this.getProductStoreDetailsApi();
              this.getProductList = [];
            }
          } catch (error) {
            this.isLoading = false;
          }
        } else {
          this.productUpdate.email = this.data.email;
          this.productUpdate.emailContactMechId = this.data.emailContactMechId;
          this.productUpdate.contactNumber = this.data.contactNumber;
          this.productUpdate.telecomeContactMechId =
            this.data.telecomeContactMechId;
          try {
            let ProductData = await productStore.updateProductStoreDetails(
              this.productUpdate
            );
            if (ProductData.responseMessage == "success") {
              this.dialogEdit = false;
              this.getProductStoreDetailsApi();
              this.getProductList = [];
            }
          } catch (error) {
            this.isLoading = false;
          }
        }
      } else if (this.data.email !== this.em) {
        if (this.em == undefined) {
          this.createUpdate.email = this.data.email;
          this.createUpdate.contactMechPurposeTypeIdEmail =
            this.data.contactMechPurposeTypeIdEmail;
          try {
            let resultData = await productStore.createProductStoreDetails(
              this.createUpdate
            );
            if (resultData.responseMessage == "success") {
              this.dialogEdit = false;
              this.getProductStoreDetailsApi();
              this.getProductList = [];
            }
          } catch (error) {
            this.isLoading = false;
          }
        } else {
          this.productUpdate.email = this.data.email;
          this.productUpdate.emailContactMechId = this.data.emailContactMechId;
          try {
            let ProductData = await productStore.updateProductStoreDetails(
              this.productUpdate
            );
            if (ProductData.responseMessage == "success") {
              this.dialogEdit = false;
              this.getProductStoreDetailsApi();
              this.getProductList = [];
            }
          } catch (error) {
            this.isLoading = false;
          }
        }
      } else {
        if (this.ph == undefined) {
          this.createUpdate.contactNumber = this.data.contactNumber;
          this.createUpdate.contactMechPurposeTypeIdPhone =
            this.data.contactMechPurposeTypeIdPhone;
          try {
            let resultData = await productStore.createProductStoreDetails(
              this.createUpdate
            );
            if (resultData.responseMessage == "success") {
              this.dialogEdit = false;
              this.getProductStoreDetailsApi();
              this.getProductList = [];
            }
          } catch (error) {
            this.isLoading = false;
          }
        } else {
          this.productUpdate.contactNumber = this.data.contactNumber;
          this.productUpdate.telecomeContactMechId =
            this.data.telecomeContactMechId;
          try {
            let productData = await productStore.updateProductStoreDetails(
              this.productUpdate
            );
            if (productData.responseMessage == "success") {
              this.dialogEdit = false;
              this.getProductStoreDetailsApi();
              this.getProductList = [];
            }
          } catch (error) {
            this.isLoading = false;
          }
        }
      }
    },
    // ************** Create Api ***************
    async createData() {
      if (this.data.contactNumber) {
        var updateProductJson = {
          contactNumber: this.data.contactNumber,
          telecomeContactMechId: this.data.telecomeContactMechId,
        };
      } else if (this.data.email) {
        this.updateProductJson = {
          email: this.data.email,
          emailContactMechId: this.data.emailContactMechId,
        };
      }

      try {
        let productData = await productStore.createProductStoreDetails(
          updateProductJson
        );
        if (productData.responseMessage == "success") {
          this.dialogEdit = false;
          this.getProductStoreDetailsApi();
        }
      } catch (error) {
        this.isLoading = false;
      }
    },

    closeEdit() {
      this.dialogEdit = false;
    },
  },
};
</script>
<style scoped>
.update {
  margin-left: 360px;
}
</style>
