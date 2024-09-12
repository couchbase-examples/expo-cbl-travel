"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReplicatorChange = isReplicatorChange;
function isReplicatorChange(obj) {
  try {
    const object = obj;
    return object.activityLevel != null && object.progress != null && object.progress.completed != null && object.progress.total != null;
  } catch (e) {
    console.warn('Invalid ReplicatorChange', e);
    return false;
  }
}
//# sourceMappingURL=replicator-change.cjs.map