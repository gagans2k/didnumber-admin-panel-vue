<template>
  <v-container fluid>
    <loading :active="isLoading" :loader="loader" />

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

    <!-- dialog box upload document -->
    <v-dialog v-model="userFormDialog" max-width="900" persistent>
      <div>
        <v-card flat class="Card-style pa-2" :loading="submitLoader">
          <v-layout>
            <v-flex xs12 class="pa-2">
              <label class="title text-xs-center">Upload Documents</label>
              <v-icon style="float: right" class="right" @click="closeUserForm"
                >cancel</v-icon
              >
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-container fluid>
            <v-radio-group
              v-model="radioGroup"
              label="Type:"
              row
              mandatory
              @change="changeForm(radioGroup)"
            >
              <v-radio label="Personal" value="PERSONAL"></v-radio>
              <v-radio label="Business" value="BUSINESS"></v-radio>
            </v-radio-group>
          </v-container>

          <!-- alerts message when aprroved document -->
          <v-col
            lg="12"
            md="12"
            sm="12"
            cols="12"
            class="py-0"
            v-if="userDocumentInfo.statusId == 'DOC_APPROVED'"
          >
            <v-alert border="right" color="blue-grey" dark>
              This Identity is approved, so no changes can be performed. If you
              need to allocate number with Different identity , Kindly create a
              new identity with new information.
            </v-alert>
          </v-col>

          <v-col cols="12" class="pb-0">
            <!-- personal form -->
            <v-card-subtitle class="pl-0 pb-3 pt-2"
              ><b>Identity Name:-</b>
            </v-card-subtitle>
            <v-row>
              <v-col cols="12" sm="4" class="py-0">
                <v-select
                  label="Select Documents"
                  :items="getDocumentList"
                  v-model="document.documentInfoId"
                  item-text="name"
                  item-value="documentInfoId"
                  color="primary"
                  outlined
                  dense
                  hide-details
                >
                  <template slot="item" slot-scope="data">
                    <v-list-item-content @click="getItemText(data.item)">
                      <v-list-item-title>{{
                        data.item.name
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-card-subtitle class="pl-1 pb-3"
              ><b>Personal Information:-</b>
            </v-card-subtitle>
            <v-form ref="form" v-model="isFormValid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="First name"
                    v-model="userDocumentInfo.firstName"
                    color="primary"
                    :rules="firstNameRules"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="Middle name"
                    v-model="userDocumentInfo.middleName"
                    color="primary"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                    :rules="middleNameRules"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="Last name"
                    v-model="userDocumentInfo.lastName"
                    color="primary"
                    :rules="lastNameRules"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="userDocumentInfo.dateOfBirth"
                        label="Date Of Birth"
                        persistent-hint
                        append-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        dense
                        readonly
                        :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="userDocumentInfo.dateOfBirth"
                      no-title
                      :max="maxDate"
                      @input="dateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="Personal Tax ID "
                    v-model="userDocumentInfo.personalTaxId"
                    color="primary"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="Address"
                    v-model="userDocumentInfo.address"
                    color="primary"
                    :rules="addressRules"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="City"
                    v-model="userDocumentInfo.city"
                    :rules="cityRules"
                    color="primary"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="Country"
                    v-model="userDocumentInfo.country"
                    :rules="countryRules"
                    color="primary"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="ZIP Code or Postal Code"
                    v-model="userDocumentInfo.postalCode"
                    color="primary"
                    :rules="postalCodeRules"
                    outlined
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-text-field
                    label="Country of Birth"
                    v-model="userDocumentInfo.countryOfBirth"
                    outlined
                    dense
                    hide-details
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                    :rules="countryOfBirthRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <div v-if="radioGroup == 'BUSINESS'">
                <v-card-subtitle class="pl-1 pb-3"
                  ><b>Business Information:- </b></v-card-subtitle
                >
                <v-row>
                  <v-col cols="12" sm="4" class="py-0">
                    <v-text-field
                      label="Company name"
                      v-model="userDocumentInfo.companyName"
                      color="primary"
                      :rules="businessNameRules"
                      outlined
                      dense
                      :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="4" class="py-0">
                    <v-text-field
                      label="Company registration number"
                      v-model="userDocumentInfo.companyRegistrationNumber"
                      outlined
                      dense
                      :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                      :rules="companyRegistrationRules"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" class="py-0">
                    <v-text-field
                      label="Incorportation Country"
                      v-model="userDocumentInfo.incorporationCountry"
                      color="primary"
                      outlined
                      dense
                      :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                      :rules="incorportationCountryRules"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" class="py-0">
                    <v-text-field
                      label="VAT ID"
                      :rules="vatIdRules"
                      v-model="userDocumentInfo.vatId"
                      color="primary"
                      outlined
                      hide-details
                      dense
                      :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-form>

            <!-- get uploaded files Description -->
            <section v-if="outList && outList.length != 0">
              <v-card-subtitle class="pl-1 pb-3"
                ><b>Uploaded Documents:-</b>
              </v-card-subtitle>
              <!-- <v-btn
                  text
                  v-for="(files, i) in outList"
                  :key="i"
                  :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  @click="deleteDialog(files)"
                >
                  {{ files.description }}
                  <v-icon color="red" size="18">delete</v-icon>
                </v-btn> -->
              <v-chip
                class="ma-2"
                @click="deleteDialog(files)"
                v-for="(files, i) in outList"
                :key="i"
                :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
              >
                {{ files.description }}
                <v-icon color="red" size="18" class="ml-2"> cancel </v-icon>
              </v-chip>
            </section>

            <v-card-subtitle class="pl-1 pb-3"
              ><b>Upload Documents:- </b>File extension should be .jpeg, .jpg,
              .pdf or .png.
            </v-card-subtitle>
            <v-form ref="validform" v-model="valid" lazy-validation>
              <v-row v-for="(input, index) in uploadInfoInputs" :key="index">
                <v-col cols="12" sm="4" class="py-0">
                  <v-select
                    label="Select Document"
                    :items="documentList"
                    item-text="text"
                    item-value="value"
                    v-model="input.uploadFileKey"
                    color="primary"
                    outlined
                    @change="uploadFiles(input.uploadFileKey)"
                    dense
                    clearable
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                  >
                  </v-select>
                </v-col>
                <v-col cols="6" sm="4" class="py-0">
                  <v-file-input
                    label="upload"
                    append-icon="mdi-paperclip"
                    color="primary"
                    v-model="input.uploadFile"
                    outlined
                    @change="uploadFiles(input.uploadFile)"
                    dense
                    :disabled="userDocumentInfo.statusId == 'DOC_APPROVED'"
                    :rules="FileUploadrules"
                  >
                  </v-file-input>
                </v-col>
                <v-col cols="12" sm="4" class="py-0">
                  <v-btn
                    fab
                    outlined
                    small
                    color="primary"
                    @click="addRow"
                    v-if="uploadInfoInputs[0].uploadFile != undefined"
                  >
                    <v-icon> add </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="uploadInfoInputs.length != 1"
                    fab
                    outlined
                    class="ml-3"
                    small
                    color="error"
                    @click="deleteRow(index)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                depressed
                color="primary"
                class="mt-2"
                :loading="submitLoader"
                @click="submitUserForm(userDocumentInfo.documentInfoId)"
                elevation="0"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-card>
      </div>
    </v-dialog>

    <!-- dialog box Number details -->
    <!-- <v-dialog v-model="dialog" persistent Extra width="960px">
      <v-card>
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>Number Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-simple-table>
            <tbody>
            <thead>
              <tr>
                <th class="text-left">
                  Number:
                </th>
                <td v-if="itemDetails.didStatus == 'DID_PENDING_ALLOCA' && itemDetails.number == null" ui-sref="app.supplierList({'order_id':order_id, 'Item_Id':Item_Id})" style="cursor: pointer;">
                  <i class="material-icons" style="cursor: pointer;color: blue;" >format_list_numbered</i><span>Assign Number</span>
                </td>
                <td v-if="itemDetails.didStatus == 'DID_PENDING_ALLOCA' && itemDetails.number == null" @click="cancel(order_id,Item_Id)" style="cursor: pointer;">
                  <i class="material-icons" style="cursor: pointer;color: red;"  >clear</i><span>Cancel Allocation</span>
                </td>
                <td v-if="itemDetails.didStatus != 'DID_PENDING_ALLOCA'">{{ itemDetails.number }}</td>
              </tr>
              <tr>
                <th class="text-left">
                  Did status:
                </th>
                <td v-if="itemDetails.didStatus == 'DID_PENDING_ALLOCA'">PENDING ALLOCATION</td>
                <td v-if="itemDetails.didStatus == 'DID_ALLO_CANCELLED'">Cancel Allocation</td>
                <td v-if="itemDetails.didStatus == 'DID_ACTIVATED'">Activated</td>
                <td v-if="itemDetails.didStatus == 'DID_INACTIVE'">INACTIVE</td>
                <td v-if="itemDetails.didStatus == 'DID_SUSPENDED'">SUSPENDED</td>
                <td v-if="itemDetails.didStatus == 'DID_TERMINATED'">TERMINATED</td>
              </tr>
              <tr>
                <th class="text-left">
                  Country Name:
                </th>
                <td>{{ itemDetails.countryName }}</td>
              </tr>
              <tr>
                <th class="text-left">
                  State:	
                </th>
                <td>{{ itemDetails.stateName }}</td>
              </tr>
              <tr>
                <th class="text-left">
                  City:
                </th>
                <td>{{ itemDetails.cityName }}</td>
              </tr>
              <tr>
                <th class="text-left">
                  Did Type:
                </th>
                <td>{{ itemDetails.didType }}</td>
              </tr>
              <tr>
                <th class="text-left">
                  Area Code:	
                </th>
                <td>{{ itemDetails.areaCode }}</td>
              </tr>
            </thead>
              </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!--------------------------------------------------------------------------------------->
    <v-row>
      <v-col cols="12">
        <!-- <v-toolbar dark color="primary">
          <v-toolbar-title>Order Detail</v-toolbar-title>
        </v-toolbar> -->
      </v-col>
    </v-row>

    <v-card class="card">
      <v-container fluid>
        <v-toolbar elevation="0">
          <v-spacer></v-spacer>
          <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
        </v-toolbar>
        <!-- <div class="bckbtn">
          <v-row justify="end">
            <v-col cols="1"> -->
        <!-- <v-btn
          color="rgb(231,87,83)"
          dark
          block
          @click="$router.go(-1)"
          >Back</v-btn -->

        <!-- <v-spacer></v-spacer> -->
        <!-- <v-col class="btn" xs="12" sm="2" md="1">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'Dashboard',
          }"
          >Back</v-btn
        >
            </v-col> -->

        <!-- Back button -->
        <!-- <v-spacer></v-spacer>
              <v-btn
                class="btn"
                xs="12"
                sm="1"
                md="1"
                color="rgb(231,87,83)"
                dark
                @click="$router.go(-1)"
              >
                Back
              </v-btn>
            </v-col>
          </v-row>
        </div> -->
        <!-- <hr /> -->
        <!-- NAME -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Order Id:</p></span
            ></v-col
          >
          <v-col cols="6">
            <span class="subtitle-1 font-weight-regular">{{
              orderDetails.orderId
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- QUANTITY -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Quantity:</p></span
            ></v-col
          >
          <v-col cols="6">
            <span class="subtitle-1 font-weight-regular">{{
              orderDetails.orderItemList[0].quantity
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- STATUS -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Status:</p>
            </span></v-col
          >
          <v-col cols="6">
            <span class="subtitle-1 font-weight-regular">{{
              orderDetails.orderItemList[0].statusId
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- UNIT PRICE -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Unit Price:</p>
            </span></v-col
          >
          <v-col cols="6">
            <span class="subtitle-1 font-weight-regular">{{
              orderDetails.orderItemList[0].unitPrice
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Setup Cost -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Setup Price:</p>
            </span></v-col
          >
          <v-col cols="6">
            <span class="subtitle-1 font-weight-regular">{{
              orderDetails.orderItemList[0].itemAdjustment
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Billing Tenure -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Billing Tenure:</p>
            </span></v-col
          >
          <v-col cols="6">
            <span
              class="subtitle-1 font-weight-regular"
              v-if="orderDetails.orderItemList[0].itemAdjustment != '0'"
              >1</span
            >
            <span
              class="subtitle-1 font-weight-regular"
              v-if="orderDetails.orderItemList[0].itemAdjustment == '0'"
              >{{(orderDetails.grandTotal / orderDetails.orderItemList[0].unitPrice) | number:0}}</span
            >
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Number -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Number:</p>
            </span></v-col
          >
          <v-col cols="6">
            <span class="font-weight-regular">
              <table style="width: 100%">
                <tr>
                  <th>Status</th>
                  <th>Number</th>
                  <th>View Detail</th>
                  <th>Require Document</th>
                  <th v-if="orderDetails.identityStatusId == 'DOC_APPROVED'">
                    Activate
                  </th>
                  <th>Has SMS/SMS IN</th>
                </tr>
                <tr
                  v-for="statusData in orderDetails.orderItemList"
                  :key="statusData"
                >
                  <td v-if="statusData.didStatus == 'DID_PENDING_ALLOCA'">
                    <v-icon left>pending</v-icon>PENDING ALLOCATION
                  </td>
                  <td v-if="statusData.didStatus == 'DID_ALLO_CANCELLED'">
                    <v-icon left style="color: red">cancel</v-icon>Cancel
                    Allocation
                  </td>
                  <td v-if="statusData.didStatus == 'DID_ACTIVATED'">
                    <v-icon left style="color: green"
                      >check_circle_outline</v-icon
                    >Activated
                  </td>
                  <td v-if="statusData.didStatus == 'DID_INACTIVE'">
                    <v-icon left style="color: blue">not_interested</v-icon
                    >Inactive
                  </td>
                  <td v-if="statusData.didStatus == 'DID_SUSPENDED'">
                    <v-icon left style="color: yellow">access_time</v-icon
                    >Suspended
                  </td>
                  <td v-if="statusData.didStatus == 'DID_TERMINATED'">
                    <v-icon left style="color: red">highlight_off</v-icon
                    >Terminated
                  </td>
                  <td v-if="statusData.didStatus == 'DID_EXPIRED'">
                    <v-icon left style="color: red">highlight_off</v-icon
                    >Expired
                  </td>
                  <!-- New condition for empty or undefined statusData -->
                  <td v-if="statusData.didStatus == 'Cancelled'">
                    <v-icon left style="color: red">highlight_off</v-icon>
                    Cancelled
                  </td>
                  <!-- <td v-if="statusData.didStatus == null">---</td> -->
                  <td v-if="statusData.didStatus !== 'DID_PENDING_ALLOCA'">
                    {{ statusData.number }}
                  </td>
                  <td v-if="statusData.didStatus == 'DID_PENDING_ALLOCA'">
                    XXXXX
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'Number Details',
                        query: {
                          orderId: $route.query.orderId,
                          orderItemSeqId: statusData.orderItemSeqId,
                        },
                      }"
                    >
                      <v-icon size="25" style="color: blue">visibility</v-icon>
                    </router-link>
                  </td>
                  <td
                    v-if="!statusData.requireDocument"
                    style="border: 1px solid black; border-collapse: collapse"
                  >
                    ---
                  </td>
                  <td
                    v-if="statusData.requireDocument == 'Y'"
                    style="border: 1px solid black; border-collapse: collapse"
                  >
                    <i
                      class="material-icons"
                      style="color: rgb(231, 87, 83); cursor: pointer"
                      @click="viewDocument(statusData)"
                      >open_in_browser</i
                    >
                  </td>
                  <td
                    v-if="statusData.requireDocument == 'N'"
                    style="
                      border: 1px solid black;
                      border-collapse: collapse;
                      text-align: center;
                    "
                  >
                    {{ statusData.requireDocument }}
                  </td>
                  <td v-if="orderDetails.identityStatusId == 'DOC_APPROVED'">
                    <v-btn
                      icon
                      v-if="statusData.requireDocument == 'Y'"
                      :disabled="statusData.didStatus === 'DID_ACTIVATED'"
                      @click="openAptoveDialog(statusData)"
                    >
                      <v-icon color="green"> phone</v-icon></v-btn
                    >
                  </td>
                  <td>{{ statusData.hasSms }}</td>
                </tr>
              </table>
            </span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Grand total -->
        <v-row>
          <v-col cols="2">
            <span class="subtitle-1 font-weight-bold">
              <p class="text">Grand Total:</p>
            </span></v-col
          >

          <v-col cols="6">
            <span class="subtitle-1 font-weight-regular">{{
              orderDetails.grandTotal
            }}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-container>
    </v-card>

    <!-- aprove modal box -->
    <v-dialog v-model="aproveModal" width="480">
      <v-card>
        <!-- <v-card-text>
          <v-card-title
            >Are you sure want to activate this number?</v-card-title
          >
        </v-card-text>
        <v-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="aproveModal = false">Cancel</v-btn>
          <v-btn color="green" @click="aproveNumebr()" class="ml-2">ok</v-btn>
        </v-actions> -->
        <v-card-title class="title">
          <span>Are you sure,you want to activate this number?</span>
        </v-card-title>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn color="error" small outlined @click="aproveModal = false">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            outlined
            small
            :loading="isLoading"
            @click="aproveNumber()"
          >
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AllApiCalls from "@/services/AllApiCalls";
import orderAPI from "@/services/orderAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      radioGroup: "PERSONAL",
      cartList: [],
      accountBillingList: [],
      grandTotal: 0,
      totalDIDNumbers: 0,
      instructions: [],
      billingAccountId: null,
      showCheckoutDialog: false,
      removeCartData: {},
      userFormDialog: false,
      isLoading: false,
      loader: "bars",
      userDocumentInfo: {
        documentInfoId: "",
      },
      getDocumentList: [],
      IndentiyDocumentList: [
        {
          name: "Create New Identity",
          documentInfoId: "createNew",
        },
      ],
      documentList: [
        {
          value: "BUS_REG_CER",
          text: "Business Registration Certificate",
        },
        {
          value: "CO_REN_CER",
          text: "Company renewal Certificate",
        },
        {
          value: "PASSPORT",
          text: "Passport",
        },
        {
          value: "NAT_ID_PRF",
          text: "National ID proof",
        },
        {
          value: "DL",
          text: "Driving Licence",
        },
        {
          value: "OTH_ID_PRF",
          text: "Other ID Proof",
        },

        {
          value: "UTL_BILL",
          text: "Utility Bill",
        },
        {
          value: "TELCOM_BILL",
          text: "Telecom Bill",
        },
        {
          value: "RE_BANK_ST",
          text: "Recent Bank Statement",
        },
        {
          value: "RENT_LEASE_AGT",
          text: "Rent//Lease Agreement",
        },
        {
          value: "OTH_ADDRESS_PRF",
          text: "other Address proof",
        },
        {
          value: "OTHERS",
          text: "Others",
        },
      ],
      isFormValid: true,
      valid: true,
      submitLoader: false,
      firstNameRules: [
        (v) => !!v || "Field is reuired",
        (v) => (v && v.length <= 70) || "Maximum 70 characters allowed",
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      middleNameRules: [
        (v) => (v && v.length >= 70 ? "Maximum 18 characters allowed" : true),
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      lastNameRules: [
        (v) => !!v || "Field is reuired",
        (v) => (v && v.length <= 70) || "Maximum 70 characters allowed",
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      addressRules: [
        (v) => !!v || "Field is reuired",
        (v) => (v && v.length <= 82) || "Maximum 82 characters allowed",

        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      cityRules: [
        (v) => !!v || "this value is required",
        (v) => (v && v.length <= 15) || "Maximum 15 characters allowed",
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      countryRules: [
        (v) => !!v || "this value is required",
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      postalCodeRules: [
        (v) => !!v || "Field is required",
        (v) => (v && v.length <= 9) || "Maximum 9 characters allowed",
        (v) =>
          /^[a-zA-Z0-9\-\s- ]{0,9}$/.test(v) ||
          "pin code can only contain letters, numbers, spaces and hyphens",
      ],
      countryOfBirthRules: [
        (v) => (v && v.length >= 9 ? "Maximum 18 characters allowed" : true),
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      businessNameRules: [
        (v) => !!v || "Field is required",
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      documentrules: [(v) => !!v || "Field is required"],
      vatIdRules: [
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      companyRegistrationRules: [
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      incorportationCountryRules: [
        (v) =>
          /[^\w\s]/.test(v) ? "Special characters are not allowed" : true,
      ],
      FileUploadrules: [
        (v) =>
          !v ||
          v.size <= 3000000 ||
          "file size should be less than or equal to 3 Mb!",
      ],
      uploadInfoInputs: [],
      dateMenu: "",
      maxDate: "",
      uploadFile: {},
      document: {},
      sumGetTotalLength: 0,
      getTotalFormLength: [],
      flag: "",
      // showNextButton: false,
      // showSubmitButton: true,
      geoIdFordocumentInfoList: "",
      base64Data: "",
      updateIdNames: "",
      uploadedFiles: [],
      countryNameList: [],
      documentInfoList: [],
      showIndex: 0,
      countryGeoId: "",
      FormType: "PERSONAL",
      geoIDSelected: "",
      // shoping cart end items
      orderDetail: [],
      orderDetailList: [],
      outList: [],
      imformatoryText: "",
      inventoryItemId: "",
      fileUpload: {},
      moment: moment,
      orderDetails: {
        orderItemList: [{}],
      },
      dialog: false,
      itemDetails: "",
      didStatusList: {
        DID_ACTIVATED: "ACTIVATED",
        DID_INACTIVE: "INACTIVE",
        DID_PENDING: "PENDING",
        DID_SUSPENDED: "SUSPENDED",
        DID_TERMINATED: "TERMINATED",
        DID_ALL: "ALL",
      },
      aproveModal: false,
      aporveNumberData: {},
      selectedIdentity: "",
    };
  },
  methods: {
    async getOrderDetail() {
      this.isLoading = true;
      let response = await this.getMethod("getOrderDetail", {
        orderId: this.$route.query.orderId,
      });
      this.isLoading = false;
      this.orderDetails = JSON.parse(JSON.stringify(response.orderDetails));
    },

    async getOrderNumberDetail(data) {
      let response = await this.getMethod("getOrderNumberDetail", {
        orderId: this.$route.query.orderId,
        orderItemSeqId: data.orderItemSeqId,
      });
      this.itemDetails = response.itemDetails;
      this.dialog = true;
    },

    changeForm(formName) {
      // if (formName) {
      //   this.radioGroup = formName;
      //   this.fetchDocumentInfo(formName);
      // } else {
      this.fetchDocumentInfo(formName);
      this.radioGroup = formName;
      // }
    },

    closeUserForm() {
      this.userFormDialog = false;
      //this.uploadFile = {};
      this.userDocumentInfo.documentInfoId = {};
      this.userDocumentInfo = {};
      this.document = {};
      this.fileUpload = {};
      this.$refs.form.reset();
      this.$refs.validform.reset();
    },

    getGeoID(geoIdRetrive) {
      this.geoIDSelected = geoIdRetrive;
    },

    updateValueData(value) {
      //this.$refs.form[0].validate()
    },

    valueChangeCheck(idName) {
      this.updateIdNames = idName;
    },

    addRow() {
      this.uploadedFiles = [];
      if (this.uploadInfoInputs.length < 6) {
        this.uploadInfoInputs.push({
          uploadFileKey: null,
          uploadFile: null,
        });
      } else {
        if (this.uploadInfoInputs.length != 0) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Maximum add six documents!",
            color: "error",
          });
        }
      }
    },

    deleteRow(index) {
      this.uploadedFiles = [];
      this.uploadInfoInputs.splice(index, 1);
      //this.getCartItem();
    },

    getItemText(selectedDocumentData) {
      if (selectedDocumentData.documentInfoId == "createNew") {
        this.$refs.form.reset();
        this.userDocumentInfo = {};
        this.uploadInfoInputs = [
          {
            uploadFileKey: null,
            uploadFile: null,
          },
        ];
        this.outList = [];
      } else {
        this.getDocumentInfo(selectedDocumentData);
      }
    },

    async viewDocument(item) {
      // console.log("item", item);
      this.userFormDialog = true;
      this.inventoryItemId = item.inventoryItemId;
      this.getGeoIdForDoc = item.facilityGeoId;
      this.quantityGetFromOrder = item.quantity;
      this.fetchDocumentInfo(this.FormType);
    },
    // fetch uplaoded documnets list
    async fetchDocumentInfo(formName) {
      // console.log(formName)
      // console.log(this.$route.query.partyId)
      this.isLoading = true;
      // var getDocumentList = [];
      this.getDocumentList = [];
      if (!this.selectedIdentity) {
        this.document = {};
      }

      try {
        let response = await orderAPI.getDocumentInfoApi({
          partyId: this.$route.query.partyId,
          geoId: this.getGeoIdForDoc,
          documentInfoType: formName,
        });
        this.getDocumentList = this.IndentiyDocumentList.concat(
          response.outMapList
        );

        // set empty form
        if (Object.keys(this.userDocumentInfo).length != 0) {
          this.$refs.form.reset();
        }
        if (Object.keys(this.document).length != 0) {
          this.$refs.form.reset();
        }
        this.outList = [];
        this.uploadedFiles = [];
        this.uploadInfoInputs = [
          {
            uploadFileKey: null,
            uploadFile: null,
          },
        ];

        // this.userDocumentInfo = selectedDocumentData;
        // var dateOfBirth = new Date(this.userDocumentInfo.dateOfBirth);
        // this.userDocumentInfo.dateOfBirth = moment(String(dateOfBirth)).format(
        //   "YYYY-MM-DD"
        // );
        // this.getTotalFormLength = Object.values(this.userDocumentInfo);

        // var userDocumentInfo = [];
        // for (let index = 0; index < getDocumentList.length; index++) {
        //   var element = getDocumentList[index];
        //   if (element.firstName) {
        //     element.name =
        //       element.firstName + " " + "(" + element.country + ")";
        //   }
        //   userDocumentInfo.push(element);
        // }
        // this.getDocumentList = userDocumentInfo;
        this.userFormDialog = true;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong",
          color: "error",
        });
      }
    },

    async getDocumentInfo(selectedDocumentData) {
      this.isLoading = true;
      // var getDocumentList = [];
      // this.getDocumentList = [];
      // this.document = {};
      // console.log(
      //   "this.radioGroup",
      //   this.radioGroup,
      //   "selectedDocumentData",
      //   selectedDocumentData
      // );
      try {
        // getDocumentInfo
        let response = await orderAPI.getDocumentInfo({
          partyId: this.$route.query.partyId,
          geoId: this.countryGeoId,
          documentInfoType: this.radioGroup,
          documentInfoId: selectedDocumentData.documentInfoId,
        });
        // getDocumentList = response.documentInfoList;
        // var userDocumentInfo = [];
        // for (let index = 0; index < getDocumentList.length; index++) {
        //   var element = getDocumentList[index];
        //   if (element.firstName) {
        //     element.name = element.firstName + " " + "(" + element.country + ")";
        //   }
        //   userDocumentInfo.push(element);
        // }
        // console.log("respaonse:+++++++++++", response);
        this.selectedIdentity = response.name;
        if (response.documentInfoList.length == 0) {
          this.$refs.form.reset();
        } else {
          this.userDocumentInfo = response.documentInfoList[0];
        }

        this.outList = response.outList;
        if (this.userDocumentInfo && this.userDocumentInfo.dateOfBirth) {
          this.converUnixToDate(this.userDocumentInfo.dateOfBirth);
        }

        // this.userFormDialog = true;
        this.isLoading = false;
        // if (checkSubmit == "Submit") {
        //   this.countryNameList.reverse();
        //   this.userFormDialog = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "something wrong",
          color: "error",
        });
      }
    },
    // convert timestamp to date format
    converUnixToDate(dateOfBirth) {
      if (dateOfBirth) {
        const dateString = moment.unix(dateOfBirth / 1000).format("YYYY-MM-DD");
        this.userDocumentInfo.dateOfBirth = dateString;
        // return dateString;
      }
    },
    //upload document functionality
    uploadFiles() {
      this.uploadedFiles = [];
      if (this.uploadInfoInputs.length != 0) {
        for (let index = 0; index < this.uploadInfoInputs.length; index++) {
          const element = this.uploadInfoInputs[index];
          if (
            (element &&
              element.uploadFile &&
              element.uploadFile.type &&
              element.uploadFile.type == "image/jpeg") ||
            element.uploadFile.type == "image/jpg" ||
            element.uploadFile.type == "application/pdf" ||
            element.uploadFile.type == "image/png"
          ) {
            element.uploadFiles = {};
            var rawData = [];
            var this_ = this;
            var files = [];
            //  making baseUrl of upload documents
            if (element.uploadFileKey != null) {
              files.push(element.uploadFile);
              var reader = new FileReader();
              var file = "updating";
              reader.onloadend = function (evt) {
                // console.log("evt--------------", evt);
                var data = evt.target.result;
                // console.log("data-------", data);
                file = data.split(",");
                // console.log("file", file);
                var img = new Image();
                if (element.uploadFile.type != "application/pdf") {
                  img.onload = function () {
                    // console.log("enterrrrrrrrrrrrrrrrr-----------canvas");
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    // Resize canvas
                    var MAX_WIDTH = 1000;
                    var MAX_HEIGHT = 800;
                    var width = img.width;
                    var height = img.height;
                    if (width > height) {
                      if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                      }
                    } else {
                      if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                      }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0, width, height);
                    // Get compressed data URL
                    var compressedDataUrl = canvas.toDataURL("image/jpeg", 1.0);
                    var rawData = compressedDataUrl.split(",")[1];
                    // console.log("======raw data", rawData);
                    //rawData = file[1];
                    // console.log("this_.geoIDSelected", this_.geoIDSelected);
                    if (
                      element.uploadFileKey != null ||
                      element.uploadFileKey != undefined
                    ) {
                      element.uploadFiles["uploadedFile"] = rawData;
                      element.uploadFiles["fileName"] = element.uploadFileKey;
                      element.uploadFiles["geoId"] = this_.geoIDSelected;
                      element.uploadFiles["documentType"] = this_.radioGroup;
                      element.uploadFiles["mimeTypeId"] =
                        element.uploadFile.type;
                      this_.uploadedFiles.push(element.uploadFiles);
                      // localStorage.setItem(
                      //   "uploadObject",
                      //   JSON.stringify(this_.uploadedFiles)
                      // );
                    }
                  };
                } else {
                  element.uploadFiles["uploadedFile"] = file[1];
                  element.uploadFiles["fileName"] = element.uploadFileKey;
                  element.uploadFiles["geoId"] = this_.geoIDSelected;
                  element.uploadFiles["documentType"] = this_.radioGroup;
                  element.uploadFiles["mimeTypeId"] = element.uploadFile.type;
                  this_.uploadedFiles.push(element.uploadFiles);
                }
                img.src = data;
              };
              if (files[0] != null) {
                reader.readAsDataURL(files[0]);
              }
            }
          } else {
            this.uploadInfoInputs[index].uploadFile = "";
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "File extension should be '.jpeg','.jpg',.pdf or '.png'",
              color: "error",
            });
          }
        }
        //store all uploaded imges in this.uploadFiles array
      }
    },

    async submitUserForm(documentInfoId) {
      // var fillForm = null;
      // this.$refs.validform.validate();
      // var userDocumentInfoArray = Object.values(this.userDocumentInfo);
      // if (this.getTotalFormLength.length != 0) {
      //   for (var i = 0; i < this.getTotalFormLength.length; i++) {
      //     if (this.getTotalFormLength[i] != userDocumentInfoArray[i]) {
      //       fillForm = true;
      //     } else if (this.getTotalFormLength[i] == userDocumentInfoArray[i]) {
      //       if (fillForm != true) {
      //       }
      //     }
      //   }
      // } else {
      //   fillForm = true;
      // }
      //part Id
      var submitForm = false;

      if (this.outList.length != 0) {
        submitForm = true;
      } else if (this.uploadedFiles.length != 0) {
        submitForm = true;
      }

      if (this.$refs.form.validate() && this.$refs.validform.validate()) {
        if (submitForm) {
          if (this.userDocumentInfo.dateOfBirth) {
            this.formatDate(this.userDocumentInfo.dateOfBirth);
          }
          // if (fillForm == true) {
          // if (this.userDocumentInfo.documentInfoId) {
          //   delete this.userDocumentInfo.documentInfoId;
          // }
          this.userDocumentInfo.uploadedFiles = this.uploadedFiles;
          this.userDocumentInfo.partyId = this.$route.query.partyId;
          this.userDocumentInfo.geoId = this.getGeoIdForDoc;
          this.userDocumentInfo.selectedDocType = this.radioGroup;
          this.userDocumentInfo["documentInfoType"] = this.radioGroup;
          this.userDocumentInfo["orderId"] = this.$route.query.orderId;
          this.userDocumentInfo["inventoryItemId"] = this.inventoryItemId;

          this.submitLoader = true;
          try {
            let response = await orderAPI.uploadDocumentInfo(
              this.userDocumentInfo
            );
            // this.document.documentInfoId = response.outMap.documentInfoId;
            this.document.documentInfoId = documentInfoId ? documentInfoId : "";
            // this.showIndex++;
            // this.uploadDidAttachment();
            // fillForm = null;
            this.$root.$emit("SHOW_SNACKBAR", {
              text: response.responseMessage,
              color: "success",
            });
            this.submitLoader = false;
            this.userFormDialog = false;
            submitForm = false;
            this.submitForm = false;
            this.userDocumentInfo.documentInfoId = {};
            this.userDocumentInfo = {};
            this.document = {};
            this.outList = [];
            this.uploadedFiles = [];
            this.uploadInfoInputs = [
              {
                uploadFileKey: null,
                uploadFile: null,
              },
            ];
            this.$refs.form.reset();
            this.$refs.validform.reset();
          } catch (error) {
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "something wrong",
              color: "error",
            });
            this.submitLoader = false;
          }
          // } else {
          // if (this.userDocumentInfo.documentInfoId) {
          //   this.submitLoader = true;
          //   this.orderDetail.forEach((element) => {
          //     this.orderDetail.orderId = element.orderId;
          //   });
          //   try {
          //     let response = await orderAPI.setInventoryItemDocInfo({
          //       orderId: this.orderDetails.orderId,
          //       geoId: this.getGeoIdForDoc,
          //       inventoryItemId: this.inventoryItemId,
          //       documentInfoId: this.userDocumentInfo.documentInfoId,
          //     });
          //     this.document.documentInfoId = response.outMap.documentInfoId;
          //     this.showIndex++;
          //     this.uploadInfoInputs = [
          //       {
          //         uploadFileKey: null,
          //         uploadFile: null,
          //       },
          //     ];
          //     this.uploadDidAttachment();
          //     fillForm = null;
          //     this.userDocumentInfo.documentInfoId = {};
          //     this.userDocumentInfo = {};
          //     this.document = {};
          //     this.$refs.form.reset();
          //     this.$refs.validform.reset();
          //     this.$root.$emit("SHOW_SNACKBAR", {
          //       text: response.responseMessage,
          //       color: "success",
          //     });
          //     this.submitLoader = false;
          //   } catch (error) {
          //     this.$root.$emit("SHOW_SNACKBAR", {
          //       text: "something wrong",
          //       color: "error",
          //     });
          //     this.submitLoader = false;
          //   }
          // }
          // }
        } else {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Please upload documents!",
            color: "error",
          });
        }
      }
    },

    formatDate(SelectedDate) {
      var date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      this.userDocumentInfo.dateOfBirth = `${SelectedDate} ${hours}:${minutes}:${seconds}`;
      // return `${SelectedDate} ${hours}:${minutes}:${seconds}`;
      // console.log(
      //   "this.userDocumentInfo.dateOfBirth",
      //   this.userDocumentInfo.dateOfBirth
      // );
    },

    closeCheckOutDialog() {
      this.$root.$emit("SHOW_SNACKBAR", {
        text: "Your order is placed",
        color: "success",
      });
    },

    // async getOrderDetail() {
    //   this.isLoading = true;
    //   try {
    //     let response = await orderAPI.getOrderDetail(
    //       this.$route.params.orderId
    //     );
    //     this.isLoading = false;
    //     this.orderDetail.push(response.orderDetails);
    //     this.orderDetailList = response.orderDetails.orderItemList;
    //     this.orderInventoryItemId = {
    //       ...this.orderDetailList,
    //       ...response.orderDetails.orderItemList,
    //     };
    //   } catch (error) {
    //     this.isLoading = false;
    //   }
    // },

    capitalizeText(str) {
      str = str.replace("_", " ").toLowerCase();
      str = str.split(" ");
      let newStr = "";
      for (let text of str) {
        text = text.charAt(0).toUpperCase() + text.slice(1);
        newStr += ` ${text}`;
      }

      return newStr;
    },

    async uploadDidAttachment() {
      // this.orderDetail.forEach((element) => {
      //   this.getOrderId = element.orderId;
      //   console.log(element)
      // });
      this.isLoading = true;
      let uploadedData = {
        inventoryItemId: this.inventoryItemId,
        orderId: this.$route.query.orderId,
        partyId: this.$route.query.partyId,
        dataCategoryId: "LEGAL",
        contentTypeId: "OUTLINE_NODE",
        statusId: "DOC_UNAPPROVED",
        didContentTypeId: "CTNT_FINAL_DRAFT",
        roleTypeId: "OWNER",
        geoId: this.getGeoIdForDoc,
      };
      for (let i = 0; i < this.uploadedFiles.length; i++) {
        //const element = this.uploadedFiles[i];
        if (this.uploadedFiles[i].mimeType) {
          uploadedData.mimeTypeId = this.uploadedFiles[i].mimeType;
        }
        if (this.uploadedFiles[i].fileName) {
          uploadedData.fileName = this.uploadedFiles[i].fileName;
        }

        if (this.uploadedFiles[i].uploadedFile) {
          uploadedData.uploadedFile = this.uploadedFiles[i].uploadedFile;
        }
        try {
          let response = await orderAPI.uploadDidAttachment(uploadedData);
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Document uploaded successfully",
            color: "success",
          });
          if ((response.responseMessage = "success")) {
            this.submitLoader = false;
            this.isLoading = false;
            this.userFormDialog = false;
            this.uploadFile = {};
            this.userDocumentInfo.documentInfoId = {};
            this.userDocumentInfo = {};
            this.document = {};
            this.fileUpload = {};
            this.$refs.form.reset();
            this.$refs.validform.reset();
          }
        } catch (error) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: error.data.messageDetail,
            color: "error",
          });
          this.isLoading = false;
          this.submitLoader = false;
        }
      }
    },
    openAptoveDialog(data) {
      this.aporveNumberData = data;
      this.aproveModal = true;
    },
    // approve number
    async aproveNumber() {
      this.isLoading = true;
      let payloadApproveIdentity = {
        inventoryItemId: this.aporveNumberData.inventoryItemId,
        authToken: localStorage.getItem("authNew"),
      };
      try {
        let response = await this.postMethod(
          "activateNumber",
          payloadApproveIdentity
        );
        this.isLoading = false;
        this.aproveModal = false;
        this.getOrderDetail();
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: error,
          color: "error",
        });
      }
    },

    back() {
      this.$router.go(-1);
    },
  },

  mounted() {
    // this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.addRow();
    this.getOrderDetail();
  },

  async created() {
    await this.getOrderDetail();
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

.bckbtn {
  display: flex;
  justify-content: right;
  flex-flow: row wrap;
  justify-content: space-between;
}

.text {
  margin-left: 14px;
}
</style>
