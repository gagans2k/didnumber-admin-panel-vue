<template>
<div>
    <v-card elevation="1">
        <v-card-actions class="py-0">

            <!-- <v-col lg="3" md="3" sm="12" class="pb-0">
          <v-text-field
            label="Search by Prefix"
            append-icon="search"
            class="pb-0 pt-2"
            v-model="searchText"
            @keyup="searchByText"
            outlined
            dense
          ></v-text-field>
        </v-col> -->
        </v-card-actions>

        <!-- remove rate dialog -->
        <v-dialog v-model="dialogDelete" max-width="450px">
            <v-card>
                <v-card-title>Would you like to remove the rate?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    <!-- view rate dialog -->
        <v-dialog v-model="dialogView" max-width="380px !important">
            <v-card>
                <v-card-title height="30px" >Task Detail

                   <v-layout>
                    <v-flex xs="12" class="pa-2">
                        <label></label>
                        <v-icon style="float: right" @click="cancelDialog">cancel</v-icon>
                    </v-flex>
                   </v-layout>
                  </v-card-title>
                     <v-divider></v-divider>
                    <v-list>
                    <!-- Category -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Category :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.category"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Action -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Action :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.action"></v-list-item-title>
                        </v-list-item-content>
                        <!-- File Name -->
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>File Name :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.file_name"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Csv -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Csv :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.csvs"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Status -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Status :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.status"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Success Count -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Success Count :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.success_count"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Failure Count -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Failure Count :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.failure_count"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Total Count -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Total Count :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.total_count"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Created Date -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Created Date :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.created"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- Start Time -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Start Time :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.start_timestamp"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- End Time -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>End Time :</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                            <v-list-item-title v-text="taskDetailData.end_timestamp"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-card-actions>
                   
                    
                  
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-data-table :headers="headers" :items="rateList" :sort-by="['prefix', 'description', 'cost']" :server-items-length="totalRateList" :footer-props="{
          'items-per-page-options': [10, 20, 30]
        }" :options.sync="options">
            <template v-slot:[`item.indexNo`]="{ item }">
                {{
            (options.page - 1) * options.itemsPerPage +
            (rateList.indexOf(item) + 1)
          }}
            </template>
            <template v-slot:[`item.created`]="{ item }">
                <!-- {{ moment(toLocaleDateString(item.created - 62167219200 * 1000)).format('MMMM Do YYYY, h:mm:ss a') }} -->
                <!-- {{new Date(item.created -62167219200) * 1000.toLocaleDateString()}} -->
                {{new Date((item.created - 62167219200) * 1000).toLocaleDateString() }}
                <!-- {{ new Date(item.created - 62167219200 ).toLocaleDateString() }} -->
            </template>
            <template v-slot:[`item.viewAction`]="{ item }">
                <!-- <v-icon @click="downloadSample(item)" medium color="info">download_for_offline </v-icon> -->
                <v-btn @click="downloadSample(item)" outlined x-small fab color="info">
                    <v-icon>download</v-icon>
                </v-btn>

                <v-btn class="ma-1" outlined x-small fab color="info" v-if="item.status == 'pending'">
                    <v-icon>play_circle </v-icon>
                </v-btn>

                <!-- <router-link
              :to="{
                name: 'Task Detail',
                query: { taskId: item.id},
              }"
            > -->
                <v-btn class="ma-1" outlined x-small fab color="green" @click="viewOrder(item)">
                    <v-icon> info</v-icon>
                </v-btn>
                <!-- </router-link> -->
                <v-btn class="ma-1" @click="deleteOrder(item)" outlined x-small fab color="red">
                    <v-icon>delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <loading :active="isLoading" :loader="loader" />
    </v-card>
</div>
</template>

