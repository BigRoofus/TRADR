import Vue from 'vue'
import App from './App.vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import VueMaterial from 'vue-material'
// import "vue-material/dist/vue-material.css";
import 'vue-material-design-icons/styles.css'

stockInit(Highcharts)

Vue.use(VueMaterial)
Vue.use(HighchartsVue)

new Vue({
    el: '#app',
    render: h => h(App)
})

// Vue.prototype.$chart_ohlc = [];
// Vue.prototype.$chart_volume = [];
