export class Geo {
	lat: number;
	lon: number;
	accuracy: string;
  
	constructor(lat: number, lon: number, accuracy: string) {
	  this.lat = lat;
	  this.lon = lon;
	  this.accuracy = accuracy;
	}
  }