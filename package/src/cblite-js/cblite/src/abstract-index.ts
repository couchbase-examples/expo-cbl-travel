export interface Index {}

export enum IndexType {
  Value = 0,
  FullText = 1,
  Geo = 2,
}

export abstract class AbstractIndex implements Index {
  abstract type(): IndexType;

  abstract language(): string;

  abstract ignoreAccents(): boolean;

  abstract items(): any[];

  abstract toJson(): any;
}
