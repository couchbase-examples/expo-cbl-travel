import { Geo } from './geo';
import { Review } from './review';

export class Hotel {
	title: string;
	name: string;
	address: string;
	directions: string | null;
	phone: string;
	tollfree: string | null;
	email: string | null;
	fax: string | null;
	url: string;
	checkin: string | null;
	checkout: string | null;
	price: string | null;
	geo: Geo;
	type: string;
	id: number;
	country: string;
	city: string;
	state: string | null;
	reviews: Review[];
	public_likes: string[];
	vacancy: boolean;
	description: string;
	alias: string | null;
	pets_ok: boolean;
	free_breakfast: boolean;
	free_internet: boolean;
	free_parking: boolean;
  
	constructor(
	  title: string,
	  name: string,
	  address: string,
	  directions: string | null,
	  phone: string,
	  tollfree: string | null,
	  email: string | null,
	  fax: string | null,
	  url: string,
	  checkin: string | null,
	  checkout: string | null,
	  price: string | null,
	  geo: Geo,
	  type: string,
	  id: number,
	  country: string,
	  city: string,
	  state: string | null,
	  reviews: Review[],
	  public_likes: string[],
	  vacancy: boolean,
	  description: string,
	  alias: string | null,
	  pets_ok: boolean,
	  free_breakfast: boolean,
	  free_internet: boolean,
	  free_parking: boolean
	) {
	  this.title = title;
	  this.name = name;
	  this.address = address;
	  this.directions = directions;
	  this.phone = phone;
	  this.tollfree = tollfree;
	  this.email = email;
	  this.fax = fax;
	  this.url = url;
	  this.checkin = checkin;
	  this.checkout = checkout;
	  this.price = price;
	  this.geo = geo;
	  this.type = type;
	  this.id = id;
	  this.country = country;
	  this.city = city;
	  this.state = state;
	  this.reviews = reviews;
	  this.public_likes = public_likes;
	  this.vacancy = vacancy;
	  this.description = description;
	  this.alias = alias;
	  this.pets_ok = pets_ok;
	  this.free_breakfast = free_breakfast;
	  this.free_internet = free_internet;
	  this.free_parking = free_parking;
	}
  }