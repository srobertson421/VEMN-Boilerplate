import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import posts from './modules/posts';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

// Export a singleton store that contains our actions, getters, and modules
export default new Vuex.Store({
  actions,
  getters,
  modules: {
    posts
  },
  strict: debug
});
