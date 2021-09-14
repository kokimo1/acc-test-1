import { createApp } from 'vue';
import moment from 'moment';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

// Check if authenticated
router.beforeEach((to, from, next) => {
  const tokenExpiration = sessionStorage.getItem('groupToolTokenExpiration');
  const groupToolToken = sessionStorage.getItem('groupToolToken');
  const currentTime = String(moment().toDate());

  // Commit token from SessionStorage to Store State
  store.commit('loadToken', groupToolToken);

  // Reroute to login page
  if (to.name !== 'Login' // Not on login and one of the following
  && (tokenExpiration === null
  || tokenExpiration === 'undefined'
  || tokenExpiration < currentTime
  || groupToolToken === null
  || groupToolToken === 'undefined')) {
    next({ name: 'Login' });
  } else { // If token exists and not expired continue using app
    next();
  }
});

createApp(App).use(store).use(router).mount('#app');