<script>
import rateAPI from "@/services/rateAPI.js";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import AllApiCalls from "@/services/AllApiCalls";
export default {
    mixins: [AllApiCalls],
    components: {
        Loading
    },
    data() {
        return {
            isLoading: false,
            dialogView: false,
            dialogDelete: false,
            //fullPage: false,
            loader: "bars",
            search: "",
            searchText: "",
            searchType: "",
            searchCountry: "",
            searchCont: "",
            isoCountryCode: "",
            taskDetailData: "",
            moment: moment,
            options: {},
            totalRateList: 0,
            headers: [{
                    text: "S.No",
                    value: "indexNo",
                    sortable: false
                },
                {
                    text: "Date",
                    value: "created",
                    sortable: false
                },
                {
                    text: "Category",
                    value: "category",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Action",
                    value: "action",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Status",
                    value: "status",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Details",
                    value: "viewAction",
                    align: "center",
                    sortable: false
                }
            ],
            rateList: []
        };
    },

    watch: {
        options: {
            handler() {
                this.getRateList();
            },
            deep: true
        }
    },

    computed: {
        // rateListData() {
        //   return this.rateList.filter(item => {
        //     const prefix = item.prefix.toLowerCase();
        //     const description = item.description.toLowerCase();
        //     const cost = item.cost.toLowerCase();
        //     const searchTerm = this.search.toLowerCase();

        //     return (
        //       prefix.includes(searchTerm) ||
        //       description.includes(searchTerm) ||
        //       cost.includes(searchTerm)
        //     );
        //   });
        // }
    },
    methods: {
        async getRateList() {
            this.isLoading = true;
            this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
            const {
                sortBy,
                sortDesc,
                page,
                itemsPerPage
            } = this.options;
            let response = await this.getMethod("getTasks", {
                accountId: this.userDetail.accountId,
                pageSize: itemsPerPage,
            });
            if (response.responseMessage = "success") {
                this.isLoading = false;
                this.rateList = response.taskList.data;
                this.totalRateList = response.page_size;
            }
        },

        // async getDataDidNumber (){
        //     this.isLoading = true;
        //     const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        //     let response = await this.getMethod("getReceivedDidList", {
        //         viewIndex: page,
        //         viewSize: itemsPerPage,
        //     });
        //     if (response.responseMessage ="success") {
        //         this.isLoading = false;
        //         this.didNumbersItems = response.didNumberList;
        //         this.totalItems = response.listSize;
        //         this.isLoading = false;
        //     }
        // },

        searchByText() {
            if (/^[a-zA-Z]+$/.test(this.searchText)) {} else {
                this.searchType = "prefix";
            }
            this.getRateList();
        },

        viewOrder(item) {
            this.dialogView = true;
            this.getTaskId = item.id;
            this.getTaskDetailSync();
            // this.$router.push(`/taskDetail/${item.id}`);
            // this.isLoading = false;
        },

        deleteOrder(item) {
            this.getTaskId = item.id;
            this.dialogDelete = true;
        },

        cancelDialog() {
            this.dialogView = false;
        },

        closeDelete() {
            this.dialogDelete = false;
        },

        async deleteItemConfirm() {
            this.isLoading = true;
            // console.log(this.getTaskId)
            // var getById = JSON.parse(localStorage.getItem("userDetail"));
            var deleteData = {
                // authToken:localStorage.getItem("authNew"),
                // accountId:getById.accountId,
                taskId: this.getTaskId
            };
            try {
                let response = await rateAPI.deleteTask(deleteData);
                if (response.responseMessage == "success") {
                    this.$root.$emit("SHOW_SNACKBAR", {
                        text: "Rate Task removed successfully",
                        color: "success",
                    });
                    this.isLoading = false;
                    this.dialogDelete = false;
                    this.getRateList();
                }
            } catch (err) {
                this.isLoading = false;
                // this.$root.$emit("SHOW_SNACKBAR", {
                //   text: error.responseMessage.errorMessage,
                //   color: "error",
                // });
            }
        },

        async getTaskDetailSync() {
            this.isLoading = true;
            let jsontaskId = {
                taskId: this.getTaskId,
            };
            try {
                let response = await rateAPI.getTaskDetail(jsontaskId);
                this.isLoading = false;
                if (response.responseMessage == 'success') {
                    // console.log(response)
                    this.taskDetailData = response.taskDetail.data._read_only;
                    var created = (this.taskDetailData.created - 62167219200) * 1000;
                    this.taskDetailData.created = moment(created).format('DD-MM-YYYY HH:mm:ss');
                    var start_timestamp = (this.taskDetailData.start_timestamp - 62167219200) * 1000;
                    this.taskDetailData.start_timestamp = moment(start_timestamp).format('HH:mm:ss');
                    var end_timestamp = (this.taskDetailData.end_timestamp - 62167219200) * 1000;
                    this.taskDetailData.end_timestamp = moment(end_timestamp).format('HH:mm:ss');
                    this.isLoading = false;
                }
                //this.orderDetails = response.orderDetails.orderItemList;
            } catch (err) {
                this.isLoading = false;
            }
        },

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

        async downloadSample() {
            var JSONData = [{
                    "Prefix": "48123950270",
                    "Iso": "PL",
                    "Desc": "Poland Special Services",
                    "InternalCost": "0",
                    "Rate": "13",
                    "rate_increment": "60",
                    "rate_minimum": "60",
                    "rate_surcharge": "0",
                    "direction": "outbound",
                    "routes": "^\+?48123950270.+$"
                },
                {
                    "Prefix": "37525430233",
                    "Iso": "BY",
                    "Desc": "Belarus Mobile - Mobility services",
                    "InternalCost": "0",
                    "Rate": "13",
                    "rate_increment": "60",
                    "rate_minimum": "60",
                    "rate_surcharge": "0",
                    "direction": "outbound",
                    "routes": "^\+?37525430233.+$"
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
            var fileName = "SampleFile";

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
    }
};
</script>

<style scoped>
.text-capitalize {
    text-transform: capitalize;
}

</style>
