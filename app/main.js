import Vue from 'vue'
import App from './App'

Vue.transition('bounce', {
  enterClass: 'bounceInUp',
  leaveClass: 'bounceOutUp'
})
/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
