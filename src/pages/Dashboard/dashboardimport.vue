<template>
  <v-row>
    <!-- <v-container> -->
    <v-col sm="12" md="6">
      <v-card flat>
        <v-card-actions>
          <v-card-title>Rate Data</v-card-title>
          <v-spacer></v-spacer>

          <!-- <div class="text-camelcase">
            <v-col cols="2">
              <i
                class="bibtn"
                to="/dashboard"
                @click="closeDialog"
                style="cursor: pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="currentColor"
                  class="bibtn"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </i>
            </v-col>
          </div> -->
        </v-card-actions>
        <!-- </v-row> -->
        <!-- <img :src="imageUrl" height="150" v-if="imageUrl" /> -->
        <!-- <img :src="imageUrl" onerror="this.src='/images/user.png';" height="150" /> -->
        <v-col>
          <v-file-input
            label="File input"
            type="file"
            id="filePicker2"
            accept="image/*"
            ref="image"
            outlined
            dense
            show-size
            v-model="media.rateUpload"
            placeholder="No file selected"
            @change="createBinaryData"
            color="primary"
          ></v-file-input>
        </v-col>
        <v-card-actions>
          <v-row align="center" class="ma-0">
            <v-btn color="primary" @click="downloadRates">
              Download Sample File
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="uploadRateCsv"> UPLOAD </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <!-- </v-container> -->
    <!-- ************ Location Data *************** -->
    <!-- <v-container> -->
    <v-col sm="12" md="6">
      <v-card flat>
        <v-card-actions>
          <v-card-title>Location Data</v-card-title>
          <v-spacer></v-spacer>
          <!-- <div class="text-camelcase">
            <v-col cols="2">
              <i
                class="bibtn"
                to="/dashboard"
                @click="closeDialog"
                style="cursor: pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="currentColor"
                  class="bibtn"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </i>
            </v-col>
          </div> -->
        </v-card-actions>
        <!-- </v-row> -->

        <!-- <img :src="imageUrl" height="150" v-if="imageUrl" /> -->
        <!-- <img :src="imageUrl" onerror="this.src='/images/user.png';" height="150" /> -->
        <v-col>
          <v-file-input
            label="File input"
            type="file"
            id="filePicker2"
            accept="image/*"
            ref="image"
            show-size
            outlined
            dense
            v-model="media.locationUpload"
            placeholder="No file selected"
            @change="createBinaryData"
            color="primary"
          ></v-file-input>
        </v-col>
        <v-card-actions>
          <v-row align="center" class="ma-0">
            <v-btn color="primary" class="left-btn" @click="downloadLocation">
              Download Sample File
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="uploadLocationCsv"> UPLOAD </v-btn>
          </v-row>
          <v-dialog v-model="showErrorText" max-width="400">
            <v-card>
              <v-card-title>Error</v-card-title>
              <v-card-text>
                <ul>
                  <li v-for="(error, index) in errorList" :key="index">{{ error.error }}</li>
                </ul>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="closeErrorDialog">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-col>
    <!-- </v-container> -->
    <!-- ************ Enable/Disable Location *************** -->
    <!-- <v-container> -->
    <v-col sm="12" md="6">
      <v-card flat>
        <v-card-actions>
          <v-card-title>Enable/Disable Location</v-card-title>
          <v-spacer></v-spacer>
          <!-- <v-col cols="1">
            <i
              class="bibtn"
              to="/dashboard"
              @click="closeDialog"
              style="cursor: pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                class="bibtn"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </i>
          </v-col> -->
        </v-card-actions>

        <!-- <img :src="imageUrl" height="10" v-if="imageUrl" /> -->
        <!-- <img :src="imageUrl" onerror="this.src='/images/user.png';" height="150" /> -->
        <v-col>
          <v-file-input
            label="File input"
            type="file"
            id="filePicker2"
            accept="image/*"
            ref="image"
            show-size
            outlined
            dense
            v-model="media.enableDisableUpload"
            placeholder="No file selected"
            @change="createBinaryData"
            color="primary"
          ></v-file-input>
        </v-col>
        <v-card-actions>
          <v-row align="center" class="ma-0">
            <v-btn
              color="primary"
              class=""
              @click="downloadEnableDisableLocationSample"
            >
              Download Sample File
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class=""
              @click="uploadEnableDisableLocationCsv"
            >
              UPLOAD
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <!-- </v-container> -->
  </v-row>
