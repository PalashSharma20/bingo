import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import VueCookies from "vue-cookies"
import { rtdbPlugin } from "vuefire"

Vue.use(VueCookies)
Vue.use(rtdbPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
