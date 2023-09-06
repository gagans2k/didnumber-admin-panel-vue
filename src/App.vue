<template>
  <div id="app-root">
    <template v-if="isAuthenticated()">
      <v-app>
        <!-- Navigation drawer -->
        <app-drawer></app-drawer>
        <v-main class="page-content">
          <!-- Header toolbar -->
          <app-toolbar></app-toolbar>
          <template v-if="checkSession()">
          </template>
          <v-container fluid>
            <router-view :key="$route.fullPath"></router-view>
          </v-container>
        </v-main>

        <v-snackbar
          timeout="3000"
          top
          right
          :color="snackbar.color"
          v-model="snackbar.show"
        >
          {{ snackbar.text }}
        </v-snackbar>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
          <v-snackbar
            timeout="3000"
            top
            right
            :color="snackbar.color"
            v-model="snackbar.show"
          >
            {{ snackbar.text }}
          </v-snackbar>
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import AppDrawer from "@/components/pageHeader/app-drawer";
import AppToolbar from "@/components/pageHeader/app-toolbar";
// import ThemeSettings from "@/components/theme-settings";
import menu from "@/side-nav/menu";

export default {
  components: {
    AppDrawer,
    AppToolbar,
    // ThemeSettings
  },
  data: () => ({
    menus: [],
    snackbar: {
      show: false,
      text: "",
      color: ""
    },
  }),


  computed: {
    isIdle() {    
      return this.$store.state.idleVue.isIdle;
    }
  },

  methods: {
    isAuthenticated() {
      return localStorage.getItem("auth");
    },
    checkSession(){
      if(this.$store.state.idleVue.isIdle){        
        localStorage.clear();
        this.$router.push({
            name: 'Login'
        });
      }
    }
  },

  mounted() {
    
    this.menus = menu;
    this.$root.$on("SHOW_SNACKBAR", (data) => {
      this.snackbar = {
        show: true,
        text: data.text,
        color: data.color,
      };
    });
  },
};
</script>

<style>

</style>