</template>

<script>
import profileAPI from "@/services/profileAPI.js";
import dashboardAPI from "@/services/dashboardAPI.js";
import AllApiCalls from "@/services/AllApiCalls";
export default {
  mixins: [AllApiCalls],
  data: () => ({
    media: {
      rateUpload: null,
      locationUpload: null,
      enableDisableUpload: null,
    },
    base64textarea2: null,
    rawData: [],
    getCsvData: [],
    userDetail: {},
    disableButton: true,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    type: "",
    errorList: [],
    showErrorText: false
  }),

  methods: {
    async uploadProfileImage() {
      let uploadedData = {
        fileName: "profilePic",
        mimeTypeId: this.type,
        partyId: this.userDetail.partyId,
        uploadedData: this.imageUrl.replace(`data:${this.type};base64,`, ""),
      };
      try {
        await profileAPI.uploadProfileImage(uploadedData);
        this.$root.$emit("CHANGE_PROFILE_IMAGE", {
          imageData: this.imageUrl,
        });
        this.$router.push("/dashboard");
      } catch (error) {}
    },
    // rate update binary
    createBinaryData() {
      this.rawData = [];
      var this_ = this;
      if (
        this.media.rateUpload ||
        this.media.locationUpload ||
        this.media.enableDisableUpload
      ) {
        var files = [];
        if (this_.media.rateUpload) {
          files.push(this_.media.rateUpload);
        } else if (this_.media.locationUpload) {
          files.push(this_.media.locationUpload);
        } else if (this_.media.enableDisableUpload) {
          files.push(this_.media.enableDisableUpload);
        }
        if (files.length > 0) {
          var reader = new FileReader();
          var file = "updating";
          reader.onloadend = function (evt) {
            file = evt.target.result;
            this_.rawData = file.split(",")[1];
          };
          reader.readAsDataURL(files[0]);
        }
      }
    },

    async uploadRateCsv() {
      var base64Data = {};
      base64Data.uploadedFile = this.rawData;
      try {
        let response = await dashboardAPI.ratesUploadViaCSV(base64Data);
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Recieved successfully",
            color: "success",
          });
          this.media.rateUpload = null;
        } else if (responseMessage == "error") {
          this.seeSnackbar("Server Error", "error");
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Server Error",
            color: "error",
          });
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Please Select Csv File",
            color: "error",
          });
        }
      }
    },

    async downloadRates() {
      var JSONData = [
        {
          id: "NZ-6427-out",
          description: "New Zealand Mobile - Telecom Nz",
          prefix: 6427,
          isoCountryCode: "NZ",
          cost: 0.03926,
        },
        {
          id: "NZ-6426-out",
          description: "New Zealand Mobile - Telecom Nz",
          prefix: 6426,
          isoCountryCode: "NZ",
          cost: 0.03926,
        },
        {
          id: "NZ-6425-out",
          description: "New Zealand Mobile - Telecom Nz",
          prefix: 6425,
          isoCountryCode: "NZ",
          cost: 0.03926,
        },
        {
          id: "NZ-6424-out",
          description: "New Zealand Mobile - Telecom Nz",
          prefix: 6424,
          isoCountryCode: "NZ",
          cost: 0.03926,
        },
        {
          id: "NZ-6423-out",
          description: "New Zealand Mobile - Telecom Nz",
          prefix: 6423,
          isoCountryCode: "NZ",
          cost: 0.03926,
        },
        {
          id: "NZ-6422-out",
          description: "New Zealand Mobile - Nz Communications",
          prefix: 6422,
          isoCountryCode: "NZ",
          cost: 0.03822,
        },
        {
          id: "NZ-6421-out",
          description: "New Zealand Mobile - Vodafone Nz",
          prefix: 6421,
          isoCountryCode: "NZ",
          cost: 0.03822,
        },
        {
          id: "NZ-6420-out",
          description: "New Zealand Mobile - Telecom Nz",
          prefix: 6420,
          isoCountryCode: "NZ",
          cost: 0.03926,
        },
        {
          id: "NZ-642-out",
          description: "New Zealand Mobile",
          prefix: 642,
          isoCountryCode: "NZ",
          cost: 0.04056,
        },
        {
          id: "NZ-64-out",
          description: "New Zealand Fixed",
          prefix: 64,
          isoCountryCode: "NZ",
          cost: 0.01014,
        },
      ];
      //var JSONData = [{"Reference":"1","First_name":"Lauri","Last_name":"Amerman","Dob":"1980","Sex":"F"},{"Reference":"2","First_name":"Rebbecca","Last_name":"Bellon","Dob":"1977","Sex":"F"},{"Reference":"3","First_name":"Stanley","Last_name":"Benton","Dob":"1984","Sex":"M"}]
      var arrData =
        typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
      var CSV = "";
      //This condition will generate the Label/Header
      var row = "";
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ",";
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + "\r\n";
      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + "\r\n";
      }
      if (CSV == "") {
        alert("Invalid data");
        return;
      }
      //Generate a file name
      var fileName = "Rate";
      //Initialize file format you want csv or xls
      var uri = "data:text/csv;charset=utf-8," + escape(CSV);
      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension
      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;
      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async uploadLocationCsv() {
      var base64Data = {};
      base64Data.uploadedFile = this.rawData;
      try {
        let response = await dashboardAPI.importLocationDataCsv(base64Data);
        if (response.responseMessage == "success" && response.errorList.length == 0) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Recieved successfully",
            color: "success",
          });
          this.media.locationUpload = null;
        } else if (response.responseMessage == "success" && response.errorList.length > 0) {
          this.errorList = response?.errorList;
          this.showErrorDialog();
          this.seeSnackbar("Server Error", "error");
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Something wrong in csv file",
            color: "error",
            
          });
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Please Select Csv File",
            color: "error",
          });
        }
      }
    },

    showErrorDialog() {
      this.showErrorText = true;
    },
    closeErrorDialog() {
      this.showErrorText = false;
    },

    // *********************** Download location ***********************
    async downloadLocation() {
      var JSONData = [
        {
          countryName: "Latvia",
          countryGeoId: "LVA",
          requireDocument: "Y",
          requireState: "N",
          stateName: "",
          stateId: "",
          tollFreePrefix: "61-1800",
          tollFreeSetupCost: "40",
          tollFreePrice: "8",
          tollFreeNoOfChannels: "100",
          tollFreePerMinChargeFixed: "0.045",
          tollFreePerMinChargeMobile: "0.045",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions:
            "<h3>LATIVA Toll-free DID registration requirements:</h3><p>1. Name business name and contact phone number.</p><p>2. Current address worldwide(street building number  postal code and city).</p><p>3. Proof of address (a copy of utility bill no older than of 3 months).</p>",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "",
          cityId: "",
          cityPrefix: "",
          citySetupCost: "",
          cityPrice: "",
          cityInstructions: "",
          cityNoOfChannels: "",
          cityPerMinCharge: "",
          didType: "TOLL_FREE",
        },
        {
          countryName: "Latvia",
          countryGeoId: "LVA",
          requireDocument: "Y",
          requireState: "N",
          stateName: "",
          stateId: "",
          tollFreePrefix: "61-1300",
          tollFreeSetupCost: "40",
          tollFreePrice: "8",
          tollFreeNoOfChannels: "100",
          tollFreePerMinChargeFixed: "0.035",
          tollFreePerMinChargeMobile: "0.035",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions:
            "<h3>LATIVA Shared Cost DID registration requirements:</h3><p>1. Name business name and contact phone number.</p><p>2. Current address worldwide(street building number  postal code and city).</p><p>3. Proof of address (a copy of utility bill no older than of 3 months).</p>",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "",
          cityId: "",
          cityPrefix: "",
          citySetupCost: "",
          cityPrice: "",
          cityInstructions: "",
          cityNoOfChannels: "",
          cityPerMinCharge: "",
          didType: "SHARED_COST",
        },
        {
          countryName: "Latvia",
          countryGeoId: "LVA",
          requireDocument: "Y",
          requireState: "N",
          stateName: "",
          stateId: "",
          tollFreePrefix: "",
          tollFreeSetupCost: "",
          tollFreePrice: "",
          tollFreeNoOfChannels: "",
          tollFreePerMinChargeFixed: "",
          tollFreePerMinChargeMobile: "",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions: "",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "Riga",
          cityId: "LVA-RIX",
          cityPrefix: "371-67",
          citySetupCost: "1",
          cityPrice: "2",
          cityInstructions:
            "<h3>LATVIA Local</h3><p>1. Business name and contact phone.</p><p>2. Company registration certificate.</p><p>Current address in Latvia (street building number postal code and city).</p><p>NOTE: Registration process cannot be performed under personal details.</p>",
          cityNoOfChannels: "2",
          cityPerMinCharge: "",
          didType: "LOCAL_DID",
        },
        {
          countryName: "Latvia",
          countryGeoId: "LVA",
          requireDocument: "Y",
          requireState: "N",
          stateName: "",
          stateId: "",
          tollFreePrefix: "",
          tollFreeSetupCost: "",
          tollFreePrice: "",
          tollFreeNoOfChannels: "",
          tollFreePerMinChargeFixed: "",
          tollFreePerMinChargeMobile: "",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions: "",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "National",
          cityId: "LVA-NAT",
          cityPrefix: "32-78",
          citySetupCost: "1",
          cityPrice: "2",
          cityInstructions:
            "<h3>LATVIA National</h3><p>1. Name business name and contact phone.</p><p>2. Current address in LATVIA (street building number postal code and city).</p><p>3. Proof of address (a copy of utility bill no older than of 3 months).</p>",
          cityNoOfChannels: "2",
          cityPerMinCharge: "",
          didType: "NATIONAL_DID",
        },
        {
          countryName: "Latvia",
          countryGeoId: "LVA",
          requireDocument: "Y",
          requireState: "N",
          stateName: "",
          stateId: "",
          tollFreePrefix: "",
          tollFreeSetupCost: "",
          tollFreePrice: "",
          tollFreeNoOfChannels: "",
          tollFreePerMinChargeFixed: "",
          tollFreePerMinChargeMobile: "",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions: "",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "Mobile",
          cityId: "LVA-MOB",
          cityPrefix: "35-25",
          citySetupCost: "1",
          cityPrice: "2",
          cityInstructions:
            "<h3>LATIVA Mobile</h3><p>1. Name business name and contact phone.</p><p>2. Passport or ID copy*.</p><p>3. Current address worldwide (street building number postal code  city).</p><p>4. Proof of address (a copy of utility bill no older than of 3 months).</p><p>*In case registration process is performed under a company name  company registration certificate shall be provided instead of passport or ID copy.</p>",
          cityNoOfChannels: "2",
          cityPerMinCharge: "",
          didType: "MOBILE_DID",
        },
        {
          countryName: "United States",
          countryGeoId: "USA",
          requireDocument: "N",
          requireState: "Y",
          stateName: "California",
          stateId: "US-CA",
          tollFreePrefix: "",
          tollFreeSetupCost: "",
          tollFreePrice: "",
          tollFreeNoOfChannels: "",
          tollFreePerMinChargeFixed: "",
          tollFreePerMinChargeMobile: "",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions: "",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "Los Angeles",
          cityId: "USA-LAX",
          cityPrefix: "1-323",
          citySetupCost: "1",
          cityPrice: "2",
          cityInstructions: "",
          cityNoOfChannels: "2",
          cityPerMinCharge: "",
          didType: "LOCAL",
        },
        {
          countryName: "United States",
          countryGeoId: "USA",
          requireDocument: "N",
          requireState: "Y",
          stateName: "California",
          stateId: "US-CA",
          tollFreePrefix: "",
          tollFreeSetupCost: "",
          tollFreePrice: "",
          tollFreeNoOfChannels: "",
          tollFreePerMinChargeFixed: "",
          tollFreePerMinChargeMobile: "",
          tollFreePerMinChargePayphone: "",
          tollFreeInstructions: "",
          tollFreeFixedCLI: "",
          tollFreeMobileCLI: "",
          tollFreePayphoneCLI: "",
          cityName: "Los Angeles",
          cityId: "USA-LAXMU",
          cityPrefix: "1-323",
          citySetupCost: "13",
          cityPrice: "30",
          cityInstructions: "",
          cityNoOfChannels: "30",
          cityPerMinCharge: "",
          didType: "VIRTUAL_PRI",
        },
      ];
      //var JSONData = [{"Reference":"1","First_name":"Lauri","Last_name":"Amerman","Dob":"1980","Sex":"F"},{"Reference":"2","First_name":"Rebbecca","Last_name":"Bellon","Dob":"1977","Sex":"F"},{"Reference":"3","First_name":"Stanley","Last_name":"Benton","Dob":"1984","Sex":"M"}]
      var arrData =
        typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
      var CSV = "";
      //This condition will generate the Label/Header
      var row = "";
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ",";
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + "\r\n";
      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + "\r\n";
      }
      if (CSV == "") {
        alert("Invalid data");
        return;
      }
      //Generate a file name
      var fileName = "MyReport_";
      //Initialize file format you want csv or xls
      var uri = "data:text/csv;charset=utf-8," + escape(CSV);
      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension
      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;
      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async downloadEnableDisableLocationSample() {
      var JSONData = [
        {
          "Geo Id": "ARG-SAL",
          Status: "Y",
          "Geo Code": "54-3874",
          Type: "LOCAL_DID",
        },
        {
          "Geo Id": "ARG",
          Status: "Y",
          "Geo Code": "54-800",
          Type: "TOLL_FREE",
        },
        {
          "Geo Id": "MEX",
          Status: "Y",
          "Geo Code": "MX",
          Type: "COUNTRY",
        },
        {
          "Geo Id": "ARG",
          Status: "Y",
          "Geo Code": "54-810",
          Type: "SHARED_COST",
        },
        {
          "Geo Id": "AUT-NAT",
          Status: "Y",
          "Geo Code": "43-720",
          Type: "NATIONAL_DID",
        },
        {
          "Geo Id": "AUS-HOB",
          Status: "Y",
          "Geo Code": "61-36",
          Type: "CITY",
        },
        {
          "Geo Id": "AUS-MOB",
          Status: "Y",
          "Geo Code": "61-4",
          Type: "MOBILE_DID",
        },
        {
          "Geo Id": "AU-NSW",
          Status: "Y",
          "Geo Code": "NSW",
          Type: "STATE",
        },
        {
          "Geo Id": "USA-LA",
          Status: "Y",
          "Geo Code": "58-241",
          Type: "VIRTUAL_PRI_DID",
        },
      ];
      //var JSONData = [{"Reference":"1","First_name":"Lauri","Last_name":"Amerman","Dob":"1980","Sex":"F"},{"Reference":"2","First_name":"Rebbecca","Last_name":"Bellon","Dob":"1977","Sex":"F"},{"Reference":"3","First_name":"Stanley","Last_name":"Benton","Dob":"1984","Sex":"M"}]
      var arrData =
        typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
      var CSV = "";
      //This condition will generate the Label/Header
      var row = "";
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ",";
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + "\r\n";
      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + "\r\n";
      }
      if (CSV == "") {
        alert("Invalid data");
        return;
      }
      //Generate a file name
      var fileName = "MyReport_";
      //Initialize file format you want csv or xls
      var uri = "data:text/csv;charset=utf-8," + escape(CSV);
      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension
      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;
      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // Enable Disable Location csv
    async uploadEnableDisableLocationCsv() {
      var base64Data = {};
      base64Data.uploadedFile = this.rawData;
      try {
        let response = await dashboardAPI.enableDisableStatus(base64Data);
        if (response.responseMessage == "success") {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Recieved successfully",
            color: "success",
          });
          this.media.enableDisableUpload = null;
        } else if (responseMessage == "error") {
          this.seeSnackbar("Server Error", "error");
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Server Error",
            color: "error",
          });
        }
      } catch (error) {
        if (error.data.messageDetail) {
          this.$root.$emit("SHOW_SNACKBAR", {
            text: "Please Select Csv File",
            color: "error",
          });
        }
      }
    },

    async getUserDetail() {},
    closeDialog() {},
  },

  mounted() {},
};
</script>

<style scoped>
.right-btn {
  margin-left: 400px;
}
.bibtn {
  margin-right: 15px;
}
.left-btn {
  margin-left: 20px;
}
</style>