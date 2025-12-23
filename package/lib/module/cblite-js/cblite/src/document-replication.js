"use strict";

import { isReplicatedDocumentRepresentation } from "./replicated-document.js";
export class DocumentReplication {
  // eslint-disable-next-line
  constructor(isPush, documents) {
    this.isPush = isPush;
    this.documents = documents;
  }
  getIsPush() {
    return this.isPush;
  }
  getDocuments() {
    return this.documents;
  }
}
export function isDocumentReplicationRepresentation(obj) {
  try {
    const object = obj;
    object.documents.forEach(document => {
      if (!isReplicatedDocumentRepresentation(document)) {
        throw 'invalid replicated document';
      }
    });
    const isPush = object.isPush;
    if (isPush === undefined) {
      throw 'unrecognized replication isPush ';
    }
    return true;
  } catch (e) {
    console.warn('Invalid DocumentReplicationRepresentation:', e);
    return false;
  }
}
//# sourceMappingURL=document-replication.js.map