<template>
  <v-card>
    <v-toolbar color="blue" dark>
      <v-toolbar-title
        >Document Information:- {{ userDocumentInfo.name }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-icon @click="closeUserDialog()">cancel</v-icon>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Name: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.firstName }}
            {{ userDocumentInfo.middleName ? userDocumentInfo.middleName : "" }}

            {{ userDocumentInfo.lastName ? userDocumentInfo.lastName : "" }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Date Of Birth: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.dateOfBirth | setDateFormat }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> City: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.city }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Country: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.country }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Address: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.address }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Country Of Birth: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.countryOfBirth }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0">
            Company Registration Number:
          </v-card-subtitle>
          <v-card-title class="pa-0">
            {{
              userDocumentInfo.companyRegistrationNumber
                ? userDocumentInfo.companyRegistrationNumber
                : "-"
            }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Personal Tax Id: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.personalTaxId }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Postal Code: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.postalCode }}
          </v-card-title>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Status Id: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.statusId }}
          </v-card-title>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> DocumentInfo Type: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.documentInfoType }}
          </v-card-title>
        </v-col>

        <v-col cols="12" sm="4" v-if="userDocumentInfo.documentInfoType == 'BUSINESS'">
          <v-card-subtitle class="pa-0"> Company Name: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.companyName }}
          </v-card-title>
        </v-col>


        <v-col cols="12" sm="4" v-if="userDocumentInfo.documentInfoType == 'BUSINESS'">
          <v-card-subtitle class="pa-0"> Company Registration Number: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.companyRegistrationNumber }}
          </v-card-title>
        </v-col>

        <v-col cols="12" sm="4" v-if="userDocumentInfo.documentInfoType == 'BUSINESS'">
          <v-card-subtitle class="pa-0"> Vat Id: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.vatId }}
          </v-card-title>
        </v-col>


        <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0"> Incorporation Company: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.incorporationCompany }}
          </v-card-title>
        </v-col>
      
       <v-col cols="12" sm="4">
          <v-card-subtitle class="pa-0">Contact Number: </v-card-subtitle>
          <v-card-title class="pa-0">
            {{ userDocumentInfo.countryCode }} - {{ userDocumentInfo.contactNumber }}
          </v-card-title>
        </v-col>
      </v-row>

      <v-col cols="12" sm="12" class="px-0">
        <v-row>
          <v-col
            cols="4"
            v-for="(document, i) in userDocumentInfo.documentsList"
            :key="i"
            class="cursor-pointer"
          >
            <v-card>
              <v-card-text>
                <h4 class="pb-3 d-flex">
                  {{ document.fileName }}
                  <v-spacer></v-spacer>
                  <v-icon
                    color="green"
                    @click="
                      openImageOnModal(
                        document.base64,
                        document.fileName,
                        document.mimeTypeId
                      )
                    "
                    >mdi-eye</v-icon
                  >
                </h4>
                <div
                  @click="
                    openImageOnModal(
                      document.base64,
                      document.fileName,
                      document.mimeTypeId
                    )
                  "
                >
                  <img
                    v-if="document.mimeTypeId != 'application/pdf'"
                    :src="'data:application/pdf;base64,' + document.base64"
                    :alt="document.base64"
                    width="100%"
                    height="300"
                  />
                  <iframe
                    v-else
                    :src="'data:application/pdf;base64,' + document.base64"
                    alt="base64"
                    width="100%"
                    height="300"
                    frameborder="0"
                  ></iframe>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-card-text>

    <!-- document images modal -->
    <v-dialog v-model="showImageModal">
      <v-card>
        <v-toolbar color="blue" dark>
          <v-toolbar-title>{{ fileName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="showImageModal = false">cancel</v-icon>
        </v-toolbar>
        <!-- {{ documentMimeTypeId }} -->
        <img
          :src="base64"
          alt="base64"
          width="100%"
          v-if="documentMimeTypeId != 'application/pdf'"
        />
        <iframe
          v-else
          :src="base64"
          alt="base64"
          width="100%"
          height="700"
          frameborder="0"
        ></iframe>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  props: ["userDocumentInfo"],
  data() {
    return {
      showImageModal: false,
      base64: null,
      fileName: "",
      documentMimeTypeId: "",
    };
  },
  filters: {
    setDateFormat(dob) {
      if (dob) {
        const dateString = moment.unix(dob / 1000).format("YYYY-MM-DD");
        return dateString;
      } else {
        return "-";
      }
    },
  },
  methods: {
    closeUserDialog() {
      this.$emit("close-user-modal");
    },
    openImageOnModal(base64, fileName, documentMimeTypeId) {
      console.log("clickkkkkkkkkkkk");
      this.fileName = fileName;
      this.base64 = "data:application/pdf;base64," + base64;
      this.documentMimeTypeId = documentMimeTypeId;
      this.showImageModal = true;
    },
  },
};
</script>


<style>
.cursor-pointer {
  cursor: pointer !important;
}
</style>