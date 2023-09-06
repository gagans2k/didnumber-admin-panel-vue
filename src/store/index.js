import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		signUpData: {}
	},
	getters: {},
	mutations: {
		storeSignUpData(state, payload) {
			state.signUpData = payload;
		}
	},
	actions: {
		storeSignUpData(context, payload) {
			context.commit('STORE_SIGNUP_DATA', payload);
		}
	},
	modules: {}
});
