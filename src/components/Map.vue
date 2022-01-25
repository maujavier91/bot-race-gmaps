<template>
  <div>
    <h1>Bot Race</h1>
    <div class="container">
    <GmapMap ref="mapRef"
      :center="center"
      :zoom="11"
      map-type-id="roadmap"
      class="map"
      
      :options="mapOptions"
      @click="setNewDestination"
      >

      <GmapMarker
        :key="index"
        v-for="(m,index) in markers"
        :position="m.position"
        :clickable="false"
        :draggable="false"
        :title="m.label"
        :animation="google && google.maps.Animation.DROP"
        :label="{text: m.label, color: m.color, fontSize: '2em'}"
        :icon="{
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: m.color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 1,
      }"
     
    />
     <GmapMarker
        :position="center"
        :clickable="false"
        :draggable="false"
        :title="'Destino'"
        :animation="google && google.maps.Animation.BOUNCE"
        :icon="{
            path: google && google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: '#ff0',
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 5,
            
      }"
/>

<button class="mapbutton" id="addBot" @click="addNewBot">Agregar Nuevo Bot</button>
<button class="mapbutton" id="changeDestination" @click="changeNewDestination">Cambiar destino</button>
</GmapMap>
<div>
<table class="botTable">
  <tr class="botRowHeader">
    <th>Posición</th>
    <th>Nombre</th>
    <th>Distancia</th>
    <th>Bateria</th>
    <th>Status</th>
  </tr>
  <tr class="botRow" v-for="(marker,index) in markers" :key="index">
    <td>{{index + 1}}</td>
    <td>{{marker.label}}</td>
    <td>{{marker.getDistanceToDestination()}}</td>
    <td>{{marker.battery}}</td>
    <td>{{marker.isCharging?'Cargando':'Activo'}}</td>
  </tr>
</table>
</div>
    </div>

  </div>
</template>

<script>
import Bot from './../bot'
import { gmapApi } from 'gmap-vue'



export default {
  name: 'Map',
  data(){
    return {
      mapOptions: {
  zoomControl: true,
   mapTypeControl: false,
   scaleControl: false,
   streetViewControl: false,
   rotateControl: false,
   fullscreenControl: true,
   disableDefaultUi: false,
   styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ]
  },
      center: {lat: 0, lng: 0},
      markers: [],
      botNumber: Bot.getRandomInt(5,10),
      timer: null,
      minStep: 50,
      maxStep: 100,
      movementTick: 1000,
      allowNewDestination: false
    }

  },
  computed: {
    google: gmapApi,
  },
  
  methods:{
    changeNewDestination(){
      this.allowNewDestination = true
      window.alert('Haga click en el mapa para seleccionar el nuevo destino y reiniciar la carrera')
    },
    setNewDestination({latLng}){
      if(this.allowNewDestination){
        this.center = {lat: latLng.lat(), lng: latLng.lng()}
        this.allowNewDestination=false
      }
      
    },

    addNewBot(){
      this.markers.push(new Bot(`Bot #${this.markers.length}`, this.center))
      if(this.timer === null){
        this.start()
      }
    },
    start(){
      this.timer = setInterval(() => {
      this.markers.forEach((el) => {
        el.moveTowardsDestination(Bot.getRandomInt(this.minStep,this.maxStep))
        el.changeColor('#FFF000')
      })
      this.markers.sort((a,b) => {
        return a.getDistanceToDestination() - b.getDistanceToDestination()
      })
      this.markers[0].changeColor('#00FF00')
      this.markers[this.markers.length-1].changeColor('#FF0000')
      if(this.markers.reduce((prev, next) => {
        return next.getDistanceToDestination()
      })===0){
        clearInterval(this.timer)
        this.timer = null
      }
      
      }, this.movementTick)
    }
  },
  created(){
  this.$getLocation({})
  .then(coordinates => {
    this.center = {lat: coordinates.lat,  lng: coordinates.lng}    
  }).catch(() => {
   alert('Esta aplicación requiere su ubicación') 
  }
  )

  },
  mounted(){
    
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.controls[this.google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('addBot'))
        map.controls[this.google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('changeDestination'))
      })
  },

  watch: {
    center: function(val){
    
      let arr = []
      for (let index = 0; index < this.botNumber; index++) {
         arr.push(new Bot(`Bot #${arr.length}`,val))
      }
      this.markers = arr
     if(this.timer) {clearInterval(this.timer)}
        this.start()
      },

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container{
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
.botList{
  text-align: left;
}

.mapbutton{
  margin: 1em;
  padding: 1em;
  opacity: .7;
}
.botList{
  max-width: 25em;
  .botItem{
    font-size: 2em;
  }
}

.botTable .botRow:nth-child(2) {
  color: rgb(38, 163, 38);
}
.botTable .botRow {
  color: rgb(156, 156, 40);
}
.botTable .botRow:last-of-type {
  color: rgb(170, 38, 38);
}

.map{

  width: 25em;
  height: 25em;

  @media (max-width: 500px) {
    width: 20em;
    height: 20em;
  }

}
</style>
