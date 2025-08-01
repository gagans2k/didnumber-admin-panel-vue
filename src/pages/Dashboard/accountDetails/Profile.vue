<template>
   <v-card elevation="1">
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
  
   <v-row>
      <v-spacer></v-spacer>
           <v-col  xs="12" sm="2" md="1">
                <v-btn
                dark
                block
          class="my-2"
          color="rgb(231,87,83)"
          :to="{
            name: 'AccountDetails',
            query: {
              accountId: $route.query.accountId,
              userId: $route.query.userId,
              partyId: $route.query.partyId,
            },
          }"
          >Back</v-btn>
          </v-col>
          </v-row>
          <hr>  
     <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
    <v-form ref="form" v-model="valid">
      <!-- Email -->
      <v-row>
        <v-col xs="12" md="4">
          <v-text-field
            v-model="profileData.emailAddress"
            label="Email"
            append-icon="mail"
            :rules="cantBeEmpty"
            
            outlined 
            dense
          ></v-text-field>
        </v-col>
              <!-- Phone Number -->
        <v-col xs="12" md="4">
          <v-text-field
            :rules="hasToBeNumber"
            v-model="profileData.contactNumber"
            label="Phone Number"
            append-icon="local_phone"
            type="tel"
             :counter="16"
             outlined
             dense
             required
          ></v-text-field>
        </v-col>
        <!-- <v-col class="btn" xs="12" sm="2" md="1">
                <v-btn
                dark
                block
          class="my-2"
          color="rgb(231,87,83)"
          :to="{
            name: 'AccountDetails',
            query: {
              accountId: $route.query.accountId,
              userId: $route.query.userId,
              partyId: $route.query.partyId,
            },
          }"
          >Back</v-btn>
          </v-col> -->
        <!-- FIRST NAME -->
        <v-col xs="12" md="4">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="profileData.firstName"
            label="First Name"
            append-icon="person"
            outlined
            dense
            required
          ></v-text-field>
        </v-col>
      </v-row>

        <!-- LAST NAME -->
      <v-row>
        <v-col xs="12" md="4">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="profileData.lastName"
            label="Last Name"
            append-icon="person"
            outlined
            dense
            required
          ></v-text-field>
        </v-col>
      <!-- Address 1 -->
        <v-col xs="12" md="4">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="profileData.address1"
            label="address 1"
            append-icon="house"
            outlined
            dense
            required
          ></v-text-field>
        </v-col>
       <!-- Address 2 -->
        <v-col xs="12" md="4">
          <v-text-field
            v-model="profileData.address2"
            label="address 2"
            outlined
            dense
            append-icon="mdi-domain"
          ></v-text-field>
        </v-col> 
      </v-row>
        <!-- Country -->
      <v-row>
        <v-col cols="6" xs="12" md="4">
          <v-autocomplete
            :rules="cantBeEmpty"
            v-model="profileData.countryGeoId"
            :items="countryList"
             append-icon="mdi-earth"
            label="Country"
            item-text="key"
            item-value="value"
            @change="getAssociatedStateList(profileData.countryGeoId)"
            outlined
            dense
            required
          ></v-autocomplete>
        </v-col>
        <!-- State/Region -->
        <v-col cols="6" xs="12" md="4">
          <v-autocomplete
           v-if="showStateField"
            :items="stateData"
            append-icon="mdi-google-maps"
            v-model="profileData.state"
            item-text="key"
            item-value="value"
            label="State/Region"
            @change="getProvinceCode(profileData.state)"
            outlined
            dense
            required
          ></v-autocomplete>
        </v-col>
      <!-- city -->
        <v-col xs="12" md="4">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="profileData.city"
            label="City"
            append-icon="location_city"
            outlined
            dense
            required
          ></v-text-field>
        </v-col>  
      </v-row>
       <!-- Pin Code -->   
      <v-row>
        <v-col xs="12" md="4">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="profileData.postalCode"
            label="Pin Code"
            append-icon="pin_drop"
            outlined
            dense
            required
          ></v-text-field>
        </v-col>
       <!-- companyName -->
        <v-col xs="4" md="4">
          <v-text-field
            v-model="profileData.companyName"
            label="companyName"
            append-icon="person"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <!-- taxNumber -->
        <v-col xs="4" md="4">
          <v-text-field
            v-model="profileData.taxNumber"
            label="taxNumber"
            append-icon="person"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
        <!-- vatNumber -->
      <v-row>
         <v-col xs="12" md="4">
          <v-text-field
            v-model="profileData.vatNumber"
            label="vatNumber"
            append-icon="person"
            outlined
            dense
          ></v-text-field>
         </v-col> 
         <!--Update Button -->
         <v-spacer></v-spacer>
      
              <v-col xs="12"  md="8">
         <v-btn color="primary" class="update-btn"       
          @click="updateUserDetail()" 
          >Update Profile
          </v-btn>
          </v-col>
        </v-row> 
    </v-form>
  </v-container>
  </v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import countryStateAPI from "@/services/countryStateAPI.js";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      updateData:{},
      dataSend:{},
      userData:'',
      checkImg: "",
      countryGeoId: "",
      profileData: {},
      countryList: [],
      stateData: [],
      userDetailList:{},
      showStateField: Boolean,

       // phoneNumberRule
     hasToBeNumber: [
        (v) =>
          (v && v.length <= 16 && /^[a-zA-Z0-9\-\s- ]{8,16}$/.test(v)) ||
          "please add a contact number - digits only",
      ],
    };
  },

  mounted(){
    this.getUserDetail();
    this.getCountryList();
  },
  
  
  methods: {
    async getUserDetail() {
      this.isLoading = true;
      let response = await this.getMethod("getUserDetail",{
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        partyId: this.$route.query.partyId,
        userId: this.$route.query.userId,
        });
      this.userDetailList = JSON.parse(JSON.stringify(response.userDetail));
      this.profileData = response.userDetail;
        this.profileData.country = response.userDetail.postalAddress.countryGeoId;
        this.profileData.emailAddress = response.userDetail.emailAddress.emailAddress;
        this.profileData.country = response.userDetail.country;
        this.contactMechIdEmail = response.userDetail.emailAddress.contactMechId;
        this.contactMechPurposeTypeIdEmail = response.userDetail.emailAddress.contactMechPurposeTypeId;
        this.contactMechIdPincode = response.userDetail.postalAddress.contactMechId;
        this.contactMechPurposeTypeIdPincode = response.userDetail.postalAddress.contactMechPurposeTypeId;
        this.contactMechIdPhone = response.userDetail.phoneNumber.contactMechId;
        this.contactMechPurposeTypeIdPhone = response.userDetail.phoneNumber.contactMechPurposeTypeId;
        this.stateProvinceGeoId = response.userDetail.postalAddress.stateProvinceGeoId;
        this.profileData = {
          ...this.profileData,
          ...response.userDetail.postalAddress,
          ...response.userDetail.phoneNumber,
        };
        let countryFilterData = this.checkCountry(this.profileData.countryGeoId);
        this.profileData.country = countryFilterData.length > 0 ? countryFilterData[0] : "";
         this.isLoading = false;
        if (response.userDetail.postalAddress.countryGeoId) {
        await this.getAssociatedStateList(response.userDetail.postalAddress.countryGeoId);
        } 
    },

    checkCountry(countryGeoId) {
      return this.countryList.filter((item) => {
        let arr = item.value;
        if (arr === countryGeoId) {
          return item;
        }
      });
    },

    checkState(stateProvinceGeoId) {
      return this.stateData.filter((item) => {
        let arr = item.split(": ");
        if (arr[1] === stateProvinceGeoId) {
          return item;
        }
      });
    },

    async getCountryList() {
       this.isLoading = true;
      let response = await this.getMethod("getCountryList");
      /* Prepare country list as array of key value pairs */
      response.countryList.forEach((currentValue, index, arr) => {
        let indexOfDots = currentValue.indexOf(":");
        let emptyObj = {};
        emptyObj.key = currentValue.slice(0, indexOfDots);
        emptyObj.value = currentValue.slice(indexOfDots + 2, indexOfDots + 5);
        this.countryList.push(emptyObj);
         this.isLoading = false;
      });
    },

    async getAssociatedStateList(getidbySelect) {
       this.isLoading = true;
      let response = await this.getMethod("getAssociatedStateList", {
        countryGeoId: getidbySelect
      });
        this.stateData = [];
      /* Prepare state list as array of key value pairs */
      if (response.stateList == "No States/Provinces exist: _NA_") {
        this.showStateField = false;
        response.stateList.forEach((currentValue, index, arr) => {
        let indexOfDots = currentValue.indexOf(":");
        let emptyObj = {};
        emptyObj.key = currentValue.slice(0, indexOfDots);
        emptyObj.value = currentValue.slice(indexOfDots + 2, indexOfDots + 7);
        this.stateData.push(emptyObj);
         this.isLoading = false;
      });
      } else {
        this.showStateField = true;
        response.stateList.forEach((currentValue, index, arr) => {
        let indexOfDots = currentValue.indexOf(":");
        let emptyObj = {};
        emptyObj.key = currentValue.slice(0, indexOfDots);
        emptyObj.value = currentValue.slice(indexOfDots + 2, indexOfDots + 7);
        this.stateData.push(emptyObj);
         this.isLoading = false;
       this.stateData.forEach(element => {
         if (this.stateProvinceGeoId == element.value) {
           this.profileData.state = this.stateProvinceGeoId;
         }
       });
      });
      }
    },

    getProvinceCode(state) {
      if (state) {
        this.stateProvinceGeoId = state.split(": ")[0].trim();
      }
    },

    async updateUserDetail() {
      this.isLoading = true;
      if (this.userDetailList.emailAddress.contactMechPurposeTypeId) {
        this.contactMechPurposeTypeIdEmail = this.userDetailList.emailAddress.contactMechPurposeTypeId
      } else {
        this.contactMechPurposeTypeIdEmail = 'PRIMARY_EMAIL';
      }

          var dataJsonProfile =  {
            
              "postalAddress": {
                "countryGeoId": this.profileData.countryGeoId,
                "contactMechPurposeTypeId": "PRIMARY_LOCATION",
                "city": this.profileData.city,
                "address1": this.profileData.address1,
                "address2": this.profileData.address2,
                "postalCode": this.profileData.postalCode,
                "stateProvinceGeoId": this.stateProvinceGeoId,
                "contactMechId": this.contactMechIdPincode
              },
              "phoneNumber": {
                "contactNumber": this.profileData.contactNumber,
                "contactMechPurposeTypeId": "PRIMARY_PHONE",
                "contactMechId": this.userDetailList.phoneNumber.contactMechId
              },
              "emailAddress": {
                "emailAddress": this.profileData.emailAddress,
                "contactMechPurposeTypeId": "PRIMARY_EMAIL",
                "contactMechId": this.userDetailList.emailAddress.contactMechId
              },
              "firstName": this.profileData.firstName,
              "lastName": this.profileData.lastName,
              "companyName": this.profileData.companyName,
              "vatNumber": this.profileData.vatNumber,
              "taxNumber": this.profileData.taxNumber,
          }
        // this.updateData = {
        //     emailAddress: {
        //     contactMechId: this.userDetailList.emailAddress.contactMechId,
        //     contactMechPurposeTypeId: this.contactMechPurposeTypeIdEmail,
        //     emailAddress: this.profileData.emailAddress,
        //   },
        //   postalAddress: {
        //     countryGeoId: this.profileData.countryGeoId,
        //     contactMechId: this.contactMechIdPincode,
        //     contactMechPurposeTypeId: this.contactMechPurposeTypeIdPincode,
        //     address1: this.profileData.address1,
        //     city: this.profileData.city,
        //     postalCode: this.profileData.postalCode,
        //     stateProvinceGeoId: this.stateProvinceGeoId,
        //   },
        //   phoneNumber: {
        //     contactMechId: this.userDetailList.phoneNumber.contactMechId,
        //     contactMechPurposeTypeId: this.userDetailList.phoneNumber.contactMechPurposeTypeId,
        //     contactNumber: this.profileData.contactNumber,
        //   },
        //   firstName: this.profileData.firstName,
        //   lastName: this.profileData.lastName,
        // }
          
        if (this.$refs.form.validate()) {
        //let response = await countryStateAPI.updateProfile(this.updateData,this.dataSend);
        let response = await this.postMethod("updateUserDetail",{
          updateData:dataJsonProfile,
          accountId: this.$route.query.accountId,
          userId: this.$route.query.userId,
          authToken: localStorage.getItem("authNew"),
        });
        if (response.responseMessage == "success") {
          this.seeSnackbar("Updated Successfully", response.responseMessage);
          this.getUserDetail();
          this.isLoading = false;
        }
      } else {
        this.seeSnackbar("Correct the highlighted errors", "warning");
        this.isLoading = false;
      }
    },
     checkValidCompanyName() {
      if (this.profileData.companyName.length != 0) {
        this.companyNameRules = [
          (v) => (v && v.length <= 40) || "this value is required",
        ];
      } else {
        this.companyNameRules = [];
      }
    },
    checkValidVatNumber() {
      if (this.profileData.vatNumber.length != 0) {
        this.vatNumberRules = [
          (v) => (v && v.length <= 12) || "this value is required",
        ];
      } else {
        this.vatNumberRules = [];
      }
    },
    checkValidTaxNumber() {
      if (this.profileData.taxNumber.length != 0) {
        this.taxNumberRules = [
          (v) => (v && v.length <= 16) || "this value is required",
        ];
      } else {
        this.taxNumberRules = [];
      }
    },
  },
};
</script>
<style scoped>
.update-btn{

    float: right;
}


</style>
