<template>
  <v-card elevation="1">
    <v-container fluid>
      <v-row>
        <loading :active="isLoading" :loader="loader" />
      </v-row>
      <!-- SEARCH -->
      <v-row align="center">
        <v-spacer></v-spacer>
        <v-toolbar elevation="0">
          <v-spacer></v-spacer>
          <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
        </v-toolbar>
      </v-row>
      <!-- DATA TABLE-->
      <v-row>
        <v-col xs="12">
          <v-data-iterator :items="items" hide-default-footer>
            <!-- 
            items-per-page.sync="itemsPerPage"
            :page.sync="page"
           -->
            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.documentInfoId"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card>
                    <v-col cols="12" class="py-0">
                      <v-row align="center">
                        <v-card-subtitle class="subheading font-weight-bold">
                          <!-- {{ item.documentInfoId }} -->
                          File Name: {{ item.name }}
                        </v-card-subtitle>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-switch
                          v-model="item.statusId"
                          value="DOC_APPROVED"
                          inset
                          class="mr-2"
                          @change="approveIdentity(item)"
                        ></v-switch>
                        <v-spacer></v-spacer>
                        <v-btn
                          x-small
                          outlined
                          fab
                          class="mr-2"
                          color="green"
                          size="25"
                          @click="getDocumentData(item)"
                          ><v-icon>visibility</v-icon></v-btn
                        >
                      </v-row>
                    </v-col>
                    <v-divider></v-divider>

                    <v-list
                      dense
                      v-for="(item, i) in item.documentsList"
                      :key="i"
                    >
                      <!-- <v-list-item v-for="(key, index) in filteredKeys" :key="index"> -->
                      <v-list-item>
                        <v-list-item-content>
                          {{ item.fileName }}
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <img
                            v-if="item.mimeTypeId != 'application/pdf'"
                            :src="`data:image/jpg;base64,${item.base64}`"
                            alt="base64"
                            width="80"
                            class="cursor-pointer"
                            @click="
                              viewDocData(
                                `data:image/jpg;base64,${item.base64}`,
                                item.fileName,
                                item.mimeTypeId
                              )
                            "
                          />
                          <div
                            v-else
                            class="cursor-pointer"
                            @click="
                              viewDocData(
                                `data:${item.mimeTypeId};base64,${item.base64}`,
                                item.fileName,
                                item.mimeTypeId
                              )
                            "
                          >
                            <v-icon size="100" color="red"
                              >picture_as_pdf</v-icon
                            >
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <!-- <template v-slot:footer>
              <v-col cols="12">
                <v-row class="mt-2" align="center" justify="center">
                  <span class="grey--text">Items per page</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        text
                        color="primary"
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ itemsPerPage }}
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(number, index) in itemsPerPageArray"
                        :key="index"
                        @click="updateItemsPerPage(number)"
                      >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-spacer></v-spacer>

                  <span class="mr-4 grey--text subtitle-2">
                    Page {{ page }} of {{ numberOfPages }}
                  </span>
                  <v-btn
                    small
                    fab
                    dark
                    color="blue darken-3"
                    class="mr-1"
                    @click="formerPage"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    small
                    fab
                    dark
                    color="blue darken-3"
                    class="ml-1"
                    @click="nextPage"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
            </template> -->
          </v-data-iterator>
        </v-col>
      </v-row>
    </v-container>
    <!-- Image Document Dialog -->
    <v-dialog v-model="viewDoc" max-width="90%">
      <v-card>
        <v-toolbar color="blue" dark>
          <v-toolbar-title>{{ fileName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="viewDoc = false">cancel</v-icon>
        </v-toolbar>
        <img
          :src="docData"
          width="100%"
          :alt="docData"
          v-if="mimeType != 'application/pdf'"
        />
        <iframe v-else :src="docData" width="100%" frameborder="0" height="700"></iframe>
      </v-card>
    </v-dialog>
    <!-- View User Document Data Dialog -->
    <v-dialog v-model="viewUserDocumentList" max-width="50%">
      <uploadDocumentsVue
        :userDocumentInfo="userDocumentInfo"
        @close-user-modal="closeUserModal"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import AllApiCalls from "@/services/AllApiCalls";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import uploadDocumentsVue from "../../../components/uploadDocuments.vue";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
    uploadDocumentsVue,
  },
  data() {
    return {
      moment: moment,
      search: "",
      isLoading: false,
      loader: "bars",
      totalItems: 0,
      userDetail: {},
      viewDoc: false,
      viewUserDocumentList: false,
      docData: "",
      fileName: "",
      mimeType: "",
      userDocumentInfo: {},
      aproveIndentity: "",

      itemsPerPageArray: [4, 8, 12],
      filter: {},
      page: 1,
      itemsPerPage: 4,
      items: [],
    };
  },
  computed: {
    // numberOfPages() {
    //   // console.log("this.items.length====", this.items);
    //   if (this.items.length != 0) {
    //     return Math.ceil(this.items.length / this.itemsPerPage);
    //   }
    // },
  },
  mounted() {
    this.fetchCustomerUploadedDocuments();
  },
  methods: {
    viewDocData(docData, fileName, mimeType) {
      this.viewDoc = true;
      this.docData = docData;
      this.fileName = fileName;
      this.mimeType = mimeType;
    },
    //  approve identity
    async approveIdentity(aproveIndentity) {
      this.isLoading = true;
      let payloadApproveIdentity = {
        partyId: this.$route.query.partyId,
        documentInfoId: aproveIndentity.documentInfoId,
        statusId: aproveIndentity.statusId == "DOC_APPROVED" ? true : false,
      };
      try {
        let response = await this.postMethod(
          "approveIdentity",
          payloadApproveIdentity
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("====error===", error);
      }
    },
    //  get Document Info
    async getDocumentData(selectedDoc) {
      this.isLoading = true;
      let payloadApproveIdentity = {
        partyId: this.$route.query.partyId,
        documentInfoId: selectedDoc.documentInfoId,
      };
      try {
        let response = await this.getMethod(
          "getDocumentInfo",
          payloadApproveIdentity
        );
        let username = {
          name: response.name,
        };
        let userDocumentInfo =
          response.documentInfoList.length != 0
            ? response.documentInfoList[0]
            : {};

        this.userDocumentInfo = { ...username, ...userDocumentInfo };
        this.viewUserDocumentList = true;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("====error===", error);
      }
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },

    async fetchCustomerUploadedDocuments() {
      this.isLoading = true;
      let response = await this.getMethod("fetchCustomerUploadedDocuments", {
        partyId: this.$route.query.partyId,
      });
      this.isLoading = false;
      this.items = response.customerData;
      this.totalItems = response.customerData.length;
    },

    closeUserModal() {
      this.viewUserDocumentList = false;
    },
    back() {
      this.$router.go(-1);
    }

  },
};
</script>
