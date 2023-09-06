<template>
  <div>
    <!-- DIALOG FOR UPLOADING FILES -->
    <!-- <v-dialog v-model="uploadFileDialog" width="500">
      <v-card>
        <v-toolbar dense dark color="grey" flat>
          <v-toolbar-title>Choose file</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="uploadFileDialog = false" size="30" color="white">close</v-icon>
        </v-toolbar>
      </v-card>
      <UploadAllFiles :url="url" @uploaded="uploadFileDialog = false"></UploadAllFiles>
    </v-dialog> -->

    <!----------------------MAIN CONTAINER --------------------------->

    <v-container fluid grid-list-sm class="pa-0">
      <!-- TOOLBAR -->

      <v-tabs slot="extension" color="#00C18C" v-model="tabsAutomation">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :to="{ name: 'Profile', query: $route.query }">Profile</v-tab>
        <v-tab :to="{ name: 'Security', query: $route.query }">Security</v-tab>
        <v-spacer></v-spacer>
      </v-tabs>

      <!---------------------------------MAIN CONTENT ---------------------------->

      <div class="pa-1">
        <router-view></router-view>
      </div>
      
    </v-container>
  </div>
</template>

<script>
import AllApiCalls from "@/services/AllApiCalls";

export default {
  mixins: [AllApiCalls],

  data() {
    return {
      tabsAutomation: null,
    };
  },

  created() {
    
  },
};
</script>

