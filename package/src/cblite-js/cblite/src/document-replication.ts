import {
  ReplicatedDocument,
  ReplicatedDocumentRepresentation,
  isReplicatedDocumentRepresentation,
} from './replicated-document';

export class DocumentReplication {
  constructor(
    protected isPush: boolean,
    protected documents: ReplicatedDocument[]
  ) {}

  getIsPush(): boolean {
    return this.isPush;
  }

  getDocuments(): ReplicatedDocument[] {
    return this.documents;
  }
}

export interface DocumentReplicationRepresentation {
  isPush: boolean;
  documents: ReplicatedDocumentRepresentation[];
}

export function isDocumentReplicationRepresentation(
  obj: any
): obj is DocumentReplicationRepresentation {
  try {
    const object: DocumentReplicationRepresentation = obj;
    object.documents.forEach((document) => {
      if (!isReplicatedDocumentRepresentation(document)) {
        throw 'invalid replicated document';
      }
    });
    const isPush: boolean | undefined = object.isPush;
    if (isPush === undefined) {
      throw 'unrecognized replication isPush ';
    }
    return true;
  } catch (e) {
    console.warn('Invalid DocumentReplicationRepresentation:', e);
    return false;
  }
}
