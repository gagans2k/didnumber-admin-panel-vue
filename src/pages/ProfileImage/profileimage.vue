<template>
  <v-card flat>
    <v-card-title>Profile Picture</v-card-title>
    <img :src="imageUrl" height="150" v-if="imageUrl" />
    <!-- <img :src="imageUrl" onerror="this.src='/images/user.png';" height="150" /> -->
    <v-text-field
      placeholder="Select Image"
      @click="pickFile"
      v-model="imageName"
      append-icon="attach_file"
      @click:append="pickFile"
      autocomplete="off"
      readonly
    ></v-text-field>
    <input
      type="file"
      accept="image/*"
      ref="image"
      @change="onFilePicked"
      style="display: none"
    />
    <v-card-actions>
      <v-row align="center" justify="center">
        <v-btn color="error" to="/dashboard">CANCEL</v-btn>
        <v-btn
          color="primary"
          class="right-btn"
          @click="uploadProfileImage"
          :disabled="disableButton"
        >
          UPLOAD
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import profileAPI from "@/services/profileAPI.js";
export default {
  data: () => ({
    userDetail: {},
    disableButton: true,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    type: "",
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
      } catch (error) {
      }
    },

    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      this.imageName = "";
      this.imageFile = "";
      this.imageUrl = "";
      this.type = "";
      if (files[0] !== undefined) {
        this.type = files[0].type;
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          this.disableButton = false;
        });
      }
    },

    async getUserDetail() {
      let userData = {
        accountId: this.userDetail.accountId,
        userId: this.userDetail.userId,
      };
      try {
        let response = await profileAPI.getUserDetail(userData);
        if (response.profileImageData) {
          this.imageUrl = `data:image/jpg;base64,${response.profileImageData}`;
        }
      } catch (error) {
      }
    },
  },

  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getUserDetail();
  },
};
</script>

<style scoped>
.right-btn {
  margin-left: 2%;
}
</style>