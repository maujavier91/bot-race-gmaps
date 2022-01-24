import { getRhumbLineBearing, computeDestinationPoint, getDistance } from 'geolib';

class Bot {
    battery = 100
    position
    origin
    destination
    minEnergyStep = 10
    maxEnergyStep = 30
    minStep = 50
    maxStep = 100
    isAtDestination = false
    color = '#FFFF00'
    hasCharge = true
    isCharging = false
    label


    static earthRadius = 6378137 // in meters
    constructor(label, destination) {
        this.label = label
        this.destination = destination
        this.setRandomOrigin(this.destination)
    }

    setRandomOrigin(destination) {
        this.position = {
            lat: destination.lat + Bot.getRandomInt(0, 15)*0.01*(Math.random() < 0.5 ? -1 : 1),
            lng: destination.lng + Bot.getRandomInt(0, 15)*0.01*(Math.random() < 0.5 ? -1 : 1)
        }
        this.origin = this.position
    }

    moveTowardsDestination(distance) {
        if (this.getDistanceToDestination() !== 0) {
            this.decreaseBattery(Bot.getRandomInt(10,30))
        if (this.battery>=0 && this.hasCharge) {

            if (this.getDistanceToDestination() > distance) {
                let displacementPoint =  computeDestinationPoint(this.position, distance, getRhumbLineBearing(this.position, this.destination), Bot.earthRadius)
                this.position = { lat: displacementPoint.latitude, lng: displacementPoint.longitude }
            } else {
                this.position = this.destination
                this.isAtDestination = true;
            }
            
        } else {
            if (!this.isCharging) {
                this.isCharging = true
            setTimeout(() => {
             this.rechargeBattery() 
            }, 6000)
            }
            
        }
        }

     }
    
    getDistanceToDestination() {
/*         const rad = function(x) {
            return x * Math.PI / 180;
          };
          
          const getDistance = function(p1, p2) {
            var R = Bot.earthRadius; // Earth’s mean radius in meter
            var dLat = rad(p2.lat - p1.lat);
            var dLong = rad(p2.lng - p1.lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
              Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d; // returns the distance in meter
        }
        return getDistance(this.position, this.destination) */
      // return this.google.maps.geometry.spherical.computeDistanceBetween(this.position, this.destination)
        return getDistance(this.position, this.destination)
     }

   static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    changeColor(RGBColorCode) {
        this.color = RGBColorCode
    }

    decreaseBattery(amount) {
        if (amount > this.battery) {
            this.battery = 0
            this.hasCharge = false
        } else {
            this.battery -= amount
        }
        
    }
    rechargeBattery() {
        this.battery = 100
        this.hasCharge = true
        this.isCharging = false
    }
}

export default Bot