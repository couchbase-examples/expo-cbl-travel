"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentReplication = void 0;
exports.isDocumentReplicationRepresentation = isDocumentReplicationRepresentation;
var _replicatedDocument = require("./replicated-document.cjs");
class DocumentReplication {
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
exports.DocumentReplication = DocumentReplication;
function isDocumentReplicationRepresentation(obj) {
  try {
    const object = obj;
    object.documents.forEach(document => {
      if (!(0, _replicatedDocument.isReplicatedDocumentRepresentation)(document)) {
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
//# sourceMappingURL=document-replication.cjs.map