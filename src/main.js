import Vue from "vue";
import App from "./App.vue";
import IdleVue from "idle-vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import JsonCSV from 'vue-json-csv';
import VueClipboard from 'vue-clipboard2';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
document.addEventListener('contextmenu', event => event.preventDefault());
Vue.component('loading-overlay', Loading)
const eventsHub = new Vue();
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  router,
  idleTime: 1200000, // 20 minutes
  startAtIdle: false
});
Vue.component('downloadCsv', JsonCSV)
Vue.config.productionTip = false
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");