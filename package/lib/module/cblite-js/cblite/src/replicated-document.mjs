export let ReplicatedDocumentFlag = /*#__PURE__*/function (ReplicatedDocumentFlag) {
  ReplicatedDocumentFlag["DELETED"] = "DELETED";
  ReplicatedDocumentFlag["ACCESS_REMOVED"] = "ACCESS_REMOVED";
  return ReplicatedDocumentFlag;
}({});
export class ReplicatedDocument {
  constructor(id, flags, error = undefined, scopeName, collectionName) {
    this.id = id;
    this.flags = flags;
    this.error = error;
    this.scopeName = scopeName;
    this.collectionName = collectionName;
  }
  getId() {
    return this.id;
  }
  getFlags() {
    return this.flags;
  }
  getError() {
    return this.error;
  }
}
export function isReplicatedDocumentRepresentation(obj) {
  try {
    const object = obj;
    object.flags.forEach(flag => {
      const flagTest = ReplicatedDocumentFlag[flag];
      if (flagTest === undefined) {
        throw 'unrecognized replication flag ' + flag;
      }
    });
    if (object.id === null) {
      throw 'document id cannot be null';
    }
    if (object.error !== null) {
      if (object.error.message === null) {
        throw 'document error is incomplete';
      }
    }
    return true;
  } catch (e) {
    console.warn('Invalid ReplicatedDocumentRepresentation:', e);
    return false;
  }
}
//# sourceMappingURL=replicated-document.mjs.map