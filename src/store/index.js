import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    signUpData: {},
    idleVue: {
      isIdle: false
    }
  }),
  
  getters: {
    getSignUpData: (state) => state.signUpData,
    isIdle: (state) => state.idleVue.isIdle
  },
  
  actions: {
    storeSignUpData(payload) {
      this.signUpData = payload;
    },
    setIdleStatus(status) {
      this.idleVue.isIdle = status;
    }
  }
});
