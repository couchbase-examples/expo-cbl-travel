import { Endpoint } from './endpoint';

export class URLEndpoint implements Endpoint {

 // eslint-disable-next-line
  constructor(private url: string) {}

  toJson() {
    return {
      url: this.url,
    };
  }
}
