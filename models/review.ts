export class Review {
	content: string;
	author: string;
	date: string;
  
	constructor(content: string, author: string, date: string) {
	  this.content = content;
	  this.author = author;
	  this.date = date;
	}
  }