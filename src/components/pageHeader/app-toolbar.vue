<template>
  <v-app-bar app color="#fff" class="elevation-0">
    <v-app-bar-nav-icon
      @click="toggleDrawer()"
      class="d-lg-none"
      src="https://picsum.photos/1920/1080?random"
    ></v-app-bar-nav-icon>
    <h3 class="font-weight-medium">{{ $route.name }}</h3>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-avatar v-bind="attrs" v-on="on">
          <img
            v-if="checkImg"
            :src="userData.profileImageData"
            alt="user"
            width="50"
          />
          <img v-else :src="dummyImg" alt="dummyuser" width="50" />
        </v-list-item-avatar>
      </template>
      <v-card width="130">
        <v-card-actions class="py-4">
          <v-btn
            color="error"
            text
            @click="logout"
            class="user-info"
          >
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { ref, reactive, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import dummyImg from "../../assets/images/dummyProfile.jpeg";

export default {
  name: "app-toolbar",
  
  setup() {
    const router = useRouter();
    const eventBus = inject('eventBus');
    
    const userDetail = ref({});
    const credit = ref(0);
    const userData = reactive({});
    const cartData = ref({});
    const cartList = ref([]);
    const noOfDID = ref({});
    const noOfCartItem = ref(0);
    const checkImg = ref("");

    const logout = () => {
      localStorage.clear();
      router.push("/login");
    };

    const toggleDrawer = () => {
      if (eventBus) {
        eventBus.emit("TOGGLE_DRAWER");
      }
    };

    onMounted(() => {
      // Initialize user data if needed
      const storedUserDetail = localStorage.getItem("userDetail");
      if (storedUserDetail) {
        userDetail.value = JSON.parse(storedUserDetail);
      }
    });

    return {
      userDetail,
      credit,
      userData,
      cartData,
      cartList,
      noOfDID,
      noOfCartItem,
      dummyImg,
      checkImg,
      logout,
      toggleDrawer
    };
  }
};
</script>

<style scoped>
.style-btn {
  margin: 6px 8px;
}

.user-info {
  font-size: 14px;
  font-weight: bold;
}
</style>
