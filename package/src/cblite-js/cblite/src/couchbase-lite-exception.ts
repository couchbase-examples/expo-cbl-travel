export class CouchbaseLiteException extends Error {
  constructor(
     // eslint-disable-next-line
    public override message: string,
     // eslint-disable-next-line
    public domain: string,
     // eslint-disable-next-line
    public code: number
  ) {
    super();
  }
}
