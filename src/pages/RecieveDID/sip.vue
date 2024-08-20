<template>
<v-card elevation="1">
<div>
         <v-container fluid>
    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :right="x === 'right'" :timeout="timeout" :top="y === 'top'">{{ snackbarMessage }}</v-snackbar>
    <v-row justify="end">
        <v-btn text-capitalize color="primary" class="ma-3" dark @click="dialog = true">
            Bulk Receive
        </v-btn>
    
        <v-dialog @click:outside="closeDialog" :value="dialog" max-width="500px">
            <v-card @drop.prevent="onDrop($event)" @dragover.prevent="dragover = true" @dragenter.prevent="dragover = true" @dragleave.prevent="dragover = false" :class="{ 'grey lighten-2': dragover }">
                <v-card-text>
                 <v-card-title>
                        <span class="headline">Bulk Receive</span>
                         <v-spacer></v-spacer>
                          <v-layout>
                    <v-flex xs12 class="pa-2">
                        <label></label>
                        <v-icon style="float: right" class="right" @click="closeDialog">cancel</v-icon>
                    </v-flex>
                </v-layout>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-row>
                    <v-col cols="12" md="12">
                    <v-file-input @change="onFilePicked" type="file" accept=".csv" label="File Input" v-model="picture" outlined dense ref="fileInput" placeholder="No file selected">
                    </v-file-input>
                    </v-col>
                    </v-row>
                     </v-card-text>
                    <!-- <input
          type="file"
          ref="fileInput"
          accept=".csv"
          @change="onFilePicked"/> -->
                    <!-- <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
            mdi-cloud-upload
          </v-icon>
          <input type="file" accept="image/jpeg/*" @change="uploadImage()"/>
          <p>
            Drop your file(s) here, or click to select them.
          </p> -->
                    <!-- </v-row> -->
                    <!-- <v-virtual-scroll
          v-if="uploadedFiles.length > 0"
          :items="uploadedFiles"
          height="150"
          item-height="50"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.name">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                  <span class="ml-3 text--secondary">
                    {{ item.size }} bytes</span
                  >
                </v-list-item-title>
              </v-list-item-content>
           <v-list-item-action>
                <v-btn @click.stop="removeFile(item.name)" icon>
                  <v-icon> mdi-close-circle </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
           <v-divider></v-divider>
          </template>
        </v-virtual-scroll> -->           
                    <!-- <v-spacer></v-spacer> -->
                   <!-- <v-btn @click="closeDialog" icon>
          <v-icon id="close-button">mdi-close</v-icon>
        </v-btn>
 <v-btn @click="submit" icon>
          <v-icon id="upload-button">mdi-upload</v-icon>
        </v-btn> -->
                    <!-- <v-row align="center" justify="center"> -->
                <v-card-actions class="pb-4">
                    <v-btn color="primary" class="ml-1" @click="downloadRates">
                        Download Sample File
                    </v-btn>
                    <v-btn color="primary" class="mr-2" @click="submit">
                        UPLOAD
                    </v-btn>

                    <!-- </v-row> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
    <v-dialog @click:outside="closeDialog" max-width="250px" v-model="existingDialog">
        <v-card>
            <v-card-text>
                <v-card-title class="pl-6">Existing Did's</v-card-title>
                <div class="pl-6 pb-4 pt-4 pr-6">
                    <ul>
                        <li v-for="item in items" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </v-card-text>
            <v-card-actions class="pb-3">
                <v-row class="mr-0 ml-0 mb-1" align="center" justify="center">
                    <v-btn color="primary" class="ml-1" @click="closeDialog">OK</v-btn>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>


    <v-form ref="form" v-model="valid" lazy-validation>
        <loading :active="isLoading" :loader="loader" />
        <v-row>
            <v-col class="pb-0.1" cols="12" sm="4">
                <v-select :items="countryDataList" v-model="profileData.countryDataList" @change="getCityList(profileData.countryDataList)" label="Country" placeholder="select country" item-text="name" item-value="code" append-icon="place" :rules="countryRule" outlined dense required></v-select>
            </v-col>

            <v-col cols="12" md="4" v-if="cityDataList.length == 0">
                <v-select :items="cityDataList" v-model="profileData.cityDataList" label="City" item-text="geoName" item-value="geoId" append-icon="location_city" placeholder="select city" @change="getProvinceCode(profileData.cityDataList)" outlined dense></v-select>
            </v-col>

            <v-col cols="12" md="4" v-if="cityDataList.length != 0">
                <v-select :items="cityDataList" v-model="profileData.cityDataList" label="City" item-text="geoName" item-value="geoId" append-icon="location_city" :rules="cityRule" placeholder="select city" @change="getProvinceCode(profileData.cityDataList)" outlined dense required></v-select>
            </v-col>

            <v-col cols="12" md="4">
                <v-select v-model="profileData.type" :items="type" item-text="name" :rules="typeRule" item-value="id" menu-props="auto" label="Type" hide-details outlined dense append-icon="format_list_numbered" required></v-select>
            </v-col>

            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.noOfChannels" label="Channel Number" :rules="channelNumberRule" append-icon="dialer_sip" outlined dense required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.didNumber" label="Did Number" placeholder="Enter DID number" :rules="didNumberRule" append-icon="dialer_sip" outlined dense required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="supplierList" item-text="supplierName" item-value="supplierId" v-model="profileData.supplierList" label="Supplier List" append-icon="format_list_numbered" outlined dense></v-select>
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.UnitCost" :rules="UnitCostRules" label="Unit Cost" placeholder="Enter cost for number" append-icon="attach_money" outlined dense required></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.PerMinuteCharge" :rules="PerMinuteChargeRules" label="Per Minute Charge" append-icon="attach_money" placeholder="Enter Per Minute Charge" outlined dense required></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.SetupCost" :rules="SetupCostRules" :counter="20" placeholder="Enter Per Minute Charge" label="Setup Cost" append-icon="attach_money" outlined dense required></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.areaCode" :counter="9" placeholder="Enter Area Code" label="Pin Code" :rules="areaCodeRules" append-icon="pin_drop" outlined dense required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field v-model="profileData.QuantityAccepted" label="Quantity Accepted" placeholder="Enter quantity of number" :rules="quantityRules" outlined dense required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-select
                    v-model="profileData.hasSms"
                    :items="['Y', 'N']"
                    label="Has SMS"
                    outlined
                    dense
                    required
                ></v-select>
            </v-col>
        </v-row>
        <!-- form button -->
        <!-- <v-container> -->
        <!-- <v-row cols="12" md="6"> -->
        <!-- <div class="update-button">  -->
        <v-row>
            <v-col cols="12" md="6">

            <v-btn margin-left: auto  @click="reset">
                Reset Form
            </v-btn>
            </v-col>
        <!-- </div> -->
     
        <!-- <div c> -->
            <v-col class="rcvbtn" cols="12" md="6">
            <v-btn :disabled="!valid" color="primary"  @click="receiveDataUpdate">
                Recieve
            </v-btn>
            </v-col>
        </v-row>
        <!-- </div> -->
        <!-- </v-row> -->
            <!-- </v-container> -->
    </v-form>
    </v-container>
      </div>
