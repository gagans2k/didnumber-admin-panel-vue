<template>
  <div>
    <v-card elevation="2">
      <div class="text-right">
        <v-btn
          class="mr-4 my-8 text-capitalize primary--text"
          @click="kazoourl()"
          outlined
          rounded
        >
          launch DIDnPBX
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </div>
      <v-container fluid>
        <div class="px-md-6">
          <p>
            Setup your business communications the way you want. Build and
            manage robust call systems like you never thought possible. Connect
            your office, mobile and desktop devices.
          </p>
          <p>Simple and intuitive user dashboard to view your communications</p>
          <ul>
            <li><b>Caller ID - </b>To recognize the callers easily</li>
            <br />
            <li>
              <b>Advanced Voicemail -</b> Voicemail messages can be sent on
              e-mail as well
            </li>
            <br />
            <li>
              <b>Real Time Call Monitoring -</b> Monitor Calls as they occur
            </li>
            <br />
            <li>
              <b>Faxing Facility -</b> No need for additional fax machine when
              you can receive fax as e-mail attachments.
            </li>
            <br />
            <li>
              <b>Call Parking - </b>Park a call on one phone & pick up the same
              from another phone
            </li>
            <br />
            <li>
              <b>Auto Call Distribution - </b>Distribute your call across a
              group so that no call is missed
            </li>
            <br />
            <li>
              <b>Call Screening -</b> Choose to take a call, when you want to
            </li>
            <br />
            <li>
              <b>Blind Call Transfer -</b> Transfer the call to any extension
              without picking up.
            </li>
            <br />
            <li>
              <b>Call Forwarding & Follow Me - </b>The call follows you wherever
              you go
            </li>
            <br />
            <li><b>Conference Bridge -</b> Multi party conferencing bridge</li>
            <br />
            <li>
              <b>Mobile Extension –</b> Mobile SIP (3rd Party applications)
            </li>
            <br />
            <li><b>Call Recording –</b> To record the calls</li>
            <br />
            <li><b>3 Way Calling - </b>Have a three person conference call</li>
            <br />
            <li>
              <b>Do not Disturb -</b> Choose not to be disturbed from unwanted
              calls
            </li>
            <br />
            <li><b>Call Waiting -</b> Manage multiple calls with ease</li>
            <br />
            <li>
              <b>Speed Dial -</b> Make important contacts accessible through a
              single touch
            </li>
            <br />
            <li>
              <b>Number Blacklisting -</b> Effectively stall all unwanted calls
            </li>
            <br />
            <li>
              <b>Call Detail Records -</b> Detailed call history available
            </li>
            <br />
            <p><b>& Lots More........</b></p>
          </ul>
        </div>
      </v-container>
    </v-card>
  </div>
</template>
// ********* Call Flow Script ***************
<script lang="js">
  export default  {
    name: 'callflows',
    props: [],
    mounted() {
    },
    data() {
      return {
          urlSuffix: localStorage.getItem("authToken")
      }
    },
    methods: {
        kazoourl() {
            let httpUrl = 'https://cloud.didnpbx.com/auth_kazoo_token?auth_token='+this.urlSuffix+'&dispatch_rule=modal_callflow_builder'
            window.open(httpUrl, '_blank', 'width=570,height=620')
        }
    },
    computed: {
    }
}
</script>
// ********* Call Flow CSS ***************
<style scoped>
.myTitle {
  color: white;
  background-color: #3e6b96 !important;
  margin: -80px 37px 4px -3px !important;
}
</style>
 