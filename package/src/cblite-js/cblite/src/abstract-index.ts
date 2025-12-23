// eslint-disable-next-line
export interface Index {}

export enum IndexType {
  // eslint-disable-next-line
  Value = 0,
  // eslint-disable-next-line
  FullText = 1,
  // eslint-disable-next-line
  Geo = 2,
}

export abstract class AbstractIndex implements Index {

  abstract type(): IndexType;

  abstract language(): string;

  abstract ignoreAccents(): boolean;

  abstract items(): any[];

  abstract toJson(): any;
}
