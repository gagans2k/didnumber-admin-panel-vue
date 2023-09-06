<template>
  <v-container>
    <v-tabs v-model="active" color="primary" background-color="grey lighten-2">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(tab, index) in tabs" :key="index">
        <div class="subheading">{{ tab.name }}</div>
      </v-tab>

      <!-- BASIC-->
      <v-tab-item>
        <v-card>
          <v-container>
            <!-- DEVICE NICKNAME -->
            <v-row>
              <v-col cols="12">
                <v-text-field label="Device Nickname" v-model="deviceDetail.editData.data.name"> </v-text-field></v-col
            ></v-row>
            <!-- ASSIGN TO -->
            <v-row>{{deviceItemsArray.owner_id}}
              <v-col cols="12"> 
                      <v-select
                      :items="deviceItemsArray.owner_id"
                      item-value="deviceItemsArray.owner_id"
                        v-model="deviceDetail.editData.data.owner_id"
                        label="Assign To"
                      >
                      </v-select>
              </v-col>
            </v-row>
            <!-- DEVICE MAC ADDRESS -->
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Device MAC Address" v-model="deviceDetail.editData.data.mac_address"> </v-text-field></v-col
            ></v-row>

            <div flex-xs flex="50">
              <v-checkbox v-model="deviceDetail.editData.data.enabled">
                <template v-slot:label>
                  <div>enabled</div>
                </template>
              </v-checkbox>
            </div>
            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                :to="{
                  name: 'Customer Devices list',
                  query: {
                    accountId: $route.query.accountId
                  },
                }"
              >
              Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="editDevice"
              >
                Update
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions> -->
          </v-container>
        </v-card>
      </v-tab-item>

      <!-- CALLER ID -->
      <v-tab-item> 
        <v-card>
          <v-container>

            <v-row>
              <v-col cols="12">
                <v-text-field label="Presence ID" v-model="deviceDetail.editData.data.presence_id"> </v-text-field></v-col
            ></v-row>

            <h4>In-House Calls</h4>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Caller ID Name" v-model="deviceDetail.editData.data.caller_id.internal.name"> </v-text-field></v-col
            ></v-row>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Caller ID Number" v-model="deviceDetail.editData.data.caller_id.internal.number"> </v-text-field></v-col
            ></v-row>

            <h4>Outbound Calls</h4>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Caller ID Name" v-model="deviceDetail.editData.data.caller_id.external.name"> </v-text-field></v-col
            ></v-row>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Caller ID Number" v-model="deviceDetail.editData.data.caller_id.external.number"> </v-text-field></v-col
            ></v-row>

            <h4>Emergency</h4>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Caller ID Name" v-model="deviceDetail.editData.data.caller_id.emergency.name"> </v-text-field></v-col
            ></v-row>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Caller ID Number" v-model="deviceDetail.editData.data.caller_id.emergency.number"> </v-text-field></v-col
            ></v-row>
          </v-container>
        </v-card>
      </v-tab-item>

      <!-- SIP SETTINGS-->
      <v-tab-item> 
        <v-card>
          <v-container>

            <v-row>
              <v-col cols="12">
                <v-text-field label="Realm" v-model="deviceDetail.editData.data.realm" disabled> </v-text-field></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.sip.method"
                  :items="items"
                  item-text="state"
                  item-value="abbr"
                  label="Authentication Method"
                  dense
                ></v-select></v-col
            ></v-row>
            <v-row v-if="deviceDetail.editData.data.sip.method == 'password'">
              <v-col cols="12" >
                <v-text-field label="Username" v-model="deviceDetail.editData.data.sip.username"> </v-text-field></v-col
            ></v-row>

            <v-row v-if="deviceDetail.editData.data.sip.method == 'password'">
              <v-col cols="12" >
                <v-text-field label="Password" v-model="deviceDetail.editData.data.sip.password" type="password"> </v-text-field></v-col
            ></v-row>

            <v-row v-if="deviceDetail.editData.data.sip.method == 'ip'">
              <v-col cols="12" >
                <v-text-field label="Ip Address" v-model="deviceDetail.editData.data.sip.ip"> </v-text-field></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.sip.invite_format"
                  :items="itemsFormat"
                  item-text="value"
                  item-value="item"
                  label="Invite Format"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-text-field label="Expire seconds" v-model="deviceDetail.editData.data.sip.expire_seconds"> </v-text-field></v-col
            ></v-row>

          </v-container>
        </v-card>
      </v-tab-item>

      <!-- AUDIO SETTINGS -->
      <v-tab-item> 
       <v-card>
          <v-container>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.music_on_hold.media_id"
                  :items="mediaList"
                  item-text="name"
                  item-value="id"
                  label="Music On Hold"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.media.peer_to_peer"
                  :items="itemsAudio"
                  item-text="text"
                  item-value="id"
                  label="Peer To Peer Audio"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.media.encryption.methods[0]"
                  :items="itemsMethod"
                  item-text="value"
                  item-value="id"
                  label="Secure RTP"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col>
                <v-flex v-for="(codec,index) in audioCodecs" :key="audioCodecs[index]">
                  <v-checkbox :label="codec" class=
                  "m-0 p-0"></v-checkbox>
                </v-flex>
              </v-col>
            </v-row>

          </v-container>
        </v-card> 
      </v-tab-item>

      <!-- VIDEO SETTINGS-->
      <v-tab-item>
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-flex v-for="(codec,index) in videoCodecs" :key="videoCodecs[index]">
                  <v-checkbox :label="codec" class=
                  "m-0"></v-checkbox>
                </v-flex>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>

      <!-- OPTIONS -->
      <v-tab-item> 
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-checkbox v-model="deviceDetail.editData.data.media.fax_option">
                  <template v-slot:label>
                    <div>T.38</div>
                  </template>
                </v-checkbox>
                <v-checkbox v-model="deviceDetail.editData.data.contact_list.exclude">
                  <template v-slot:label>
                    <div>Hide from Contrast List</div>
                  </template>
                </v-checkbox>
                <v-checkbox v-model="deviceDetail.editData.data.ignore_completed_elsewhere">
                  <template v-slot:label>
                    <div>Ignore Complete Elsewhere</div>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>

      <!-- RESTRICTIONS -->
      <v-tab-item>
        <v-card>
          <v-container v-if="!deviceDetail.editData.data.call_restriction">

            <v-checkbox v-model="deviceDetail.editData.data.call_restriction.closed_groups.action">
              <template v-slot:label>
                <div>Closed Groups</div>
              </template>
            </v-checkbox>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.tollfree_us.action"
                  :items="itemsTollfree"
                  item-text="text"
                  item-value="id"
                  label="US TollFree"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.toll_us.action"
                  :items="itemsToll"
                  item-text="text"
                  item-value="id"
                  label="US Toll"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.emergency.action"
                  :items="itemsEmer"
                  item-text="text"
                  item-value="id"
                  label="Emergency Dispatcher"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.caribbean.action"
                  :items="itemsCari"
                  item-text="text"
                  item-value="id"
                  label="Caribbean"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.did_us.action"
                  :items="itemsDid"
                  item-text="text"
                  item-value="id"
                  label="US DID"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.international.action"
                  :items="itemsInter"
                  item-text="text"
                  item-value="id"
                  label="International"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  v-model="deviceDetail.editData.data.call_restriction.unknown.action"
                  :items="itemsUn"
                  item-text="text"
                  item-value="id"
                  label="Unknown"
                  dense
                ></v-select></v-col
            ></v-row>

          </v-container>
        </v-card>  
        <v-card>
          <v-container v-if="deviceDetail.editData.data.call_restriction">

            <v-checkbox>
              <template v-slot:label>
                <div>Closed Groups</div>
              </template>
            </v-checkbox>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsTollfree"
                  item-text="text"
                  item-value="id"
                  label="US TollFree"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsToll"
                  item-text="text"
                  item-value="id"
                  label="US Toll"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsEmer"
                  item-text="text"
                  item-value="id"
                  label="Emergency Dispatcher"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsCari"
                  item-text="text"
                  item-value="id"
                  label="Caribbean"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsDid"
                  item-text="text"
                  item-value="id"
                  label="US DID"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsInter"
                  item-text="text"
                  item-value="id"
                  label="International"
                  dense
                ></v-select></v-col
            ></v-row>

            <v-row>
              <v-col cols="12" >
                <v-select
                  :items="itemsUn"
                  item-text="text"
                  item-value="id"
                  label="Unknown"
                  dense
                ></v-select></v-col
            ></v-row>

          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          :to="{
            name: 'Customer Devices list',
            query: {
              accountId: $route.query.accountId
            },
          }"
        >
        Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="editDevice"
        >
          Update
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
export default {
  mixins: [AllApiCalls],
   props: {
    owner_id: String,
    likes: Number,
    isPublished: Boolean,
    commentIds: Array,
    author: Object,
    callback: Function,
    contactsPromise: Promise // or any other constructor
 },
  data() {
    return {
      // DIALOG BOX EVENT DETAILS
      items: [
        { state: 'IP', abbr: 'ip' },
        { state: 'Password', abbr: 'password' }
      ],
      itemsFormat: [
        { value: 'Username', item: 'username' },
        { value: 'NPA NXX XXXX', item: 'npan' },
        { value: 'E.164', item: 'e164' }
      ],
      itemsAudio: [
        { text: 'Automatic', id: 'auto' },
        { text: 'Always', id: 'true' },
        { text: 'Never', id: 'false' }
      ],
      itemsMethod: [
        { value: 'SRTP', id: 'srtp' },
        { value: 'ZRTP', id: 'zrtp' }
      ],
      itemsTollfree: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      itemsToll: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      itemsDid: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      itemsEmer: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      itemsUn: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      itemsInter: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      itemsCari: [
        { text: 'Inherit', id: 'inherit' },
        { text: 'Deny', id: 'deny' },
        { text: 'Allow', id: 'allow' }
      ],
      deviceData:{},

      deviceDetail:{
        editData:{
          data:{

          }
        },
      },
      deviceItemsArray:[
      ],
      active: 0,
      mediaList:[],
      audioCodecs : [
          "OPUS",
          "CELT@32000h",
          "G7221@32000h",
          "G7221@16000h",
          "G722",
          "speex@32000h",
          "speex@16000h",
          "PCMU",
          "PCMA",
          "G729",
          "GSM",
          "CELT@48000h",
          "CELT@64000h"
      ],

      videoCodecs : [
          "VP8",
          "H264",
          "H263",
          "H261"
      ],

      tabs: [
        { name: "Basic" },
        { name: "Caller Id" },
        { name: "SIP Settings" },
        { name: "Audio Settings" },
        { name: "Video Settings" },
        { name: "Options" },
        { name: "Restrictions" },
      ],
    };
  },

  methods: {
    async getDeviceDetails() {
      let response = await this.getMethod("getDeviceDetails", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
        deviceId: this.$route.query.deviceId,
      });
      // this.enable = response.deviceDetails.enabled;
      // this.device.name = response.deviceDetails.name;
      this.deviceDetail.editData.data = {};
      this.deviceDetail.editData.data = response.deviceDetails;
      this.codecs = this.deviceDetail.editData.data.media.audio.codecs;
      this.vCodecs = this.deviceDetail.editData.data.media.video.codecs;
      // console.log(this.deviceDetail.editData.data.caller_id.internal)
      this.deviceItemsArray.push(response.deviceDetails);
    },

    
    async getUsersList() {
      let response = await this.getMethod("getUsersList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
    },

    async getMediaList() {
      let response = await this.getMethod("getMediaList", {
        accountId: this.$route.query.accountId,
        authToken: localStorage.getItem("authNew"),
      });
      this.mediaList = response.mediaList;
    },

    async editDevice(){
      // if (this.deviceDetail.editData.data.name == undefined) {
      //     // toaster.error("Device name is required.");
      // } else {
          this.deviceData.accountId = this.$route.query.accountId;
          this.deviceData.authToken = localStorage.getItem("authNew");
          this.deviceData.deviceId = this.$route.query.deviceId;
          this.deviceData.sipUriName = this.deviceDetail.editData.data.name;
          this.deviceData.userName = this.deviceDetail.editData.data.sip.username;
          this.deviceData.password = this.deviceDetail.editData.data.sip.password;
          // this.deviceDetail.sipUriName = this.deviceDetail.editData.data.name;
          // this.device.editData.data.media.audio.codecs = this.codecs;
          

          // this.device.editData.data.media.video.codecs = this.vCodecs;

          let response = await this.putMethod("editDeviceDetails",this.deviceData);
        if (response.responseMessage == "success") {
          this.seeSnackbar("Updated Successfully", response.responseMessage);
          // this.getUserDetail();
          this.isLoading = false;
        }
          // deviceService.editDeviceDetails(data).save($scope.deviceDetail).$promise.then(function(deviceResult) {
          //     if (deviceResult.responseMessage === "success") {
          //         // $location.path("/app/device");
          //         toaster.success('Device updated successfully');
          //         $state.reload();
          //     }
          // }, function error(error) {
          //     if (error) {
          //         toaster.error("Server error");
          //     }
          // });
      // }
    }

  },

  async created() {
    await this.getDeviceDetails();
    await this.getMediaList();
  },

};
</script>
<style scoped>
</style>