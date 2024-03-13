/**VUE PACK
 * createApp
 * App
 * router
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App)
//END VUE PACK

/**VUETIFY PACK
 * styles
 * createVuetify
 * components
 * directives
 * fonts-icons
 * config
 */
import "vuetify/styles";
import { createVuetify, } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
  components,
  directives,

});
// END VUETIFY PACK

/**FIREBASE PACK
 * initial
 * firebaseConfig
 * app
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import 'firebase/database'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC07mbmQvs57U-fFYKMCVUg46p4HUbjw8",
  authDomain: "takiedela-bd.firebaseapp.com",
  projectId: "takiedela-bd",
  storageBucket: "takiedela-bd.appspot.com",
  messagingSenderId: "274604949344",
  appId: "1:274604949344:web:2022c846d3b9b4c8f3e805"
};


// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb)



app.use(vuetify)
app.use(router)
app.mount('#app')



