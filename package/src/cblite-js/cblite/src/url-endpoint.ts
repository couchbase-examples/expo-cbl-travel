import { Endpoint } from './endpoint';

export class URLEndpoint implements Endpoint {
  constructor(private url: string) {}

  toJson() {
    return {
      url: this.url,
    };
  }
}
