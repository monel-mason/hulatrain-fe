import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import './../node_modules/bulma/css/bulma.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt,faSave,faPlusSquare, faMinusSquare, faEye, faObjectGroup, faArrowCircleLeft, faArrowCircleRight, faChartBar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router'

library.add(faSyncAlt,faSave,faPlusSquare,faMinusSquare,faEye,faObjectGroup,faArrowCircleLeft,faArrowCircleRight,faChartBar)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
