import {
  getRhumbLineBearing,
  computeDestinationPoint,
  getDistance
} from "geolib";

class Bot {
  battery = 100;
  position;
  origin;
  destination;
  minEnergyStep = 10;
  maxEnergyStep = 30;
  minStep = 50;
  maxStep = 100;
  isAtDestination = false;
  color = "#FFFF00";
  hasCharge = true;
  isCharging = false;
  label;

  static earthRadius = 6378137; // in meters
  /**Creates a new Bot
   *
   * @param {string} label Label of the bot
   * @param {{lat: number, lng: number}} destination Destination for the bot
   */
  constructor(label, destination) {
    this.label = label;
    this.destination = destination;
    this.setRandomOrigin(this.destination);
  }
  /**
   * Sets the origin to a random location around the given destination
   * @param {{lat: number, lng: number}} destination An object containing latitude and longitude properties
   */
  setRandomOrigin(destination) {
    this.position = {
      lat:
        destination.lat +
        Bot.getRandomInt(0, 15) * 0.01 * (Math.random() < 0.5 ? -1 : 1),
      lng:
        destination.lng +
        Bot.getRandomInt(0, 15) * 0.01 * (Math.random() < 0.5 ? -1 : 1)
    };
    this.origin = this.position;
  }
  /**Moves the bot a set distance
   *
   * @param {number} distance Distance to move the bot in meters
   */
  moveTowardsDestination(distance) {
    if (this.getDistanceToDestination() !== 0) {
      this.decreaseBattery(Bot.getRandomInt(10, 30));
      if (this.battery >= 0 && this.hasCharge) {
        if (this.getDistanceToDestination() > distance) {
          let displacementPoint = computeDestinationPoint(
            this.position,
            distance,
            getRhumbLineBearing(this.position, this.destination),
            Bot.earthRadius
          );
          this.position = {
            lat: displacementPoint.latitude,
            lng: displacementPoint.longitude
          };
        } else {
          this.position = this.destination;
          this.isAtDestination = true;
        }
      } else {
        if (!this.isCharging) {
          this.isCharging = true;
          setTimeout(() => {
            this.rechargeBattery();
          }, 6000);
        }
      }
    }
  }
  /**Gets the remaining distance between the bot's position and it's destination
   *
   * @returns Distance to arrive at set destination in meters
   */
  getDistanceToDestination() {
    // return this.google.maps.geometry.spherical.computeDistanceBetween(this.position, this.destination)
    return getDistance(this.position, this.destination);
  }
  /**
   * Gets a random number
   *
   * @param {number} min Minimun possible integer
   * @param {number} max Maximun possible integer
   * @returns {number} Random Integer
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**Sets the color property for the bot
   *
   * @param {string} RGBColorCode RGB color (e.g. #FFFFFF)
   */
  changeColor(RGBColorCode) {
    this.color = RGBColorCode;
  }
  /**
   * Decrease the bot's battery by the amount specified
   * @param {number} amount Amount to reduce the bot's battery
   */
  decreaseBattery(amount) {
    if (amount > this.battery) {
      this.battery = 0;
      this.hasCharge = false;
    } else {
      this.battery -= amount;
    }
  }
  /**
   * Set the bot to full charge
   */
  rechargeBattery() {
    this.battery = 100;
    this.hasCharge = true;
    this.isCharging = false;
  }
}

export default Bot;
