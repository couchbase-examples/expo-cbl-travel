export class CouchbaseLiteException extends Error {
  constructor(
    public override message: string,
    public domain: string,
    public code: number
  ) {
    super();
  }
}
