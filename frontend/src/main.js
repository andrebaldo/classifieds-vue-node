import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import Meta from 'vue-meta';

Vue.use(Meta);

Vue.config.productionTip = false;



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');



