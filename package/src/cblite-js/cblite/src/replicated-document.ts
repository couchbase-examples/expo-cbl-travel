export enum ReplicatedDocumentFlag {
     // eslint-disable-next-line
  DELETED = 'DELETED',
     // eslint-disable-next-line
  ACCESS_REMOVED = 'ACCESS_REMOVED',
}

export class ReplicatedDocument {
     // eslint-disable-next-line
  constructor( protected id: string, protected flags: ReplicatedDocumentFlag[], protected error: string = undefined, protected scopeName: string, protected collectionName: string) {}

  getId(): string {
    return this.id;
  }

  getFlags(): ReplicatedDocumentFlag[] {
    return this.flags;
  }

  getError(): string | undefined {
    return this.error;
  }
}

export interface ReplicatedDocumentRepresentation {
  id: string;
  flags: string[];
  scopeName: string;
  collectionName: string;
  error: {
    message: string;
  };
}

export function isReplicatedDocumentRepresentation(obj: any): obj is ReplicatedDocumentRepresentation { 
  try {
    const object: ReplicatedDocumentRepresentation = obj;
    object.flags.forEach((flag) => {
      const flagTest: ReplicatedDocumentFlag | undefined = (<any>(
        ReplicatedDocumentFlag
      ))[flag];
      if (flagTest === undefined) {
        throw 'unrecognized replication flag ' + flag;
      }
    });
    if (object.id === null) {
      throw 'document id cannot be null';
    }
    if (object.error) {
      if (!object.error.message) {
        throw 'document error is incomplete';
      }
    }
    return true;
  } catch (e) {
    console.warn('Invalid ReplicatedDocumentRepresentation:', e);
    return false;
  }
}
