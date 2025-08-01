<template>
  <div>
    <v-card elevation="1">
      <v-toolbar elevation="0">
        <v-spacer></v-spacer>
        <v-btn
          class="mx-2"
          fab
          small
          dark
          color="blue"
          elevation="2"
          to="/purchasedid"
        >
          <v-icon> keyboard_backspace </v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <div v-if="cartList.length < 1" class="py-15">
        <v-row align="center" justify="center">
          <v-card-title>Your shopping cart is empty.</v-card-title>
        </v-row>
        <v-row align="center" justify="center">
          <v-card-actions>
            <v-btn depressed class="primary-btn" outlined to="/purchasedid">
              Continue Shopping
            </v-btn>
          </v-card-actions>
        </v-row>
      </div>

      <v-dialog v-model="showDialog" max-width="400px" persistent>
        <v-card flat class="Card-style pa-2">
          <v-container fluid>
            <v-layout justify-center>
              <v-flex xs12 sm12>
                <p>Would You like to remove your order?</p>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="showDialog = false" depressed color="error"
                    >Cancel</v-btn
                  >
                  <v-btn @click="modifyCart" depressed color="primary">
                    Ok
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showCheckoutDialog" max-width="400px" persistent>
        <v-card flat class="Card-style pa-2">
          <v-container fluid>
            <v-layout justify-center>
              <v-flex xs12 sm12>
                <p>
                  Order has been placed successfully. We will inform you via
                  Email when numbers are allocated.
                </p>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="closeCheckOutDialog"
                    depressed
                    to="/orders"
                    color="primary"
                    >OK
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="uploadDocumentDialog" max-width="500px" persistent>
        <v-card flat class="Card-style pa-2">
          <v-layout>
            <v-flex xs12>
              <label class="title text-xs-center">Upload Documents</label>
              <v-icon
                style="float: right"
                class="right"
                @click="uploadDocumentDialog = false"
                >cancel</v-icon
              >
            </v-flex>
          </v-layout>
          <v-flex>
            <v-text-field
              placeholder="Select Image"
              @click="pickFile"
              v-model="imageName"
              append-icon="attach_file"
              autocomplete="off"
              readonly
            ></v-text-field>
            <input
              type="file"
              accept="image/*"
              ref="image"
              @change="onFilePicked"
              style="display: none"
            />
          </v-flex>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="uploadDocumentDialog = false" depressed color="error"
              >Cancel</v-btn
            >
            <v-btn
              depressed
              color="primary"
              @click="uploadDocumentDialog = false"
            >
              Select
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container class="fill-height pb-6" fluid v-if="cartList.length > 0">
        <v-row v-if="instructions">
          <v-col lg="12" md="8" sm="12" cols="12">
            <v-card-title class="pl-0 pt-0 font-weight-regular">
              Review and agree to end user registration requirements and notes
              :-
            </v-card-title>
            <v-alert
              border="right"
              color="blue-grey"
              dark
              v-for="(instruction, i) in instructions"
              :key="i"
            >
              <span v-html="instruction"></span>
            </v-alert>
          </v-col>
          <!-- <v-col lg="12" md="12" sm="12" cols="12">
            <v-card-actions class="py-0">
              <v-spacer></v-spacer>
              <v-btn
                class="primary-btn"
                outlined
                @click="uploadDocumentDialog = true"
              >
                Upload Documents
                <v-icon> cloud_upload </v-icon>
              </v-btn>
            </v-card-actions>
          </v-col> -->
        </v-row>
        <v-row>
          <v-col cols="12">
            <div>
              <v-card-actions class="py-1">
                <v-card-title class="pl-0 py-0 font-weight-regular">
                  Order Summary :-
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn
                  class="primary-btn"
                  outlined
                  @click="uploadDocumentDialog = true"
                >
                  Upload Documents
                  <v-icon class="pl-2"> cloud_upload </v-icon>
                </v-btn>
              </v-card-actions>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-card elevation="1">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <!-- <th class="text-left">DID</th>

                            <th class="text-left">Quantity</th>
                            <th class="text-left">
                              <v-icon>call_to_action </v-icon>
                            </th> -->
                            <th class="text-left">DID Numbers</th>
                            <th class="text-left"></th>
                            <th class="text-left">
                              {{ totalDIDNumbers }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in cartList"
                            :key="item.itemIndex"
                          >
                            <td class="py-2">
                              <b> {{ item.countryName }}</b
                              ><br />
                              Setup:<b> ${{ item.setupCost }}</b> <br />
                              Unitprice: <b> ${{ item.unitPrice }}</b> <br />
                              DidType: <b>{{ item.didType }}</b>
                            </td>
                            <td>{{ Number(item.quantity) }}</td>
                            <td>
                              <v-icon
                                color="red"
                                @click="showModal(index, item.quantity)"
                                >delete</v-icon
                              >
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                    <v-divider></v-divider>
                    <v-card-actions class="pt-1 pb-0">
                      <v-card-subtitle class="pl-2 black--text">Total DID Orders</v-card-subtitle>
                      <v-spacer></v-spacer>
                      <v-card-subtitle class="black--text"> ${{ grandTotal }} </v-card-subtitle>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-card elevation="1">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Pay By</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="py-4">
                              <v-radio-group
                                v-model="billingAccountId"
                                mandatory
                              >
                                <v-radio
                                  :value="account.billingAccountId"
                                  v-for="account of accountBillingList"
                                  :key="account.billingAccountId"
                                >
                                  <template v-slot:label>
                                    <div>
                                      Billing Account: ${{ account.balance }}
                                    </div>
                                  </template>
                                </v-radio>
                              </v-radio-group>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                    <v-divider></v-divider>
                    <v-card-actions class="py-3">
                      <v-row align="end" justify="end" no-gutters>
                        <v-btn class="primary-btn" outlined @click="checkOut">
                          Check Out</v-btn
                        >
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <loading :active="isLoading" :loader="loader" />
    </v-card>
  </div>
</template>

<script>
import shoppingCartAPI from "@/services/shoppingCartAPI.js";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";

export default {
  name: "shoppingCart",
  components: {
    Loading,
  },
  data() {
    return {
      cartList: [],
      accountBillingList: [],
      grandTotal: 0,
      totalDIDNumbers: 0,
      instructions: [],
      billingAccountId: null,
      removeCartData: {},
      showDialog: false,
      showCheckoutDialog: false,
      uploadDocumentDialog: false,
      userDetail: {},
      isLoading: false,
      loader: "bars",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      type: "",
    };
  },

  methods: {
    async getCartItem() {
      let userDetail = JSON.parse(localStorage.getItem("userDetail"));
      try {
        let response = await shoppingCartAPI.getCartItem();
        this.cartList = [];
        let obj = {};
        for (let item of response.cartItemList) {
          if (obj[item.areaCode]) {
            obj[item.areaCode][0].quantity += Number(item.quantity);
          } else {
            obj[item.areaCode] = [];
            item.quantity = Number(item.quantity);
            obj[item.areaCode].push(item);
          }
        }

        for (let item of Object.values(obj)) {
          this.cartList.push(...item);
        }

        this.grandTotal = response.cartGrandTotal;
        if (response.instructions && response.instructions.length > 0) {
          this.instructions = response.instructions;
        }
        for (let item of this.cartList) {
          this.totalDIDNumbers += Number(item.quantity);
        }
      } catch (error) {
      }
    },

    async getBilling() {
      this.isLoading = true;
      let userDetail = JSON.parse(localStorage.getItem("userDetail"));
      try {
        let response = await shoppingCartAPI.getBilling({
          accountId: userDetail.accountId,
          partyId: userDetail.partyId,
        });
        this.accountBillingList = response.billingAccountList;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },

    async modifyCart() {
      try {
        await shoppingCartAPI.modifyCart({
          removeSelected: "true",
          selectedItem: this.removeCartData.index,
        });

        this.getCartItem();
        this.getBilling();
        this.$root.$emit("MODIFY_CART", {
          quantity: -Number(this.removeCartData.quantity),
        });
        this.showDialog = false;
      } catch (error) {
      }
    },

    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      this.imageName = "";
      this.imageFile = "";
      this.imageUrl = "";
      this.type = "";
      if (files[0] !== undefined) {
        this.type = files[0].type;
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          this.disableButton = false;
        });
      }
    },

    async checkOut() {
      try {
        let checkOutData = {
          billingAccountId: this.billingAccountId,
          shippingMethod: "NO_SHIPPING@_NA_",
          checkOutPaymentId: "EXT_BILLACT",
        };

        await shoppingCartAPI.checkOut(checkOutData);
        let processOrderData = {
          accountId: this.userDetail.accountId,
          authToken: localStorage.getItem("auth"),
          billingAccountId: this.billingAccountId,
          checkOutPaymentId: "EXT_BILLACT",
          shippingMethod: "NO_SHIPPING@_NA_",
          uploadedFile: [],
        };
        if (this.imageUrl) {
          processOrderData.uploadedFile.push(
            this.imageUrl.replace(`data:${this.type};base64,`, "")
          );
        }
        await shoppingCartAPI.processOrder(processOrderData);
        this.showCheckoutDialog = true;
      } catch (error) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: error.data.messageDetail,
          color: "error",
        });
      }
    },

    showModal(index, quantity) {
      this.showDialog = true;
      this.removeCartData = {
        index: index,
        quantity: quantity,
      };
    },

    closeCheckOutDialog() {
      this.showCheckoutDialog = false;
      this.$root.$emit("SHOW_SNACKBAR", {
        text: "Your order is placed",
        color: "success",
      });
    },
  },

  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getCartItem();
    this.getBilling();
  },
};
</script>