</v-card>

</template>

<script>
import dashboardAPI from "@/services/dashboardAPI.js";
// import Security from "./security.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import AllApiCalls from "@/services/AllApiCalls";
export default {
    mixins: [AllApiCalls],
    components: {
        Loading,
    },
    data: () => ({
        isLoading: false,
        //fullPage: false,
        picture: null,
        loader: "bars",
        name: "Upload",
        dragover: false,
        existingDialog: false,
        uploadedFiles: [],
        items: [],
        valid: true,
        type: [{
                name: 'TOLL FREE',
                id: 'TOLL_FREE'
            },
            {
                name: 'LOCAL',
                id: 'LOCAL_DID'
            },
            {
                name: 'NATIONAL',
                id: 'NATIONAL_DID'
            },
            {
                name: 'VIRTUAL PRI',
                id: 'VIRTUAL_PRI_DID'
            },
            {
                name: 'SHARED COST',
                id: 'SHARED_COST'
            },
            {
                name: 'MOBILE',
                id: 'MOBILE_DID'
            }
        ],
        supplierList: [],
        // dialog: {
        //   type: Boolean,
        //   required: false
        // },
        dialog: false,
        multiple: {
            type: Boolean,
            default: false
        },
        isoCountryCode: '',
        geoId: '',
        isoCityDataList: '',
        cityGeoName: "",
        countryDataList: [],
        cityDataList: [],
        profileCardLoading: false,
        areaCodeRules: [(v) => !!v || "Area code is required"],
        countryRule: [(v) => !!v || "Country is required"],
        quantityRules: [(v) => !!v || "Quantity of number is required"],
        cityRule: [(v) => !!v || "City is required"],
        typeRule: [(v) => !!v || "Type is required"],
        SetupCostRules: [(v) => !!v || "Setup cost is required"],
        PerMinuteChargeRules: [(v) => !!v || "Minute charge is required"],
        // SupplierRule: [(v) => !!v || "Supplier list is required"],
        UnitCostRules: [(v) => !!v || "Unit cost is required"],
        didNumberRule: [(v) => !!v || "Did number is required"],
        channelNumberRule: [(v) => !!v || "Channel number is required"],
        tab: null,
        profileData: {},
        countryGeoId: "",
        userDetail: {},
        base64result: "",
        getGeoId: "",
        facilityGetNewId: "",
        showStateField: Boolean,
    }),
    mounted() {
        this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
        this.profileData.supplierList = "DIDNPBX";
        this.profileData.hasSms = "Y";
        this.getCountryList();
        this.supplyApi();
    },

    methods: {

        onFilePicked(event) {
            var reader = new FileReader()
            reader.readAsDataURL(event)
            reader.onload = () => {
                this.base64result = reader.result.split(';base64,')[1];
                // this.base64result = reader.result.split(',').pop();
                // this.uploadedFiles.push(this.base64result)
            };
            // const files = event.target.files
            // let filename = files[0].name
            // const fileReader = new FileReader()
            // fileReader.addEventListener('load', () => {
            //   this.imageUrl = fileReader.result
            //   console.log(this.imageUrl)
            // })
            // fileReader.readAsDataURL(files[0])
            // this.image = files[0]

        },
        // ************************ csv code start *******************
        closeDialog() {
            // Remove all the uploaded files
            this.uploadedFiles = [];
            this.picture = null;
            // Close the dialog box
            //this.$emit("update:dialog", false);
            this.dialog = false;
            this.existingDialog = false;
        },

        removeFile(fileName) {
            // Find the index of the
            const index = this.uploadedFiles.findIndex(
                file => file.name === fileName
            );
            // If file is in uploaded files remove it
            if (index > -1) this.uploadedFiles.splice(index, 1);
        },
        onDrop(e) {
            this.dragover = false;
            // If there are already uploaded files remove them
            if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
            // If user has uploaded multiple files but the component is not multiple throw error
            if (!this.multiple && e.dataTransfer.files.length > 1) {
                this.seeSnackbar("Only one file can be uploaded at a time..", "error")
                // this.$store.dispatch("addNotification", {
                //   message: "Only one file can be uploaded at a time..",
                //   colour: "error"
                // });
            }
            // Add each file to the array of uploaded files
            else
                var reader = new FileReader()
            reader.readAsDataURL(e.dataTransfer.files[0])
            reader.onload = () => {
                this.base64result = reader.result.split(';base64,')[1];
                // this.base64result = reader.result.split(',').pop();
                this.uploadedFiles.push(this.base64result)
            };
            reader.onerror = error => reject(error);
        },

        async submit() {
            if (!this.picture) {
                this.seeSnackbar("Please Select Csv File", "error")
            } else {
                // var encodedStringBtoA = btoa(this.base64result);
                var base64Data = {};
                base64Data.uploadedFile = this.base64result;
                // }
                try {
                    let response = await dashboardAPI.receiveDidCsv(base64Data);
                    if (response.responseMessage == "success") {
                        this.seeSnackbar("Number Recieved Sucessfully", "success");
                        this.dialog = false;
                        if (response.existingDIDs.length != 0) {
                            this.existingDialog = true;
                            this.items = response.existingDIDs;
                        }
                        this.picture = '';
                    } else if (responseMessage == "error") {
                        this.seeSnackbar("Server Error", "error");
                    }
                } catch (error) {
                    if (error.data.messageDetail) {
                        this.$root.$emit("SHOW_SNACKBAR", {
                            text: 'Please Select Csv File',
                            color: "error",
                        });
                    }
                }
            }
        },

        async downloadRates() {
            var JSONData = [{
                    "facilityId": "AUS",
                    "stateId": "",
                    "cityId": "",
                    "didNumber": "1882299931411",
                    "supplierId": "10013",
                    "didType": "LOCAL_DID"
                },
                {
                    "facilityId": "CRI",
                    "stateId": "",
                    "cityId": "CRI-NAT",
                    "didNumber": "1231233212",
                    "supplierId": "10013",
                    "didType": "NATIONAL_DID"
                },
                {
                    "facilityId": "AUS",
                    "stateId": "",
                    "cityId": "",
                    "didNumber": "2211335544",
                    "supplierId": "10013",
                    "didType": "TOLL_FREE"
                }
            ]
            //var JSONData = [{"Reference":"1","First_name":"Lauri","Last_name":"Amerman","Dob":"1980","Sex":"F"},{"Reference":"2","First_name":"Rebbecca","Last_name":"Bellon","Dob":"1977","Sex":"F"},{"Reference":"3","First_name":"Stanley","Last_name":"Benton","Dob":"1984","Sex":"M"}]
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';
            //This condition will generate the Label/Header
            var row = "";
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                //add a line break after each row
                CSV += row + '\r\n';
            }
            if (CSV == '') {
                alert("Invalid data");
                return;
            }
            //Generate a file name
            var fileName = "My Report";
            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
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

        // ************************ csv code end *******************

        checkCountry(countryGeoId) {
            return this.countryData.filter((item) => {
                let arr = item.split(": ");
                if (arr[1] === countryGeoId) {
                    return item;
                }
            });
        },

        reset() {
            this.$refs.form.reset();
        },

        checkState(stateProvinceGeoId) {
            return this.stateData.filter((item) => {
                let arr = item.split(": ");
                if (arr[1] === stateProvinceGeoId) {
                    return item;
                }
            });
        },

        async supplyApi() {
            let response = await this.getMethod("getSupplierList", {
                authToken: localStorage.getItem("authNew"),
            });
            response.supplier.forEach((supplylistData, index, arr) => {
                this.supplierList.push(supplylistData)
            });
        },

        typecheck(typecheck) {},

        async getCountryList() {
            this.isLoading = true;
            let response = await this.getMethod("getFacilityGeoList", {
                accountId: this.$route.query.accountId,
                authToken: localStorage.getItem("authNew"),
            });
            this.isoCountryCode = response.countryList;
            response.countryList.forEach((currentValue, index, arr) => {
                this.countryDataList.push(currentValue.facilityName);
                this.getGeoId = currentValue.facilityGeoId
                this.isLoading = false;
            });
        },

        async getCityList(cityGeoId) {
            let result = await this.getMethod("getFacilityGeoList", {
                accountId: this.$route.query.accountId,
                authToken: localStorage.getItem("authNew"),
            });
            this.isoCountryCode = result.countryList;
            result.countryList.forEach((currentValue, index, arr) => {
                var getGeoId = JSON.stringify(currentValue.facilityName).replace(/['"]+/g, '');
                if (cityGeoId == getGeoId) {
                    this.facilityIdCode = currentValue.facilityGeoId;
                    this.facilityGetNewId = currentValue.facilityId;
                } else if (cityGeoId == undefined) {
                    this.facilityGetNewId = null;
                }
            });
            let response = await this.getMethod("getCountryCities", {
                countryGeoId: this.facilityIdCode
            });
            this.isoCountryCode.forEach((checkCountryData, index, arr) => {
                if (cityGeoId == checkCountryData.facilityGeoId) {
                    this.facilityGeoId = cityGeoId;
                    this.facilityId = checkCountryData.facilityId;
                }
            });
            response.cityList.forEach((cityListJson, index, arr) => {
                this.cityDataList.push(cityListJson);
            });
            this.isoCityDataList = response.cityList;
        },

        getProvinceCode(cityGeoName) {
            this.isoCityDataList.forEach((el, index, arr) => {
                if (cityGeoName == el.geoId) {
                    this.profileData.noOfChannels = el.noOfChannels;
                    this.profileData.SetupCost = el.setupCost;
                    this.profileData.UnitCost = el.price;
                    this.profileData.areaCode = el.prefix;
                    this.geoId = el.geoId;
                } else if (this.geoId == undefined) {
                    this.geoId = null;
                }
            });
        },

        async receiveDataUpdate() {
            this.isLoading = true;
            if (this.$refs.form.validate() == true) {
                let response = await this.postMethod("receiveSerialInventoryProduct", {
                    productId: this.profileData.productId,
                    inventoryItemTypeId: "SERIALIZED_INV_ITEM",
                    areaCode: this.profileData.areaCode,
                    cityGeoId: this.geoId,
                    didNumber: this.profileData.didNumber,
                    didType: this.profileData.type,
                    facilityGeoId: this.facilityIdCode,
                    facilityId: this.facilityGetNewId,
                    inventoryItemTypeId: "SERIALIZED_INV_ITEM",
                    noOfChannels: this.profileData.noOfChannels,
                    perMinCharge: this.profileData.PerMinuteCharge,
                    productId: "GEOGRAPHIC_DID",
                    quantityAccepted: this.profileData.QuantityAccepted,
                    quantityRejected: "0",
                    setupCost: this.profileData.SetupCost,
                    stateGeoId: this.profileData.cityDataList,
                    supplierId: 'DIDNPBX',
                    unitCost: this.profileData.UnitCost,
                    hasSms: this.profileData.hasSms,
                });
                if (response.responseMessage = "success") {
                    this.seeSnackbar("SIP successfully created", "success")
                    this.isLoading = false;
                    this.$refs.form.reset()
                    //this.$router.go(this.$router.currentRoute)
                }
            } else {
                this.$refs.form.validate();
                this.isLoading = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.rcvbtn{
    justify-content: right;
    display: flex;
    flex-flow: row wrap;
}


.bulkButton {
    float: right;
}

.dropbox {
    outline: 2px dashed grey;
    /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px;
    /* minimum height */
    position: relative;
    cursor: pointer;
}

.input-file {
    opacity: 0;
    /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
}

.dropbox:hover {
    background: lightblue;
    /* when mouse over to the drop zone, change color */
}

.dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
}

.ml-1 {
    margin-right: 170px;
}

.text-camelcase {
    margin-left: 270px !important;
}
.justify-right{
    margin-inline-start: 290px;
}

</style>
