import Vue from 'vue'
import App from './App.vue'
import VueGeolocation from 'vue-browser-geolocation'
import GmapVue from 'gmap-vue'

Vue.use(VueGeolocation)
Vue.use(GmapVue, {
  load: {
    key: `${process.env.VUE_APP_KEY}`,
    //libraries: 'geometry',
   // libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'gmap-vue/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then set installComponents to 'false'.
  //// If you want to automatically install all the components this property must be set to 'true':
  installComponents: true
})
/* import GmapMap from 'gmap-vue/dist/components/map-layer.vue'
Vue.component('GmapMap', GmapMap) */
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
